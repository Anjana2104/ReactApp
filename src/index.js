import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./Pages/Home";
import ResourceDetails from "./components/Resource/ResourceDetails";
import ResourceInsights from "./components/Resource/ResourceInsights";
import ResourcePlanning from "./Pages/ResourcePlanning";
import ResourceInformation from "./Pages/ResourceInformation";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resources" element={<ResourceDetails />} />
      <Route path="/insights" element={<ResourceInsights />} />
      <Route path="/planning" element={<ResourcePlanning />} />
      <Route path="/resource-information" element={<ResourceInformation />} />
      
    </Routes>
  </Router>
);
