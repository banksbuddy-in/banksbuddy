import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
import { useEffect } from "react";
import "./App.css";
import "./components.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Dat } from "./Route";
import { FaWhatsapp } from "react-icons/fa6";
import "./change.css";
import "./change2.css";
import "./responsive.css";
import "./components/r.css";
import "./ch.css";
import "./res2.css";
import { Cursor } from "./components/Cursor";
import { RiAdminFill } from "react-icons/ri";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const AdminButton = () => {
  const { userRole } = useAuth();
  // Only show if userRole is explicitly 'admin'
  if (userRole !== "admin") return null;

  return (
    <Link to="/admin" className="aa blink">
      <RiAdminFill />
    </Link>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          {/* <Cursor /> */}
          <Navbar />
          <Routes>
            {Dat.map((e) => {
              return (
                <Route
                  path={e.path}
                  element={e.element}
                  key={e.label || e.path}
                />
              );
            })}
          </Routes>
          <Link to="https://wa.me/+916377956633" className="ablink">
            <FaWhatsapp />
          </Link>
          <AdminButton />
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
