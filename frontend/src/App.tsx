import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "./App.css";

import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/LoginPage";
import RegisterPage from "./pages/Register/RegisterPage";
import FeedPage from "./pages/Feed/FeedPage";
import MoviesPage from "./pages/Movies/MoviesPage";
import RateMoviePage from "./pages/RateMovie/RateMoviePage";
import MyReviewsPage from "./pages/MyReviews/MyReviewsPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col font-poppins">
      <BrowserRouter>
        <RouterContent />
      </BrowserRouter>
    </div>
  );
}

function RouterContent() {
  const location   = useLocation();
  const { token, user } = useSelector((s: any) => s.login);
  const isLoggedIn = Boolean(token);

  const isViewerPath = location.pathname.includes("viewer");

  return (
    <main className={`App flex flex-col flex-1 bg-[#0F172A] min-h-screen ${isViewerPath ? "viewer" : ""}`}>
      <Header isLoggedIn={isLoggedIn} username={user?.name} />

      <div className="flex-1">
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/feed"        element={<FeedPage />} />
          <Route path="/movies"      element={<MoviesPage />} />
          <Route path="/my-reviews"  element={<MyReviewsPage />} />
          <Route path="/rate"        element={<RateMoviePage />} />

          <Route path="/login"       element={<Login />} />
          <Route path="/register"    element={<RegisterPage />} />
        </Routes>
      </div>

      <Footer />
    </main>
  );
}

export default App;
