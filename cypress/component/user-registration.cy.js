describe('User Registration', () => {
  it('should register a new user', () => {
    const uniqueUsername = `NewUser${Date.now()}`;
    const uniqueEmail = `adam${Date.now()}@123.com`;

    cy.visit('/register');
    cy.get('input[name="username"]').type(uniqueUsername);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/trips');
    cy.get('[data-cy="logout-button"]').should('be.visible');
    cy.get('[data-cy="logout-button"]').click();
  });

  it('should fail to register with an existing username', () => {
    const duplicateUsername = 'NewUser1';

    cy.visit('/register');
    cy.get('input[name="username"]').type(duplicateUsername);
    cy.get('input[name="password"]').type('password123');
    cy.get('input[name="email"]').type('duplicate@123.com');
    cy.get('button[type="submit"]').click();

    cy.get('.alert').should('contain', 'Username already exists. Please choose another one.');
  });
});