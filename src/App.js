import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import NoMatch from "./components/NoMatch";
import City from "./components/City";

function App() {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="city/:cityName" element={<City />} />
        <Route path="/*" element={<NoMatch />} />
      </Routes>
    </>
  );
}

export default App;
