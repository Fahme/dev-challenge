import fs from 'fs';
import util from 'util';
import uuidBase62 from 'uuid-base62';

import { isBase16 } from '../helpers';

const writeFile = util.promisify(fs.writeFile);

export default async function setUser(user) {
  let id;
  if (!isBase16(user.id)) {
    const decoded = uuidBase62.decode(user.id);
    id = decoded;
  }
  id = user.id;
  return writeFile(`./data/users/${id}.json`, JSON.stringify(user));
}
