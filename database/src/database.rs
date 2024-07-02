use crate::{
    error::{Error, Result},
    models::{Item, ItemUpdate, List, ListUpdate, User},
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

    pub async fn lists(&self, user_id: &str) -> Result<Vec<List>> {
        let rows = sqlx::query_as(
            r#"
            SELECT "id", "owner_id", "created_at", "name", "description", "timeout_seconds"
            FROM "list"
            WHERE "owner_id" = $1
            "#,
        )
        .bind(user_id)
        .fetch(&self.pool);

        let res = rows.try_collect().await?;
        Ok(res)
    }

    pub async fn list_by_id(&self, user_id: &str, list_id: &str) -> Result<Option<List>> {
        let res = sqlx::query_as(
            r#"
            SELECT "id", "owner_id", "created_at", "name", "description", "timeout_seconds"
            FROM "list"
            WHERE "owner_id" = $1 AND "id" = $2
            "#,
        )
        .bind(user_id)
        .bind(list_id)
        .fetch_optional(&self.pool)
        .await?;

        Ok(res)
    }

    pub async fn add_list(&self, list: &List) -> Result<u64> {
        let res = sqlx::query(
            r#"
            INSERT INTO "list" ("id", "owner_id", "created_at", "name", "description", "timeout_seconds") 
            VALUES ($1, $2, $3, $4, $5, $6)
            "#,
        )
        .bind(&list.id)
        .bind(&list.owner_id)
        .bind(list.created_at)
        .bind(&list.name)
        .bind(&list.description)
        .bind(list.timeout_seconds)
        .execute(&self.pool)
        .await?;
        Ok(res.rows_affected())
    }

    pub async fn update_list(&self, user_id: &str, id: &str, list: &ListUpdate) -> Result<u64> {
        let res = sqlx::query(
            r#"
            UPDATE "list"
            SET "name" = $1, "description" = $2, "timeout_seconds" = $3
            WHERE "owner_id" = $4 AND "id" = $5
            "#,
        )
        .bind(&list.name)
        .bind(&list.description)
        .bind(list.timeout_seconds)
        .bind(user_id)
        .bind(id)
        .execute(&self.pool)
        .await?;
        Ok(res.rows_affected())
    }

    pub async fn delete_list(&self, user_id: &str, id: &str) -> Result<u64> {
        let res = sqlx::query(r#"DELETE FROM "list" WHERE "owner_id" = $1 AND "id" = $2"#)
            .bind(user_id)
            .bind(id)
            .execute(&self.pool)
            .await?;
        Ok(res.rows_affected())
    }

    pub async fn list_items(&self, list_id: &str) -> Result<Vec<Item>> {
        let rows = sqlx::query_as(
            r#"
            SELECT "id", "list_id", "part", "created_at", "edited_at", "title", "description"
            FROM "item"
            WHERE "list_id" = $1
            "#,
        )
        .bind(list_id)
        .fetch(&self.pool);

        let res = rows.try_collect().await?;
        Ok(res)
    }

    pub async fn add_list_item(&self, item: &Item) -> Result<u64> {
        let res = sqlx::query(
            r#"
            INSERT INTO "item" ("id", "list_id", "part", "created_at", "edited_at", "title", "description")
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            "#,
        )
        .bind(&item.id)
        .bind(&item.list_id)
        .bind(item.part)
        .bind(item.created_at)
        .bind(item.edited_at)
        .bind(&item.title)
        .bind(&item.description)
        .execute(&self.pool).await?;
        Ok(res.rows_affected())
    }

    pub async fn update_list_item(&self, id: &str, item: &ItemUpdate) -> Result<u64> {
        let res = sqlx::query(
            r#"
            UPDATE "item"
            SET "title" = $1, "description" = $2, "list_id" = $3, "part" = $4, "edited_at" = $5
            WHERE "id" = $6
            "#,
        )
        .bind(&item.title)
        .bind(&item.description)
        .bind(&item.list_id)
        .bind(item.part)
        .bind(item.edited_at)
        .bind(id)
        .execute(&self.pool)
        .await?;
        Ok(res.rows_affected())
    }
}
