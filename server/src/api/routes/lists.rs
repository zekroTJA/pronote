use crate::api::{
    error::{Error, Result},
    guards::Auth,
    models::{List, ListResponse, ListUpdate},
};
use chrono::Utc;
use database::Database;
use rocket::{
    delete, get, http::Status, post, response::status::Created, routes, serde::json::Json, Route,
    State,
};
use std::sync::Arc;

#[get("/")]
async fn lists(user: Auth, database: &State<Arc<Database>>) -> Result<Json<ListResponse<List>>> {
    let lists = database.lists(user.id()).await?;
    let res: Vec<_> = lists.iter().map(|v| v.into()).collect();
    Ok(Json(res.into()))
}

#[get("/<id>")]
async fn list(user: Auth, id: &str, database: &State<Arc<Database>>) -> Result<Json<List>> {
    let list = database.list_by_id(user.id(), id).await?;
    match list {
        None => Err(Error::not_found("no list found with this ID")),
        Some(list) => Ok(Json(list.into())),
    }
}

#[post("/", data = "<list>")]
async fn add_list(
    user: Auth,
    list: Json<ListUpdate>,
    database: &State<Arc<Database>>,
) -> Result<Created<Json<List>>> {
    let Json(list) = list;
    let new_list = database::models::List {
        id: xid::new().to_string(),
        owner_id: user.id().to_string(),
        created_at: Utc::now(),
        name: list.name,
        description: list.description,
        timeout_seconds: list.timeout_seconds,
    };

    database.add_list(&new_list).await?;

    Ok(Created::new(format!("/api/lists/{}", new_list.id)).tagged_body(Json(new_list.into())))
}

#[post("/<id>", data = "<list>")]
async fn update_list(
    user: Auth,
    id: &str,
    list: Json<ListUpdate>,
    database: &State<Arc<Database>>,
) -> Result<Status> {
    let Json(list) = list;
    let new_list = database::models::ListUpdate {
        name: list.name,
        description: list.description,
        timeout_seconds: list.timeout_seconds,
    };

    let affected_rows = database.update_list(user.id(), id, &new_list).await?;
    match affected_rows {
        0 => Err(Error::not_found("no list found with the given ID")),
        _ => Ok(Status::NoContent),
    }
}

#[delete("/<id>")]
async fn delete_list(user: Auth, id: &str, database: &State<Arc<Database>>) -> Result<Status> {
    let afftected_rows = database.delete_list(user.id(), id).await?;
    match afftected_rows {
        0 => Err(Error::not_found("no list found with the given ID")),
        _ => Ok(Status::NoContent),
    }
}

pub fn routes() -> Vec<Route> {
    routes![list, lists, add_list, update_list, delete_list]
}
