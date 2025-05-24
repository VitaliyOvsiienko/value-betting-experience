const axios = require("axios");

const API_KEY = "1c744924ebmshdfc60a2e57b75fcp19ee0djsnd42145bbef62";

async function getLeagues() {
  try {
    const res = await axios.get(
      "https://api-football-v1.p.rapidapi.com/v3/leagues",
      {
        headers: {
          "X-RapidAPI-Key": API_KEY,
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
        params: {
          current: true,
        },
      }
    );

    const leagues = res.data.response
      .filter((l) => l.seasons.some((s) => s.current))
      .map((l) => ({
        id: l.league.id,
        name: `${l.league.name} (${l.country.name})`,
        country: l.country.name,
      }));

    return leagues;
  } catch (error) {
    console.error("getLeagues error:", error.message);
    return [];
  }
}

module.exports = { getLeagues };
