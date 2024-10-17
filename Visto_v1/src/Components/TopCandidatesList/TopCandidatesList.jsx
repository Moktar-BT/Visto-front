import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TopCandidatesList.module.css';
import openeye from '../../assets/openeye.png';
import more from '../../assets/more-than.png'
import { Link } from 'react-router-dom';
const TopCandidatesList = () => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get('http://localhost:8086/recruteurs/TopCandidats');
        setCandidates(response.data);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <>
      <div className={styles.container}>
        <h2>Top Candidats : Les Plus Compétents</h2>
        {candidates.map(candidate => (
          <div key={candidate.id} className={styles.candidateItem}>
            <img 
              src={`http://localhost:8086/images/${candidate.img}`} 
              alt={`Profil de ${candidate.nom} ${candidate.prenom}`} 
              className={styles.candidateImage} 
            />
            <div className={styles.candidateInfo}>
              <div>{candidate.nom} {candidate.prenom}</div>
              <div>{candidate.experience} années</div>
              <a 
                href={`http://localhost:8086/cv/${candidate.cv}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <img 
                  src={openeye} 
                  alt="Voir CV" 
                  className={styles.eyeIcon} 
                />
              </a>
            </div>
          </div>  
        ))}
      </div>
     <Link to='/candidats'><button className={styles.viewAllButton}>Voir tous <img src={more} className={styles.more} alt="" /></button></Link> 
    </>
  );
};

export default TopCandidatesList;
