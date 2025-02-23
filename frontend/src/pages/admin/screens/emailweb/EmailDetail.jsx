import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useUser from '../../../../hooks/useUser';  

const EmailDetail = () => {
  const { id } = useParams();
  const [email, setEmail] = useState(null);
  const { jwt } = useUser();  

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const { data } = await axios.get(`/api/emailweb/${id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,  
          },
        });
        setEmail(data);
      } catch (error) {
        console.error('Error al obtener el correo:', error);
      }
    };

    fetchEmail();
  }, [id, jwt]);

  if (!email) return <Typography>Cargando...</Typography>;

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Detalle del Correo</Typography>
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h6">Nombre: {email.name}</Typography>
        <Typography variant="h6">Correo Electrónico: {email.email}</Typography>
        <Typography variant="h6">Teléfono: {email.phone}</Typography>
        <Typography variant="h6">Mensaje:</Typography>
        <Typography>{email.message}</Typography>
      </Paper>
    </Box>
  );
};

export default EmailDetail;