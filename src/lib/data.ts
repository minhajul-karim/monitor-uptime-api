import * as fs from 'fs/promises';
import * as path from 'path';

interface Lib {
  create: (fileName: string, content: string) => void;
  update: (fileName: string, content: string) => void;
  read: (fileName: string) => void;
  delete: (fileName: string) => void;
}

const lib = {} as Lib;

const filePath = path.join(__dirname, '../../.data/contents');
const EXTENSION = '.txt';

lib.create = async (fileName, content) => {
  const newFileName = `${fileName}${EXTENSION}`;
  const newFilePath = `${filePath}/${newFileName}`;
  try {
    await fs.writeFile(newFilePath, content, { flag: 'wx' });
    console.log(`${fileName}${EXTENSION} has been created!`);
  } catch (error) {
    console.error(`Could not create the file ${newFileName}`);
  }
};

lib.read = async (fileName) => {
  const fileNameToRead = `${fileName}${EXTENSION}`;
  const filePathToRead = `${filePath}/${fileNameToRead}`;
  try {
    const data = await fs.readFile(filePathToRead, { encoding: 'utf8' });
    console.log(data);
  } catch (error) {
    console.error(`Could not read the file ${fileNameToRead}`);
  }
};

lib.update = async (fileName, content) => {
  const fileNameToUpdate = `${fileName}${EXTENSION}`;
  const filePathToUpdate = `${filePath}/${fileNameToUpdate}`;
  try {
    await fs.appendFile(filePathToUpdate, content);
    console.log(`${fileName}${EXTENSION} has been updated!`);
  } catch (error) {
    console.error(`Could not update the file ${fileNameToUpdate}`);
  }
};

lib.delete = async (fileName) => {
  const fileNameToDelete = `${fileName}${EXTENSION}`;
  const filePathToDelete = `${filePath}/${fileNameToDelete}`;
  try {
    await fs.unlink(filePathToDelete);
    console.log(`Deleted ${fileNameToDelete}`);
  } catch (error) {
    console.error(`Could not delete ${fileNameToDelete}`);
  }
};

export default lib;
