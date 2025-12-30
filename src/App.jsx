import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import "./components.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Dat } from "./Route";
import { FaWhatsapp } from "react-icons/fa6";
import "./change.css"
import "./responsive.css"
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          {Dat.map((e) => (
            <Route path={e.path} element={e.element} key={e.label} />
          ))}
        </Routes>
        <Link to="https://wa.me/+916377956633" className="ablink"><FaWhatsapp /></Link>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
