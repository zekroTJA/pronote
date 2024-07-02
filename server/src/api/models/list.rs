use crate::lazy_from;
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Hash)]
pub struct List {
    pub id: String,
    pub owner_id: String,
    pub created_at: DateTime<Utc>,
    pub name: String,
    pub description: Option<String>,
    pub timeout_seconds: Option<i64>,
}

#[derive(Deserialize)]
pub struct ListUpdate {
    pub name: String,
    pub description: Option<String>,
    pub timeout_seconds: Option<i64>,
}

lazy_from! {
    database::models::List, List,
    id, owner_id, created_at, name, description, timeout_seconds,
}
