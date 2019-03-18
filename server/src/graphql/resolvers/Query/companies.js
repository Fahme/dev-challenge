import fs from 'fs';
import util from 'util';

const readDir = util.promisify(fs.readdir);

import { getCompany, getUser } from '../../../helpers';

export default async function companies(root, args, { ctx }, info) {
  const users = await fetchUsers();

  const companies = await fetchCompanies(users);

  return companies;
}

async function fetchCompanies(users) {
  const files = await readDir('./data/companies');
  const companies = files
    .filter(filename => filename.includes('.json'))
    .map(filename => getCompany(filename.replace('.json', ''), users));
  return companies;
}

async function fetchUsers() {
  const ufiles = await readDir('./data/users');
  let users = ufiles
    .filter(filename => filename.includes('.json'))
    .map(filename => getUser(filename.replace('.json', '')));

  users = await Promise.all(users);
  return users;
}
