# fresh project

### Usage

Start the project:

```
deno task start
```

This will watch the project directory and restart as necessary.

## Contributing

### Is a redirection not working?

- Look into the [`REDIRECTORS` in _404.tsx route](routes/_404.tsx)

### Is a preference not being saved?

- Look into the
  [`setPrefCookie` in shared/setPrefCookie.tsx](shared/setPrefCookie.tsx), or
- Look into the
  [`getToootCookies` in shared/getToootCookies.tsx](shared/getToootCookies.tsx)

### Is a QR code sucky?

- Look into the [`generate_qr_code` in the Rust lib](rs_lib/src/lib.rs)

TODO:

- [ ] Make QR codes not blurry (should be pixel aligned)
- [ ] Move `tooot.to/@toLabel` text to QR Code from handoff.tsx
