import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import useUser from '../../../../hooks/useUser';  

const ManageEmails = () => {
  const [emails, setEmails] = useState([]);
  const { jwt } = useUser();  

  useEffect(() => {
    const fetchEmails = async () => {
      const { data } = await axios.get('/api/emailweb', {
        headers: {
          Authorization: `Bearer ${jwt}`,  
        },
      });
      setEmails(data);
    };

    fetchEmails();
  }, [jwt]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este correo?')) {
      await axios.delete(`/api/emailweb/${id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,  
        },
      });
      setEmails(emails.filter((email) => email._id !== id));
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Gestionar Correos Electrónicos</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Correo Electrónico</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {emails.map((email) => (
              <TableRow key={email._id}>
                <TableCell>{email.name}</TableCell>
                <TableCell>{email.email}</TableCell>
                <TableCell>
                  <Button component={Link} to={`/admin/emailweb/${email._id}`} variant="contained" color="primary" size="small" style={{ marginRight: '10px' }}>
                    Ver
                  </Button>
                  <Button onClick={() => handleDelete(email._id)} variant="contained" color="secondary" size="small">
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ManageEmails;