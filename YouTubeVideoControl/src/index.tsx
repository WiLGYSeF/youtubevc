import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter, Navigate, Route, Routes,
} from 'react-router-dom';
import { createBrowserHistory } from 'history';

import App from './App';
import Home from './routes/Home';
import YouTubePlayerContainer from './routes/YouTubePlayerContainer';

import './i18n/config';

const history = createBrowserHistory();

const app = document.getElementById('root');

// used with static hosting
if (app) {
  const path = (/^#!(\/.*)$/.exec(location.hash) || [])[1];
  if (path) {
    history.replace(path);
  }
}

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
  app,
);
