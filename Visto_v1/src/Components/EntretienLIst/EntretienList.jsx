import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import editbtn from '../../assets/edit.png';
import styles from './EntretienList.module.css';
import X from '../../assets/x-button.png';
import axios from 'axios';

const tableContainerStyle = {
  margin: '20px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  overflow: 'hidden',
  width: '1214px'
};

const tableHeaderStyle = {
  backgroundColor: 'rgb(216, 234, 255)',
  color: 'black',
  fontWeight: 'bold',
  textAlign: 'left',
  padding: '8px',
  fontSize: '16px',
  fontWeight: '100',
  paddingLeft: '74px'
};

const tableCellStyle = {
  textAlign: 'left',
  verticalAlign: 'middle',
  padding: '8px',
  fontSize: '14px',
  borderBottom: '1px solid #e0e0e0',
  height: '27px',
  paddingLeft: '74px'
};

const circularImageStyle = {
  borderRadius: '50%',
  width: '30px',
  height: '30px',
  marginRight: '10px'
};

const nameWithImageStyle = {
  display: 'flex',
  alignItems: 'center'
};

const messageCellStyle = {
  fontSize: '16px',
  fontWeight:'300',
  color: 'black',
  padding: '20px'
};

const confirmationDialogStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const EntretienList = ({ message, sortedRows = [] }) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [entretienList, setEntretienList] = useState(sortedRows);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);

  useEffect(() => {
    setEntretienList(sortedRows);
  }, [sortedRows]);

  const handleClickOpen = (date, id) => {
    setSelectedDate(date);
    setCurrentId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentId(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:8086/recruteurs/modifierDate/${currentId}/${selectedDate.toISOString().split('T')[0]}`);
      setEntretienList(entretienList.map(entretien => 
        entretien.id === currentId ? { ...entretien, dateEntretien: selectedDate.toISOString().split('T')[0] } : entretien
      ));
      handleClose();
    } catch (error) {
      console.error('Failed to save date', error);
    }
  };

  const handleDeleteClick = (id) => {
    setIdToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8086/recruteurs/deleteEntretien/${idToDelete}`);
      setEntretienList(entretienList.filter(entretien => entretien.id !== idToDelete));
      setConfirmDeleteOpen(false);
      setIdToDelete(null);
    } catch (error) {
      console.error('Failed to delete entretien', error);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setIdToDelete(null);
  };

  return (
    <>
      <TableContainer component={Paper} style={tableContainerStyle}>
        <Table stickyHeader aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell style={tableHeaderStyle}>Date Entretien</TableCell>
              <TableCell style={tableHeaderStyle}>Nom Candidat</TableCell>
              <TableCell style={tableHeaderStyle}>Nom Recruteur</TableCell>
              <TableCell style={tableHeaderStyle}>Titre d'Offre</TableCell>
              <TableCell style={tableHeaderStyle}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entretienList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" style={messageCellStyle}>
                  Aucun entretien disponible.
                </TableCell>
              </TableRow>
            ) : (
              entretienList.map((row) => (
                <TableRow key={row.id} style={{ height: '40px' }}>
                  <TableCell style={tableCellStyle}>
                    {row.dateEntretien}
                    <button className={styles.editbtn} onClick={() => handleClickOpen(new Date(row.dateEntretien), row.id)}>
                      <img src={editbtn} className={styles.edit} alt="edit" />
                    </button>
                  </TableCell>
                  <TableCell style={tableCellStyle}>
                    <div style={nameWithImageStyle}>
                      <img
                        src={`http://localhost:8086/images/${row.candidatImg || 'default-image.png'}`}
                        alt={`${row.candidatNomPrenom}'s image`}
                        style={circularImageStyle}
                      />
                      {row.candidatNomPrenom}
                    </div>
                  </TableCell>
                  <TableCell style={tableCellStyle}>
                    <div style={nameWithImageStyle}>
                      <img
                        src={`http://localhost:8086/images/${row.recruteurImg || 'default-image.png'}`}
                        alt={`${row.recruteurNomPrenom}'s image`}
                        style={circularImageStyle}
                      />
                      {row.recruteurNomPrenom}
                    </div>
                  </TableCell>
                  <TableCell style={tableCellStyle}>{row.offreEmploiTitre}</TableCell>
                  <TableCell>
                    <img
                      className={styles.deletebtn}
                      src={X}
                      alt="delete"
                      onClick={() => handleDeleteClick(row.id)}
                      style={{ cursor: 'pointer' }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: confirmationDialogStyle }}>
        <DialogTitle>Modifier la Date d'Entretien</DialogTitle>
        <DialogContent>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            inline
          />
        </DialogContent>
        <DialogActions>
          <Button className={`${styles.modalButton} ${styles.saveButton}`} onClick={handleSave}>
            Enregistrer
          </Button>
          <Button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={handleClose}>
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDeleteOpen} onClose={handleCancelDelete} PaperProps={{ style: confirmationDialogStyle }}>
        <DialogTitle>Confirmation de Suppression</DialogTitle>
        <DialogContent>
          Êtes-vous sûr de vouloir supprimer cet entretien ?
        </DialogContent>
        <DialogActions>
          <Button className={`${styles.modalButton} ${styles.deleteButton}`} onClick={handleConfirmDelete} type="button">
            Supprimer
          </Button>
          <Button className={`${styles.modalButton} ${styles.cancelButton}`} onClick={handleCancelDelete} type="button">
            Annuler
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EntretienList;
