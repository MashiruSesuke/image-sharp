# Image Sharp

Batch image converter that generates **WebP**, **AVIF**, and **JPEG** outputs with automatic resizing to multiple widths.

---

## 1. Installation

### System requirements

Sharp depends on `libvips`. Install it before running `npm i`:

| OS | Command |
|---|---|
| **Ubuntu / Debian** | `sudo apt-get update && sudo apt-get install -y libvips` |
| **Fedora / RHEL / CentOS** | `sudo dnf install -y vips` or `sudo yum install -y vips` |
| **macOS** | `brew install vips` |
| **Windows** | Native binaries are bundled — no extra step needed |

See also: https://sharp.pixelplumbing.com/install/

### Node.js

- **Node.js ≥ 18.17.0** (Node-API v9), Node.js 22+ recommended
- Check version: `node -v`

### Steps

```bash
# 1. Go to project folder
cd image-sharp

# 2. Install Node.js dependencies
npm i

# 3. (Windows only) Install sharp native binary
npm i @img/sharp-win32-x64
```

---

## 2. Folder Structure

| Folder | Purpose |
|---|---|
| `images/` | Place your source images here |
| `processed_images/` | Generated output (created automatically) |

For the example:

| Folder | Purpose |
|---|---|
| `example/images/` | Source images for the example |
| `example/processed_images/` | Example output |

---

## 3. Configuration (`params.json`)

Copy the template and customize it for your project:

```bash
cp params.example.json params.json
```

The `params.json` file is ignored by git — it's local to your environment.

```json
{
  "webp": {
    "quality": 100,
    "lossless": true
  },
  "avif": {
    "quality": 100,
    "lossless": true
  },
  "jpg": {
    "quality": 100,
    "progressive": true
  },
  "sizes": [300, 600, 1200, 1800, 3000],
  "background": "#F5F5F5"
}
```

### Available parameters

| Key | Description | Default |
|---|---|---|
| `webp` | WebP output options | `quality: 100, lossless: true` |
| `avif` | AVIF output options | `quality: 100, lossless: true` |
| `jpg` | JPEG output options | `quality: 100, progressive: true` |
| `sizes` | Array of target widths (px). Can be empty. | `[300, 600, 1200, 1800, 3000]` |
| `background` | Background color for JPEG (hex string) | `"#F5F5F5"` |

Parameters `webp`, `avif`, `jpg` are direct options from the sharp library:
- [WebP options](https://sharp.pixelplumbing.com/api-output#webp)
- [AVIF options](https://sharp.pixelplumbing.com/api-output#avif)
- [JPEG options](https://sharp.pixelplumbing.com/api-output#jpeg)
- [Flatten (background)](https://sharp.pixelplumbing.com/api-operation#flatten)

---

## 4. Usage

### Main workflow

```bash
# Place images in images/ folder, then run:
node _image_process.js
# or
npm run build
```

Output structure in `processed_images/`:

```
processed_images/
├── webp/
│   ├── filename-default.webp      ← no resize (if sizes is empty)
│   └── filename/
│       ├── 300.webp               ← one file per size
│       ├── 600.webp
│       └── ...
├── avif/
│   └── ...
└── jpg/
    └── ...
```

### When `sizes` is empty or missing

A single non-resized file is generated with a `-default` suffix:

```
processed_images/
├── webp/filename-default.webp
├── avif/filename-default.avif
└── jpg/filename-default.jpg
```

### Run the example

```bash
node _image_process.js example
# or
npm run example
```

Place a test image in `example/images/example.*`, then run. Open the result in your browser: `example/index.html`.

---

## 5. How it works

1. The script reads all files from the `images/` folder
2. For each file:
   - Converts to **WebP** (with transparency support)
   - Converts to **AVIF** (with transparency support)
   - Converts to **JPEG** (with the configured background color)
3. If `sizes` is not empty, one file is generated per size
4. Old output in `processed_images/` is deleted before generating new output

---

## 6. Troubleshooting

| Issue | Solution |
|---|---|
| Sharp fails to compile | Ensure Node.js ≥ 18.17.0 |
| Not working on Windows | Run `npm i @img/sharp-win32-x64` |
| Missing `images/` folder | The script creates it automatically, but it's better to create it manually and place files |