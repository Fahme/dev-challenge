import { setUser, getUser } from '../../../helpers';

export default async function User(root, { user }, { ctx }, info) {
  // todo: 1 this throws a unfriendly (and potentially unsafe) error if a non-existnant user ID is entered.
  // how can we check for a non-existing user id and throw a more friendly error.

  // todo: 2 why is this update overwriting existing user data? Need to fix this so that just data input is
  // updated rather than overwritting all the data.
  try {
    console.log('user===', user);
    const userExists = await getUser(user.id);

    if (!userExists || !userExists.id) {
      throw new Error('User does not exist. Please enter a valid user.');
    } else {
      const updateUser = { ...userExists, name: user.name, email: user.email };
      console.log('updateUser===', updateUser);
      await setUser(updateUser);
    }

    return true;
  } catch (err) {
    throw new Error('Unable to update user. Please try again!');
  }
}
