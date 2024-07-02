use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, PartialEq, Eq, Hash)]
#[serde(rename_all = "lowercase")]
pub enum Part {
    Top,
    Bottom,
    Expired,
}

impl From<i64> for Part {
    fn from(value: i64) -> Self {
        match value {
            0 => Self::Top,
            1 => Self::Bottom,
            _ => Self::Expired,
        }
    }
}

impl Part {
    pub fn value(&self) -> i64 {
        match self {
            Part::Top => 0,
            Part::Bottom => 1,
            Part::Expired => 2,
        }
    }
}

#[derive(Deserialize, Serialize, Hash)]
pub struct Item {
    pub id: String,
    pub list_id: String,
    pub part: Part,
    pub created_at: DateTime<Utc>,
    pub edited_at: DateTime<Utc>,
    pub title: String,
    pub description: Option<String>,
}

impl From<database::models::Item> for Item {
    fn from(value: database::models::Item) -> Self {
        Self {
            id: value.id,
            list_id: value.list_id,
            part: value.part.into(),
            created_at: value.created_at,
            edited_at: value.edited_at,
            title: value.title,
            description: value.description,
        }
    }
}

#[derive(Deserialize)]
pub struct ItemUpdate {
    pub title: String,
    pub description: Option<String>,
    pub part: Part,
}
