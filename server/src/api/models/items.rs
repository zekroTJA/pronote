use chrono::{DateTime, TimeDelta, Utc};
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, PartialEq, Eq, Hash, Clone)]
#[serde(rename_all = "lowercase")]
pub enum Part {
    Top,
    Bottom,
    Expired,
}

impl From<i32> for Part {
    fn from(value: i32) -> Self {
        match value {
            0 => Self::Top,
            1 => Self::Bottom,
            _ => Self::Expired,
        }
    }
}

impl Part {
    pub fn value(&self) -> i32 {
        match self {
            Part::Top => 0,
            Part::Bottom => 1,
            Part::Expired => 2,
        }
    }
}

#[derive(Deserialize, Serialize, Hash, Clone)]
pub struct Item {
    pub id: String,
    pub list_id: String,
    pub part: Part,
    pub created_at: DateTime<Utc>,
    pub edited_at: DateTime<Utc>,
    pub title: String,
    pub description: Option<String>,
    pub expires_in_seconds: Option<i64>,
    pub expires_at: Option<DateTime<Utc>>,
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
            expires_in_seconds: None,
            expires_at: None,
        }
    }
}

impl Item {
    pub fn with_expires(self, list_expiry_seconds: Option<i32>, now: DateTime<Utc>) -> Self {
        if self.part == Part::Top {
            return self;
        }

        let Some(list_expiry_seconds) = list_expiry_seconds else {
            return self;
        };

        let expires_in_seconds = list_expiry_seconds as i64 - (now - self.edited_at).num_seconds();
        let expires_at = now + TimeDelta::seconds(expires_in_seconds);

        Self {
            expires_in_seconds: Some(expires_in_seconds),
            expires_at: Some(expires_at),
            ..self
        }
    }
}

#[derive(Deserialize)]
pub struct ItemUpdate {
    pub title: String,
    pub description: Option<String>,
    pub part: Part,
}
