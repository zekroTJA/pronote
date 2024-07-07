mod error;
mod guards;
mod models;
mod responders;
mod routes;

use crate::{config::Config, jwt};
use anyhow::Result;
use database::Database;
use error::Error;
use openid::DiscoveredClient;
use rocket::{catch, catchers, http::Status, Request};
use routes::{auth, lists, spa};
use std::sync::Arc;

pub async fn run(cfg: Config, database: Arc<Database>) -> Result<()> {
    let oidc_client = DiscoveredClient::discover(
        cfg.oidc.id.clone(),
        Some(cfg.oidc.secret.clone()),
        Some(cfg.oidc.redirect.clone()),
        cfg.oidc.issuer.clone(),
    )
    .await?;

    let jwt_handler = jwt::Handler::new();

    rocket::build()
        .manage(oidc_client)
        .manage(jwt_handler)
        .manage(database)
        .manage(cfg)
        .mount("/", spa::routes())
        .mount("/api/auth", auth::routes())
        .mount("/api/lists", lists::routes())
        .register("/api", catchers![default_catcher])
        .launch()
        .await?;

    Ok(())
}

#[catch(default)]
fn default_catcher(status: Status, _: &Request) -> Error {
    Error::new::<&'static str>(status, status.reason_lossy(), None)
}
