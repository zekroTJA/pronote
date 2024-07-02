mod list;
pub use list::*;

mod items;
pub use items::*;

use serde::Serialize;

#[derive(Serialize)]
pub struct ListResponse<I> {
    pub count: usize,
    pub items: Vec<I>,
}

impl<I> From<Vec<I>> for ListResponse<I>
where
    I: Serialize,
{
    fn from(value: Vec<I>) -> Self {
        Self {
            count: value.len(),
            items: value,
        }
    }
}
