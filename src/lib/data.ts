import * as fs from 'fs/promises';
import * as path from 'path';

interface Lib {
  create: (folderName: string, fileName: string, content: string) => Promise<boolean>;
  update: (folderName: string, fileName: string, content: string) => void;
  read: (folderName: string, fileName: string) => void;
  delete: (folderName: string, fileName: string) => void;
}

const lib = {} as Lib;

const filePath = path.join(__dirname, '../../.data');
const EXTENSION = '.txt';

lib.create = async (folderName, fileName, content) => {
  const newFileName = `${fileName}${EXTENSION}`;
  const newFilePath = `${filePath}/${folderName}/${newFileName}`;
  try {
    await fs.writeFile(newFilePath, content, { flag: 'wx' });
    console.log(`${fileName}${EXTENSION} has been created!`);
    return true;
  } catch (error) {
    console.error(`Could not create the file ${newFileName}`);
    return false;
  }
};

lib.read = async (folderName, fileName) => {
  const fileNameToRead = `${fileName}${EXTENSION}`;
  const filePathToRead = `${filePath}/${folderName}/${fileNameToRead}`;
  try {
    const data = await fs.readFile(filePathToRead, { encoding: 'utf8' });
    console.log(data);
  } catch (error) {
    console.error(`Could not read the file ${fileNameToRead}`);
  }
};

lib.update = async (folderName, fileName, content) => {
  const fileNameToUpdate = `${fileName}${EXTENSION}`;
  const filePathToUpdate = `${filePath}/${folderName}/${fileNameToUpdate}`;
  try {
    await fs.appendFile(filePathToUpdate, content);
    console.log(`${fileName}${EXTENSION} has been updated!`);
  } catch (error) {
    console.error(`Could not update the file ${fileNameToUpdate}`);
  }
};

lib.delete = async (folderName, fileName) => {
  const fileNameToDelete = `${fileName}${EXTENSION}`;
  const filePathToDelete = `${filePath}/${folderName}/${fileNameToDelete}`;
  try {
    await fs.unlink(filePathToDelete);
    console.log(`Deleted ${fileNameToDelete}`);
  } catch (error) {
    console.error(`Could not delete ${fileNameToDelete}`);
  }
};

export default lib;
