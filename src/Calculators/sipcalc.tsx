import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar";

const SipCalculator: React.FC = () => {
  const [investmentType, setInvestmentType] = useState<"sip" | "lumpsum">(
    "sip"
  );
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(1000);
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(100000);
  const [rate, setRate] = useState<number>(12);
  const [timePeriod, setTimePeriod] = useState<number>(1);

  const [errors, setErrors] = useState({
    monthlyInvestment: "",
    lumpSumAmount: "",
    rate: "",
    timePeriod: "",
  });

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [results, setResults] = useState({
    totalInvestment: 0,
    returnEarned: 0,
    maturityAmount: 0,
  });

  useEffect(() => {
    // Sidebar loading logic placeholder - you add your external sidebar load script here
    // e.g. fetch sidebar.html and inject or load via external React component
  }, []);

  const validate = () => {
    let hasError = false;
    const newErrors = {
      monthlyInvestment: "",
      lumpSumAmount: "",
      rate: "",
      timePeriod: "",
    };

    if (
      investmentType === "sip" &&
      (!monthlyInvestment || monthlyInvestment < 500)
    ) {
      newErrors.monthlyInvestment =
        "Please enter monthly investment (min ₹500)";
      hasError = true;
    }
    if (
      investmentType === "lumpsum" &&
      (!lumpSumAmount || lumpSumAmount < 1000)
    ) {
      newErrors.lumpSumAmount = "Please enter lump sum amount (min ₹1000)";
      hasError = true;
    }
    if (!rate || rate <= 0) {
      newErrors.rate = "Please enter valid rate of interest";
      hasError = true;
    }
    if (!timePeriod || timePeriod < 1) {
      newErrors.timePeriod = "Please enter valid time period (min 1 year)";
      hasError = true;
    }

    setErrors(newErrors);
    return !hasError;
  };

  const calculateInvestment = () => {
    if (!validate()) return;

    const r = rate / 100;
    let totalInvestment = 0;
    let maturityAmount = 0;
    let returnEarned = 0;

    if (investmentType === "sip") {
      const monthlyRate = r / 12;
      const n = timePeriod * 12;
      maturityAmount =
        monthlyInvestment *
        (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) *
          (1 + monthlyRate));
      totalInvestment = monthlyInvestment * n;
    } else {
      maturityAmount = lumpSumAmount * Math.pow(1 + r, timePeriod);
      totalInvestment = lumpSumAmount;
    }

    returnEarned = maturityAmount - totalInvestment;

    setResults({
      totalInvestment: parseFloat(totalInvestment.toFixed(2)),
      returnEarned: parseFloat(returnEarned.toFixed(2)),
      maturityAmount: parseFloat(maturityAmount.toFixed(2)),
    });
  };

  return (
    <div className="container-fluid page-body-wrapper">
      {/* Sidebar container (like RD calc) */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
        <div className="main-panel">
          <div className="content-wrapper">
            <div
              className="card p-3"
              style={{
                maxWidth: 420,
                margin: "auto",
                marginTop: 20,
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                borderRadius: 10,
              }}
            >
              <h2 className="text-center mb-3">SIP Calculator</h2>

              <label htmlFor="investmentType" className="fw-bold">
                Choose Investment Type:
              </label>
              <select
                id="investmentType"
                className="form-select mb-3"
                value={investmentType}
                onChange={(e) =>
                  setInvestmentType(e.target.value as "sip" | "lumpsum")
                }
              >
                <option value="sip">SIP</option>
                <option value="lumpsum">Lumpsum</option>
              </select>

              {investmentType === "sip" && (
                <>
                  <label htmlFor="monthlyInvestment" className="fw-bold">
                    Monthly Investment (₹):
                  </label>
                  <input
                    type="number"
                    id="monthlyInvestment"
                    className="form-control mb-1"
                    value={monthlyInvestment}
                    min={500}
                    onChange={(e) =>
                      setMonthlyInvestment(parseFloat(e.target.value))
                    }
                  />
                  {errors.monthlyInvestment && (
                    <div className="text-danger mb-2">
                      {errors.monthlyInvestment}
                    </div>
                  )}
                </>
              )}

              {investmentType === "lumpsum" && (
                <>
                  <label htmlFor="lumpSumAmount" className="fw-bold">
                    Lump Sum Investment (₹):
                  </label>
                  <input
                    type="number"
                    id="lumpSumAmount"
                    className="form-control mb-1"
                    value={lumpSumAmount}
                    min={1000}
                    onChange={(e) =>
                      setLumpSumAmount(parseFloat(e.target.value))
                    }
                  />
                  {errors.lumpSumAmount && (
                    <div className="text-danger mb-2">
                      {errors.lumpSumAmount}
                    </div>
                  )}
                </>
              )}

              <label htmlFor="rate" className="fw-bold">
                Expected Rate of Interest (% per annum):
              </label>
              <input
                type="number"
                id="rate"
                className="form-control mb-1"
                value={rate}
                min={1}
                onChange={(e) => setRate(parseFloat(e.target.value))}
              />
              {errors.rate && (
                <div className="text-danger mb-2">{errors.rate}</div>
              )}

              <label htmlFor="timePeriod" className="fw-bold">
                Time Period (in Years):
              </label>
              <input
                type="number"
                id="timePeriod"
                className="form-control mb-3"
                value={timePeriod}
                min={1}
                onChange={(e) => setTimePeriod(parseFloat(e.target.value))}
              />
              {errors.timePeriod && (
                <div className="text-danger mb-2">{errors.timePeriod}</div>
              )}

              <button
                className="btn btn-success w-100 mb-3"
                onClick={calculateInvestment}
              >
                Calculate
              </button>

              <div className="results bg-light p-3 rounded">
                <h3 className="text-center mb-3">SIP Calculation Result:</h3>
                <div className="result-item d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded border">
                  <div>Total Investment:</div>
                  <span className="fw-bold text-success">
                    ₹{results.totalInvestment.toLocaleString()}
                  </span>
                </div>
                <div className="result-item d-flex justify-content-between align-items-center mb-2 p-2 bg-white rounded border">
                  <div>Return Earned:</div>
                  <span className="fw-bold text-success">
                    ₹{results.returnEarned.toLocaleString()}
                  </span>
                </div>
                <div className="result-item d-flex justify-content-between align-items-center p-2 bg-white rounded border">
                  <div>Maturity Amount:</div>
                  <span className="fw-bold text-success">
                    ₹{results.maturityAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SipCalculator;
