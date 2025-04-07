import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ stats }) => {
  const data = {
    labels: ["Locked", "Unlocked"],
    datasets: [
      {
        data: [stats.locked, stats.unlocked],
        backgroundColor: ["#FF9999", "#66B3FF"],
      },
    ],
  };

  return <Pie data={data} />;
};

export default PieChart;
