import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import openeye from '../../assets/openeye.png';

const BODY_CELL_HEIGHT = 30; // Hauteur des cellules du corps en pixels

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'rgb(216, 234, 255)',
    color: theme.palette.common.black,
    
  
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    height: BODY_CELL_HEIGHT,
    padding: '4px 16px', // Ajustez les valeurs de padding si nécessaire
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  height: BODY_CELL_HEIGHT,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 650,
  overflowY: 'auto',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.45)',
}));

const CircularImage = styled('img')(({ theme }) => ({

  width: 45,
  height: 45,
  borderRadius: '50%',
}));

const EyeImage = styled('img')(({ theme }) => ({
  width: 22,
  height: 22,
  cursor: 'pointer',
}));

const InfiniteScrollList = ({ data , message }) => {




  const sortedRows = data.sort((a, b) => b.experience - a.experience);

  return (
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
          </TableRow>
        </TableHead>
        <TableBody>
          {message ? (
            <TableRow>
              <StyledTableCell colSpan={8} align="center">
                {message}
              </StyledTableCell>
            </TableRow>
          ) : (
            sortedRows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>
                  {row.img ? (
                    <CircularImage src={`http://localhost:8086/images/${row.img}`} alt={`${row.nom}'s image`} />
                  ) : (
                    <CircularImage src={openeye} alt="Image par défaut" />
                  )}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {row.nom} {row.prenom}
                </StyledTableCell>
                <StyledTableCell>{row.email || 'Non fourni'}</StyledTableCell>
                <StyledTableCell>{row.age}</StyledTableCell>
                <StyledTableCell>{row.competences.join(', ')}</StyledTableCell>
                <StyledTableCell>{row.experience} années</StyledTableCell>
                <StyledTableCell>{row.region}</StyledTableCell>
                <StyledTableCell align="center">
                  <a href={`http://localhost:8086/cv/${row.cv}`} target="_blank" rel="noopener noreferrer">
                    <EyeImage src={openeye} alt="Voir CV" />
                  </a>
                </StyledTableCell>
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default InfiniteScrollList;
