use crate::{
    error::{Error, Result},
    models::{List, ListUpdate, User},
};
use futures::TryStreamExt;
use sqlx::PgPool;

pub struct Database {
    pool: PgPool,
}

impl Database {
    pub async fn new(dsn: &str) -> Result<Self> {
        let pool = PgPool::connect(dsn)
            .await
            .map_err(Error::ConnectionFailed)?;

        sqlx::migrate!("./migrations").run(&pool).await?;

        Ok(Self { pool })
    }

    pub async fn users(&self) -> Result<Vec<User>> {
        let rows = sqlx::query_as(r#"SELECT "id", "registered_at" FROM "user""#).fetch(&self.pool);
        let res = rows.try_collect().await?;
        Ok(res)
    }

    pub async fn user(&self, id: &str) -> Result<Option<User>> {
        let res = sqlx::query_as(r#"SELECT "id", "registered_at" FROM "user" WHERE "id" = $1"#)
            .bind(id)
            .fetch_optional(&self.pool)
            .await?;

        Ok(res)
    }

    pub async fn add_user(&self, user: &User) -> Result<()> {
        sqlx::query(r#"INSERT INTO "user" ("id", "registered_at") VALUES ($1, $2)"#)
            .bind(&user.id)
            .bind(user.registered_at)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    pub async fn lists_of_user(&self, user_id: &str) -> Result<Vec<List>> {
        let rows = sqlx::query_as(
            r#"
            SELECT "id", "owner_id", "created_at", "name", "deleted", "description", "timeout_seconds"
            FROM "list"
            WHERE "owner_id" = $1
            "#,
        ).bind(user_id).fetch(&self.pool);

        let res = rows.try_collect().await?;
        Ok(res)
    }

    pub async fn list_by_id(&self, user_id: &str, list_id: &str) -> Result<Option<List>> {
        let res = sqlx::query_as(
            r#"
            SELECT "id", "owner_id", "created_at", "name", "deleted", "description", "timeout_seconds"
            FROM "list"
            WHERE "owner_id" = $1 AND "list_id" = $2
            "#,
        )
        .bind(user_id)
        .bind(list_id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(res)
    }

    pub async fn add_list(&self, list: &List) -> Result<()> {
        sqlx::query(
            r#"
            INSERT INTO "list" ("id", "owner_id", "created_at", "name", "deleted", "description", "timeout_seconds") 
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            "#,
        )
        .bind(&list.id)
        .bind(list.created_at)
        .bind(&list.owner_id)
        .bind(&list.name)
        .bind(list.deleted)
        .bind(&list.description)
        .bind(list.timeout_seconds)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn update_list(&self, id: &str, list: &ListUpdate) -> Result<()> {
        sqlx::query(
            r#"
            UPDATE "list"
            SET "name" = $1, "deleted" = $2, "description" = $3, "timeout_seconds" = $4
            WHERE "id" = $5
            "#,
        )
        .bind(&list.name)
        .bind(list.deleted)
        .bind(&list.description)
        .bind(list.timeout_seconds)
        .bind(id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}
