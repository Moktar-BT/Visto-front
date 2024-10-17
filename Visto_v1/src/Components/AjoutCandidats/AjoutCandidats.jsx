import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import openeye from '../../assets/openeye.png';
import Navbar from '../navbar/Navbar';
import back from '../../assets/back.png';
import all from '../../assets/all (1).png';
import add from '../../assets/add-post.png';
import ajouter from '../../assets/add.png';
import styles from './AjoutCandidats.module.css';

const BODY_CELL_HEIGHT = 40;
const HEADER_CELL_HEIGHT = 45;

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(216, 234, 255)',
    color: theme.palette.common.black,
    height: HEADER_CELL_HEIGHT,
    padding: '4px 16px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    height: BODY_CELL_HEIGHT,
    padding: '4px 16px',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  height: BODY_CELL_HEIGHT,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 700,
  overflowY: 'auto',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.45)',
}));

const CircularImage = styled('img')({
  width: 45,
  height: 45,
  borderRadius: '50%',
});

const EyeImage = styled('img')({
  width: 22,
  height: 22,
  cursor: 'pointer',
});

function AjoutCandidats() {
  const navigate = useNavigate();
  const [candidats, setCandidats] = useState([]);
  const [message, setMessage] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [selectedCandidatId, setSelectedCandidatId] = useState(null);
  const [openAllModal, setOpenAllModal] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:8085/recruteurs/ajouterCandidat');
      setCandidats(response.data);
      if (response.data.length === 0) {
        setMessage('Aucun candidat à afficher.');
      } else {
        setMessage('');
      }
    } catch (error) {
      setMessage('Échec de la récupération des candidats.');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:8085/recruteurs/candidats/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          setMessage('Fichier téléchargé avec succès.');
          await fetchCandidates();
        } else {
          setMessage('Échec du téléchargement du fichier.');
        }
      } catch (error) {
        setMessage(`Échec du téléchargement du fichier : ${error.response ? error.response.data.message : error.message}`);
      }
    }
  };

  const handleViewAllClick = () => {
    setOpenAllModal(true);
  };

  const confirmViewAllCandidats = async () => {
    try {
      const response = await axios.post('http://localhost:8085/recruteurs/ajouterTous');
      setMessage('Tous les candidats ont été ajoutés avec succès.');
      await fetchCandidates();
      navigate('/candidats');
    } catch (error) {
      setMessage('Échec de l’ajout de tous les candidats. Veuillez réessayer.');
    } finally {
      setOpenAllModal(false);
    }
  };

  const handleAddClick = (id) => {
    setSelectedCandidatId(id);
    setOpenModal(true);
  };

  const confirmAddCandidat = async () => {
    try {
      await axios.post(`http://localhost:8085/recruteurs/ajouterUn/${selectedCandidatId}`);
      setMessage('Candidat ajouté avec succès.');
      await fetchCandidates();
    } catch (error) {
      setMessage('Échec de l’ajout du candidat. Veuillez réessayer.');
    } finally {
      setOpenModal(false);
    }
  };

  const sortedCandidats = candidats.sort((a, b) => a.nom.localeCompare(b.nom));

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <Link to="/candidats">
          <button className={styles.btn1}><img className={styles.back} src={back} alt="Back" /></button>
        </Link>
        <input
          type="file"
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
          id="file-upload"
          onChange={handleFileUpload}
        />
        <label htmlFor="file-upload">
          <button
            className={styles.btnscontainer}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <img src={add} className={styles.add} alt="Add" />Importer un fichier
          </button>
        </label>
        <StyledTableContainer component={Paper}>
          <Table stickyHeader aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell>Nom</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Âge</StyledTableCell>
                <StyledTableCell>Compétence</StyledTableCell>
                <StyledTableCell>Expérience</StyledTableCell>
                <StyledTableCell>Région</StyledTableCell>
                <StyledTableCell align="center">Voir CV</StyledTableCell>
                <StyledTableCell align="center">
                  <button className={styles.btn2} onClick={handleViewAllClick}>
                    <img className={styles.all} src={all} alt="View All" />
                  </button>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {message && (
                <TableRow>
                  <StyledTableCell colSpan={9} align="center">
                    {message}
                  </StyledTableCell>
                </TableRow>
              )}
              {sortedCandidats.map((candidat) => (
                <StyledTableRow key={candidat.id}>
                  <StyledTableCell>
                    {candidat.img ? (
                      <CircularImage src={`http://localhost:8085/images/${candidat.img}`} alt={`${candidat.nom}'s image`} />
                    ) : (
                      <CircularImage src={openeye} alt="No Image" />
                    )}
                  </StyledTableCell>
                  <StyledTableCell>{candidat.nom} {candidat.prenom}</StyledTableCell>
                  <StyledTableCell>{candidat.email}</StyledTableCell>
                  <StyledTableCell>{candidat.age}</StyledTableCell>
                  <StyledTableCell>{candidat.competences.join(', ')}</StyledTableCell>
                  <StyledTableCell>{candidat.experience}</StyledTableCell>
                  <StyledTableCell>{candidat.region}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Link to={`http://localhost:8085/cv/${candidat.cv}`} target="_blank">
                      <EyeImage src={openeye} alt="View CV" />
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <button
                      className={styles.btn2}
                      onClick={() => handleAddClick(candidat.id)}
                    >
                      <img className={styles.ajouter} src={ajouter} alt="Add" />
                    </button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
  <DialogTitle>Confirmation</DialogTitle>
  <DialogContent>
    Êtes-vous sûr de vouloir ajouter ce candidat ?
  </DialogContent>
  <DialogActions>
    <Button
      style={{ 
        backgroundColor: '#4CAF50', 
        color: 'white', 
        border: 'none', 
        padding: '6px 8px', 
        borderRadius: '4px',
        textTransform: 'capitalize' // Capitalizes the first letter of each word
      }}
      onClick={confirmAddCandidat}
    >
      Confirmer
    </Button>
    <Button
      style={{ 
        backgroundColor: '#ccc', 
        color: '#333', 
        border: 'none', 
        padding: '6px 8px', 
        borderRadius: '4px',
        textTransform: 'capitalize' // Capitalizes the first letter of each word
      }}
      onClick={() => setOpenModal(false)}
    >
      Annuler
    </Button>
  </DialogActions>
</Dialog>

{/* Confirmation Modal for View All */}
<Dialog open={openAllModal} onClose={() => setOpenAllModal(false)}>
  <DialogTitle>Confirmation</DialogTitle>
  <DialogContent>
    Êtes-vous sûr de vouloir ajouter tous les candidats ?
  </DialogContent>
  <DialogActions>
    <Button
      style={{ 
        backgroundColor: '#4CAF50', 
        color: 'white', 
        border: 'none', 
        padding: '6px 8px', 
        borderRadius: '4px',
        textTransform: 'capitalize' // Capitalizes the first letter of each word
      }}
      onClick={confirmViewAllCandidats}
    >
      Confirmer
    </Button>
    <Button
      style={{ 
        backgroundColor: '#ccc', 
        color: '#333', 
        border: 'none', 
        padding: '6px 8px', 
        borderRadius: '4px',
        textTransform: 'capitalize' // Capitalizes the first letter of each word
      }}
      onClick={() => setOpenAllModal(false)}
    >
      Annuler
    </Button>
  </DialogActions>
</Dialog>
      </div>
    </>
  );
}

export default AjoutCandidats;
