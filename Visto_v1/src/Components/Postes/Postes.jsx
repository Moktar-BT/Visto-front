import React, { useEffect, useState } from 'react';
import { SimpleGrid, Card, CardHeader, Heading, CardBody, Text, CardFooter, Button } from '@chakra-ui/react';
import axios from 'axios';
import Navbar from '../navbar/Navbar';
import styles from './Postes.module.css';
import remove from '../../assets/remove.png';
import edit from '../../assets/edit.png';
import add from '../../assets/add-post.png';
import eye from '../../assets/openeye.png';
import {Link} from 'react-router-dom'


function Postes() {
  const [offresEmploi, setOffresEmploi] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editOffre, setEditOffre] = useState({
    id: '',
    titre: '',
    description: '',
    niveauEtude: '',
    niveauExperience: '',
    contratPropose: '',
    competenceCles: '',
    dateCreation: ''
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newOffre, setNewOffre] = useState({
    titre: '',
    description: '',
    niveauEtude: '',
    niveauExperience: '',
    contratPropose: '',
    competenceCles: '',
    dateCreation: ''
  });

  useEffect(() => {
    axios.get('http://localhost:8086/recruteurs/offres')
      .then(response => {
        const formattedData = response.data.map(offre => ({
          ...offre,
          dateCreation: new Date(offre.dateCreation).toISOString().split('T')[0] // Format the date as YYYY-MM-DD
        }));
        setOffresEmploi(formattedData);
      })
      .catch(error => {
        console.error('There was an error fetching the job offers!', error);
      });
  }, []);

  const truncateDescription = (description, maxLength = 200) => {
    if (description.length > maxLength) {
      return `${description.substring(0, maxLength)}...`;
    }
    return description;
  };

  const handleDeleteClick = (offre) => {
    setSelectedOffre(offre);
    setShowModal(true);
  };

  const handleEditClick = (offre) => {
    setSelectedOffre(offre);
    setEditOffre({
      id: offre.id,
      titre: offre.titre,
      description: offre.description,
      niveauEtude: offre.niveauEtude,
      niveauExperience: offre.niveauExperience,
      contratPropose: offre.contratPropose,
      competenceCles: offre.competenceCles,
      dateCreation: offre.dateCreation
    });
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleEditModalSubmit = (event) => {
    event.preventDefault();
    if (validateForm(editOffre)) {
      axios.put(`http://localhost:8086/recruteurs/offres/${editOffre.id}`, editOffre)
        .then(response => {
          const updatedOffresEmploi = offresEmploi.map(offre => {
            if (offre.id === response.data.id) {
              return response.data;
            }
            return offre;
          });
          setOffresEmploi(updatedOffresEmploi);
          setEditModalOpen(false);
          setSelectedOffre(null);
        })
        .catch(error => {
          console.error('There was an error updating the job offer!', error);
        });
    } else {
      console.error('Form validation failed.');
    }
  };

  const confirmDelete = () => {
    axios.delete(`http://localhost:8086/recruteurs/offres/${selectedOffre.id}`)
      .then(() => {
        setOffresEmploi(offresEmploi.filter(offre => offre.id !== selectedOffre.id));
        setShowModal(false);
        setSelectedOffre(null);
      })
      .catch(error => {
        console.error('There was an error deleting the job offer!', error);
      });
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setAddModalOpen(false);
  };

  const handleAddModalSubmit = (event) => {
    event.preventDefault();
    const newOffreWithDate = {
      ...newOffre,
      dateCreation: new Date().toISOString().split('T')[0] // Set current date if it's not already set
    };
    if (validateForm(newOffreWithDate)) {
      axios.post('http://localhost:8086/recruteurs/creeoffre', newOffreWithDate)
        .then(response => {
          setOffresEmploi([...offresEmploi, response.data]);
          setAddModalOpen(false);
          setNewOffre({
            titre: '',
            description: '',
            niveauEtude: '',
            niveauExperience: '',
            contratPropose: '',
            competenceCles: '',
            dateCreation: ''
          });
        })
        .catch(error => {
          console.error('There was an error creating the job offer!', error);
        });
    } else {
      console.error('Form validation failed.');
    }
  };
  
  const validateForm = (form) => {
    const { dateCreation, ...rest } = form; // Exclude dateCreation from validation if it should be set automatically
    return Object.values(rest).every(value => value.trim() !== '');
  };
  
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <SimpleGrid spacing={4} templateColumns="repeat(3, 1fr)">
          <Card className={`${styles.card} ${styles.addCard}`}>
            <CardBody className={styles.cardBody}>
              <Button className={styles.addButton} onClick={handleAddClick}>
                <img src={add} alt="Ajouter" className={styles.icon} />
              </Button>
            </CardBody>
          </Card>
          {offresEmploi.map((offre) => (
            <Card key={offre.id} className={styles.card}>
              <CardHeader className={styles.cardHeader}>
                <Heading size="md">{offre.titre}</Heading>
              </CardHeader>
              <CardBody className={styles.cardBody}>
                <Text className={styles.des}>{truncateDescription(offre.description)}</Text>
                <Text><strong>Niveau d'étude:</strong> {offre.niveauEtude}</Text>
                <Text><strong>Expérience:</strong> {offre.niveauExperience} </Text>
                <Text><strong>Contrat proposé:</strong> {offre.contratPropose}</Text>
                <Text><strong>Compétences clés:</strong> {offre.competenceCles}</Text>
                <Text><strong>Date de création:</strong> {offre.dateCreation}</Text>
              </CardBody>
              <CardFooter className={styles.cardFooter}>
  <Link to={`/OffreEmploi/${offre.id}`}>
    <Button className={styles.button}>
      <img src={eye} className={styles.icon} alt="" />
    </Button>
  </Link>
  <Button className={styles.button} onClick={() => handleEditClick(offre)}>
    <img src={edit} alt="Modifier" className={styles.icon} />
  </Button>
  <Button className={styles.button} onClick={() => handleDeleteClick(offre)}>
    <img src={remove} alt="Supprimer" className={styles.icon} />
  </Button>
</CardFooter>

            </Card>
          ))}
        </SimpleGrid>
      </div>
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>Confirmation</div>
            <div className={styles.modalBody}>Voulez-vous vraiment supprimer cette offre d'emploi?</div>
            <div className={styles.modalFooter}>
              <button className={`${styles.modalButton} ${styles.confirmButton}`} onClick={confirmDelete}>Oui</button>
              <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={() => setShowModal(false)}>Non</button>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>Modifier l'offre d'emploi</div>
            <form onSubmit={handleEditModalSubmit}>
              <div className={styles.modalBody}>
                <input
                  type="text"
                  value={editOffre.titre}
                  onChange={(e) => setEditOffre({ ...editOffre, titre: e.target.value })}
                  placeholder="Titre"
                  required
                />
                <textarea
                  className={styles.description}
                  value={editOffre.description}
                  onChange={(e) => setEditOffre({ ...editOffre, description: e.target.value })}
                  placeholder="Description"
                  required
                />
                <input
                  type="text"
                  value={editOffre.niveauEtude}
                  onChange={(e) => setEditOffre({ ...editOffre, niveauEtude: e.target.value })}
                  placeholder="Niveau d'étude"
                  required
                />
                <input
                  type="text"
                  value={editOffre.niveauExperience}
                  onChange={(e) => setEditOffre({ ...editOffre, niveauExperience: e.target.value })}
                  placeholder="Expérience"
                  required
                />
                <input
                  type="text"
                  value={editOffre.contratPropose}
                  onChange={(e) => setEditOffre({ ...editOffre, contratPropose: e.target.value })}
                  placeholder="Contrat proposé"
                  required
                />
                <input
                  type="text"
                  value={editOffre.competenceCles}
                  onChange={(e) => setEditOffre({ ...editOffre, competenceCles: e.target.value })}
                  placeholder="Compétences clés"
                  required
                />
              </div>
              <div className={styles.modalFooter}>
                <button className={`${styles.modalButton} ${styles.saveButton}`} type="submit">Enregistrer</button>
                <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={handleEditModalClose}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {addModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>Ajouter une offre d'emploi</div>
            <form onSubmit={handleAddModalSubmit}>
              <div className={styles.modalBody}>
                <input
                  type="text"
                  value={newOffre.titre}
                  onChange={(e) => setNewOffre({ ...newOffre, titre: e.target.value })}
                  placeholder="Titre"
                  required
                />
                <textarea
                  className={styles.description}
                  value={newOffre.description}
                  onChange={(e) => setNewOffre({ ...newOffre, description: e.target.value })}
                  placeholder="Description"
                  required
                />
                <input
                  type="text"
                  value={newOffre.niveauEtude}
                  onChange={(e) => setNewOffre({ ...newOffre, niveauEtude: e.target.value })}
                  placeholder="Niveau d'étude"
                  required
                />
                <input
                  type="text"
                  value={newOffre.niveauExperience}
                  onChange={(e) => setNewOffre({ ...newOffre, niveauExperience: e.target.value })}
                  placeholder="Expérience"
                  required
                />
                <input
                  type="text"
                  value={newOffre.contratPropose}
                  onChange={(e) => setNewOffre({ ...newOffre, contratPropose: e.target.value })}
                  placeholder="Contrat proposé"
                  required
                />
                <input
                  type="text"
                  value={newOffre.competenceCles}
                  onChange={(e) => setNewOffre({ ...newOffre, competenceCles: e.target.value })}
                  placeholder="Compétences clés"
                  required
                />
              
              </div>
              <div className={styles.modalFooter}>
                <button className={`${styles.modalButton} ${styles.saveButton}`} type="submit">Ajouter</button>
                <button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={handleAddModalClose}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Postes;
