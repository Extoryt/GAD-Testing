describe('Logout - Happy path, should allow users to logout', () => {
  const email = 'test@gmail.com';
  const password = 'test';

  beforeEach(() => {
    cy.visit('http://localhost:3000/welcome');
  });

  it('logout using button "logout"', () => {
    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(password);
    cy.get('#keepSignIn').click();
    cy.get('#loginButton').click();

    cy.get('[data-testid="logoutButton"]').click();

    cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/login');
  });

  it('logout using button on the navbar after hovering over the avatar icon', () => {
    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(password);
    cy.get('#keepSignIn').click();
    cy.get('#loginButton').click();

    cy.get('[data-testid="user-dropdown"]').trigger('mouseenter');
    cy.get('#logoutBtn').click({ force: true });

    cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/login');
  });
});
