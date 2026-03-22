import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './store/AppProvider';
import AppRoutes from './app/routes/AppRoutes';
import './assets/styles/globals.css';

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


