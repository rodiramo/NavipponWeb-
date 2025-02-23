import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel } from '@mui/material';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '@mui/material/styles';
import MainLayout from '../../components/MainLayout';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ContactPage = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    consent: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/emailweb', formData);
      if (response.status === 201) {
        alert('Mensaje enviado con éxito');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          consent: false,
        });
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
      alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <MainLayout>
      <Box mt={8} display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'center', md: 'flex-start' }} p={2}>
        <Box flex={1} p={4} textAlign={{ xs: 'center', md: 'left' }} bgcolor="white" borderRadius={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <Link to="/">
              <FaArrowLeft className="text-xl cursor-pointer" style={{ color: theme.palette.primary.main }} />
            </Link>
            <Typography variant="h4" fontWeight="bold">Contáctanos</Typography>
          </Box>
          <Typography variant="body1" mb={4}>¡Estamos aquí para ayudarte! Envíanos un mensaje y te responderemos lo antes posible.</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Nombre"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Correo Electrónico"
              type="email"
              variant="outlined"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Teléfono"
              type="tel"
              variant="outlined"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mensaje"
              multiline
              rows={4}
              variant="outlined"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <FormControlLabel
              control={<Checkbox name="consent" checked={formData.consent} onChange={handleChange} required />}
              label="Acepto los términos y condiciones y la política de privacidad."
            />
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
              <Button type="submit" variant="contained" color="primary">Enviar</Button>
              <Box display="flex">
                <FaFacebookF className="mr-4 text-xl cursor-pointer" style={{ color: theme.palette.primary.main }} />
                <FaTwitter className="mr-4 text-xl cursor-pointer" style={{ color: theme.palette.primary.main }} />
                <FaLinkedinIn className="text-xl cursor-pointer" style={{ color: theme.palette.primary.main }} />
              </Box>
            </Box>
          </form>
        </Box>
        <Box flex={1} mt={{ xs: 4, md: 5 }} ml={{ md: 4 }} minHeight="50vh">
          <img
            src="https://viajes.nationalgeographic.com.es/medio/2024/07/15/castillo-de-osaka_d8742318_1513825088_240715144429_1280x854.jpg"
            alt="Contáctanos"
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          />
        </Box>
      </Box>
    </MainLayout>
  );
};

export default ContactPage;