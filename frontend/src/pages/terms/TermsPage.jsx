import React from "react";
import { Container, Typography, Box, Paper, useTheme } from "@mui/material";
import {
  Gavel,
  Shield,
  Person,
  Business,
  Security,
  Info,
} from "@mui/icons-material";
import MainLayout from "../../components/MainLayout";

const TermsPage = () => {
  const theme = useTheme();

  const sections = [
    {
      id: "acceptance",
      title: "1. Aceptación de los Términos",
      icon: <Gavel />,
      content: `Al acceder y utilizar Navippon ("la Plataforma"), usted acepta cumplir con estos Términos de Uso y todas las leyes y regulaciones aplicables. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.

Estos términos constituyen un acuerdo legal vinculante entre usted y Navippon. Nos reservamos el derecho de modificar estos términos en cualquier momento, y dichas modificaciones entrarán en vigor inmediatamente después de su publicación en la Plataforma.`,
    },
    {
      id: "services",
      title: "2. Descripción del Servicio",
      icon: <Business />,
      content: `Navippon es una plataforma digital que permite a los usuarios:
      
• Explorar experiencias de viaje verificadas en Japón
• Crear y gestionar itinerarios de viaje personalizados
• Descubrir hoteles, restaurantes y atracciones
• Planificar viajes a Japón de manera integral

Navippon actúa como un servicio de información y planificación. No somos una agencia de viajes ni procesamos reservas directamente. Los usuarios deben contactar directamente con los proveedores de servicios para realizar reservas.`,
    },
    {
      id: "user-responsibilities",
      title: "3. Responsabilidades del Usuario",
      icon: <Person />,
      content: `Al utilizar Navippon, usted se compromete a:

• Proporcionar información precisa y actualizada
• Mantener la confidencialidad de sus credenciales de acceso
• No utilizar la plataforma para actividades ilegales o no autorizadas
• Respetar los derechos de propiedad intelectual
• No interferir con el funcionamiento normal de la plataforma
• Cumplir con todas las leyes locales aplicables durante sus viajes

Usted es responsable de todas las actividades que ocurran bajo su cuenta y debe notificarnos inmediatamente sobre cualquier uso no autorizado.`,
    },
    {
      id: "intellectual-property",
      title: "4. Propiedad Intelectual",
      icon: <Shield />,
      content: `Todo el contenido de Navippon, incluyendo pero no limitándose a:

• Textos, gráficos, logos, iconos
• Software y código fuente
• Diseño y estructura del sitio web
• Compilación de datos y experiencias

Está protegido por derechos de autor y otras leyes de propiedad intelectual. Usted puede utilizar nuestro contenido únicamente para fines personales y no comerciales.

Los usuarios que contribuyan con contenido (reseñas, fotos, comentarios) otorgan a Navippon una licencia no exclusiva para usar, modificar y mostrar dicho contenido en la plataforma.`,
    },
    {
      id: "prohibited-uses",
      title: "5. Usos Prohibidos",
      icon: <Security />,
      content: `Está prohibido utilizar Navippon para:

• Actividades fraudulentas o engañosas
• Violación de derechos de terceros
• Distribución de malware o virus
• Spam o comunicaciones comerciales no solicitadas
• Recopilación automatizada de datos (scraping)
• Intentos de acceso no autorizado a sistemas
• Publicación de contenido ofensivo, difamatorio o ilegal
• Suplantación de identidad

Nos reservamos el derecho de suspender o terminar cuentas que violen estas restricciones.`,
    },
    {
      id: "disclaimers",
      title: "6. Exenciones de Responsabilidad",
      icon: <Info />,
      content: `Navippon se proporciona "tal como está" sin garantías de ningún tipo. No garantizamos:

• La exactitud, completitud o actualidad de la información
• La disponibilidad ininterrumpida del servicio
• La idoneidad para un propósito específico
• La calidad de los servicios de terceros listados

No somos responsables de:
• Decisiones de viaje basadas en nuestra información
• Problemas con proveedores de servicios de terceros
• Pérdidas o daños relacionados con sus viajes
• Cambios en condiciones de viaje o restricciones

Los usuarios deben verificar toda la información independientemente antes de hacer reservas o viajar.`,
    },
    {
      id: "limitation-liability",
      title: "7. Limitación de Responsabilidad",
      icon: <Shield />,
      content: `En la máxima medida permitida por la ley, Navippon no será responsable de:

• Daños directos, indirectos, incidentales o consecuentes
• Pérdida de beneficios, datos o uso
• Interrupción del negocio
• Daños que excedan el monto pagado por los servicios

Esta limitación se aplica independientemente de la teoría legal y aunque hayamos sido advertidos de la posibilidad de dichos daños.

Algunas jurisdicciones no permiten la limitación de responsabilidad, por lo que estas limitaciones pueden no aplicarse en su caso.`,
    },
    {
      id: "termination",
      title: "8. Terminación",
      icon: <Gavel />,
      content: `Podemos terminar o suspender su acceso a Navippon inmediatamente, sin previo aviso, por cualquier motivo, incluyendo:

• Violación de estos Términos de Uso
• Comportamiento que consideremos dañino para otros usuarios
• Solicitud de las autoridades legales
• Razones técnicas o de seguridad

Usted puede terminar su cuenta en cualquier momento contactándonos. Tras la terminación:
• Su derecho a usar la plataforma cesará inmediatamente
• Podemos eliminar o retener su información según nuestra Política de Privacidad
• Las disposiciones que por su naturaleza deben sobrevivir, continuarán en vigor`,
    },
    {
      id: "governing-law",
      title: "9. Ley Aplicable y Jurisdicción",
      icon: <Gavel />,
      content: `Estos Términos de Uso se rigen por las leyes de España, sin tener en cuenta los principios de conflicto de leyes.

Cualquier disputa relacionada con estos términos será sometida a la jurisdicción exclusiva de los tribunales de Madrid, España.

Si alguna disposición de estos términos se considera inválida o inaplicable, las disposiciones restantes permanecerán en pleno vigor y efecto.`,
    },
  ];

  return (
    <MainLayout
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, 
          ${theme.palette.primary.main}08 0%, 
          ${theme.palette.secondary.main}08 50%,
          ${theme.palette.primary.main}05 100%)`,
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box textAlign="center" mb={6}>
          <Box
            sx={{
              mt: 19,
              display: "inline-flex",
              p: 3,
              borderRadius: "50%",
              background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
              mb: 3,
            }}
          >
            <Gavel sx={{ fontSize: 48, color: theme.palette.primary.main }} />
          </Box>

          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main})`,
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 2,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Términos de Uso
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 400 }}
          >
            利用規約 (Riyō Kiyaku)
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3, fontSize: "1.1rem" }}
          >
            <strong>Última actualización:</strong> 16 de Junio de 2025
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              maxWidth: "800px",
              mx: "auto",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            Estos Términos de Uso rigen el uso de la plataforma Navippon y
            establecen los derechos y responsabilidades entre usted y nuestros
            servicios.
          </Typography>
        </Box>

        {/* Terms Sections */}
        {sections.map((section, index) => (
          <Paper
            key={section.id}
            elevation={0}
            sx={{
              mb: 4,
              borderRadius: "20px",
              overflow: "hidden",
              background: `linear-gradient(135deg, 
                ${theme.palette.background.paper}95 0%, 
                ${theme.palette.background.paper}90 100%)`,
              backdropFilter: "blur(20px)",
              border: `1px solid ${theme.palette.primary.main}20`,
            }}
          >
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.primary.main}05)`,
                borderBottom: `1px solid ${theme.palette.primary.main}20`,
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    background: `${theme.palette.primary.main}20`,
                    color: theme.palette.primary.main,
                  }}
                >
                  {section.icon}
                </Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: theme.palette.text.primary }}
                >
                  {section.title}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ p: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.8,
                  fontSize: "1rem",
                  whiteSpace: "pre-line",
                }}
              >
                {section.content}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Container>
    </MainLayout>
  );
};

export default TermsPage;
