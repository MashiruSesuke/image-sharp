const sharp = require("sharp");
const fs = require("fs");

const params = require("./params.json");

const images_folder = "./images",
  final_folder = "./processed_images";

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
  // create `images` folder
  if (!fs.existsSync(`${images_folder}`)) {
    fs.mkdirSync(`${images_folder}`);
  }
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

    sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#webp
      .webp(params.webp)
      .toFile(`${final_folder}/webp/${file_name}.webp`);
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

    sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#avif
      .avif(params.avif)
      .toFile(`${final_folder}/avif/${file_name}.avif`);
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

    sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#jpeg
      .jpeg(params.jpg)
      .toFile(`${final_folder}/jpg/${file_name}.jpg`);
  }
};
