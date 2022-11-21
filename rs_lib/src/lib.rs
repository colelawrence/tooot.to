use wasm_bindgen::prelude::*;
use fast_qr;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
  return a + b;
}

#[wasm_bindgen]
pub fn generate_qr_code(url: String) -> Vec<u8> {
  use fast_qr::convert::{image::ImageBuilder, Builder, Shape};

  let margins: usize = 4; 
  let squares = (33 + margins * 2) as u32;
  // common 33 + 4 + 4
  let qrcode = fast_qr::qr::QRBuilder::new(url)
  .build().expect("valid qr input");

  ImageBuilder::default()
      // .shape(Shape::Square)
      .margin(margins)
      .fit_width(squares * 4)
      .to_pixmap(&qrcode)
      .encode_png()
      .expect("rendered png")
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn it_works() {
    let result = add(1, 2);
    assert_eq!(result, 3);
  }
}
