import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styles from './OffreEmploi.module.css';
import editbtn from '../../assets/edit.png';
import back from '../../assets/back.png';

function OffreEmploi() {
  const { id } = useParams(); 
  const [offre, setOffre] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    axios.get(`http://localhost:8086/recruteurs/offres/${id}`)
      .then(response => {
        setOffre(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des détails de l\'offre', error);
      });
  }, [id]);

  const handleEditClick = (field, value) => {
    setEditField(field);
    setEditedValue(value);
  };

  const handleInputChange = (e) => {
    setEditedValue(e.target.value);
  };

  const confirmEdit = (field) => {
    if (editField) {
      const updatedFieldData = {
        titre: field === 'titre' ? editedValue : offre.titre,
        description: field === 'description' ? editedValue : offre.description,
        niveauEtude: field === 'niveauEtude' ? editedValue : offre.niveauEtude,
        niveauExperience: field === 'niveauExperience' ? editedValue : offre.niveauExperience,
        contratPropose: field === 'contratPropose' ? editedValue : offre.contratPropose,
        competenceCles: field === 'competenceCles' ? editedValue : offre.competenceCles,
      };
      sendUpdatedFieldData(updatedFieldData);
      setEditField(null);
    }
  };

  const sendUpdatedFieldData = (updatedFieldData) => {
    axios.put(`http://localhost:8086/recruteurs/modifierOffre/${id}`, null, {
      params: updatedFieldData
    })
    .then(response => {
      console.log('Offre modifiée avec succès', response.data);
      setOffre(prevState => ({
        ...prevState,
        ...updatedFieldData,
      }));
    })
    .catch(error => {
      console.error('Erreur lors de la modification de l\'offre', error);
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        confirmEdit(editField);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editField]);

  if (!offre) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      <Link to='/postes'>
        <button className={styles.backbtn}>
          <img className={styles.backimg} src={back} alt="Back" />
        </button>
      </Link>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            {editField === 'titre' ? (
              <input
                type="text"
                value={editedValue}
                onChange={handleInputChange}
                onKeyPress={(e) => e.key === 'Enter' && confirmEdit('titre')}
                className={styles.editInput}
                ref={inputRef}
              />
            ) : (
              <h1 className={styles.title}>{offre.titre}</h1>
            )}
            <img
              src={editbtn}
              alt="Edit"
              className={styles.editIcon}
              onClick={() => handleEditClick('titre', offre.titre)}
            />
          </div>
          <p className={styles.date}>Date de création: {offre.dateCreation}</p>
          <hr className={styles.divider} />
        </div>
        <div className={styles.body}>
          {['description', 'niveauEtude', 'niveauExperience', 'contratPropose', 'competenceCles'].map((field) => (
            <div className={styles.attribute} key={field}>
              <strong className={styles.label}>{field.charAt(0).toUpperCase() + field.slice(1)}</strong>
              <div className={styles.valueContainer}>
                {editField === field ? (
                  <input
                    type="text"
                    value={editedValue}
                    onChange={handleInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && confirmEdit(field)}
                    className={styles.editInput}
                    ref={inputRef}
                  />
                ) : (
                  <span className={styles.value}>{offre[field]}</span>
                )}
                <img
                  src={editbtn}
                  alt="Edit"
                  className={styles.editIcon}
                  onClick={() => handleEditClick(field, offre[field])}
                />
              </div>
            </div>
          ))}
          {offre.recruteur && (
            <div className={styles.attribute}>
              <strong className={styles.label}>Recruteur</strong>
              <div className={styles.valueContainer}>
                <span className={styles.value}>
                  {offre.recruteur.nom} {offre.recruteur.prenom}
                </span>
              </div>
            </div>
          )}
          {offre.candidats && (
            <div className={styles.attribute}>
              <strong className={styles.label}>Candidats</strong>
              <div className={styles.valueContainer}>
                <span className={styles.value}>{offre.candidats.length} candidat(s)</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default OffreEmploi;
