import { generateEmail } from '../support/commands';

describe('Delete account', () => {
  let data = 'test';
  let email: string;

  beforeEach(() => {
    cy.visit('http://localhost:3000/register.html');
    email = generateEmail();
    cy.intercept('POST', '/api/users').as('createUser');
  });

  it('should allow users to delete their accounts', () => {
    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 201);

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/'
    );

    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(data);

    cy.get('#loginButton').click();
    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/welcome'
    );

    cy.get('[data-testid="deleteButton"]').click();

    cy.on('window:confirm', (text) => {
      expect(text).to.equal('Are you sure you want to delete your account?');
      return true;
    });

    cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/login');
    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(data);
    cy.get('#loginButton').click();

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/?msg=Invalid%20username%20or%20password'
    );
  });

  it('should allow users to cancel their delete account request', () => {
    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 201);

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/'
    );
    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(data);
    cy.get('#loginButton').click();
    cy.get('[data-testid="deleteButton"]').click();

    cy.on('window:confirm', (text) => {
      expect(text).to.equal('Are you sure you want to delete your account?');
      return false;
    });

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/welcome'
    );
  });
});
