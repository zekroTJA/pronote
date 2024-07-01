use chrono::{DateTime, Utc};
use sqlx::FromRow;

#[derive(FromRow)]
pub struct User {
    pub id: String,
    pub registered_at: DateTime<Utc>,
}

impl User {
    pub fn new<S: Into<String>>(id: S) -> Self {
        Self {
            id: id.into(),
            registered_at: Utc::now(),
        }
    }
}

#[derive(FromRow)]
pub struct List {
    pub id: String,
    pub owner_id: String,
    pub created_at: DateTime<Utc>,
    pub name: String,
    pub deleted: bool,
    pub description: Option<String>,
    pub timeout_seconds: Option<i64>,
}

pub struct ListUpdate {
    pub name: String,
    pub deleted: bool,
    pub description: Option<String>,
    pub timeout_seconds: Option<i64>,
}

pub enum ListPart {
    Top,
    Bottom,
    Expired,
}

#[derive(FromRow)]
pub struct Item {
    pub id: String,
    pub list_id: String,
    pub part: ListPart,
    pub created_at: DateTime<Utc>,
    pub edited_at: DateTime<Utc>,
    pub title: String,
    pub description: Option<String>,
}
