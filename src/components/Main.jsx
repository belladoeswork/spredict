"use client";

import Image from "next/image.js";
import { dates } from "@/lib/dates.js";
import { useRef, useState } from "react";
import { MdAdd } from "react-icons/md";


export default function Main() {
  const [tickersArr, setTickersArr] = useState([]);
  const [tickerInput, setTickerInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  //   const tickersArr = [];

  //   const generateReportBtn = useRef(null);

  // const generateReportBtn = document.querySelector(".generate-report-btn");

  // generateReportBtn.addEventListener("click", fetchStockData);

  // document
  //   .getElementById("ticker-input-form")
  //   .addEventListener("submit", (e) => {
  //     e.preventDefault();
  //     const tickerInput = document.getElementById("ticker-input");
  //     if (tickerInput.value.length > 2) {
  //       generateReportBtn.disabled = false;
  //       const newTickerStr = tickerInput.value;
  //       tickersArr.push(newTickerStr.toUpperCase());
  //       tickerInput.value = "";
  //       renderTickers();
  //     } else {
  //       const label = document.getElementsByTagName("label")[0];
  //       label.style.color = "red";
  //       label.textContent =
  //         "You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.";
  //     }
  //   });

  
  // const openai = new OpenAI(process.env.OPENAI_API_KEY);


  function renderTickers(tickers) {
    const tickersDiv = document.querySelector(".ticker-choice-display");
    tickersDiv.innerHTML = "";
    tickers.forEach((ticker) => {
      const newTickerSpan = document.createElement("span");
      newTickerSpan.textContent = ticker;
      newTickerSpan.classList.add("ticker");
      tickersDiv.appendChild(newTickerSpan);
    });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    if (tickerInput.length > 2) {
        setTickersArr((prevTickersArr) => {
          
            const newTicker = tickerInput.toUpperCase();
            if (prevTickersArr.includes(newTicker)) {
                setErrorMessage("This ticker has already been added.");
                setTickerInput("");
                return prevTickersArr;
            } else {
                const newTickersArr = [...prevTickersArr, newTicker];
                setTickerInput("");
                setErrorMessage("");
                renderTickers(newTickersArr);
                return newTickersArr;
            }
      });
    } else {
      setErrorMessage(
        "You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla."
      );
    }
  };

  const message =
    hasAttemptedSubmit && errorMessage
      ? errorMessage
      : "Add up to 3 stock tickers below to get a super accurate stock predictions report👇";

  const labelClass =
    hasAttemptedSubmit && errorMessage ? "label-error" : "label-light";

  const loadingArea = document.querySelector(".loading-panel");
  const apiMessage = document.getElementById("api-message");

  async function fetchStockData() {
    document.querySelector(".action-panel").style.display = "none";
    loadingArea.style.display = "flex";
    try {
      const stockData = await Promise.all(
        tickersArr.map(async (ticker) => {
          const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=${process.env.POLYGON_API_KEY}`;
          const response = await fetch(url);
          const data = await response.text();
          const status = await response.status;
          if (status === 200) {
            apiMessage.innerText = "Creating report...";
            return data;
          } else {
            loadingArea.innerText = "There was an error fetching stock data.";
          }
        })
      );
      fetchReport(stockData.join(""));
    } catch (err) {
      loadingArea.innerText = "There was an error fetching stock data.";
      console.error("error: ", err);
    }
  }

  async function fetchReport(data) {
    /** AI goes here **/
  }

  function renderReport(output) {
    loadingArea.style.display = "none";
    const outputArea = document.querySelector(".output-panel");
    const report = document.createElement("p");
    outputArea.appendChild(report);
    report.textContent = output;
    outputArea.style.display = "flex";
  }

  return (
    <main>
      <section className="action-panel">
        <form id="ticker-input-form" onSubmit={handleSubmit}>
          <label className={labelClass}>{message}</label>
          <div className="form-input-control">
            <input
              type="text"
              id="ticker-input"
              placeholder="MSFT"
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
            />
            <button className="add-ticker-btn">
              <MdAdd />
            </button>
          </div>
        </form>
        <p className="ticker-choice-display">
          Your tickers will appear here...
        </p>
        <button
          onClick={fetchStockData}
          className="generate-report-btn"
          type="button"
          disabled={tickersArr.length === 0}
        >
          Generate Report
        </button>
        <p className="tag-line">Always correct 15% of the time!</p>
      </section>
    </main>
  );
}
