/// <reference types="cypress" />

import { noConflict } from 'cypress/types/lodash';

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }'

// Data
let data = 'test';
let email: string;

// Generate email

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
export const generateEmail = () => {
  let email = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    email += alphabet[randomIndex];
  }
  return email + '@example.com';
};

// -------------------------Integration Testing--------------------------------------------
beforeEach(() => {
  cy.visit('http://localhost:3000/register.html');
  email = generateEmail();
  cy.intercept('POST', '/api/users').as('createUser');
});
// Registration

export const fillRegistrationForm = () => {
  cy.visit('http://localhost:3000/register.html');
  cy.intercept('POST', '/api/users').as('createUser');

  cy.get('[data-testid="firstname-input"]').type(data);
  cy.get('[data-testid="lastname-input"]').type(data);
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="birthdate-input"]').click();
  cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
  cy.get('[data-testid="password-input"]').type(data);
};
export const submitRegistrationForm = () => {
  cy.get('[data-testid="register-button"]').click();
  cy.wait('@createUser').its('response.statusCode').should('eq', 201);
  cy.contains('.alert-success', 'User created').should('be.visible');
  cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/login/');
};
// userLogin

export const userLogin = () => {
  describe('userLogin', () => {
    // Registration
    cy.intercept('POST', '/api/users').as('createUser');
    cy.visit('http://localhost:3000/register.html');
    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    cy.get('[data-testid="password-input"]').type(data);

    cy.get('[data-testid="register-button"]').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 201);
    cy.contains('.alert-success', 'User created').should('be.visible');

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/'
    );

    // Logging

    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(data);
    cy.get('#loginButton').click();

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/welcome'
    );
  });
};
// Checking cookies after logging
export const loggingCookies = () => {
  describe('cookies', () => {
    // Registration

    fillRegistrationForm();
    submitRegistrationForm();
    // Logging
    defaultLogin();

    // Checking added cookies after logging in

    loggingCookiesCheck();
  });
};
// Checking cookies after logout
export const logoutCookies = () => {
  cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/login');
  cy.getCookies()
    .should('have.length', 1)
    .then((cookies) => {
      const expectedCookieName = ['expires'];
      expectedCookieName.forEach((cookieName) => {
        const cookie = cookies.find((cookie) => cookie.name === cookieName);
        expect(cookie, `Cookie '${cookieName}'`).to.exist;
      });
      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/login'
      );
    });
};

export const logout = () => {
  // Registration
  fillRegistrationForm();
  submitRegistrationForm();

  // Logging
  defaultLogin();
};

// Deleting account

export const deleteAccount = () => {
  // Registration

  fillRegistrationForm();
  submitRegistrationForm();

  // Login

  cy.get(':nth-child(2) > #username').type(email);
  cy.get('#password').type(data);

  cy.get('#loginButton').click();

  cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/welcome');

  // Confirmation of account deletion
  cy.get('[data-testid="deleteButton"]').click();

  cy.on('window:confirm', (text) => {
    expect(text).to.equal('Are you sure you want to delete your account?');
    return true;
  });

  cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/login');

  // Checking if a user can log in to a deleted account
  cy.get(':nth-child(2) > #username').type(email);
  cy.get('#password').type(data);
  cy.get('#loginButton').click();

  cy.url({ timeout: 10000 }).should(
    'include',
    'http://localhost:3000/login/?msg=Invalid%20username%20or%20password'
  );
};

