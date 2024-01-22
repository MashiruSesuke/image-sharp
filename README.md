My work with `sharp`.

To work you need to create `images` and `processed_images` inside your project folder.

To run, use `node _image_process.js` or `npm run build`.

Requare `Node-API v9 compatible runtime e.g. Node.js >= 18.17.0`:
https://sharp.pixelplumbing.com/install

Also for `win` need to install package:
`npm i @img/sharp-win32-x64`

# Install

Run `npm i`

# Params

`params.json` supports:
1. `webp` params from https://sharp.pixelplumbing.com/api-output#webp
2. `avif` params from https://sharp.pixelplumbing.com/api-output#avif
3. `jpeg` params from https://sharp.pixelplumbing.com/api-output#jpeg
4. `sizes` array with needed sizes. Can be empty or deleted.

# Example

To run example, use `node _image_process.js example` or `npm run example`.
Then open `./example/index.html`.

You can place your `example` image to the `./example/images/example.*`.