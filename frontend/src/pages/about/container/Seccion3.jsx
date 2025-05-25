import { useTheme } from "@mui/material/styles";
import "../../../css/AboutUs.css";
import CustomShape from "../../../components/Shapes/CustomShape";
import { Goal, Telescope, HandHeart } from "lucide-react";

const PrinciplesSection = () => {
  const theme = useTheme();
  const primaryMain = theme.palette.primary.main;

  const cardStyle = {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: "1rem",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
    maxWidth: "450px",
    minHeight: "400px",
    width: "100%",
    transition: "transform 0.3s ease",
    cursor: "default",
    backgroundColor: "#fff",
  };

  return (
    <section className="flex flex-col container mx-auto px-5 py-10">
      <div className="mb-20 flex flex-col items-center justify-center">
        <CustomShape size={2} />
        <h3
          className="text-2xl font-bold mb-2"
          style={{
            fontSize: "2em",
            paddingTop: "2rem",
            paddingBottom: "1.5rem",
          }}
        >
          Nuestros Principios
        </h3>
        <p className="text-center opacity-90 ">
          Navippon te ayuda a planificar tu viaje con nuestros ideales.
        </p>
      </div>

      <div className="flex flex-col md:flex-row justify-around items-center gap-8 w-full">
        {/* Misión */}
        <div style={cardStyle}>
          <Goal size={48} color={primaryMain} />
          <h3
            style={{
              fontSize: "1.5em",
              paddingTop: "1rem",
              paddingBottom: "0.5rem",
            }}
            className="text-xl font-semibold mt-4 mb-2"
          >
            Misión
          </h3>
          <p className="opacity-90 text-left">
            Nuestra misión en Navippon es ser el{" "}
            <span style={{ color: primaryMain, fontWeight: "bold" }}>
              compañero confiable
            </span>{" "}
            para los viajeros que desean explorar la riqueza y belleza de Japón.
            Estamos comprometidos a proporcionar a nuestros usuarios las
            herramientas y la información que necesitan para planificar viajes
            personalizados y significativos.
          </p>
        </div>

        {/* Valores */}
        <div style={cardStyle}>
          <HandHeart size={48} color={primaryMain} />
          <h3
            style={{
              fontSize: "1.5em",
              paddingTop: "1rem",
              paddingBottom: "0.5rem",
            }}
            className="text-xl font-semibold mt-4 mb-2"
          >
            Valores
          </h3>
          <p className="opacity-90 text-left">
            Amamos Japón en todas sus dimensiones y compartimos esa pasión con
            nuestros usuarios. Nos esforzamos por promover el{" "}
            <span style={{ color: primaryMain, fontWeight: "bold" }}>
              entendimiento y respeto
            </span>{" "}
            por la cultura japonesa en cada experiencia de viaje que ofrecemos.
          </p>
        </div>

        {/* Visión */}
        <div style={cardStyle}>
          <Telescope size={48} color={primaryMain} />
          <h3
            style={{
              fontSize: "1.5em",
              paddingTop: "1rem",
              paddingBottom: "0.5rem",
            }}
            className="text-xl font-semibold mt-4 mb-2"
          >
            Visión
          </h3>
          <p className="opacity-90 text-left">
            Nuestra visión en Navippon es convertirnos en la plataforma líder
            para la exploración y planificación de viajes en Japón. Aspiramos a
            ser reconocidos por nuestra{" "}
            <span style={{ color: primaryMain, fontWeight: "bold" }}>
              excelencia
            </span>{" "}
            en proporcionar a los viajeros una experiencia donde puedan
            descubrir la autenticidad de Japón.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrinciplesSection;
