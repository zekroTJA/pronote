mod error;
mod guards;
mod responders;
mod routes;

use crate::{config::Config, jwt};
use anyhow::Result;
use database::Database;
use openid::DiscoveredClient;
use routes::{auth, spa};
use std::sync::Arc;

pub async fn run(cfg: Config, database: Arc<Database>) -> Result<()> {
    let oidc_client = DiscoveredClient::discover(
        cfg.oidc.id,
        Some(cfg.oidc.secret),
        Some(cfg.oidc.redirect),
        cfg.oidc.issuer,
    )
    .await?;

    let jwt_handler = jwt::Handler::new();

    rocket::build()
        .manage(oidc_client)
        .manage(jwt_handler)
        .manage(database)
        .mount("/api/auth", auth::routes())
        .mount("/", spa::routes())
        .launch()
        .await?;

    Ok(())
}
