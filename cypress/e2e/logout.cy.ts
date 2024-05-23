import { logout, generateEmail, logoutCookies } from '../support/commands';

describe('Logout - Happy path, should allow users to logout', () => {
  let email: string;

  beforeEach(() => {
    email = generateEmail();
    logout();
  });

  it('logout using button "logout"', () => {
    // Logout

    cy.get('[data-testid="logoutButton"]').click();

    // Checking cookies after logout
    logoutCookies();
  });

  it('logout using button on the navbar after hovering over the avatar icon', () => {
    // Logout

    cy.get('[data-testid="user-dropdown"]').trigger('mouseenter');
    cy.get('#logoutBtn').click({ force: true });

    // Checking cookies after logout
    logoutCookies();
  });
});
