require("dotenv").config();
const express = require("express");
const { fetchOdds } = require("./src/getOdds.js");

const app = express();
const PORT = process.env.PORT || 5050;

const cors = require("cors");
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/odds", async (req, res) => {
  console.log("Fetching raw odds...");
  const rawOdds = await fetchOdds();

  if (!rawOdds) {
    return res.status(500).json({ error: "Failed to fetch odds" });
  }

  const result = [];

  for (const match of rawOdds) {
    const homeTeam = match.home_team;
    const awayTeam = match.away_team;
    const league = match.sport_title;
    const bookmakers = match.bookmakers || [];

    for (const bookmaker of bookmakers) {
      const h2h = bookmaker.markets.find((m) => m.key === "h2h");
      if (!h2h || !h2h.outcomes) continue;

      for (const outcome of h2h.outcomes) {
        const probability = Math.random() * 0.3 + 0.35;
        const value = probability * outcome.price - 1;

        result.push({
          match: `${homeTeam} vs ${awayTeam}`,
          league,
          bookmaker: bookmaker.title,
          bet: outcome.name,
          odds: outcome.price,
          probability: probability.toFixed(2),
          value: value.toFixed(2),
        });
      }
    }
  }

  res.json(result);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
