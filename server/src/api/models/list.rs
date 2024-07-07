use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use serde_valid::Validate;

#[derive(Serialize, Hash)]
pub struct List {
    pub id: String,
    pub owner_id: String,
    pub created_at: DateTime<Utc>,
    pub name: String,
    pub description: Option<String>,
    pub timeout_seconds: Option<i32>,
}

#[derive(Deserialize, Validate)]
pub struct ListUpdate {
    #[validate(max_length = 100)]
    pub name: String,
    #[validate(max_length = 2000)]
    pub description: Option<String>,
    pub timeout_seconds: Option<i32>,
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
