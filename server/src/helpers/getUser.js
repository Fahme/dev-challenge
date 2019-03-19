import fs from 'fs';
import util from 'util';
import uuidBase62 from 'uuid-base62';

import isBase16 from './isBase16';
const readFile = util.promisify(fs.readFile);

export default async function getUser(id) {
  if (!isBase16(id)) {
    const decoded = uuidBase62.decode(id);
    id = decoded;
  }

  const data = await readFile(`./data/users/${id}.json`, 'utf8');
  return JSON.parse(data);
}
