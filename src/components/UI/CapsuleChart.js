import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CapsulesChart({ chartData }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Capsules Status Distribution",
      },
    },
  };

  return (
    <div className="w-[400px] h-[300px] flex justify-center items-center mx-auto">
      <Bar data={chartData} options={options} />
    </div>
  );
}
