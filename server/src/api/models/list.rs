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

impl From<database::models::List> for List {
    fn from(value: database::models::List) -> Self {
        Self {
            id: value.id,
            owner_id: value.owner_id,
            created_at: value.created_at,
            name: value.name,
            description: value.description,
            timeout_seconds: value.timeout_seconds,
        }
    }
}
