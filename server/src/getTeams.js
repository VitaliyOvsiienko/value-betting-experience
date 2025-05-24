const axios = require("axios");

const API_KEY = "1c744924ebmshdfc60a2e57b75fcp19ee0djsnd42145bbef62";

async function getTeamsByLeague(leagueId) {
  try {
    const res = await axios.get(
      "https://api-football-v1.p.rapidapi.com/v3/teams",
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
        params: { league: leagueId, season: 2023 },
      }
    );

    return res.data.response.map((t) => ({
      id: t.team.id,
      name: t.team.name,
    }));
  } catch (error) {
    console.error("getTeams error:", error.message);
    return [];
  }
}

module.exports = { getTeamsByLeague };
