describe('Logout', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/welcome');
  });

  describe('Logout', () => {
    it('logout using button "logout" ', () => {
      cy.get(':nth-child(2) > #username').type('test@gmail.com');
      cy.get('#password').type('test');
      cy.get('#keepSignIn').click();
      cy.get('#loginButton').click();

      cy.get('[data-testid="logoutButton"]').click();
      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/login'
      );
    });
  });

  describe('Logout', () => {
    it('logout using button on the navbar after hovering over the avatar', () => {
      cy.get(':nth-child(2) > #username').type('test@gmail.com');
      cy.get('#password').type('test');
      cy.get('#keepSignIn').click();
      cy.get('#loginButton').click();

      cy.get('[data-testid="user-dropdown"]').trigger('mouseenter');

      cy.get('#logoutBtn').click({ force: true });
      cy.url({ timeout: 10000 }).should(
        'include',
        'http://localhost:3000/login'
      );
    });
  });
});
