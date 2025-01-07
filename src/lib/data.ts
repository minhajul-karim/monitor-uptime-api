import * as fs from 'fs/promises';
import * as path from 'path';

interface Lib {
  create: (fileName: string, content: unknown) => void;
  read: (fileName: string) => void;
}

const lib = {} as Lib;

lib.create = async (fileName, content) => {
  const filePath = path.join(__dirname, '../../.data');
  const newFileName = `${filePath}/${fileName}.json`;
  const contentStr = content ? JSON.stringify(content) : '';
  try {
    await fs.writeFile(newFileName, contentStr, { flag: 'wx' });
    console.log(`${fileName}.json has been created!`);
  } catch (error) {
    console.error('Could not create the file');
  }
};

lib.read = async (fileName) => {
  try {
    const filePath = path.join(__dirname, '../../.data');
    const fileToRead = `${filePath}/${fileName}.json`;
    const data = await fs.readFile(fileToRead, { encoding: 'utf8' });
    console.log(data);
  } catch (error) {
    console.log('Could not read the file');
  }
};

export default lib;
