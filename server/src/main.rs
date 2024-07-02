mod api;
mod config;
mod jwt;

use anyhow::Result;
use database::Database;
use env_logger::Env;
use log::info;
use std::sync::Arc;

#[rocket::main]
async fn main() -> Result<()> {
    dotenv::dotenv().ok();
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();

    info!("loading config");
    let cfg = config::Config::load()?;

    info!("initializing database");
    let database = Arc::new(Database::new(&cfg.database.dsn).await?);

    info!("initializing web server");
    api::run(cfg, database).await
}
