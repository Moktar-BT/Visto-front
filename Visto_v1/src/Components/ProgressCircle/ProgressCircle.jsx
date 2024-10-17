import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import styles from './ProgressCircle.module.css';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, ArcElement);

const ProgressCircle = ({ malePercentage, femalePercentage }) => {
  const data = {
    labels: ['Hommes', 'Femmes'],
    datasets: [
      {
        data: [malePercentage, femalePercentage],
        backgroundColor: ['rgb(90, 163, 242)', '#F5A9B8'], // Bleu doux pour les hommes et rose doux pour les femmes
        borderWidth: 0, // Pas de bordure autour des sections
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const label = tooltipItem.label || '';
            const value = tooltipItem.raw;
            return `${label}: ${value}%`;
          },
        },
      },
    },
  };

  return (
    <div className={styles.progressCircleContainer}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default ProgressCircle;
