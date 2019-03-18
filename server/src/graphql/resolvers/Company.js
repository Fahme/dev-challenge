import { getUsers } from '../../helpers';

export default {
  employees: async (root, args, { ctx }, info) => {
    if (root.employees) {
      const filteredUsers = root.employees.filter(
        user => user.company === root.id
      );
      return filteredUsers;
    }
    const criteria = {
      filter: {
        where: {
          companyId: `${root.id}`
        }
      }
    };

    let users = await getUsers(criteria);

    return users;
  }
};
