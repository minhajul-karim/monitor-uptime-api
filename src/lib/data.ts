import * as fs from 'fs/promises';
import * as path from 'path';

interface Lib {
  create: (fileName: string, content: string) => void;
  update: (fileName: string, content: string) => void;
  read: (fileName: string) => void;
}

const lib = {} as Lib;

const filePath = path.join(__dirname, '../../.data');
const EXTENSION = '.txt';

lib.create = async (fileName, content) => {
  const newFileName = `${filePath}/${fileName}${EXTENSION}`;
  try {
    await fs.writeFile(newFileName, content, { flag: 'wx' });
    console.log(`${fileName}.json has been created!`);
  } catch (error) {
    console.error('Could not create the file');
  }
};

lib.read = async (fileName) => {
  try {
    const fileToRead = `${filePath}/${fileName}${EXTENSION}`;
    const data = await fs.readFile(fileToRead, { encoding: 'utf8' });
    console.log(data);
  } catch (error) {
    console.log('Could not read the file');
  }
};

lib.update = async (fileName, content) => {
  const fileToUpdate = `${filePath}/${fileName}${EXTENSION}`;
  try {
    await fs.appendFile(fileToUpdate, content);
    console.log(`${fileName}.json has been updated!`);
  } catch (error) {
    console.error('Could not update the file');
  }
};

export default lib;
