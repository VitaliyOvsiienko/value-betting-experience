console.log(">>> THIS IS THE REAL INDEX.JS FILE");

const { getLeagues } = require("./src/getLeagues");
const { getTeamsByLeague } = require("./src/getTeams");

const { getTeamAvgGoals } = require("./src/getTeamStats");

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

app.get("/api/test-poisson", (req, res) => {
  res.send("Poisson test route works");
});

const { generateScoreProbabilities } = require("./src/poisson");

app.get("/api/poisson", (req, res) => {
  const avgA = parseFloat(req.query.avgA);
  const avgB = parseFloat(req.query.avgB);

  if (isNaN(avgA) || isNaN(avgB)) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const result = generateScoreProbabilities(avgA, avgB);
  res.json(result);
});

app.get("/api/stats", async (req, res) => {
  const team = req.query.team;
  if (!team) return res.status(400).json({ error: "No team name provided" });

  const avg = await getTeamAvgGoals(team);
  if (!avg)
    return res.status(500).json({ error: "Could not fetch team stats" });

  res.json({ team, avg });
});

app.get("/api/leagues", async (req, res) => {
  const leagues = await getLeagues();
  res.json(leagues);
});

app.get("/api/teams", async (req, res) => {
  const leagueId = req.query.league;
  if (!leagueId) return res.status(400).json({ error: "League ID required" });

  const teams = await getTeamsByLeague(leagueId);
  res.json(teams);
}); // ← закриваємо .get()

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
