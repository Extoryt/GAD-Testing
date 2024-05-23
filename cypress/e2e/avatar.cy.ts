import {
  generateEmail,
  fillRegistrationForm,
  submitRegistrationForm,
  defaultLogin,
} from '../support/commands';
let email: string;
email = generateEmail();
// wartosc z avatara (ciasteczko cookie)
describe('Avatar', () => {
  it('checking avatar changes', () => {
    cy.visit('http://localhost:3000/register.html');

    cy.get('.avatar')
      .find('option')
      .then((options) => {
        const numberOfAvatars = options.length;
        for (let i = 0; i < numberOfAvatars; i++) {
          cy.get('.avatar').select(i).should('have.value', options[i].value);
        }
        cy.get('.avatar').select(0).should('have.value', options[0].value);

        // Registration

        fillRegistrationForm();
        submitRegistrationForm();

        // Logging

        defaultLogin();

        // Logout

        cy.get('[data-testid="logoutButton"]').click();
      });
  });
});
