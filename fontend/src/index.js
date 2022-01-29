import React from 'react';
import ReactDOM from 'react-dom';
import App from './ui/App';
import {BrowserRouter} from "react-router-dom";
// import { useState } from 'react';

ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </React.StrictMode>,
  document.getElementById('root')
);
