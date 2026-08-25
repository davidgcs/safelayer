# Safe Layer

Safe Layer sanitizes images and PDF documents locally in the browser before
they are shared for government, official, or professional procedures.

## Features

- English and Spanish interface with a persistent light/dark theme.
- Permanent black redactions in exported files.
- Per-page cropping and left/right rotation for images and PDFs.
- Explicit per-page redaction mode, reset action, and page deletion with confirmation.
- Grayscale and the localized `copy`/`copia` watermark are enabled automatically.
- Adjustable watermark weight with a slider.
- Repeating wave-shaped watermark with consistent spacing for text of any length.
- Local browser processing; this version does not upload documents to a server.
- Branded favicon and social preview card for shared links.

## Reusable GitHub branding

The creator banner links to [@davidgcs](https://github.com/davidgcs) and the
[Safe Layer repository](https://github.com/davidgcs/safelayer). To reuse it in
another static app, copy the `.github-brand` element from `index.html`,
copy `github-brand.css`, and link the stylesheet from the new app's `<head>`.

## Run locally

```sh
git clone https://github.com/davidgcs/safelayer.git
cd safelayer
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

The application loads PDF.js and pdf-lib from public CDNs, so an internet
connection is required when opening or exporting PDF files.
