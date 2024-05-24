import {
  registration,
  userLogin,
  userLogout,
  deleteAccount,
  avatar,
} from '../support/commands';

describe('Integration testing - Happy Path', () => {
  // Registration
  it('Registration', () => {
    registration();
  });

  // Logging, checking added cookies after login and deleting cookies after login
  it('Logging', () => {
    userLogin();
  });

  // Logout, checking cookies after logout
  it('Logout', () => {
    userLogout();
  });

  // Deleting account
  it('Delete Account', () => {
    deleteAccount();
  });

  //  Checking avatar changes
  it('Avatar', () => {
    avatar();
  });
});
