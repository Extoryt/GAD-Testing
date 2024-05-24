import { registerAndLogin, checkLogoutCookies } from '../support/commands';

describe('Logout - Happy path, should allow users to logout', () => {
  beforeEach(() => {
    cy.visit('register.html');
    registerAndLogin();
  });

  it('logout using button "logout"', () => {
    cy.get('[data-testid="logoutButton"]').click();
    checkLogoutCookies();
  });

  it('logout using button on the navbar after hovering over the avatar icon', () => {
    // Logout

    cy.get('[data-testid="user-dropdown"]').trigger('mouseenter');
    cy.get('#logoutBtn').click({ force: true });

    // Checking cookies after logout
    checkLogoutCookies();
  });
});
