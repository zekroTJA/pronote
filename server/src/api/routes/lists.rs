use crate::api::{
    error::{Error, Result},
    guards::Auth,
    models::{Item, ItemUpdate, List, ListResponse, ListUpdate, Part},
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
    let res: Vec<_> = lists.iter().cloned().map(|v| v.into()).collect();
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
    let affected_rows = database.delete_list(user.id(), id).await?;
    match affected_rows {
        0 => Err(Error::not_found("no list found with the given ID")),
        _ => Ok(Status::NoContent),
    }
}

#[get("/<id>/items")]
async fn items(
    user: Auth,
    id: &str,
    database: &State<Arc<Database>>,
) -> Result<Json<ListResponse<Item>>> {
    let Some(list) = database.list_by_id(user.id(), id).await? else {
        return Err(Error::not_found("no list found with the given ID"));
    };

    let items = database.list_items(id).await?;

    if let Some(timeout_seconds) = list.timeout_seconds {
        let now = Utc::now();
        let new_expired: Vec<_> = items
            .iter()
            .filter(|i| {
                Part::from(i.part) == Part::Bottom
                    && (now - i.edited_at).num_seconds() > timeout_seconds as i64
            })
            .collect();
        if !new_expired.is_empty() {
            for i in &new_expired {
                database
                    .update_list_item(
                        &i.id,
                        &database::models::ItemUpdate {
                            title: i.title.clone(),
                            description: i.description.clone(),
                            list_id: i.list_id.clone(),
                            part: Part::Expired.value(),
                            edited_at: i.edited_at,
                        },
                    )
                    .await?;
            }
            let items: Vec<_> = items
                .iter()
                .map(|i| {
                    if new_expired.iter().any(|e| e.id == i.id) {
                        database::models::Item {
                            part: Part::Expired.value(),
                            ..i.clone()
                        }
                    } else {
                        i.clone()
                    }
                })
                .map(|v| v.into())
                .collect();
            return Ok(Json(items.into()));
        }
    }

    let items: Vec<_> = items.iter().cloned().map(|v| v.into()).collect();
    Ok(Json(items.into()))
}

#[post("/<id>/items", data = "<item>")]
async fn add_item(
    user: Auth,
    id: &str,
    item: Json<ItemUpdate>,
    database: &State<Arc<Database>>,
) -> Result<Created<Json<Item>>> {
    let Some(list) = database.list_by_id(user.id(), id).await? else {
        return Err(Error::not_found("no list found with the given ID"));
    };

    let Json(item) = item;
    let now = Utc::now();
    let item = database::models::Item {
        id: xid::new().to_string(),
        list_id: list.id.clone(),
        part: item.part.value(),
        created_at: now,
        edited_at: now,
        title: item.title,
        description: item.description,
    };

    database.add_list_item(&item).await?;

    Ok(
        Created::new(format!("/api/list/{}/items/{}", list.id, item.id))
            .tagged_body(Json(item.into())),
    )
}

#[post("/<id>/items/<item_id>", data = "<item>")]
async fn update_items(
    user: Auth,
    id: &str,
    item_id: &str,
    item: Json<ItemUpdate>,
    database: &State<Arc<Database>>,
) -> Result<Status> {
    let Some(list) = database.list_by_id(user.id(), id).await? else {
        return Err(Error::not_found("no list found with the given ID"));
    };

    let Json(item) = item;

    let affected_rows = database
        .update_list_item(
            item_id,
            &database::models::ItemUpdate {
                title: item.title,
                description: item.description,
                list_id: list.id,
                part: item.part.value(),
                edited_at: Utc::now(),
            },
        )
        .await?;

    match affected_rows {
        0 => Err(Error::not_found("no list item found with the given ID")),
        _ => Ok(Status::NoContent),
    }
}

#[delete("/<id>/items/<item_id>")]
async fn delete_items(
    user: Auth,
    id: &str,
    item_id: &str,
    database: &State<Arc<Database>>,
) -> Result<Status> {
    let Some(list) = database.list_by_id(user.id(), id).await? else {
        return Err(Error::not_found("no list found with the given ID"));
    };

    let affected_rows = database.delete_list_item(&list.id, item_id).await?;

    match affected_rows {
        0 => Err(Error::not_found("no list item found with the given ID")),
        _ => Ok(Status::NoContent),
    }
}

pub fn routes() -> Vec<Route> {
    routes![
        list,
        lists,
        add_list,
        update_list,
        delete_list,
        items,
        add_item,
        update_items,
        delete_items
    ]
}
