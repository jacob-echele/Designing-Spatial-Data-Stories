import { useState, useEffect } from "react";
import MapDisplay from './components/MapDisplay.jsx'
import TitleBar from './components/TitleBar'
import CityModal from './components/CityModal.jsx'

function App() {
  
  return (
    <div className="mx-auto max-w-screen-xl bg-gray-50 min-h-screen">
      <TitleBar title = "Olympic Host Cities (1896-2028)" />
      <MapDisplay />
      <CityModal />
    </div>
  )
}

export default App
