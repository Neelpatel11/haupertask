import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import UserManagement from './components/UserManagement';
import './index.css';
import { ToastContainer } from 'react-toastify';

ReactDOM.render(
  <Provider store={store}>
      <ToastContainer />
    <UserManagement />
  </Provider>,
  document.getElementById('root')
);
