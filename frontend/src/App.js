// frontend/src/App.js
import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import Navigation from './components/Navigation/Navigation';

function App() {
  return (
    <div className="App">
      <Navigation/>
      <Dashboard />
      
    </div>
  );
}

export default App;
