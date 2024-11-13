import fs from "fs";
import path from "path";

const fileRemover = (filename) => {
  fs.unlink(path.join(__dirname, "../uploads", filename), function (err) {
    if (err && err.code == "ENOENT") {
      console.log(`El archivo ${filename} No existe, no se elimina.`);
    } else if (err) {
      console.log(err.message);
      console.log(`Se produjo un error al intentar eliminar el archivo ${filename}`);
    } else {
      console.log(`Se eliminó ${filename}`);
    }
  });
};

export { fileRemover };
