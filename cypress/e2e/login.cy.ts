describe('Login - Happy Path, should allow users to login', () => {
  const email = 'test@gmail.com';
  const password = 'test';

  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('login with checking the "keep me sign in" button ', () => {
    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(password);
    cy.get('#keepSignIn').click();
    cy.get('#loginButton').click();

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/welcome'
    );
  });

  it('login without checking the "keep me sign in" button', () => {
    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(password);
    cy.get('#loginButton').click();

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/welcome'
    );
  });
});

describe('Login - Unhappy Path, should not allow users to login', () => {
  const email = 'test@gmail.com';
  const password = 'test';
  const wrongemail = 'wrongemail';
  const wrongpassword = 'wrongpassword';

  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('login with wrong email address', () => {
    cy.get(':nth-child(2) > #username').type(wrongemail);
    cy.get('#password').type(password);
    cy.get('#loginButton').click();

    cy.contains(
      '[data-testid="login-error"]',
      'Invalid username or password'
    ).should('be.visible');

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/?msg=Invalid%20username%20or%20password'
    );
  });

  it('login with wrong password', () => {
    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(wrongpassword);
    cy.get('#loginButton').click();

    cy.contains(
      '[data-testid="login-error"]',
      'Invalid username or password'
    ).should('be.visible');

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/?msg=Invalid%20username%20or%20password'
    );
  });
});
