import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "./components.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Dat } from "./Route";

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
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
