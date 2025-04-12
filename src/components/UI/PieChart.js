import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required elements
ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const PieChart = ({ stats }) => {
  const data = {
    labels: ['Locked', 'Unlocked'],
    datasets: [
      {
        data: [stats.locked, stats.unlocked],
        backgroundColor: ['#FF5733', '#33FF57'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows you to set specific height and width
  };

  return (
    <div style={{ width: '300px', height: '300px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
