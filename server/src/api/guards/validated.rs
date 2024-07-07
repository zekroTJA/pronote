use rocket::{
    data::{FromData, Outcome},
    http::Status,
    serde::json::Json,
    Data, Request,
};
use serde::Deserialize;
use serde_valid::{validation::Errors, Validate};

pub struct Validated<T>(pub T);

#[rocket::async_trait]
impl<'r, T> FromData<'r> for Validated<Json<T>>
where
    T: Validate,
    T: Deserialize<'r>,
{
    type Error = Result<Errors, rocket::serde::json::Error<'r>>;

    async fn from_data(req: &'r Request<'_>, data: Data<'r>) -> Outcome<'r, Self> {
        let data_outcome = <Json<T> as FromData<'r>>::from_data(req, data).await;

        match data_outcome {
            Outcome::Error((status, err)) => Outcome::Error((status, Err(err))),
            Outcome::Forward((data, status)) => Outcome::Forward((data, status)),
            Outcome::Success(data) => match data.validate() {
                Ok(_) => Outcome::Success(Self(data)),
                Err(err) => Outcome::Error((Status::UnprocessableEntity, Ok(err))),
            },
        }
    }
}
