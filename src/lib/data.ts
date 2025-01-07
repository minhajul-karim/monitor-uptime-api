import * as fs from "fs/promises";
import * as path from "path";

interface Lib {
  create: (fileName: string, content: unknown) => void;
}

const lib = {} as Lib;

lib.create = async (fileName, content) => {
  const filePath = path.join(__dirname, "../../.data");
  const newFileName = `${filePath}/${fileName}.json`;
  const contentStr = content ? JSON.stringify(content) : "";
  try {
    await fs.writeFile(newFileName, contentStr, {flag: "wx"});
    console.log(`${fileName}.json has been created!`)
  } catch (error) {
    console.error("Could not create the file");
  }
}

export default lib