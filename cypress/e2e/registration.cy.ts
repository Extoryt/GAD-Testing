import { userRegistration, checkUserRegistration, registrationWithAllDataBlank } from '../support/commands';

describe('Registration - Happy Path, should allow users to sign up', () => {
	let birthdate = '1995-10-05';

	beforeEach(() => {
		cy.visit('register.html');
		userRegistration();
	});
	afterEach(() => {
		checkUserRegistration(true);
	});

	it('a registration with birth date clicked', () => {
		cy.get('[data-testid="birthdate-input"]').click();
		cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
	});

	it('a registration with birth date typed, closed via button "done"', () => {
		cy.get('[data-testid="birthdate-input"]').type(birthdate);
		cy.get('.ui-datepicker-close').click();
	});

	it('a registration with birth date typed, closed via clicking on a body site', () => {
		cy.get('[data-testid="birthdate-input"]').type(birthdate);
		cy.get('#pageHeader').click({ force: true });
	});

	it('a registration without birth date', () => {});
});

describe('Registration - Unhappy Path, should not allow users to sign up', () => {
	beforeEach(() => {
		cy.visit('register.html');
		userRegistration();
		cy.intercept('POST', '/api/createUser').as('createUser');
	});

	it('a registration with data already used by another user', () => {
		// Load login data from fixture file
		cy.fixture('userData').then(loginData => {
			cy.fixture('userData').as('loginData');
			// Type an email that is already used by another user
			cy.get('[data-testid="email-input"]').clear().type(loginData.email);
			checkUserRegistration(false);
			cy.wait('@createUser').its('response.statusCode').should('eq', 409);
			cy.contains('.alert-error', 'User not created! Email not unique').should('be.visible');
		});
	});

	it('a registration without first name', () => {
		cy.get('[data-testid="firstname-input"]').clear();
		checkUserRegistration(false);

		cy.contains('#octavalidate_firstname', 'This field is required').should('be.visible');
	});

	it('a registration without last name', () => {
		cy.get('[data-testid="lastname-input"]').clear();
		checkUserRegistration(false);

		cy.contains('#octavalidate_lastname', 'This field is required').should('be.visible');
	});

	it('a registration without email', () => {
		cy.get('[data-testid="email-input"]').clear();
		checkUserRegistration(false);

		cy.contains('#octavalidate_email', 'This field is required').should('be.visible');
	});

	it('a registration without "@" in email', () => {
		cy.fixture('userData').then(loginData => {
			cy.get('[data-testid="email-input"]').clear().type(loginData.invalidEmail);
			checkUserRegistration(false);
		});
		cy.contains('#octavalidate_email', 'Please provide a valid email address').should('be.visible');
	});

	it('a registration without password', () => {
		cy.get('[data-testid="password-input"]').clear();
		checkUserRegistration(false);

		cy.contains('#octavalidate_password', 'This field is required').should('be.visible');
	});

	it('a registration with all data blank', () => {
		registrationWithAllDataBlank();

		checkUserRegistration(false);
		cy.get('#octavalidate_firstname, #octavalidate_lastname, #octavalidate_email, #octavalidate_password').each($el => {
			cy.wrap($el).contains('This field is required').should('be.visible');
		});
	});
});
