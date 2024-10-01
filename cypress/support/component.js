import './commands';
import { mount } from 'cypress/react18';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../src/redux/store'; // Adjust the path as necessary

Cypress.Commands.add('mount', (component) => {
  return mount(
    <Provider store={store}>
      <Router>{component}</Router>
    </Provider>
  );
});

// Example use:
// cy.mount(<MyComponent />)