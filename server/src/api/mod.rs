mod error;
mod guards;
mod models;
mod responders;
mod routes;

use crate::{config::Config, jwt};
use anyhow::Result;
use database::Database;
use error::Error;
use log::info;
use openid::DiscoveredClient;
use rocket::{
    catch, catchers,
    http::{Method, Status},
    Request,
};
use rocket_cors::{AllowedOrigins, CorsOptions};
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

    let mut rocket = rocket::build()
        .manage(oidc_client)
        .manage(jwt_handler)
        .manage(database)
        .manage(cfg.clone())
        .mount("/api/auth", auth::routes())
        .mount("/api/lists", lists::routes())
        .register("/api", catchers![default_catcher]);

    if cfg.servespa.unwrap_or(true) {
        rocket = rocket.mount("/", spa::routes());
    }

    if let Some(ref cors) = cfg.cors {
        let allowed_origins = AllowedOrigins::some_exact(&cors.origins);
        let allowed_methods = [Method::Get, Method::Post, Method::Delete]
            .into_iter()
            .map(From::from)
            .collect();
        let cors = CorsOptions {
            allowed_origins,
            allowed_methods,
            allow_credentials: true,
            ..Default::default()
        }
        .to_cors()?;

        rocket = rocket.attach(cors);

        info!("CORS is enabled for the domains {:?}", &cfg.cors);
    }

    rocket.launch().await?;

    Ok(())
}

#[catch(default)]
fn default_catcher(status: Status, _: &Request) -> Error {
    Error::new::<&'static str>(status, status.reason_lossy(), None)
}
