import fsx from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON } = fsx;

const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../db"
);

export const getBooks = async () =>
  await readJSON(join(dataFolderPath, "books.json"));

export const writeBooks = async (content) =>
  await writeJSON(join(dataFolderPath, "books.json"), content);
