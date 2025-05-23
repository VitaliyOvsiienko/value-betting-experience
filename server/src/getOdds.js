require("dotenv").config();
const axios = require("axios");

const API_KEY = process.env.ODDS_API_KEY;
const SPORT = "soccer_epl";

const fetchOdds = async () => {
  try {
    const response = await axios.get(
      `https://api.the-odds-api.com/v4/sports/${SPORT}/odds`,
      {
        params: {
          regions: "eu",
          markets: "h2h",
          oddsFormat: "decimal",
          apiKey: API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API error:", error.response?.data || error.message);
    return null;
  }
};

module.exports = { fetchOdds };
