import React from 'react';
import { Outlet } from 'react-router-dom';

import Footer from './components/Footer';
import Header from './components/Header';

import './App.scss';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="app-contents">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default App;