export const avatar = () => {
  cy.get('.avatar')
    .find('option')
    .then((options) => {
      const numberOfAvatars = options.length;
      for (let i = 0; i < numberOfAvatars; i++) {
        cy.get('.avatar').select(i).should('have.value', options[i].value);
      }
      cy.get('.avatar').select(0).should('have.value', options[0].value);

      // Registration

      cy.get('[data-testid="firstname-input"]').type(data);
      cy.get('[data-testid="lastname-input"]').type(data);
      cy.get('[data-testid="email-input"]').type(email);
      cy.get('[data-testid="birthdate-input"]').click();
      cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
      cy.get('[data-testid="password-input"]').type(data);

      cy.get('[data-testid="register-button"]').click();

      cy.wait('@createUser').its('response.statusCode').should('eq', 201);
      cy.contains('.alert-success', 'User created').should('be.visible');

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/login/'
      );

      // Logging

      cy.get(':nth-child(2) > #username').type(email);
      cy.get('#password').type(data);
      cy.get('#loginButton').click();

      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/welcome'
      );

      // Logout

      cy.get('[data-testid="logoutButton"]').click();
    });
};
// -------------------------------Testing------------------------------------------
// Logging with specific data
export const loginData = () => {
  let email = 'test@gmail.com';
  let password = 'test';
  cy.visit('http://localhost:3000/login');
  cy.get(':nth-child(2) > #username').type(email);
  cy.get('#password').type(password);
};

// Checking cookies after logging in
export const loggingCookiesCheck = () => {
  cy.getCookies()
    .should('have.length', 7)
    .then((cookies) => {
      const expectedCookieNames = [
        'avatar',
        'email',
        'expires',
        'firstname',
        'id',
        'token',
        'username',
      ];
      expectedCookieNames.forEach((cookieName) => {
        const cookie = cookies.find((cookie) => cookie.name === cookieName);
        expect(cookie, `Cookie '${cookieName}'`).to.exist;
      });
    });

  cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/welcome');

  // Deleting cookies after logging in

  cy.clearAllCookies();

  cy.getCookies().should('have.length', 0);

  cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/welcome');
};
// Checking login with wrong data
export const checkFailedLogin = () =>
  cy
    .get('[data-testid="login-error"]')
    .should('be.visible')
    .and('contain', 'Invalid username or password');

// Check if the account was successfuly deleted
export const checkAccountDeletion = () => {
  cy.get(':nth-child(2) > #username').type(email);
  cy.get('#password').type(data);
  cy.get('#loginButton').click();

  cy.url({ timeout: 10000 }).should(
    'include',
    'http://localhost:3000/login/?msg=Invalid%20username%20or%20password'
  );
};
// Logging
export const defaultLogin = () => {
  cy.get(':nth-child(2) > #username').type(email);
  cy.get('#password').type(data);
  cy.get('#loginButton').click();

  cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/welcome');
};

// Registration with wrong data
export const registerFailedData = () => {
  cy.visit('http://localhost:3000/register.html');
  cy.intercept('POST', '/api/users').as('createUser');

  cy.get('[data-testid="firstname-input"]').type(data);
  cy.get('[data-testid="lastname-input"]').type(data);
  cy.get('[data-testid="email-input"]').type(email);
  cy.get('[data-testid="password-input"]').type(data);
};
export const registerFailedCheck = () => {
  cy.get('[data-testid="register-button"]').click();

  cy.url({ timeout: 10000 }).should(
    'include',
    'http://localhost:3000/register.html'
  );
};

// registration with good data
export const registerSuccessfullData = () => {
  cy.visit('http://localhost:3000/register.html');
  cy.intercept('POST', '/api/users').as('createUser');

  cy.get('[data-testid="firstname-input"]').type(data);
  cy.get('[data-testid="lastname-input"]').type(data);
  cy.get('[data-testid="email-input"]').type(email);
  // cy.get('[data-testid="birthdate-input"]').click();
  // cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
  cy.get('[data-testid="password-input"]').type(data);
};
// Checking if a registration was successful
export const registerSuccessfullCheck = () => {
  cy.get('[data-testid="register-button"]').click();

  cy.wait('@createUser').its('response.statusCode').should('eq', 201);
  cy.contains('.alert-success', 'User created').should('be.visible');

  cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/login/');
};

export const registerWithAllDataBlank = () => {
  cy.get('[data-testid="firstname-input"]').clear();
  cy.get('[data-testid="lastname-input"]').clear();
  cy.get('[data-testid="email-input"]').clear();
  cy.get('[data-testid="password-input"]').clear();
};
