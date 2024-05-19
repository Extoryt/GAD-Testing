describe('Registration', () => {
	it('happy path, should allow people to sign up', () => {
		cy.visit('http://localhost:3000/register.html');

		const data = 'test';
		const alphanumeric = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

		const generateEmail = () => {
			let email = '';
			for (let i = 0; i < 6; i++) {
				const randomIndex = Math.floor(Math.random() * alphanumeric.length);
				email += alphanumeric[randomIndex];
			}
			return email + '@example.com';
		};

		const email = generateEmail();

		cy.intercept('POST', '/api/users').as('createUser');

		cy.get('#firstname').type(data);
		cy.get('#lastname').type(data);
		cy.get('#email').type(email);
		cy.get('#registerForm > :nth-child(6)').click();
		cy.get(':nth-child(1) > :nth-child(5) > .ui-state-default').click();
		cy.get('#password').type(data);
		cy.get('#registerButton').click();

		cy.wait('@createUser').its('response.statusCode').should('eq', 201);

		cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/login/');
	});
});

describe('Registration', () => {
	it('a registration with all data blank, should not allow people to sign up', () => {
		cy.visit('http://localhost:3000/register.html');

		cy.get('#registerButton').click();

		cy.wait('@createUser').its('response.statusCode').should('eq', 201);

		cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/login/');
	});
});
