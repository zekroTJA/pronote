pub type Result<T> = std::result::Result<T, Error>;

#[derive(thiserror::Error, Debug)]
pub enum Error {
    #[error("connection failed: {0}")]
    ConnectionFailed(sqlx::error::Error),

    #[error("migration failed: {0}")]
    MigrationFailed(#[from] sqlx::migrate::MigrateError),

    #[error("database query failed: {0}")]
    QueryFailed(#[from] sqlx::error::Error),
}
