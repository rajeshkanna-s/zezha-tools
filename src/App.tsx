// import { useState } from "react";
import "./App.css";
import Dashboard from "./dashboard/Dashboard";
import EmiCalculator from "./Calculators/emilcal";
import FDCalculator from "./Calculators/fdcalc";
import RDCalculator from "./Calculators/rdcalc";
import TDSCalculator from "./Calculators/tdscalc";
import SIPCalculator from "./Calculators/sipcalc";
import TAXCOMPARECalculator from "./Calculators/taxcomparecalc";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/emi-calculator" element={<EmiCalculator />} />
        <Route path="/fd-calculator" element={<FDCalculator />} />
        <Route path="/rd-calculator" element={<RDCalculator />} />
        <Route path="/tds-calculator" element={<TDSCalculator />} />
        <Route path="/sip-calculator" element={<SIPCalculator />} />
        <Route
          path="/taxcompare-calculator"
          element={<TAXCOMPARECalculator />}
        />
        {/* You can add more routes here */}
      </Routes>
    </Router>
  );
}

export default App;
