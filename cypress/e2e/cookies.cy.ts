describe('Cookies', () => {
  const email = 'test@gmail.com';
  const password = 'test';

  beforeEach(() => {
    cy.visit('http://localhost:3000/login');
  });

  it('checking cookies after logging', () => {
    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(password);
    cy.get('#loginButton').click();

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

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/welcome'
    );
  });

  it('deleting cookies after logging ', () => {
    cy.get(':nth-child(2) > #username').type(email);
    cy.get('#password').type(password);
    cy.get('#loginButton').click();

    cy.clearAllCookies();

    cy.getCookies().should('have.length', 0);

    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/welcome'
    );
  });
});
