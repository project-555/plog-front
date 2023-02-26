import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './assets/css.css'
import reportWebVitals from './reportWebVitals';
import Router from './Router'
import {RouterProvider} from "react-router-dom";
import axios from "axios";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common = {
    'X-AUTH-TOKEN': localStorage.getItem('token')? localStorage.getItem('token') : ''
}


root.render(
  <React.StrictMode>
      <RouterProvider router={Router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
