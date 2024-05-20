describe('Login', () => {
  it('happy path, should allow user to login ', () => {
    cy.visit('http://localhost:3000/login');
    cy.get(':nth-child(2) > #username').type('test@gmail.com');
    cy.get('#password').type('test');
    cy.get('#keepSignIn').click();
    cy.get('#loginButton').click();

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/welcome'
    );
  });
});

describe('Login', () => {
  it('happy path, without checking the "keep me sign in" button, should allow user to login', () => {
    cy.visit('http://localhost:3000/login');
    cy.get(':nth-child(2) > #username').type('test@gmail.com');
    cy.get('#password').type('test');
    cy.get('#loginButton').click();

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/welcome'
    );
  });
});

describe('Login', () => {
  it('unhappy path, login with wrong email address, should not allow user to login ', () => {
    cy.visit('http://localhost:3000/login');
    cy.get(':nth-child(2) > #username').type('wrongemail@gmail.com');
    cy.get('#password').type('test');
    cy.get('#keepSignIn').click();
    cy.get('#loginButton').click();

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/?msg=Invalid%20username%20or%20password'
    );
  });
});

describe('Login', () => {
  it('unhappy path, login with wrong password, should not allow user to login ', () => {
    cy.visit('http://localhost:3000/login');
    cy.get(':nth-child(2) > #username').type('test@gmail.com');
    cy.get('#password').type('wrongpassword');
    cy.get('#keepSignIn').click();
    cy.get('#loginButton').click();

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/?msg=Invalid%20username%20or%20password'
    );
  });
});
