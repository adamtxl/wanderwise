describe('login landing', () => {
  it('should log in the user', () => {
    cy.visit('/login'); // Visit the login page
    
    // Fill out and submit the login form
    cy.get('input[name="username"]').type('AdamT');
    cy.get('input[name="password"]').type('1234');
    cy.get('button[type="submit"]').click();

    // Verify URL change to /trips
    cy.url().should('include', '/trips');
  });
});