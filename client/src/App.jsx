import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/pages/Header";
import { Profile } from "./Components/pages/Profile.jsx";
import SignUp from "./Components/pages/SignUp.jsx";
import SignIn from "./Components/pages/SignIn.jsx";
import PrivateRoute from "./Components/PrivateRoute.jsx";
import About from "./Components/pages/About.jsx";
import AddListings  from "./Components/AddListings.jsx";
import Listing from "./Components/pages/Listing.jsx";
import EditListing from "./Components/EditListing.jsx";
import  Search  from "./Components/pages/Search.jsx";
import Home from './Components/pages/Home.jsx'
const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route path='/search' element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path='/create-listing' element={<AddListings />} />
          <Route
            path='/update-listing/:listingId'
            element={<EditListing />}
          />
        </Route>
        <Route path="/about" element={<About/>}></Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
