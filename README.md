# Safe Layer

Safe Layer sanitizes images and PDF documents locally in the browser before
they are shared for government, official, or professional procedures.

## Features

- English and Spanish interface.
- Permanent black redactions in exported files.
- Optional grayscale output.
- Repeating wave-shaped watermark with consistent spacing for text of any length.
- Local browser processing; this version does not upload documents to a server.

## Run locally

```sh
git clone https://github.com/davidgcs/safelayer.git
cd safelayer
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).

The application loads PDF.js and pdf-lib from public CDNs, so an internet
connection is required when opening or exporting PDF files.
