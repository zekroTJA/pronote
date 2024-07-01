use std::time::{SystemTime, UNIX_EPOCH};

use anyhow::Result;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use rand::{rngs::StdRng, Rng, SeedableRng};
use rocket::time::Duration;
use serde::{de::DeserializeOwned, Serialize};

pub struct Handler {
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
}

impl Handler {
    pub fn new() -> Self {
        let mut key_bytes = [0; 512];
        let mut rng = StdRng::from_entropy();
        rng.fill(&mut key_bytes);

        let encoding_key = EncodingKey::from_secret(key_bytes.as_ref());
        let decoding_key = DecodingKey::from_secret(key_bytes.as_ref());

        Handler {
            encoding_key,
            decoding_key,
        }
    }

    pub fn encode<C>(&self, claims: C) -> Result<String>
    where
        C: Serialize,
    {
        let res = encode(&Header::default(), &claims, &self.encoding_key)?;
        Ok(res)
    }

    pub fn decode<C, T>(&self, token: &str, required_claims: &[T]) -> Result<C>
    where
        C: DeserializeOwned,
        T: ToString,
    {
        let mut validation = Validation::default();
        validation.set_required_spec_claims(required_claims);

        let res = decode(token, &self.decoding_key, &validation)?;
        Ok(res.claims)
    }
}

pub fn expire_in(duration: Duration) -> usize {
    let m = SystemTime::now() + duration;
    m.duration_since(UNIX_EPOCH)
        .expect("time must be after unix expoch")
        .as_secs() as usize
}
