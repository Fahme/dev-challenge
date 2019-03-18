import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);

export default async function getCompany(id, users = null) {
  const data = await readFile(`./data/companies/${id}.json`, 'utf8');
  const parsed = JSON.parse(data);

  if (users) parsed.employees = users;

  return parsed;
}
