import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";

interface TaxResult {
  taxAfter87A: number;
  surcharge: number;
  cess: number;
  totalTax: number;
}

const IncomeTaxCalculator: React.FC = () => {
  // State for Old Regime inputs and results
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const [oldSalary, setOldSalary] = useState<string>("");
  const [oldDeduction, setOldDeduction] = useState<string>("");
  const [oldResult, setOldResult] = useState<TaxResult>({
    taxAfter87A: 0,
    surcharge: 0,
    cess: 0,
    totalTax: 0,
  });
  const [oldErrors, setOldErrors] = useState({
    salary: "",
    deduction: "",
  });

  // State for New Regime (2025-2026) inputs and results
  const [newSalary, setNewSalary] = useState<string>("");
  const [newDeduction, setNewDeduction] = useState<string>("");
  const [newResult, setNewResult] = useState<TaxResult>({
    taxAfter87A: 0,
    surcharge: 0,
    cess: 0,
    totalTax: 0,
  });
  const [newErrors, setNewErrors] = useState({
    salary: "",
    deduction: "",
  });

  // Helper: parse input string to number safely
  const parseInput = (value: string): number => {
    const num = parseFloat(value.replace(/,/g, ""));
    return isNaN(num) || num < 0 ? 0 : num;
  };

  // Format number to Indian currency string
  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  // Format number input with commas as user types
  const formatNumberInput = (value: string): string => {
    let digits = value.replace(/[^0-9]/g, "");
    if (digits === "") return "";
    digits = digits.replace(/^0+/, "") || "0";
    return Number(digits).toLocaleString("en-IN");
  };

  // Old Regime Tax Calculation
  function calculateOldRegimeTax(
    totalSalary: number,
    totalDeduction: number
  ): TaxResult {
    let taxableIncome = totalSalary - totalDeduction;
    if (taxableIncome <= 250000)
      return { taxAfter87A: 0, surcharge: 0, cess: 0, totalTax: 0 };

    let tax = 0;
    if (taxableIncome > 250000 && taxableIncome <= 500000) {
      tax = (taxableIncome - 250000) * 0.05;
      tax = 0; // original logic preserved
    } else if (taxableIncome > 500000 && taxableIncome <= 1000000) {
      tax = 12500 + (taxableIncome - 500000) * 0.2;
    } else if (taxableIncome > 1000000) {
      tax = 112500 + (taxableIncome - 1000000) * 0.3;
    }
    tax = Math.round(tax);

    let surcharge = 0;
    if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
      surcharge = tax * 0.1;
    } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
      surcharge = tax * 0.15;
    } else if (taxableIncome > 20000000 && taxableIncome <= 50000000) {
      surcharge = tax * 0.25;
    } else if (taxableIncome > 50000000) {
      surcharge = tax * 0.37;
    }

    let adjustedTax = tax + surcharge;

    if (taxableIncome > 5000000) {
      const marginalRelief = calculateMarginalReliefOld(
        taxableIncome,
        adjustedTax,
        surcharge
      );
      if (marginalRelief < adjustedTax) adjustedTax = marginalRelief;
    }

    surcharge = Math.round(adjustedTax - tax);

    let cess = Math.ceil(adjustedTax * 0.04);

    const totalTax = Math.ceil(adjustedTax + cess);

    return { taxAfter87A: tax, surcharge, cess, totalTax };
  }

  function calculateMarginalReliefOld(
    income: number,
    tax: number,
    surcharge: number
  ): number {
    const thresholds = [
      { limit: 5000000 },
      { limit: 10000000 },
      { limit: 20000000 },
      { limit: 50000000 },
    ];

    for (let i = 0; i < thresholds.length; i++) {
      const { limit } = thresholds[i];
      if (income <= limit) {
        const taxAtLimit = calculateIncomeTaxThresholdOld(limit);
        const surchargeAtLimit = calculateSurchargeOld(limit, taxAtLimit);
        const excessIncome = income - limit;
        return taxAtLimit + surchargeAtLimit + excessIncome;
      }
    }
    const lastLimit = 50000000;
    const taxAtLimit = calculateIncomeTaxThresholdOld(lastLimit);
    const surchargeAtLimit = calculateSurchargeOld(lastLimit, taxAtLimit);
    return taxAtLimit + surchargeAtLimit + (income - lastLimit);
  }

  function calculateIncomeTaxThresholdOld(income: number): number {
    if (income > 250000 && income <= 500000) {
      return (income - 250000) * 0.05;
    } else if (income > 500000 && income <= 1000000) {
      return 12500 + (income - 500000) * 0.2;
    } else if (income > 1000000) {
      return 112500 + (income - 1000000) * 0.3;
    }
    return 0;
  }

  function calculateSurchargeOld(income: number, tax: number): number {
    if (income > 5000000 && income <= 10000000) {
      return tax * 0.1;
    } else if (income > 10000000 && income <= 20000000) {
      return tax * 0.15;
    } else if (income > 20000000 && income <= 50000000) {
      return tax * 0.25;
    } else if (income > 50000000) {
      return tax * 0.37;
    }
    return 0;
  }

  // New Regime (2025-2026) Tax Calculation
  function calculateNewRegimeTax(
    totalSalary: number,
    totalDeduction: number
  ): TaxResult {
    let taxableIncome = totalSalary - totalDeduction;
    if (taxableIncome <= 400000)
      return { taxAfter87A: 0, surcharge: 0, cess: 0, totalTax: 0 };

    let tax = 0;
    if (taxableIncome > 400000 && taxableIncome <= 800000) {
      tax = (taxableIncome - 400000) * 0.05;
      tax = 0;
    } else if (taxableIncome > 800000 && taxableIncome <= 1200000) {
      tax = 20000 + (taxableIncome - 800000) * 0.1;
      tax = 0;
    } else if (taxableIncome > 1200000 && taxableIncome <= 1600000) {
      tax = 60000 + (taxableIncome - 1200000) * 0.15;
    } else if (taxableIncome > 1600000 && taxableIncome <= 2000000) {
      tax = 120000 + (taxableIncome - 1600000) * 0.2;
    } else if (taxableIncome > 2000000 && taxableIncome <= 2400000) {
      tax = 200000 + (taxableIncome - 2000000) * 0.25;
    } else if (taxableIncome > 2400000) {
      tax = 300000 + (taxableIncome - 2400000) * 0.3;
    }
    tax = Math.round(tax);

    let surcharge = 0;
    if (taxableIncome > 5000000 && taxableIncome <= 10000000) {
      surcharge = tax * 0.1;
    } else if (taxableIncome > 10000000 && taxableIncome <= 20000000) {
      surcharge = tax * 0.15;
    } else if (taxableIncome > 20000000) {
      surcharge = tax * 0.25;
    }

    let adjustedTax = tax + surcharge;

    if (taxableIncome > 5000000) {
      const marginalRelief = calculateMarginalReliefNew(
        taxableIncome,
        adjustedTax,
        surcharge
      );
      if (marginalRelief < adjustedTax) adjustedTax = marginalRelief;
    }

    surcharge = Math.round(adjustedTax - tax);
    let cess = Math.ceil(adjustedTax * 0.04);
    const totalTax = Math.ceil(adjustedTax + cess);

    return { taxAfter87A: tax, surcharge, cess, totalTax };
  }

  function calculateMarginalReliefNew(
    income: number,
    tax: number,
    surcharge: number
  ): number {
    const thresholds = [
      { limit: 5000000 },
      { limit: 10000000 },
      { limit: 20000000 },
    ];

    for (let i = 0; i < thresholds.length; i++) {
      const { limit } = thresholds[i];
      if (income <= limit) {
        const taxAtLimit = calculateIncomeTaxThresholdNew(limit);
        const surchargeAtLimit = calculateSurchargeNew(limit, taxAtLimit);
        const excessIncome = income - limit;
        return taxAtLimit + surchargeAtLimit + excessIncome;
      }
    }

    const lastLimit = 20000000;
    const taxAtLimit = calculateIncomeTaxThresholdNew(lastLimit);
    const surchargeAtLimit = calculateSurchargeNew(lastLimit, taxAtLimit);
    return taxAtLimit + surchargeAtLimit + (income - lastLimit);
  }

  function calculateIncomeTaxThresholdNew(income: number): number {
    if (income > 400000 && income <= 800000) {
      return (income - 400000) * 0.05;
    } else if (income > 800000 && income <= 1200000) {
      return 20000 + (income - 800000) * 0.1;
    } else if (income > 1200000 && income <= 1600000) {
      return 60000 + (income - 1200000) * 0.15;
    } else if (income > 1600000 && income <= 2000000) {
      return 120000 + (income - 1600000) * 0.2;
    } else if (income > 2000000 && income <= 2400000) {
      return 200000 + (income - 2000000) * 0.25;
    } else if (income > 2400000) {
      return 300000 + (income - 2400000) * 0.3;
    }
    return 0;
  }

  function calculateSurchargeNew(income: number, tax: number): number {
    if (income > 5000000 && income <= 10000000) {
      return tax * 0.1;
    } else if (income > 10000000 && income <= 20000000) {
      return tax * 0.15;
    } else if (income > 20000000) {
      return tax * 0.25;
    }
    return 0;
  }

  const handleOldCalculation = () => {
    const salaryNum = parseInput(oldSalary);
    const deductionNum = parseInput(oldDeduction);
    let hasError = false;
    const errors = { salary: "", deduction: "" };

    if (salaryNum <= 0) {
      errors.salary = "Enter a valid salary.";
      hasError = true;
    }
    if (deductionNum < 0) {
      errors.deduction = "Enter a valid deduction.";
      hasError = true;
    }

    setOldErrors(errors);
    if (hasError) return;

    const result = calculateOldRegimeTax(salaryNum, deductionNum);
    setOldResult(result);
  };

  const handleNewCalculation = () => {
    const salaryNum = parseInput(newSalary);
    const deductionNum = parseInput(newDeduction);
    let hasError = false;
    const errors = { salary: "", deduction: "" };

    if (salaryNum <= 0) {
      errors.salary = "Enter a valid salary.";
      hasError = true;
    }
    if (deductionNum < 0) {
      errors.deduction = "Enter a valid deduction.";
      hasError = true;
    }

    setNewErrors(errors);
    if (hasError) return;

    const result = calculateNewRegimeTax(salaryNum, deductionNum);
    setNewResult(result);
  };

  return (
    <div className="container-fluid">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
        <h2 className="text-center mb-4">Income Tax Calculator</h2>

        <div className="row">
          {/* Old Regime Card */}
          <div className="col-md-6">
            <div className="card shadow p-4 mb-4">
              <h3>Old Regime</h3>
              <label htmlFor="oldSalary">Total Salary:</label>
              <input
                type="text"
                id="oldSalary"
                className="form-control"
                placeholder="Enter total salary"
                value={oldSalary}
                onChange={(e) =>
                  setOldSalary(formatNumberInput(e.target.value))
                }
              />
              {oldErrors.salary && (
                <div className="text-danger small">{oldErrors.salary}</div>
              )}

              <label htmlFor="oldDeduction">Total Deduction:</label>
              <input
                type="text"
                id="oldDeduction"
                className="form-control"
                placeholder="Enter total deduction"
                value={oldDeduction}
                onChange={(e) =>
                  setOldDeduction(formatNumberInput(e.target.value))
                }
              />
              {oldErrors.deduction && (
                <div className="text-danger small">{oldErrors.deduction}</div>
              )}

              <button
                onClick={handleOldCalculation}
                className="btn btn-primary mt-3 w-100"
              >
                Calculate Tax
              </button>

              <div className="mt-4 p-3 bg-light border rounded">
                <h5 className="text-center mb-3">Tax Details</h5>
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Tax after relief 87A Payable</span>
                    <strong>{formatCurrency(oldResult.taxAfter87A)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Surcharge Payable</span>
                    <strong>{formatCurrency(oldResult.surcharge)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Cess Payable</span>
                    <strong>{formatCurrency(oldResult.cess)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Total Tax Payable</span>
                    {/* <strong>{formatCurrency(oldResult.totalTax)}</strong> */}

                    <strong
                      style={{
                        color: oldResult.totalTax === 0 ? "red" : "inherit",
                      }}
                    >
                      {oldResult.totalTax === 0
                        ? "NO TAX (0)"
                        : formatCurrency(oldResult.totalTax)}
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* New Regime Card */}
          <div className="col-md-6">
            <div className="card shadow p-4 mb-4">
              <h3>New Regime (2025-2026)</h3>
              <label htmlFor="newSalary">Total Salary:</label>
              <input
                type="text"
                id="newSalary"
                className="form-control"
                placeholder="Enter total salary"
                value={newSalary}
                onChange={(e) =>
                  setNewSalary(formatNumberInput(e.target.value))
                }
              />
              {newErrors.salary && (
                <div className="text-danger small">{newErrors.salary}</div>
              )}

              <label htmlFor="newDeduction">Total Deduction:</label>
              <input
                type="text"
                id="newDeduction"
                className="form-control"
                placeholder="Enter total deduction"
                value={newDeduction}
                onChange={(e) =>
                  setNewDeduction(formatNumberInput(e.target.value))
                }
              />
              {newErrors.deduction && (
                <div className="text-danger small">{newErrors.deduction}</div>
              )}

              <button
                onClick={handleNewCalculation}
                className="btn btn-primary mt-3 w-100"
              >
                Calculate Tax
              </button>

              <div className="mt-4 p-3 bg-light border rounded">
                <h5 className="text-center mb-3">Tax Details</h5>
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Tax after relief 87A Payable</span>
                    <strong>{formatCurrency(newResult.taxAfter87A)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Surcharge Payable</span>
                    <strong>{formatCurrency(newResult.surcharge)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Cess Payable</span>
                    <strong>{formatCurrency(newResult.cess)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Total Tax Payable</span>
                    {/* <strong>{formatCurrency(newResult.totalTax)}</strong> */}
                    <strong
                      style={{
                        color: newResult.totalTax === 0 ? "red" : "inherit",
                      }}
                    >
                      {newResult.totalTax === 0
                        ? "NO TAX (0)"
                        : formatCurrency(newResult.totalTax)}
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncomeTaxCalculator;
