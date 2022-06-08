import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ListingPage from "./listing/ListingPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ListingPage />}></Route>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
