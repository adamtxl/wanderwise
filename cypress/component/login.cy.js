import Login from '../../src/components/LoginPage/LoginPage'; // Path to your Login component

describe('Login Component Tests', () => {
  it('should render the login form and log in the user', () => {
    // Mount the Login component
    cy.mount(<Login />);

    // Fill out and submit the login form
    cy.get('input[name="username"]').type('AdamT');
    cy.get('input[name="password"]').type('1234');
    cy.get('button[type="submit"]').click();

    // Add your assertions here, e.g., check if the correct route is called
    // You may need to mock any API calls or routing logic
    cy.url().should('include', '/trips');
  });

  describe('Login Failures', () => {
    it('should display an error for invalid username', () => {
      // Mount the Login component
      cy.mount(<Login />);

      // Fill out form with invalid username
      cy.get('input[name="username"]').type('InvalidUsername');
      cy.get('input[name="password"]').type('1234');
      cy.get('button[type="submit"]').click();

      // Assert that an error message is shown
      cy.get('.alert').should('contain', `The username and password didn't match an existing user.`);
    });

    it('should display an error for incorrect password', () => {
      // Mount the Login component
      cy.mount(<Login />);

      cy.get('input[name="username"]').type('AdamT');
      cy.get('input[name="password"]').type('WrongPassword');
      cy.get('button[type="submit"]').click();

      cy.get('.alert').should('contain', `The username and password didn't match an existing user.`);
    });

    it('should show an error when the username is empty (server-side validation)', () => {
      // Mount the Login component
      cy.mount(<Login />);

      cy.get('input[name="password"]').type('1234');
      cy.get('input[name="username"]').invoke('removeAttr', 'required'); // Bypass client-side validation
      cy.get('button[type="submit"]').click();

      cy.get('.alert').should('contain', 'Username is required.');
    });

    it('should show an error when the password is empty (server-side validation)', () => {
      // Mount the Login component
      cy.mount(<Login />);

      cy.get('input[name="username"]').type('AdamT');
      cy.get('input[name="password"]').invoke('removeAttr', 'required'); // Bypass client-side validation
      cy.get('button[type="submit"]').click();

      cy.get('.alert').should('contain', 'Password is required.');
    });
  });
});