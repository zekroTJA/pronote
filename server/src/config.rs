use anyhow::Result;
use rocket::figment::{providers::Env, Figment};
use serde::Deserialize;
use url::Url;

#[derive(Deserialize, Debug, Clone)]
pub struct Config {
    pub oidc: Oidc,
    pub database: Database,
    pub limit: Option<Limit>,
    pub cors: Option<Cors>,
    pub servespa: Option<bool>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Oidc {
    pub id: String,
    pub secret: String,
    pub redirect: String,
    pub issuer: Url,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Database {
    pub dsn: String,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Limit {
    pub lists: Option<i64>,
    pub items: Option<i64>,
}

#[derive(Deserialize, Debug, Clone)]
pub struct Cors {
    pub origins: Vec<String>,
}

impl Config {
    pub fn load() -> Result<Self> {
        let cfg = Figment::new()
            .merge(Env::prefixed(env!("CONFIG_PREFIX")).split('_'))
            .extract()?;

        Ok(cfg)
    }
}
