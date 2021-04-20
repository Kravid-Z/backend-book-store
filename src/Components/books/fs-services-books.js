import fsx from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fsx;

// tool for get all paths wherever folder, must import always this import { dirname, join } from "path"; only PARAMETER will be the new path stucture AS STRING that i want to join
// const thisFolderPath = (newPath) => {
//   join(dirname(fileURLToPath(import.meta.url)), newPath); // DOESN'T WORK error with string type in path
// };

const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../db"
);

export const getBooks = async () =>
  await readJSON(join(dataFolderPath, "books.json"));

export const writeBooks = async (content) =>
  await writeJSON(join(dataFolderPath, "books.json"), content);
