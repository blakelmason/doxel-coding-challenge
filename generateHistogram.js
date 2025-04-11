const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
const fs = require("fs");

const width = 800;
const height = 600;
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

async function generateHistogram(words, outputPath) {
  const labels = words.map(([word]) => word);
  const data = words.map(([, count]) => count);

  const configuration = {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Top 25 Words",
          data,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: "Top 25 Most Common Words",
        },
      },
      scales: {
        x: { ticks: { autoSkip: false } },
        y: { beginAtZero: true },
      },
    },
  };

  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration);
  fs.writeFileSync(outputPath, buffer);
}

module.exports = { generateHistogram };
