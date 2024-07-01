use lazy_static::lazy_static;
use regex::Regex;
use rocket::{fs::NamedFile, get, routes, Route};
use std::{
    io,
    path::{Path, PathBuf},
};

const ROOT_PATH: &str = env!("WEBAPP_ROOT_DIR");

lazy_static! {
    static ref re: Regex =
        Regex::new(r#"\.(?:js|css|html|svg|webp|jpe?g|png)$"#).expect("web file regex");
}

#[get("/")]
async fn index() -> io::Result<NamedFile> {
    NamedFile::open(Path::new(ROOT_PATH).join("index.html")).await
}

#[get("/<file..>")]
async fn files(file: PathBuf) -> io::Result<NamedFile> {
    if let Some(file_name) = file.file_name().and_then(|v| v.to_str()) {
        if re.is_match(file_name) {
            return NamedFile::open(Path::new(ROOT_PATH).join(file)).await;
        }
    }

    index().await
}

pub fn routes() -> Vec<Route> {
    routes![index, files]
}
