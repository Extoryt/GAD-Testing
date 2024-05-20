import { generateEmail } from '../support/commands';

describe('Registration', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/register.html');
  });

  let data = 'test';
  let email = generateEmail();
  let birthdate = '1995-10-05';

  describe('Registration', () => {
    it('happy path, a registration with birth date clicked, should allow people to sign up', () => {
      email = generateEmail();

      cy.intercept('POST', '/api/users').as('createUser');

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
    });
  });
  describe('Registration', () => {
    it('happy path, a registration with birth date typed, closed via button "done", should allow people to sign up', () => {
      email = generateEmail();

      cy.intercept('POST', '/api/users').as('createUser');

      cy.get('[data-testid="firstname-input"]').type(data);
      cy.get('[data-testid="lastname-input"]').type(data);
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="birthdate-input"]').type(birthdate);
      cy.get('.ui-datepicker-close').click();
      cy.get('[data-testid="password-input"]').type(data);
      cy.get('[data-testid="register-button"]').click();

      cy.wait('@createUser').its('response.statusCode').should('eq', 201);

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/login/'
      );
    });
  });
  describe('Registration', () => {
    it('happy path, a registration with birth date typed,closed via clicking on a body site, should allow people to sign up', () => {
      email = generateEmail();

      cy.intercept('POST', '/api/users').as('createUser');

      cy.get('[data-testid="firstname-input"]').type(data);
      cy.get('[data-testid="lastname-input"]').type(data);
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="birthdate-input"]').type(birthdate);
      cy.get('#pageHeader').click({ force: true });
      cy.get('[data-testid="password-input"]').type(data);
      cy.get('[data-testid="register-button"]').click();

      cy.wait('@createUser').its('response.statusCode').should('eq', 201);

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/login/'
      );
    });
  });
  describe('Registration', () => {
    it('a registration with data already used by another user, should not allow people to sign up', () => {
      email = 'test@gmail.com';

      cy.intercept('POST', '/api/users').as('createUser');

      cy.get('[data-testid="firstname-input"]').type(data);
      cy.get('[data-testid="lastname-input"]').type(data);
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="birthdate-input"]').click();
      cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
      cy.get('[data-testid="password-input"]').type(data);
      cy.get('[data-testid="register-button"]').click();

      cy.wait('@createUser').its('response.statusCode').should('eq', 409);

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/register.html'
      );
    });
  });
  describe('Registration', () => {
    it('a registration without first name, should not allow people to sign up', () => {
      email = generateEmail();

      cy.intercept('POST', '/api/users').as('createUser');

      cy.get('[data-testid="firstname-input"]').type(data);
      // cy.get('[data-testid="lastname-input"]').type(data);
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="birthdate-input"]').click();
      cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
      cy.get('[data-testid="password-input"]').type(data);
      cy.get('[data-testid="register-button"]').click();

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/register.html'
      );
    });
  });
  describe('Registration', () => {
    it('a registration without last name, should not allow people to sign up', () => {
      email = generateEmail();

      cy.intercept('POST', '/api/users').as('createUser');

      cy.get('[data-testid="firstname-input"]').type(data);
      // cy.get('[data-testid="lastname-input"]').type(data);
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="birthdate-input"]').click();
      cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
      cy.get('[data-testid="password-input"]').type(data);
      cy.get('[data-testid="register-button"]').click();

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/register.html'
      );
    });
  });
  describe('Registration', () => {
    it('a registration without email, should not allow people to sign up', () => {
      email = generateEmail();

      cy.intercept('POST', '/api/users').as('createUser');

      cy.get('[data-testid="firstname-input"]').type(data);
      cy.get('[data-testid="lastname-input"]').type(data);
      // cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="birthdate-input"]').click();
      cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
      cy.get('[data-testid="password-input"]').type(data);
      cy.get('[data-testid="register-button"]').click();

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/register.html'
      );
    });
  });
  describe('Registration', () => {
    it('a registration without "@" in email, should not allow people to sign up', () => {
      email = 'testgmail.com';

      cy.intercept('POST', '/api/users').as('createUser');

      cy.get('[data-testid="firstname-input"]').type(data);
      cy.get('[data-testid="lastname-input"]').type(data);
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="birthdate-input"]').click();
      cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
      cy.get('[data-testid="password-input"]').type(data);
      cy.get('[data-testid="register-button"]').click();

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/register.html'
      );
    });
  });
  describe('Registration', () => {
    it('a registration without birth date, should allow people to sign up', () => {
      email = generateEmail();

      cy.intercept('POST', '/api/users').as('createUser');

      cy.get('[data-testid="firstname-input"]').type(data);
      cy.get('[data-testid="lastname-input"]').type(data);
      cy.get('[data-testid="email-input"]').type(email);
      // cy.get('[data-testid="birthdate-input"]').click();
      // cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
      cy.get('[data-testid="password-input"]').type(data);
      cy.get('[data-testid="register-button"]').click();

      cy.wait('@createUser').its('response.statusCode').should('eq', 201);

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/login/'
      );
    });
  });
  describe('Registration', () => {
    it('a registration without password, should not allow people to sign up', () => {
      email = generateEmail();

      cy.intercept('POST', '/api/users').as('createUser');

      cy.get('[data-testid="firstname-input"]').type(data);
      cy.get('[data-testid="lastname-input"]').type(data);
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="birthdate-input"]').click();
      cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
      // cy.get('[data-testid="password-input"]').type(data);
      cy.get('[data-testid="register-button"]').click();

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/register.html'
      );
    });
  });
  describe('Registration', () => {
    it('a registration with all data blank, should not allow people to sign up', () => {
      cy.get('[data-testid="register-button"]').click();

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/register.html'
      );
    });
  });
});
