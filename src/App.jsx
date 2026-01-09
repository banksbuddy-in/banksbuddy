import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
import { Cursor } from "./components/Cursor";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        {/* <Cursor /> */}
        <Navbar />
        <Routes>
          {Dat.map((e) => (
            <Route path={e.path} element={e.element} key={e.label} />
          ))}
        </Routes>
        <Link to="https://wa.me/+916377956633" className="ablink">
          <FaWhatsapp />
        </Link>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
