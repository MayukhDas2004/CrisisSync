import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomSelect from './pages/RoomSelect';
import SOSPage from './pages/SOSPage';
import Confirmation from './pages/Confirmation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomSelect />} />
        <Route path="/sos" element={<SOSPage />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
