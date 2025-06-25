import React, { useEffect, useState } from "react";
import Sidebar from "../dashboard/Sidebar";
import "../dashboard/Dashboard.css";
import "../assets/CSS/currencyconverter.css";
import axios from "axios";

const CurrencyConverter: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");
  const [convertedValue, setConvertedValue] = useState<string>("");
  const [allRates, setAllRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const currencyNames: Record<string, string> = {
    AUD: "Australian Dollar",
    BGN: "Bulgarian Lev",
    BRL: "Brazilian Real",
    CAD: "Canadian Dollar",
    CHF: "Swiss Franc",
    CNY: "Chinese Yuan",
    CZK: "Czech Koruna",
    DKK: "Danish Krone",
    EUR: "Euro",
    GBP: "Pound Sterling",
    HKD: "Hong Kong Dollar",
    HUF: "Hungarian Forint",
    IDR: "Indonesian Rupiah",
    ILS: "Israeli Shekel",
    INR: "Indian Rupee",
    ISK: "Icelandic Króna",
    JPY: "Japanese Yen",
    KRW: "South Korean Won",
    MXN: "Mexican Peso",
    MYR: "Malaysian Ringgit",
    NOK: "Norwegian Krone",
    NZD: "New Zealand Dollar",
    PHP: "Philippine Peso",
    PLN: "Polish Złoty",
    RON: "Romanian Leu",
    SEK: "Swedish Krona",
    SGD: "Singapore Dollar",
    THB: "Thai Baht",
    TRY: "Turkish Lira",
    ZAR: "South African Rand",
  };

  const fetchRates = async () => {
    setLoading(true);
    setError("");
    try {
      // const currencyAPI = process.env.REACT_APP_CURRENCY_CONVERTER_API;
      const response = await axios.get(
        `https://api.frankfurter.dev/v1/latest?from=${fromCurrency}`
      );
      const rate = response.data.rates[toCurrency];
      const converted = (parseFloat(amount) * rate).toFixed(2);
      setConvertedValue(converted);
      setCurrencies(Object.keys(response.data.rates).concat(fromCurrency));
      setAllRates(response.data.rates);
    } catch (err) {
      setError("Failed to fetch exchange rates. Try again.");
      setConvertedValue("");
      setAllRates({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, [fromCurrency, toCurrency, amount]);

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className={`col ${isSidebarOpen ? "ms-3" : ""}`}>
          <div className="currcard currency-card shadow p-4 mt-4">
            <h2 className="text-center mb-4">Currency Converter</h2>

            <div className="row g-3 align-items-end">
              <div className="currency-form-row">
                <div className="row">
                  <div className="col-xl-4 col-lg-6">
                    <div className="currency-form-group">
                      <label className="currency-label">Amount</label>
                      <input
                        type="number"
                        className="form-control currency-input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6">
                    <div className="currency-form-group">
                      <label className="currency-label">From Currency</label>
                      <select
                        className="form-select currency-select"
                        value={fromCurrency}
                        onChange={(e) => setFromCurrency(e.target.value)}
                      >
                        {currencies.map((cur) => (
                          <option key={cur} value={cur}>
                            {cur} - {currencyNames[cur] || cur}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6">
                    <div className="currency-form-group">
                      <label className="currency-label">To Currency</label>
                      <select
                        className="form-select currency-select"
                        value={toCurrency}
                        onChange={(e) => setToCurrency(e.target.value)}
                      >
                        {currencies.map((cur) => (
                          <option key={cur} value={cur}>
                            {cur} - {currencyNames[cur] || cur}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center mt-4">Loading...</div>
            ) : error ? (
              <div className="alert alert-danger mt-4 text-center">{error}</div>
            ) : (
              convertedValue && (
                <div className="alert alert-success mt-4 text-center fs-5">
                  {amount} {fromCurrency} = {convertedValue} {toCurrency}
                </div>
              )
            )}
          </div>

          {Object.keys(allRates).length > 0 && (
            <div className="currcard currency-card shadow p-4 mt-4">
              <h5 className="mb-3">Exchange Rates (Base: {fromCurrency})</h5>
              <div className="currency-rates-list">
                {Object.entries(allRates).map(([key, value]) => (
                  <div key={key} className="currency-rate-item">
                    <strong>{key}:</strong> {value.toFixed(4)} (
                    {currencyNames[key] || key})
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CurrencyConverter;
