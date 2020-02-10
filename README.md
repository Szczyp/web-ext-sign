# web-ext-sign GitHub Action #

[![Build Status](https://github.com/Szczyp/web-ext-sign/workflows/Test/badge.svg)](https://github.com/Szczyp/web-ext-sign/actions?workflow=Test)

This action allows you to sign an add-on using [mozilla/web-ext](https://github.com/mozilla/web-ext).

## Inputs ##

* apiKey: Mozilla API key used for signing. Required.
* apiSecret: Mozilla API secret used for signing. Required.
* sourceDir: Path to an addon source. Defaults to `'.'`.
* ignoreFiles: List of ignored paths. Defaults to `[]`.
* channel: Mozilla release channel. Defaults to `'unlisted'`.

## Outputs ##
* name: Filename of a signed xpi.
* path: Directory of a signed xpi.
* target: Path to a signed xpi.
  
## Usage ##

```yaml
name: "Release"
on:
  push:
    tags:
      - 'v*.*.*'

jobs:
  sign:
    name: "Release"
    runs-on: ubuntu-latest
    steps:
      - name: "Checkout"
        uses: actions/checkout@v2

      - name: "web-ext-sign"
        id: web-ext-sign
        uses: Szczyp/web-ext-sign@v1
        with:
          apiKey: ${{ secrets.API_KEY }}
          apiSecret: ${{ secrets.API_SECRET }}

      - name: "Create Release"
        uses: softprops/action-gh-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          files: ${{ steps.web-ext-sign.outputs.target }}
```
