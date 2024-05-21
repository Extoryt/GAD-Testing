import { generateEmail } from '../support/commands';

describe('Registration - Happy Path, should allow users to sign up', () => {
  let data = 'test';
  let email: string;
  let birthdate = '1995-10-05';

  beforeEach(() => {
    cy.visit('http://localhost:3000/register.html');
    email = generateEmail();
    cy.intercept('POST', '/api/users').as('createUser');
  });

  it('a registration with birth date clicked, checking changing avatar', () => {
    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    cy.get('[data-testid="password-input"]').type(data);

    cy.get('.avatar')
      .find('option')
      .then((options) => {
        const numberOfAvatars = options.length;
        for (let i = 0; i < numberOfAvatars; i++) {
          cy.get('.avatar').select(i).should('have.value', options[i].value);
        }
      });

    cy.get('[data-testid="register-button"]').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 201);
    cy.contains('.alert-success', 'User created').should('be.visible');

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/'
    );
  });

  it('a registration with birth date typed, closed via button "done"', () => {
    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').type(birthdate);
    cy.get('.ui-datepicker-close').click();
    cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 201);
    cy.contains('.alert-success', 'User created').should('be.visible');

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/'
    );
  });

  it('a registration with birth date typed, closed via clicking on a body site', () => {
    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').type(birthdate);
    cy.get('#pageHeader').click({ force: true });
    cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 201);
    cy.contains('.alert-success', 'User created').should('be.visible');

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/'
    );
  });

  it('a registration without birth date', () => {
    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    // cy.get('[data-testid="birthdate-input"]').click();
    // cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 201);
    cy.contains('.alert-success', 'User created').should('be.visible');

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/login/'
    );
  });
});

describe('Registration - Unhappy Path, should not allow users to sign up', () => {
  let data = 'test';
  let email: string;

  beforeEach(() => {
    cy.visit('http://localhost:3000/register.html');
    email = generateEmail();
    cy.intercept('POST', '/api/users').as('createUser');
  });

  it('a registration with data already used by another user', () => {
    email = 'test@gmail.com';

    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.wait('@createUser').its('response.statusCode').should('eq', 409);
    cy.contains('.alert-error', 'User not created! Email not unique').should(
      'be.visible'
    );

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/register.html'
    );
  });

  it('a registration without first name', () => {
    cy.get('[data-testid="firstname-input"]').type(data);
    // cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.contains('#octavalidate_lastname', 'This field is required').should(
      'be.visible'
    );

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/register.html'
    );
  });

  it('a registration without last name', () => {
    cy.get('[data-testid="firstname-input"]').type(data);
    // cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.contains('#octavalidate_lastname', 'This field is required').should(
      'be.visible'
    );

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/register.html'
    );
  });

  it('a registration without email', () => {
    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    // cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.contains('#octavalidate_email', 'This field is required').should(
      'be.visible'
    );

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/register.html'
    );
  });

  it('a registration without "@" in email', () => {
    email = 'testgmail.com';

    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.contains(
      '#octavalidate_email',
      'Please provide a valid email address'
    ).should('be.visible');

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/register.html'
    );
  });

  it('a registration without password', () => {
    cy.get('[data-testid="firstname-input"]').type(data);
    cy.get('[data-testid="lastname-input"]').type(data);
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
    // cy.get('[data-testid="password-input"]').type(data);
    cy.get('[data-testid="register-button"]').click();

    cy.contains('#octavalidate_password', 'This field is required').should(
      'be.visible'
    );

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/register.html'
    );
  });

  it('a registration with all data blank', () => {
    cy.get('[data-testid="register-button"]').click();

    cy.get(
      '#octavalidate_firstname, #octavalidate_lastname, #octavalidate_email, #octavalidate_password'
    ).each(($el) => {
      cy.wrap($el).contains('This field is required').should('be.visible');
    });

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/register.html'
    );
  });
});
