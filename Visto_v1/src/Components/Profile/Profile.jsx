import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import styles from './Profile.module.css';
import editbtn from '../../assets/edit.png';
import axios from 'axios';

function Profile() {
  const [isEditing, setIsEditing] = useState({
    nom: false,
    prenom: false,
    email: false
  });

  const [recruteur, setRecruteur] = useState({
    nom: '',
    prenom: '',
    email: '',
    image: '',
    offreEmplois: [],
    entretiens: []
  });

  const fetchRecruteurData = async () => {
    try {
      const profileResponse = await axios.get('http://localhost:8086/recruteurs/profile');
      const profileData = profileResponse.data;
      const imageUrl = `http://localhost:8086/images/${profileData.image}`;

      const offreResponse = await axios.get('http://localhost:8086/recruteurs/offreProfile');
      const offreData = offreResponse.data;

      if (profileData && offreData) {
        setRecruteur({
          ...profileData,
          image: imageUrl,
          offreEmplois: offreData || [],
          entretiens: recruteur.entretiens
        });
      }
    } catch (error) {
      console.error("Error fetching recruiter data:", error);
    }
  };

  const fetchEntretienData = async () => {
    try {
      const response = await axios.get('http://localhost:8086/recruteurs/entretienProfile');
      const data = response.data;

      if (data) {
        setRecruteur(prevState => ({
          ...prevState,
          entretiens: data.map(entretien => ({
            id: entretien.id,
            candidatNomPrenom: entretien.candidatNomPrenom,
            recruteurNomPrenom: entretien.recruteurNomPrenom,
            offreEmploiTitre: entretien.offreEmploiTitre,
            candidatImg: entretien.candidatImg,
            recruteurImg: entretien.recruteurImg,
            dateEntretien: entretien.dateEntretien
          }))
        }));
      }
    } catch (error) {
      console.error("Error fetching entretien data:", error);
    }
  };

  useEffect(() => {
    fetchRecruteurData();
    fetchEntretienData();
  }, []);

  const handleEditClick = (field) => {
    setIsEditing({
      ...isEditing,
      [field]: !isEditing[field]
    });
    if (isEditing[field]) {
      updateNomPrenom();
    }
  };

  const handleInputChange = (e, field) => {
    setRecruteur({
      ...recruteur,
      [field]: e.target.value
    });
  };

  const handleKeyDown = (e, field) => {
    if (e.key === 'Enter') {
      handleEditClick(field);
    }
  };

  const updateNomPrenom = async () => {
    try {
      await axios.post('http://localhost:8086/recruteurs/modifierNomPrenom', null, {
        params: {
          nom: recruteur.nom,
          prenom: recruteur.prenom
        }
      });
      console.log('Nom and Prénom updated successfully');
    } catch (error) {
      console.error("Error updating Nom and Prénom:", error);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.container1}>
          <h1 className={styles.header}>Profile</h1>
          <div className={styles.profileTop}>
            <img src={recruteur.image} alt="Profile" className={styles.profileImage} />
            <div className={styles.profileDetailsRight}>
              <div className={styles.profileDetail}>
                <label>Nom:</label>
                {isEditing.nom ? (
                  <>
                    <input
                      type="text"
                      value={recruteur.nom}
                      onChange={(e) => handleInputChange(e, 'nom')}
                      onKeyDown={(e) => handleKeyDown(e, 'nom')}
                      onBlur={() => handleEditClick('nom')}
                    />
                    <img
                      src={editbtn}
                      alt="Save"
                      onClick={() => handleEditClick('nom')}
                      className={styles.editButton}
                    />
                  </>
                ) : (
                  <>
                    <span>{recruteur.nom}</span>
                    <img
                      src={editbtn}
                      alt="Edit"
                      onClick={() => handleEditClick('nom')}
                      className={styles.editButton}
                    />
                  </>
                )}
              </div>
              <div className={styles.profileDetail}>
                <label>Prénom:</label>
                {isEditing.prenom ? (
                  <>
                    <input
                      type="text"
                      value={recruteur.prenom}
                      onChange={(e) => handleInputChange(e, 'prenom')}
                      onKeyDown={(e) => handleKeyDown(e, 'prenom')}
                      onBlur={() => handleEditClick('prenom')}
                    />
                    <img
                      src={editbtn}
                      alt="Save"
                      onClick={() => handleEditClick('prenom')}
                      className={styles.editButton}
                    />
                  </>
                ) : (
                  <>
                    <span>{recruteur.prenom}</span>
                    <img
                      src={editbtn}
                      alt="Edit"
                      onClick={() => handleEditClick('prenom')}
                      className={styles.editButton}
                    />
                  </>
                )}
              </div>
              <div className={styles.profileDetail}>
                <label>Email: </label>
                <span>{recruteur.email}</span>
              </div>
            </div>
          </div>
          <h2 className={styles.subHeader}>Offres d'emploi</h2>
          <div className={styles.offreList}>
            {recruteur.offreEmplois.map((offre, index) => (
              <div key={index} className={styles.offreDetail}>
                <h3>{offre.titre}</h3>
                <p>{truncateText(offre.description, 250)}</p>
                <p><strong>Niveau d'étude:</strong> {offre.niveauEtude}</p>
                <p><strong>Niveau d'expérience:</strong> {offre.niveauExperience}</p>
                <p><strong>Contrat proposé:</strong> {offre.contratPropose}</p>
                <p><strong>Compétences clés:</strong> {offre.competenceCles}</p>
                <p><strong>Date de création:</strong> {offre.dateCreation}</p>
              </div>
            ))}
          </div>
          <h2 className={styles.subHeader}>Entretiens</h2>
          <div className={styles.entretienList}>
            {recruteur.entretiens.map((entretien, index) => (
              <div key={index} className={styles.entretienDetail}>
                <img src={`http://localhost:8086/images/${entretien.candidatImg}`} alt="Candidat" className={styles.entretienImage} />
                <p><strong>{entretien.dateEntretien}</strong> - {entretien.candidatNomPrenom} (Candidat)</p>
                <p><strong>Offre d'emploi:</strong> {entretien.offreEmploiTitre}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
