mod api;
mod config;
mod jwt;

use std::sync::Arc;

use anyhow::Result;
use database::Database;
use env_logger::Env;

#[rocket::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    let cfg = config::Config::load()?;

    let database = Arc::new(Database::new(&cfg.database.dsn).await?);

    api::run(cfg, database).await
}
