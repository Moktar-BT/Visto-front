import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AddEntretienModal.module.css';

function AddEntretienModal({ onClose, onSave }) {
  const [date, setDate] = useState('');
  const [selectedPoste, setSelectedPoste] = useState('');
  const [selectedCandidat, setSelectedCandidat] = useState('');
  const [postes, setPostes] = useState([]);
  const [candidats, setCandidats] = useState([]);

  useEffect(() => {
    // Fetch postes
    axios.get('http://localhost:8086/recruteurs/offres')
      .then(response => {
        setPostes(response.data);
      })
      .catch(error => {
        console.error('Error fetching postes:', error);
      });

    // Fetch candidats
    axios.get('http://localhost:8086/recruteurs/candidats')
      .then(response => {
        setCandidats(response.data);
      })
      .catch(error => {
        console.error('Error fetching candidats:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the backend API to create a new Entretien
    axios.post(`http://localhost:8086/recruteurs/creeEntretien/${date}/${selectedCandidat}/${selectedPoste}`)
      .then(response => {
        onSave(response.data); // Handle the newly created entretien
        onClose(); // Close the modal
      })
      .catch(error => {
        console.error('Error creating entretien:', error);
      });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>Ajouter Entretien</div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <label>Poste:</label>
            <select
              value={selectedPoste}
              onChange={(e) => setSelectedPoste(e.target.value)}
              required
            >
              <option value="">Sélectionnez un poste</option>
              {postes.map(poste => (
                <option key={poste.id} value={poste.id}>{poste.titre}</option>
              ))}
            </select>
            <label>Candidat:</label>
            <select
              value={selectedCandidat}
              onChange={(e) => setSelectedCandidat(e.target.value)}
              required
            >
              <option value="">Sélectionnez un candidat</option>
              {candidats.map(candidat => (
                <option key={candidat.id} value={candidat.id}>{candidat.nom} {candidat.prenom}</option>
              ))}
            </select>
          </div>
          <div className={styles.modalFooter}>
            <button type="submit" className={styles.modalButton}>Enregistrer</button>
            <button type="button" className={styles.modalButton} onClick={onClose}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddEntretienModal;
