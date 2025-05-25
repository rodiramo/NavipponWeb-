import { useTheme } from "@mui/material/styles";

const Seccion1 = () => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const logoSrc = isDarkMode
    ? "/assets/navippon-logo-white.png"
    : "/assets/navippon-icon.png";

  return (
    <div
      className="w-full flex flex-col md:flex-row pl-2 relative"
      style={{
        height: "auto",
        fontSize: "1rem",
        padding: "2rem 7rem",
      }}
    >
      {/* Text Section */}
      <div
        className="md:w-1/2 p-4 md:p-12 flex flex-col items-center md:items-start text-center md:text-left"
        style={{
          marginBottom: "2rem",
        }}
      >
        <img
          src={logoSrc}
          alt="Logo"
          style={{
            width: "16%",
            marginBottom: "1rem",
          }}
          className="mb-4 md:mx-0"
        />
        <h3
          className="text-2xl font-bold mb-2"
          style={{
            fontSize: "2em",
            paddingTop: "2rem",
            paddingBottom: "1.5rem",
          }}
        >
          {" "}
          ¿Qué es Navippon?
        </h3>
        <p className="text-left">
          En un mundo donde los viajes de ocio son cada vez más populares, hemos
          desarrollado una{" "}
          <span style={{ color: theme.palette.primary.main }}>aplicación</span>{" "}
          que ofrece a los usuarios la oportunidad de{" "}
          <span style={{ color: theme.palette.primary.main }}>descubrir</span>{" "}
          el destino perfecto para unas vacaciones inolvidables en{" "}
          <span style={{ color: theme.palette.primary.main }}>Japón</span>. Esta
          aplicación está diseñada para proporcionar a los viajeros una guía.
        </p>
      </div>

      {/* Image Section */}
      <div
        className="md:absolute right-0 top-0 h-full flex items-center justify-end md:w-1/2"
        style={{
          maxWidth: "100%",
        }}
      >
        <img
          src="/assets/about-section.jpg"
          alt="Festival"
          className="mr-0 pr-0"
          style={{
            width: "85%",
            maxWidth: "100%",
            borderRadius: "20rem 0 0 20rem",
          }}
        />
      </div>
    </div>
  );
};

export default Seccion1;
