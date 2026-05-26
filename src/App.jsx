import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
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
import apiFetch from "./lib/api.js";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function ActivityTracker() {
  const { pathname } = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const logPageView = async () => {
      try {
        await apiFetch("/api/activity-logs", {
          method: "POST",
          body: JSON.stringify({
            type: "page_view",
            path: pathname,
            uid: currentUser?.uid || "anonymous",
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error("Failed to log activity view:", err);
      }
    };
    logPageView();
  }, [pathname, currentUser]);

  return null;
}

const AdminButton = () => {
  const { userRole } = useAuth();
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
        <ToastProvider>
          <AuthProvider>
            <ScrollToTop />
            <ActivityTracker />
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
        </ToastProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
