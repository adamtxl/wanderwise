describe('Trip Details', () => {
  it('passes', () => {
    // Custom command to log in
    cy.login('AdamT', '1234');

    // Ensure the trip details section is visible
    cy.get('[data-cy="trip-details"]').should('be.visible');

    // Click the first trip details element
    cy.get('[data-cy="trip-details"]').first().click();

    // Assert that the URL contains '/trip-details'
    cy.url().should('include', '/trip-details');
  });
});