import { unlink } from "fs/promises";

export const removeFile = async (path) => {
  try {
    unlink(path);
  } catch (error) {
    console.log("errr removin file", error.message);
  }
};
