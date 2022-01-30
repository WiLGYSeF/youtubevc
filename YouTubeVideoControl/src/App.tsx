import React from 'react';

import { Outlet } from 'react-router-dom';

import './css/style.min.css';

function App() {
  return (
    <div className="App">
      <p>Hi</p>
      <Outlet />
    </div>
  );
}

export default App;
