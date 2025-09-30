const sharp = require("sharp");
const fs = require("fs");
const { argv } = require('node:process');

const params = require("./params.json");

let images_folder = "./images",
  final_folder = "./processed_images";

if (argv[2] && argv[2] === 'example') {
  images_folder = "./example/images",
  final_folder = "./example/processed_images";
}

// create `images` folder
if (!fs.existsSync(`${images_folder}`)) {
  fs.mkdirSync(`${images_folder}`);
}

fs.readdir(`${images_folder}/`, (err, files) => {
  console.log("Work in progres...");

  // del old files and create all needed folders
  remove_files();
  add_folders();

  // read `images_folder`
  const tasks = files.map((file) => convert_image(file));

  Promise.all(tasks)
    .then(() => {
      console.log("Build successful");
    })
    .catch((error) => {
      console.error("Build failed:", error);
    });
});

// https://stackoverflow.com/questions/27072866/how-to-remove-all-files-from-directory-without-removing-directory-in-node-js
// https://stackoverflow.com/questions/18052762/remove-directory-which-is-not-empty
const remove_files = () => {
  fs.rmSync(final_folder, { recursive: true, force: true });
};

// https://stackoverflow.com/questions/21194934/how-to-create-a-directory-if-it-doesnt-exist-using-node-js
const add_folders = () => {
  // create `processed_images` folder
  if (!fs.existsSync(`${final_folder}`)) {
    fs.mkdirSync(`${final_folder}`);
  }
};

/**
 * Convert file to needed formats
 *
 * @param {String} file   file name with format (like 'test.png')
 */
const convert_image = (file) => {
  return Promise.all([
    convert_to_webp(file),
    convert_to_avif(file),
    convert_to_jpg(file)
  ]);
};

/**
 * Convert file to webp
 *
 * @param {String} file   file name with format (like 'test.png')
 */
const convert_to_webp = async (file) => {
  if (!file) return Promise.resolve();

  // file path
  const needed_file_path = `${images_folder}/${file}`;

  // needed file name without format
  const file_name = file.split(".")[0];

  if (params.sizes?.length > 0) {
    return sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#webp
      .webp(params.webp)
      .toBuffer()
      .then((data) => {
        // prepare files for all sizes
        params.sizes.forEach(async (size) => {
          await resize_image(data, file_name, "webp", +size);
        });
      });
  } else {
    return sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#webp
      .webp(params.webp)
      .toFile(`${final_folder}/webp/${file_name}-default.webp`);
  }
};

/**
 * Convert file to avif
 *
 * @param {String} file   file name with format (like 'test.png')
 */
const convert_to_avif = async (file) => {
  if (!file) return Promise.resolve();

  const needed_file_path = `${images_folder}/${file}`;
  const file_name = file.split(".")[0];

  if (params.sizes?.length > 0) {
    const data = await sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#avif
      .avif(params.avif)
      .toBuffer();
    // prepare files for all sizes
    params.sizes.forEach(async(size) => {
      await resize_image(data, file_name, "avif", +size);
    });
  } else {
    return sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#avif
      .avif(params.avif)
      .toFile(`${final_folder}/avif/${file_name}-default.avif`);
  }
};

/**
 * Convert file to jpg
 *
 * @param {String} file   file name with format (like 'test.png')
 */
const convert_to_jpg = async (file) => {
  if (!file) return Promise.resolve();

  const needed_file_path = `${images_folder}/${file}`;
  const file_name = file.split(".")[0];

  if (params.sizes?.length > 0) {
    return sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-operation#flatten
      .flatten({ background: params.background })
      // https://sharp.pixelplumbing.com/api-output#jpeg
      .jpeg(params.jpg)
      .toBuffer()
      .then((data) => {
        // prepare files for all sizes
        params.sizes.forEach(async (size) => {
          await resize_image(data, file_name, "jpg", +size);
        });
      });
  } else {
    return sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#jpeg
      .jpeg(params.jpg)
      .toFile(`${final_folder}/jpg/${file_name}-default.jpg`);
  }
};

/**
 * Resize image to needed width
 *
 * @param {String} file     image data
 * @param {String} name     file name
 * @param {String} format   needed format
 * @param {Number} width    needed width
 */
const resize_image = (file, name, format, width) => {
  if (file && name && format && width) {
    if (!fs.existsSync(`${final_folder}/${name}`)) {
      fs.mkdirSync(`${final_folder}/${name}`);
    }

    return sharp(file)
      .resize(width)
      .toFile(`${final_folder}/${name}/${width}.${format}`);
  } else {
    console.log("something missed in the `resize_image` func");
    return Promise.resolve();
  }
};
