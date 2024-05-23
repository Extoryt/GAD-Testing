import {
  fillRegistrationForm,
  submitRegistrationForm,
  userLogin,
  loggingCookies,
  logout,
  deleteAccount,
  avatar,
  logoutCookies,
} from '../support/commands';

describe('Integration testing - Happy Path', () => {
  // Registration
  it('Registration', () => {
    fillRegistrationForm();
    submitRegistrationForm();
  });

  // Logging, checking added cookies after login and deleting cookies after login
  it('Logging', () => {
    userLogin();
  });

  // Logout, checking cookies after logout
  it('Logout', () => {
    logout();
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
