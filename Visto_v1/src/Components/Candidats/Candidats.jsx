import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/Navbar';
import styles from '../Candidats/Candidats.module.css';
import InfiniteScrollList from '../InfiniteScrollList/InfiniteScrollList';
import SearchBar from '../Searchbar/SearchBar';
import add from '../../assets/add.png';
import axios from 'axios';
import {Link} from 'react-router-dom'

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


function Candidats() {
  const [searchTerm, setSearchTerm] = useState('');
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (searchTerm) {
          response = await axios.get(`http://localhost:8086/recruteurs/candidats/${searchTerm}`);
        } else {
          response = await axios.get(`http://localhost:8086/recruteurs/candidats`);
        }
        const data = response.data;
        setRows(data);

        if (data.length === 0) {
          setMessage('Aucun résultat trouvé');
        } else {
          setMessage('');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données des candidats :', error);
        setMessage('Erreur lors de la récupération des données.');
      }
    };

    fetchData();
  }, [searchTerm]);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <Link to="/AjoutCandidats"><button className={styles.btnscontainer}><img src={add} className={styles.add} alt="" />Ajouter Candidats</button>
        </Link>
        
        <div className={styles.searchbar}>
          <SearchBar placeholder="Chercher Candidats" handleSearch={handleSearch} />
        </div>
        <div className={styles.list}>
          <InfiniteScrollList data={rows} message={message} />
        </div>
      </div>
    </>
  );
}

export default Candidats;
