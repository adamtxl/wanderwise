describe('User Registration', () => {
    it('should register a new user', () => {
      cy.visit('/register');
      cy.get('input[name="username"]').type('NewUser1');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="email"]').type('adam1@123.com');
      cy.get('button[type="submit"]').click();
      cy.url().should('include', '/trips');
    });
  });