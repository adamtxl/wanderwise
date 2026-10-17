import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './components/App/App';
import store from './redux/store';

<script src="https://kit.fontawesome.com/9ea6dc5149.js" crossOrigin="anonymous"></script>;

const root = ReactDOM.createRoot(document.getElementById('react-root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
