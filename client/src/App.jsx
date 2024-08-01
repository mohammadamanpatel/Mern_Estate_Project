import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary"; // Ensure correct path
import { useSelector } from "react-redux";

// Lazy load your non-protected components
const Header = lazy(() => import("./Components/pages/Header"));
const SignUp = lazy(() => import("./Components/pages/SignUp.jsx"));
const SignIn = lazy(() => import("./Components/pages/SignIn.jsx"));
const About = lazy(() => import("./Components/pages/About.jsx"));
const Listing = lazy(() => import("./Components/pages/Listing.jsx"));
const Search = lazy(() => import("./Components/pages/Search.jsx"));
const Home = lazy(() => import("./Components/pages/Home.jsx"));

// Direct imports for protected routes
import { Profile } from "./Components/pages/Profile.jsx";
import AddListings from "./Components/AddListings.jsx";
import EditListing from "./Components/EditListing.jsx";

const App = () => {
  // Get the current user from the Redux store
  const { currentUser } = useSelector((state) => state.user);
  console.log("currentUser in app", currentUser);
  // Function to check if the user is authenticated
  const isAuthenticated = currentUser && Object.keys(currentUser).length > 0;
  console.log("isAuthenticated", isAuthenticated);

  return (
    <BrowserRouter>
      <ErrorBoundary>
      {/* Wrap only the lazy-loaded routes in Suspense */}
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen">
          <div className="flex items-center justify-center">
            <div className="loader"></div>
          </div>
          <style jsx>{`
            .loader {
              border: 16px solid #f3f3f3; /* Light grey */
              border-top: 16px solid #3498db; /* Blue */
              border-radius: 50%;
              width: 80px;
              height: 80px;
              animation: spin 2s linear infinite;
            }

            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      }>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/listing/:listingId" element={<Listing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
      {/* Directly render protected routes */}
      <Routes>
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/sign-in" />}
        />
        <Route
          path="/create-listing"
          element={
            isAuthenticated ? <AddListings /> : <Navigate to="/sign-in" />
          }
          z
        />
        <Route
          path="/update-listing/:listingId"
          element={
            isAuthenticated ? <EditListing /> : <Navigate to="/sign-in" />
          }
        />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
