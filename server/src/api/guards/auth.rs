use openid::{biscuit::jws, Client, Compact, Empty, StandardClaims};
use rocket::{
    async_trait,
    http::Status,
    outcome::try_outcome,
    request::{FromRequest, Outcome},
    Request, State,
};
use std::ops::Deref;

pub struct Auth(StandardClaims);

#[async_trait]
impl<'r> FromRequest<'r> for Auth {
    type Error = &'r str;

    async fn from_request(request: &'r Request<'_>) -> Outcome<Self, Self::Error> {
        let Some(id_token) = request.cookies().get("id_token") else {
            return Outcome::Error((Status::Unauthorized, "no ID token contained in request"));
        };

        let client = try_outcome!(request
            .guard::<&State<Client>>()
            .await
            .map_error(|(status, ())| (status, "failed extracting OIDC client from request")));

        match decode_and_validate_token(client, id_token.value()) {
            Ok(claims) => Outcome::Success(Self(claims)),
            Err(_) => Outcome::Error((Status::Unauthorized, "invalid ID token")),
        }
    }
}

impl Deref for Auth {
    type Target = StandardClaims;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

fn decode_and_validate_token(
    client: &State<Client>,
    token: &str,
) -> anyhow::Result<StandardClaims> {
    let mut id_token = jws::Compact::<StandardClaims, Empty>::Encoded(Compact::decode(token));
    client.decode_token(&mut id_token)?;
    client.validate_token(&id_token, None, None)?;
    Ok(dbg!(id_token.payload()?).clone())
}
