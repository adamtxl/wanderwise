describe('logout', () => {
	it('passes', () => {
		cy.login('AdamT', '1234');

        cy.get('[data-cy="logout-button"]').should('be.visible');
        cy.get('[data-cy="logout-button"]').click();

		// Example: Assert you were redirected after login
		cy.url().should('include', '/login');
	});
});
