import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [bets, setBets] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/odds")
      .then((response) => setBets(response.data))
      .catch((error) => console.error("API error:", error));
  }, []);

  const filteredBets = bets.filter(
    (bet) =>
      bet.match.toLowerCase().includes(filter.toLowerCase()) ||
      bet.league.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>All Betting Odds</h1>

      <input
        type="text"
        placeholder="Search by team or league"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />

      <table
        border="1"
        cellPadding="10"
        style={{ width: "100%", textAlign: "left" }}
      >
        <thead>
          <tr>
            <th>Match</th>
            <th>League</th>
            <th>Bookmaker</th>
            <th>Bet</th>
            <th>Odds</th>
            <th>Probability</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {filteredBets.map((bet, index) => (
            <tr key={index}>
              <td>{bet.match}</td>
              <td>{bet.league}</td>
              <td>{bet.bookmaker}</td>
              <td>{bet.bet}</td>
              <td>{bet.odds}</td>
              <td>{bet.probability}</td>
              <td>{bet.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
