use rocket::{
    http::Cookie,
    response::{Responder, Result},
    Request,
};

pub struct Cookies<R> {
    pub inner: R,
    pub cookies: Vec<Cookie<'static>>,
}

impl<'r, 'o: 'r, R: Responder<'r, 'o>> Responder<'r, 'o> for Cookies<R> {
    fn respond_to(self, request: &'r Request<'_>) -> Result<'o> {
        for cookie in self.cookies {
            request.cookies().add(cookie);
        }
        self.inner.respond_to(request)
    }
}
