use core::fmt;
use rocket::{http::Status, serde::json::Json, Responder};
use serde::Serialize;

pub type Result<T> = std::result::Result<T, Error>;

#[derive(Serialize, Debug)]
pub struct ErrorModel {
    pub message: String,
    pub error: Option<String>,
}

#[derive(Responder, Debug)]
pub struct Error {
    inner: (Status, Json<ErrorModel>),
}

impl Error {
    pub fn new<S: fmt::Display>(
        status: Status,
        message: impl Into<String>,
        error: Option<S>,
    ) -> Self {
        let err = ErrorModel {
            message: message.into(),
            error: error.map(|e| e.to_string()),
        };
        let inner = (status, Json(err));
        Self { inner }
    }

    pub fn message(status: Status, message: impl Into<String>) -> Self {
        Self::new::<&'static str>(status, message, None)
    }

    pub fn not_found(message: impl Into<String>) -> Self {
        Self::message(Status::NotFound, message)
    }

    pub fn bad_request(message: impl Into<String>) -> Self {
        Self::message(Status::BadRequest, message)
    }
}

impl<D> From<D> for Error
where
    D: fmt::Display,
{
    fn from(value: D) -> Self {
        Self::new(
            Status::InternalServerError,
            "Unexpected Error",
            Some(value.to_string()),
        )
    }
}
