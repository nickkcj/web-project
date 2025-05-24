import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
// import ProtectedRoute from "./Auth/protectedRoute";

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
    const location = useLocation();
    const isViewerPath = location.pathname.includes("viewer");

    return (
        <div className={`App flex flex-col flex-1 ${isViewerPath ? "viewer" : ""}`}>
            <Header />
            <div className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<RegisterPage />} />
                    {/*<Route path="/agendar" element={<ProtectedRoute Component={Review} path="/review" />} />*/}
                </Routes>
            </div>
            <Footer />
        </div>
    );
}

export default App;
