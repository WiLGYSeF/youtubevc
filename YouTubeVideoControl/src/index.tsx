import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';

import App from './App';
import Home from './routes/Home';
import YouTubePlayerContainer from './routes/YouTubePlayerContainer';

import reportWebVitals from './reportWebVitals';

import './i18n/config';

import './css/style.min.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="watch" element={<YouTubePlayerContainer />} />
          <Route index element={<Home />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
