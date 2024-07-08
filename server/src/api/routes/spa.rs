use lazy_static::lazy_static;
use regex::Regex;
use rocket::{fs::NamedFile, get, http::Status, routes, Route};
use std::{
    io,
    path::{Path, PathBuf},
};

use crate::api::error::{Error, Result};

const ROOT_PATH: &str = env!("WEBAPP_ROOT_DIR");

lazy_static! {
    static ref re: Regex =
        Regex::new(r#"\.(?:js|css|html|svg|webp|jpe?g|png|ico)$"#).expect("web file regex");
}

#[get("/")]
async fn index() -> Result<NamedFile> {
    NamedFile::open(Path::new(ROOT_PATH).join("index.html"))
        .await
        .map_err(io_err_to_api_err)
}

#[get("/<file..>", rank = 1)]
async fn files(file: PathBuf) -> Result<NamedFile> {
    if let Some(file_name) = file.file_name().and_then(|v| v.to_str()) {
        if re.is_match(file_name) {
            return NamedFile::open(Path::new(ROOT_PATH).join(file))
                .await
                .map_err(io_err_to_api_err);
        }
    }

    index().await
}

pub fn routes() -> Vec<Route> {
    routes![index, files]
}

fn io_err_to_api_err(err: io::Error) -> Error {
    match err.kind() {
        io::ErrorKind::NotFound => Error::not_found("file not found"),
        _ => Error::new(
            Status::InternalServerError,
            "failed opening file",
            Some(err),
        ),
    }
}
