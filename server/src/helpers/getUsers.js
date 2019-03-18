import fs from 'fs';
// import util from 'util';
import path from 'path';

// const readDir = util.promisify(fs.readdir);

import getUser from './getUser';

// todo: 3. can we accept a input variable into the graphql query to only show certain users? Maybe allowing
//  filter by name to begin with.

// todo: 5. getting this list of all users is slow.  Would be really cool if it could return all the users
//  in a more performant way.  Keeping in mind that the underlaying JSON files may get updated.

export default async function getUsers(criteria) {
  try {
    const dir = path.join(__dirname, '../../data/users');
    const files = fs.readdirSync(dir);
    const users = files.map(filename => getUser(filename.replace('.json', '')));

    const result = await Promise.all(users);

    if (!criteria) {
      return result;
    }

    if (
      !criteria &&
      !criteria.filter &&
      !criteria.filter.where &&
      !criteria.filter.where.name
    ) {
      return result;
    }

    let filteredUsers = [];
    const {
      filter: {
        where: { name, companyId }
      }
    } = criteria;

    if (name) {
      filteredUsers = result.filter(user => user.name === name);
    } else if (companyId) {
      filteredUsers = result.filter(user => user.company === companyId);
    }

    return filteredUsers;
  } catch (error) {
    console.log('ERROR ', error);
  }
}
