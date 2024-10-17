import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import styles from './Dashboard.module.css';
import candidat from '../../assets/user.png';
import postes from '../../assets/briefcase (1).png';
import entretien from '../../assets/interview.png';
import TopCandidatesList from '../TopCandidatesList/TopCandidatesList';

// Register Chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement);

const Dashboard = () => {
  const [chartData, setChartData] = useState({});
  const [lineChartData, setLineChartData] = useState({});
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalInterviews, setTotalInterviews] = useState(0);

  // Function to get JWT token from localStorage
  const getToken = () => {
    return localStorage.getItem('token'); // Assurez-vous que le token est stocké sous la clé 'token'
  };

  // Set up Axios interceptors to include the token in the headers
  axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch candidats par technologie
        const candidatsResponse = await axios.get('http://localhost:8086/recruteurs/candidatsParTechnologie');
        const candidatsParTechnologie = candidatsResponse.data;

        // Fetch nombre de candidats
        const candidatsCountResponse = await axios.post('http://localhost:8086/recruteurs/nombreDeCandidats');
        setTotalCandidates(candidatsCountResponse.data);

        // Fetch nombre de postes
        const postesCountResponse = await axios.post('http://localhost:8086/recruteurs/nombreDePostes');
        setTotalJobs(postesCountResponse.data);

        // Fetch nombre d'entretiens
        const entretiensCountResponse = await axios.post('http://localhost:8086/recruteurs/nombreD\'entretien');
        setTotalInterviews(entretiensCountResponse.data);

        // Fetch candidats par expérience
        const experienceResponse = await axios.get('http://localhost:8086/recruteurs/nbrCandidatParExperience');
        const candidatsParExperience = experienceResponse.data;

        // Order of technologies
        const technologyOrder = ["React", "Angular", "SpringBoot", "NestJS", "Node.js", "C#", "C++", "Flutter", "MongoDB", "MySQL", "Ruby on Rails", "Autre"];

        // Prepare chart data according to the fixed order
        const sortedTechnologies = technologyOrder.map(tech => ({
          label: tech,
          value: candidatsParTechnologie[tech] || 0,
        }));

        setChartData({
          labels: sortedTechnologies.map(t => t.label),
          datasets: [
            {
              label: 'Nombre de candidats',
              data: sortedTechnologies.map(t => t.value),
              backgroundColor: 'rgb(90, 163, 242)',
              barThickness: 10,
            },
          ],
        });

        // Prepare data for the line chart
        const yearsOfExperience = Array.from({ length: 11 }, (_, i) => i); // 0 to 10+ years
        const candidatesCountByExperience = yearsOfExperience.map(year => candidatsParExperience[year] || 0);

        setLineChartData({
          labels: yearsOfExperience,
          datasets: [
            {
              label: 'Nombre de candidats par années d\'expérience',
              data: candidatesCountByExperience,
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);
  
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.leftContainer}>
          <div className={styles.statContainer}>
            <img src={candidat} alt="Candidat" className={styles.icon} />
            <h3>Nombre de candidats</h3>
            <p>{totalCandidates}</p>
          </div>
          <div className={styles.statContainer}>
            <img src={postes} alt="Postes" className={styles.icon} />
            <h3>Nombre de postes</h3>
            <p>{totalJobs}</p>
          </div>
          <div className={styles.statContainer}>
            <img src={entretien} alt="Entretien" className={styles.icon} />
            <h3>Nombre d'entretien</h3>
            <p>{totalInterviews}</p>
          </div>
        </div>
        <div className={styles.rightContainer}>
          {chartData.labels && chartData.labels.length > 0 && <Bar data={chartData} />}
        </div>
        <div className={styles.fullWidthContainer}>
          {lineChartData.labels && lineChartData.labels.length > 0 && <Line data={lineChartData} />}
        </div>
        <div className={styles.fullWidthContainer1}><TopCandidatesList /></div>
      </div>
    </>
  );
};

export default Dashboard;
