import {
  generateEmail,
  registerFailedCheck,
  registerFailedData,
  registerSuccessfullCheck,
  registerSuccessfullData,
  registerWithAllDataBlank,
} from '../support/commands';

describe('Registration - Happy Path, should allow users to sign up', () => {
  let email: string;
  let birthdate = '1995-10-05';

  beforeEach(() => {
    email = generateEmail();
    registerSuccessfullData();
  });

  it('a registration with birth date clicked', () => {
    cy.get('[data-testid="birthdate-input"]').click();
    cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();

    registerSuccessfullCheck();
  });

  it('a registration with birth date typed, closed via button "done"', () => {
    cy.get('[data-testid="birthdate-input"]').type(birthdate);
    cy.get('.ui-datepicker-close').click();

    registerSuccessfullCheck();
  });

  it('a registration with birth date typed, closed via clicking on a body site', () => {
    cy.get('[data-testid="birthdate-input"]').type(birthdate);
    cy.get('#pageHeader').click({ force: true });

    registerSuccessfullCheck();
  });

  it('a registration without birth date', () => {
    registerSuccessfullCheck();
  });
});

describe('Registration - Unhappy Path, should not allow users to sign up', () => {
  let email: string;
  let data = 'test';

  beforeEach(() => {
    email = generateEmail();
    registerFailedData();
  });

  it('a registration with data already used by another user', () => {
    email = 'test@gmail.com';

    cy.get('[data-testid="email-input"]').clear();
    cy.get('[data-testid="email-input"]').type(email);

    registerFailedCheck();
    cy.wait('@createUser').its('response.statusCode').should('eq', 409);
    cy.contains('.alert-error', 'User not created! Email not unique').should(
      'be.visible'
    );
  });

  it('a registration without first name', () => {
    cy.get('[data-testid="firstname-input"]').clear();

    registerFailedCheck();
    cy.contains('#octavalidate_firstname', 'This field is required').should(
      'be.visible'
    );
  });

  it('a registration without last name', () => {
    cy.get('[data-testid="lastname-input"]').clear();

    registerFailedCheck();
    cy.contains('#octavalidate_lastname', 'This field is required').should(
      'be.visible'
    );
  });

  it('a registration without email', () => {
    cy.get('[data-testid="email-input"]').clear();

    registerFailedCheck();
    cy.contains('#octavalidate_email', 'This field is required').should(
      'be.visible'
    );
  });

  it('a registration without "@" in email', () => {
    email = 'testgmail.com';

    cy.get('[data-testid="email-input"]').clear();
    cy.get('[data-testid="email-input"]').type(email);

    registerFailedCheck();
    cy.contains(
      '#octavalidate_email',
      'Please provide a valid email address'
    ).should('be.visible');
  });

  it('a registration without password', () => {
    cy.get('[data-testid="password-input"]').clear();

    registerFailedCheck();
    cy.contains('#octavalidate_password', 'This field is required').should(
      'be.visible'
    );
  });

  it('a registration with all data blank', () => {
    registerWithAllDataBlank();

    registerFailedCheck();
    cy.get(
      '#octavalidate_firstname, #octavalidate_lastname, #octavalidate_email, #octavalidate_password'
    ).each(($el) => {
      cy.wrap($el).contains('This field is required').should('be.visible');
    });
  });
});
