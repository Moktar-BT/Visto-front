import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import styles from '../Entretien/Entretien.module.css';
import EntretienList from '../EntretienLIst/EntretienList';

import add from '../../assets/add.png';
import AddEntretienModal from '../AddEntretienModal/AddEntretienModal'; // Import the modal component

function Entretien() {
  const [sortedRows, setSortedRows] = useState([]);
  const [message, setMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false); // State to handle modal visibility

  useEffect(() => {
    fetchEntretienData(); // Fetch data on component mount
  }, []);

  const fetchEntretienData = () => {
    axios.get('http://localhost:8086/recruteurs/Entretiens')
      .then(response => {
        setSortedRows(response.data);
      })
      .catch(error => {
        setMessage('Failed to fetch data');
      });
  };

  const handleAddEntretien = () => {
    fetchEntretienData(); // Re-fetch the data after adding a new entretien
    setShowAddModal(false); // Close the modal
  };

  return (
    <>
      <Navbar />
    
      <div className={styles.container}>
      <div className={styles.padding}>
      <button className={styles.btnscontainer} onClick={() => setShowAddModal(true)}>
          <img src={add} className={styles.add} alt="" />Ajouter Entretien
        </button>
        <div className={styles.entretienList}>
          <EntretienList message={message} sortedRows={sortedRows} />
        </div>
      </div>
      </div>
      
      {showAddModal && (
        <AddEntretienModal 
          onClose={() => setShowAddModal(false)} 
          onSave={handleAddEntretien}
        />
      )}
    </>
  );
}

export default Entretien;
