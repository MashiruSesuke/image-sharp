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
  // del old files and create all needed folders
  remove_files();
  add_folders();

  // read `images_folder`
  files.forEach((file) => {
    convert_image(file);
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

  // create `images/webp` folder
  if (!fs.existsSync(`${final_folder}/webp`)) {
    fs.mkdirSync(`${final_folder}/webp`);
  }
  // create `images/avif` folder
  if (!fs.existsSync(`${final_folder}/avif`)) {
    fs.mkdirSync(`${final_folder}/avif`);
  }
  // create `images/jpg` folder
  if (!fs.existsSync(`${final_folder}/jpg`)) {
    fs.mkdirSync(`${final_folder}/jpg`);
  }
};

/**
 * Convert file to needed formats
 *
 * @param {String} file   file name with format (like 'test.png')
 */
const convert_image = (file) => {
  convert_to_webp(file);
  convert_to_avif(file);
  convert_to_jpg(file);
};

/**
 * Convert file to webp
 *
 * @param {String} file   file name with format (like 'test.png')
 */
const convert_to_webp = (file) => {
  if (file) {
    // file path
    const needed_file_path = `${images_folder}/${file}`;

    // needed file name without format
    const file_name = file.split(".")[0];

    if (params.sizes?.length > 0) {
      sharp(needed_file_path)
        // https://sharp.pixelplumbing.com/api-output#webp
        .webp(params.webp)
        .toBuffer()
        .then((data) => {
          // prepare files for all sizes
          params.sizes.forEach((size) => {
            resize_image(data, file_name, "webp", +size);
          });
        });
    } else {
      sharp(needed_file_path)
        // https://sharp.pixelplumbing.com/api-output#webp
        .webp(params.webp)
        .toFile(`${final_folder}/webp/${file_name}-default.webp`);
    }
  }
};

/**
 * Convert file to avif
 *
 * @param {String} file   file name with format (like 'test.png')
 */
const convert_to_avif = (file) => {
  if (file) {
    const needed_file_path = `${images_folder}/${file}`;
    const file_name = file.split(".")[0];

    if (params.sizes?.length > 0) {
      sharp(needed_file_path)
        // https://sharp.pixelplumbing.com/api-output#avif
        .avif(params.avif)
        .toBuffer()
        .then((data) => {
          // prepare files for all sizes
          params.sizes.forEach((size) => {
            resize_image(data, file_name, "avif", +size);
          });
        });
    } else {
      sharp(needed_file_path)
        // https://sharp.pixelplumbing.com/api-output#avif
        .avif(params.avif)
        .toFile(`${final_folder}/avif/${file_name}-default.avif`);
    }
  }
};

/**
 * Convert file to jpg
 *
 * @param {String} file   file name with format (like 'test.png')
 */
const convert_to_jpg = (file) => {
  if (file) {
    const needed_file_path = `${images_folder}/${file}`;
    const file_name = file.split(".")[0];

    if (params.sizes?.length > 0) {
      sharp(needed_file_path)
        // https://sharp.pixelplumbing.com/api-output#jpeg
        .jpeg(params.jpg)
        .toBuffer()
        .then((data) => {
          // prepare files for all sizes
          params.sizes.forEach((size) => {
            resize_image(data, file_name, "jpg", +size);
          });
        });
    } else {
      sharp(needed_file_path)
        // https://sharp.pixelplumbing.com/api-output#jpeg
        .jpeg(params.jpg)
        .toFile(`${final_folder}/jpg/${file_name}-default.jpg`);
    }
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
    sharp(file)
      .resize(width)
      .toFile(`${final_folder}/${format}/${name}-${width}.${format}`);
  } else {
    console.log("something missed in the `resize_image` func");
  }
};
