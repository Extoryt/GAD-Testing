import {
  generateEmail,
  userLogin,
  checkAccountDeletion,
} from '../support/commands';

describe('Delete account', () => {
  let email: string;

  beforeEach(() => {
    email = generateEmail();
    userLogin();
  });

  const confirmDelete = (confirmation: boolean) => {
    cy.get('[data-testid="deleteButton"]').click();
    cy.on('window:confirm', (text) => {
      expect(text).to.equal('Are you sure you want to delete your account?');
      return confirmation;
    });
  };

  it('should allow users to delete their accounts', () => {
    confirmDelete(true);
    cy.url({ timeout: 10000 }).should('include', 'http://localhost:3000/login');
    checkAccountDeletion();
  });

  it('should allow users to cancel their delete account request', () => {
    confirmDelete(false);
    cy.url({ timeout: 10000 }).should(
      'include',
      'http://localhost:3000/welcome'
    );
  });
});
