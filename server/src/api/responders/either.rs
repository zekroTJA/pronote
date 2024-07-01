use rocket::response::Responder;

pub enum Either<A, B> {
    A(A),
    B(B),
}

impl<'r, 'o, A, B> Responder<'r, 'o> for Either<A, B>
where
    'o: 'r,
    A: Responder<'r, 'o>,
    B: Responder<'r, 'o>,
{
    fn respond_to(self, request: &'r rocket::Request<'_>) -> rocket::response::Result<'o> {
        match self {
            Either::A(r) => r.respond_to(request),
            Either::B(r) => r.respond_to(request),
        }
    }
}
