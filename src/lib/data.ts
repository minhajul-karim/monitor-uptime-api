import * as fs from 'fs/promises';
import * as path from 'path';
import { Lib } from '../helpers/types';

const lib = {} as Lib;

const filePath = path.join(__dirname, '../../.data');
const EXTENSION = '.txt';

lib.create = async (folderName, fileName, content) => {
  const newFileName = `${fileName}${EXTENSION}`;
  const newFilePath = `${filePath}/${folderName}/${newFileName}`;
  try {
    await fs.writeFile(newFilePath, content, { flag: 'wx' });
    console.log(`${fileName}${EXTENSION} has been created!`);
  } catch (error) {
    console.error(
      `Could not create the file ${newFileName}. The file may already exist`,
    );
    throw error;
  }
};

lib.read = async (folderName, fileName) => {
  const fileNameToRead = `${fileName}${EXTENSION}`;
  const filePathToRead = `${filePath}/${folderName}/${fileNameToRead}`;
  try {
    const data = await fs.readFile(filePathToRead, { encoding: 'utf8' });
    return data;
  } catch (error) {
    console.error(`Couldn't read ${fileNameToRead}`);
    throw error;
  }
};

lib.update = async (folderName, fileName, content) => {
  const fileNameToUpdate = `${fileName}${EXTENSION}`;
  const filePathToUpdate = `${filePath}/${folderName}/${fileNameToUpdate}`;
  try {
    // Check if file exists before update
    await fs.access(filePathToUpdate);
    await fs.writeFile(filePathToUpdate, content);
    console.log(`${fileName}${EXTENSION} has been updated!`);
  } catch (error) {
    console.error(`Could not update the file ${fileNameToUpdate}`);
    throw error;
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
    throw error;
  }
};

export default lib;
