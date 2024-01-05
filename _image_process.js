const sharp = require("sharp");
const fs = require("fs");

const params = require('./params.json');

const images_folder = "./images/",
      final_folder = "./processed_images";

fs.readdir(images_folder, (err, files) => {
  remove_files();
  add_folders();
  
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
  if (!fs.existsSync(`${final_folder}`)){
    fs.mkdirSync(`${final_folder}`);
  }

  if (!fs.existsSync(`${final_folder}/webp`)){
    fs.mkdirSync(`${final_folder}/webp`);
  }
  if (!fs.existsSync(`${final_folder}/avif`)){
    fs.mkdirSync(`${final_folder}/avif`);
  }
  if (!fs.existsSync(`${final_folder}/jpg`)){
    fs.mkdirSync(`${final_folder}/jpg`);
  }
}

const convert_image = (file) => {
  convert_to_webp(file);
  convert_to_avif(file);
  convert_to_jpg(file);
};

const convert_to_webp = (name) => {
  if (name) {
    const needed_file_path = `${images_folder}${name}`;
    const file_name = name.split('.')[0];

    sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#webp
      .webp(params.webp)
      .toFile(`${final_folder}/webp/${file_name}.webp`);
  }
};

const convert_to_avif = (name) => {
  if (name) {
    const needed_file_path = `${images_folder}${name}`;
    const file_name = name.split('.')[0];

    sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#avif
      .avif(params.avif)
      .toFile(`${final_folder}/avif/${file_name}.avif`);
  }
};

const convert_to_jpg = (name) => {
  if (name) {
    const needed_file_path = `${images_folder}${name}`;
    const file_name = name.split('.')[0];

    sharp(needed_file_path)
      // https://sharp.pixelplumbing.com/api-output#jpeg
      .jpeg(params.jpg)
      .toFile(`${final_folder}/jpg/${file_name}.jpg`);
  }
};