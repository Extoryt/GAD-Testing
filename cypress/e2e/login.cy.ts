import {
  checkFailedLogin,
  checkLoggingCookies,
  loginData,
} from '../support/commands';

describe('Login - Happy Path, should allow users to login', () => {
  beforeEach(() => {
    cy.visit('login');
    loginData();
  });

  it('login with checking the "keep me sign in" button, checking and deleting cookies after logging', () => {
    cy.get('#keepSignIn').click();
    cy.get('#loginButton').click();
    cy.url({ timeout: 10000 }).should('include', '/welcome');
    // Checking cookies ater log-in, checking whether the user has been logged out after deleting cookies
    checkLoggingCookies();
    cy.get('[data-testid="open-articles"]').click();
    cy.get('#avatar')
      .invoke('attr', 'src')
      .should('equal', './data/icons/user.png');
  });

  it('login without checking the "keep me sign in" button', () => {
    cy.get('#loginButton').click();
    cy.url({ timeout: 10000 }).should('include', 'welcome');
  });
});

describe('Login - Unhappy Path, should not allow users to login', () => {
  beforeEach(() => {
    cy.visit('login');
  });
  it('login with wrong email address', () => {
    cy.get(':nth-child(2) > #username').type('wrongemail');
    cy.get('#loginButton').click();

    checkFailedLogin();
    cy.url({ timeout: 10000 }).should(
      'include',
      'login/?msg=Invalid%20username%20or%20password'
    );
  });

  it('login with wrong password', () => {
    cy.get('#password').type('wrongpassword');
    cy.get('#loginButton').click();

    checkFailedLogin();
    cy.url({ timeout: 10000 }).should(
      'include',
      'login/?msg=Invalid%20username%20or%20password'
    );
  });
});
