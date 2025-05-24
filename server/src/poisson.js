function poisson(lambda, k) {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

function factorial(n) {
  return n <= 1 ? 1 : n * factorial(n - 1);
}

function generateScoreProbabilities(avgGoalsA, avgGoalsB, maxGoals = 5) {
  const matrix = [];
  let BTTS = 0;
  let totalUnder25 = 0;
  let totalOver25 = 0;

  for (let goalsA = 0; goalsA <= maxGoals; goalsA++) {
    for (let goalsB = 0; goalsB <= maxGoals; goalsB++) {
      const prob = poisson(avgGoalsA, goalsA) * poisson(avgGoalsB, goalsB);
      matrix.push({
        score: `${goalsA}:${goalsB}`,
        probability: prob.toFixed(4),
      });

      if (goalsA + goalsB <= 2) totalUnder25 += prob;
      if (goalsA + goalsB > 2) totalOver25 += prob;
      if (goalsA > 0 && goalsB > 0) BTTS += prob;
    }
  }

  return {
    scores: matrix,
    totals: {
      over25: totalOver25.toFixed(4),
      under25: totalUnder25.toFixed(4),
    },
    btts: BTTS.toFixed(4),
  };
}

module.exports = { generateScoreProbabilities };
