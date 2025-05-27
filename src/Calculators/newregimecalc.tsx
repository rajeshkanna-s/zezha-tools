import React, { useState } from "react";
import Sidebar from "../dashboard/Sidebar";

interface TaxResult {
  taxAfter87A: number;
  surcharge: number;
  cess: number;
  totalTax: number;
}

const IncomeTaxNewRegime: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const [salary, setSalary] = useState<string>("");
  const [deduction, setDeduction] = useState<string>("");
  const [result, setResult] = useState<TaxResult>({
    taxAfter87A: 0,
    surcharge: 0,
    cess: 0,
    totalTax: 0,
  });
  const [errors, setErrors] = useState({ salary: "", deduction: "" });

  const parseInput = (value: string): number => {
    const num = parseFloat(value.replace(/,/g, ""));
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const formatCurrency = (amount: number): string => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  const formatNumberInput = (value: string): string => {
    let digits = value.replace(/[^0-9]/g, "");
    if (digits === "") return "";
    digits = digits.replace(/^0+/, "") || "0";
    return Number(digits).toLocaleString("en-IN");
  };

  const calculateNewRegimeTax = (
    totalSalary: number,
    totalDeduction: number
  ): TaxResult => {
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
  };

  const calculateMarginalReliefNew = (
    income: number,
    tax: number,
    surcharge: number
  ): number => {
    const thresholds = [
      { limit: 5000000 },
      { limit: 10000000 },
      { limit: 20000000 },
    ];

    for (let { limit } of thresholds) {
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
  };

  const calculateIncomeTaxThresholdNew = (income: number): number => {
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
  };

  const calculateSurchargeNew = (income: number, tax: number): number => {
    if (income > 5000000 && income <= 10000000) {
      return tax * 0.1;
    } else if (income > 10000000 && income <= 20000000) {
      return tax * 0.15;
    } else if (income > 20000000) {
      return tax * 0.25;
    }
    return 0;
  };

  const handleCalculation = () => {
    const salaryNum = parseInput(salary);
    const deductionNum = parseInput(deduction);
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

    setErrors(errors);
    if (hasError) return;

    const result = calculateNewRegimeTax(salaryNum, deductionNum);
    setResult(result);
  };

  return (
    <div className="container-fluid">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
        {/* <h2 className="text-center mb-4">Income Tax Calculator (New Regime)</h2> */}

        <div className="row">
          <div className="col-md-6">
            <div className="card shadow p-4 mb-4">
              <h3>New Regime</h3>
              <label htmlFor="salary">Total Salary:</label>
              <input
                type="text"
                id="salary"
                className="form-control"
                placeholder="Enter total salary"
                value={salary}
                onChange={(e) => setSalary(formatNumberInput(e.target.value))}
              />
              {errors.salary && (
                <div className="text-danger small">{errors.salary}</div>
              )}

              <label htmlFor="deduction" className="mt-3">
                Total Deduction:
              </label>
              <input
                type="text"
                id="deduction"
                className="form-control"
                placeholder="Enter total deduction"
                value={deduction}
                onChange={(e) =>
                  setDeduction(formatNumberInput(e.target.value))
                }
              />
              {errors.deduction && (
                <div className="text-danger small">{errors.deduction}</div>
              )}

              <button
                onClick={handleCalculation}
                className="btn btn-primary mt-3 w-100"
              >
                Calculate Tax
              </button>

              <div className="mt-4 p-3 bg-light border rounded">
                <h5 className="text-center mb-3">Tax Details</h5>
                <ul className="list-group">
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Tax after relief 87A Payable</span>
                    <strong>{formatCurrency(result.taxAfter87A)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Surcharge Payable</span>
                    <strong>{formatCurrency(result.surcharge)}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Cess Payable</span>
                    <strong>{formatCurrency(result.cess)}</strong>
                  </li>

                  <li className="list-group-item d-flex justify-content-between fw-bold text-success">
                    <span>Total Tax Payable</span>
                    {/* <strong>{formatCurrency(newResult.totalTax)}</strong> */}
                    <strong
                      style={{
                        color: result.totalTax === 0 ? "red" : "inherit",
                      }}
                    >
                      {result.totalTax === 0
                        ? "NO TAX (0)"
                        : formatCurrency(result.totalTax)}
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

export default IncomeTaxNewRegime;
