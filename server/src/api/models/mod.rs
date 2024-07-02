mod list;
pub use list::*;
use serde::Serialize;

#[macro_export]
macro_rules! lazy_from {
    ($from:ty, $to:ty, $( $field:tt, )*) => {
        impl From<&$from> for $to {
            fn from(value: &$from) -> Self {
                Self {
                    $(
                        $field: value.$field.clone(),
                    )*
                }
            }
        }

        impl From<$from> for $to {
            fn from(value: $from) -> Self {
                Self {
                    $(
                        $field: value.$field,
                    )*
                }
            }
        }
    };
}

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
