describe('End-to-End User Flow', () => {
	it('should log in the user', () => {
		cy.visit('/login');
		cy.get('input[name="username"]').type('AdamT');
		cy.get('input[name="password"]').type('1234');
		cy.get('button[type="submit"]').click();

		// Verify URL change to /trips
		cy.url().should('include', '/trips');
	});

	it('should navigate to trip details', () => {
		cy.login('AdamT', '1234');
		cy.get('[data-cy="trip-details"]').should('be.visible');

		// Click the first trip details element
		cy.get('[data-cy="trip-details"]').first().click();

		// Assert that the URL contains '/trip-details'
		cy.url().should('include', '/trip-details');
	});

	it('should display the packing list', () => {
		cy.login('AdamT', '1234');

		// Intercept the trip details and packing list API calls BEFORE clicking the trip details
		cy.intercept('GET', '/api/trips/*').as('getTripDetails');
		cy.intercept('GET', '/api/packing-list/*').as('getPackingList');

		// Now click the first trip details element to trigger the request
		cy.get('[data-cy="trip-details"]').first().click();

		// Wait for the trip details API call to complete before proceeding
		cy.wait('@getTripDetails');

		// Click the packing list button after trip details have loaded
		cy.get('[data-cy="packing-list-button"]').click();

		// Wait for the packing list API call to complete before making assertions
		// cy.wait('@getPackingList');

		// Assert that the URL contains the trip ID
		cy.url().should('match', /\/packing-list\/\d+/);

		// Assert that the packing list items are displayed
		cy.get('[data-cy="packing-item"]').should('have.length.greaterThan', 0);
	});

	it('should allow the user to add a daily itinerary', () => {
		cy.login('AdamT', '1234');

		// Navigate to a trip
		cy.get('[data-cy="trip-details"]').first().click();

		cy.wait(2000);
    
		cy.get('[data-cy="daily-itinerary-button"]').click();

		// Intercept the API call for adding an itinerary
		cy.intercept('POST', '/api/itinerary/*/itineraries').as('addDailyItinerary');

		// Fill in the itinerary form fields
		cy.get('input[name="day"]').type('2024-10-02'); // Enter a valid date
		cy.get('input[name="location"]').type('Downtown Park');
		cy.get('input[name="description"]').type('Morning walk and museum visit');
		cy.get('input[name="activity"]').type('Walking and Museum');
		cy.get('textarea[name="notes"]').type('Bring snacks and water.');

		// Submit the form
		cy.get('button[type="submit"]').click();

		// Wait for the API call to complete before proceeding
		cy.wait('@addDailyItinerary', { timeout: 10000 }); // Increase timeout to 10 seconds

		// Wait for the URL to change back to the trip details page with the trip ID
		cy.url().should('include', '/trip-details/');

		// Assert that the new itinerary appears on the trip details page
		cy.get('[data-cy="itinerary-item"]').should('contain', 'Downtown Park');
	});

	it('should log out the user', () => {
		cy.login('AdamT', '1234');
		cy.get('[data-cy="logout-button"]').click();
		cy.url().should('include', '/login');
	});
});