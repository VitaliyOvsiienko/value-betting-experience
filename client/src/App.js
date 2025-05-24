import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [leagues, setLeagues] = useState([]);
  const [leagueInput, setLeagueInput] = useState("");
  const [leagueId, setLeagueId] = useState(null);

  const [teams, setTeams] = useState([]);
  const [teamAInput, setTeamAInput] = useState("");
  const [teamBInput, setTeamBInput] = useState("");
  const [teamA, setTeamA] = useState("");
  const [teamB, setTeamB] = useState("");

  const [avgA, setAvgA] = useState("");
  const [avgB, setAvgB] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5050/api/leagues")
      .then((res) => setLeagues(res.data))
      .catch((err) => console.error("Failed to load leagues", err));
  }, []);

  useEffect(() => {
    if (leagueId) {
      axios
        .get(`http://localhost:5050/api/teams?league=${leagueId}`)
        .then((res) => setTeams(res.data))
        .catch((err) => console.error("Failed to load teams", err));
    } else {
      setTeams([]);
      setTeamAInput("");
      setTeamBInput("");
    }
  }, [leagueId]);
  const fetchAvg = async (team, setAvg) => {
    try {
      const res = await axios.get(
        `http://localhost:5050/api/stats?team=${team}`
      );
      setAvg(res.data.avg);
    } catch {
      setAvg("");
    }
  };

  const fetchPoisson = async () => {
    if (!avgA || !avgB) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5050/api/poisson?avgA=${avgA}&avgB=${avgB}`
      );
      setResult(res.data);
    } catch {
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "sans-serif",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Value Betting Poisson Model</h1>

      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Type league name..."
          value={leagueInput}
          onChange={(e) => setLeagueInput(e.target.value)}
          style={{
            padding: "0.5rem",
            width: "100%",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
        {leagueInput && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              maxHeight: "200px",
              overflowY: "auto",
              zIndex: 1000,
              margin: 0,
              padding: 0,
              listStyle: "none",
            }}
          >
            {leagues
              .filter((l) =>
                l.name.toLowerCase().includes(leagueInput.toLowerCase())
              )
              .slice(0, 10)
              .map((l) => (
                <li
                  key={l.id}
                  onClick={() => {
                    setLeagueId(l.id);
                    setLeagueInput(l.name);
                  }}
                  style={{ padding: "0.5rem", cursor: "pointer" }}
                >
                  {l.name}
                </li>
              ))}
          </ul>
        )}
      </div>

      {leagueId && (
        <>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            {[
              ["A", teamAInput, setTeamAInput, setTeamA, setAvgA],
              ["B", teamBInput, setTeamBInput, setTeamB, setAvgB],
            ].map(([label, input, setInput, setTeam, setAvg], idx) => (
              <div
                key={label}
                style={{ position: "relative", flex: "1 1 250px" }}
              >
                <input
                  type="text"
                  placeholder={`Type team ${label}`}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setTeam("");
                  }}
                  style={{
                    padding: "0.5rem",
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
                {input && (
                  <ul
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      maxHeight: "200px",
                      overflowY: "auto",
                      zIndex: 1000,
                      margin: 0,
                      padding: 0,
                      listStyle: "none",
                    }}
                  >
                    {teams
                      .filter((t) =>
                        t.name.toLowerCase().includes(input.toLowerCase())
                      )
                      .slice(0, 10)
                      .map((t) => (
                        <li
                          key={t.id}
                          onClick={() => {
                            setTeam(t.name);
                            setInput(t.name);
                            fetchAvg(t.name, setAvg);
                          }}
                          style={{ padding: "0.5rem", cursor: "pointer" }}
                        >
                          {t.name}
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {teamA && teamB && (
            <div style={{ marginBottom: "1rem", textAlign: "center" }}>
              <button
                onClick={fetchPoisson}
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Calculate
              </button>
            </div>
          )}
        </>
      )}

      {teamA && (
        <p>
          <strong>{teamA}</strong> avg goals: {avgA}
        </p>
      )}
      {teamB && (
        <p>
          <strong>{teamB}</strong> avg goals: {avgB}
        </p>
      )}
      {loading && <p>Calculating...</p>}

      {result && (
        <>
          <h2>Top Score Probabilities</h2>
          <table
            border="1"
            cellPadding="8"
            style={{ width: "100%", marginBottom: "2rem" }}
          >
            <thead>
              <tr>
                <th>Score</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody>
              {[...result.scores]
                .sort(
                  (a, b) =>
                    parseFloat(b.probability) - parseFloat(a.probability)
                )
                .map((item, index) => (
                  <tr key={index}>
                    <td>{item.score}</td>
                    <td>{(parseFloat(item.probability) * 100).toFixed(2)}%</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h2>Probability Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[...result.scores].slice(0, 10)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="score" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="probability" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <h2>Summary</h2>
          <p>
            <strong>Over 2.5 goals:</strong>{" "}
            {(parseFloat(result.totals.over25) * 100).toFixed(2)}%
          </p>
          <p>
            <strong>Under 2.5 goals:</strong>{" "}
            {(parseFloat(result.totals.under25) * 100).toFixed(2)}%
          </p>
          <p>
            <strong>BTTS:</strong> {(parseFloat(result.btts) * 100).toFixed(2)}%
          </p>

          <h2>Top Bet</h2>
          {(() => {
            const over = parseFloat(result.totals.over25);
            const under = parseFloat(result.totals.under25);
            const btts = parseFloat(result.btts);
            if (btts > 0.55) return <p>✅ Both teams to score — YES</p>;
            if (over > 0.55) return <p>✅ Over 2.5 goals</p>;
            if (under > 0.55) return <p>✅ Under 2.5 goals</p>;
            return <p>⚠️ No strong recommendation</p>;
          })()}
        </>
      )}
    </div>
  );
}

export default App;
