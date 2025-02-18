import React, { useState, useEffect } from "react";
import { getUserProfile } from "../../../../services/index/users";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { useTheme } from "@mui/material";
import "../../../../css/ChatBot.css";
import botIcon from "../../../../assets/navippon-icon.png";
import { AiOutlineClose } from "react-icons/ai";
const LinkComponent = ({ link, text }) => (
  <a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#FF4081", fontWeight: "bold" }}
  >
    {text}
  </a>
);

const ChatWithBot = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const interval = setInterval(() => {
      const inputField = document.querySelector(".rsc-input");
      if (inputField) {
        inputField.setAttribute("placeholder", "Escribe un mensaje...");
        clearInterval(interval);
      }
    }, 500); // Check every 500ms until it's found
  }, []);

  useEffect(() => {
    const jwt = window.sessionStorage.getItem("jwt");
    if (jwt) {
      getUserProfile({ token: jwt })
        .then((userData) => setUser(userData))
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setUser(null);
        });
    }
  }, []);

  const steps = [
    {
      id: "1",
      message: "こんにちは！ ¿En qué puedo ayudarte hoy con respecto a Japón?",
      trigger: "userInput",
    },
    {
      id: "userInput",
      user: true,
      trigger: ({ value }) => {
        const question = value.toLowerCase();

        if (["hola", "hi", "hello", "buenas", "saludos"].includes(question)) {
          return "greetingResponse";
        }
        // 🌦️ Clima
        if (
          question.includes("clima") ||
          question.includes("tiempo") ||
          question.includes("hace frío") ||
          question.includes("temperatura")
        )
          return "climaResponse";
        // 🍣 Comida
        if (
          question.includes("comida") ||
          question.includes("gastronomía") ||
          question.includes("qué comer") ||
          question.includes("platos típicos")
        )
          return "comidaResponse";
        // 🏯 Cultura
        if (
          question.includes("cultura") ||
          question.includes("costumbres") ||
          question.includes("qué tradiciones hay")
        )
          return "culturaResponse";
        // 🛂 Visa
        if (
          question.includes("visa") ||
          question.includes("necesito visa") ||
          question.includes("documentos para viajar")
        )
          return "visaResponse";
        if (question.includes("documentación")) return "documentacionResponse";
        if (question.includes("idioma")) return "idiomaResponse";
        // 🚆 Transporte
        if (
          question.includes("transporte") ||
          question.includes("cómo moverse") ||
          question.includes("tren") ||
          question.includes("jr pass") ||
          question.includes("pasajes")
        )
          return "transporteResponse";
        if (question.includes("trabajo")) return "trabajoResponse";
        if (question.includes("mapa")) return "mapaResponse";
        if (question.includes("floración") || question.includes("sakura"))
          return "sakuraResponse";
        // 🏨 Alojamiento
        if (
          question.includes("dónde dormir") ||
          question.includes("alojamiento") ||
          question.includes("hoteles") ||
          question.includes("dónde hospedarse")
        )
          return "alojamientoResponse";

        // 💰 Tarjetas & Dinero
        if (
          question.includes("tarjetas") ||
          question.includes("dinero") ||
          question.includes("efectivo") ||
          question.includes("se puede pagar con tarjeta")
        )
          return "tarjetasResponse";
        if (
          question.includes("festivales") ||
          question.includes("actividades") ||
          question.includes("eventos") ||
          question.includes("celebraciones") ||
          question.includes("atractivos")
        )
          return "festivalesResponse";
        if (question.includes("propinas")) return "propinasResponse";
        if (
          question.includes("es seguro") ||
          question.includes("seguridad") ||
          question.includes("delitos") ||
          question.includes("seguridad en japón")
        )
          return "seguridadResponse";

        if (question.includes("wifi") || question.includes("internet"))
          return "internetResponse";
        if (question.includes("etiqueta") || question.includes("costumbres"))
          return "etiquetaResponse";
        if (
          question.includes("tokyo") ||
          question.includes("kyoto") ||
          question.includes("fuji")
        )
          return "atraccionesResponse";
        if (question.includes("compras") || question.includes("shopping"))
          return "comprasResponse";
        if (question.includes("hospital") || question.includes("salud"))
          return "saludResponse";
        if (question.includes("emergencia") || question.includes("policía"))
          return "emergenciaResponse";
        return "defaultResponse";
      },
    },

    // **Greeting Response**
    {
      id: "greetingResponse",
      message:
        "Konnichiwa! 🌸 Soy tu asistente de viaje para Japón. Puedes preguntarme sobre:\n\n- 🌤️ Clima en diferentes estaciones\n- 🍜 Comida japonesa\n- 🚆 Transporte (Japan Rail Pass, metro, etc.)\n- 🎎 Cultura y costumbres\n- 🎉 Festivales y eventos\n- 🗼 Qué visitar en Tokio, Kioto y más\n\n¡Pregunta lo que quieras! 😊",
      trigger: "userInput",
    },

    // Other responses (same as before)
    {
      id: "climaResponse",
      message: "El clima en Japón varía según la región y la estación.",
      trigger: "climaLink",
    },
    {
      id: "climaLink",
      component: (
        <LinkComponent
          link="https://www.jma.go.jp/"
          text="Consulta el clima aquí 🌤️"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "comidaResponse",
      message:
        "Algunos platillos recomendados en Japón: 🍣 Sushi, 🍜 Ramen, 🥢 Okonomiyaki. ",
      trigger: "comidaLink",
    },
    {
      id: "comidaLink",
      component: (
        <LinkComponent
          link="https://www.lonelyplanet.com/japan/food-and-drink"
          text="Ver más sobre comida japonesa 🍣"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "transporteResponse",
      message: "Usa el **Japan Rail Pass** para viajar en tren bala 🚅. ",
      trigger: "transporteLink",
    },
    {
      id: "transporteLink",
      component: (
        <LinkComponent
          link="https://www.japanrailpass.net/"
          text="Ver información sobre el JR Pass 🚆"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "atraccionesResponse",
      message:
        "Lugares turísticos populares:\n🏯 Kyoto: Fushimi Inari, Kinkakuji\n🏙️ Tokio: Shibuya, Akihabara\n🗻 Monte Fuji: Vista desde Kawaguchi. ",
      trigger: "userInput",
    },
    {
      id: "defaultResponse",
      message:
        "Lo siento, no tengo una respuesta para esa pregunta. ¿Puedes preguntar algo más sobre Japón? 😊",
      trigger: "userInput",
    },
    {
      id: "tarjetasResponse",
      message:
        "Es útil llevar efectivo en Japón, pero también puedes usar tarjetas IC.",
      trigger: "tarjetasLink",
    },
    {
      id: "tarjetasLink",
      component: (
        <LinkComponent
          link="https://www.japanrailpass.net/"
          text="Ver tarjetas de transporte 🚋"
        />
      ),
      trigger: "userInput",
    },

    {
      id: "propinasResponse",
      message:
        "En Japón no se acostumbra dejar propina. El servicio siempre está incluido.",
      trigger: "userInput",
    },

    {
      id: "seguridadResponse",
      message: "Japón es uno de los países más seguros del mundo.",
      trigger: "userInput",
    },
    {
      id: "alojamientoResponse",
      message: "Encuentra alojamiento en Japón aquí.",
      trigger: "alojamientoLink",
    },
    {
      id: "alojamientoLink",
      component: (
        <LinkComponent
          link="https://www.booking.com/"
          text="Buscar hoteles en Japón 🏨"
        />
      ),
      trigger: "userInput",
    },

    {
      id: "festivalesResponse",
      message: "Japón tiene increíbles festivales durante todo el año.",
      trigger: "festivalesLink",
    },
    {
      id: "festivalesLink",
      component: (
        <LinkComponent
          link="https://www.japan.travel/en/uk/inspiration/6-must-see-festivals/"
          text="Ver festivales en Japón 🎎"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "sakuraResponse",
      message: "La floración de los cerezos es un evento importante en Japón.",
      trigger: "sakuraLink",
    },
    {
      id: "sakuraLink",
      component: (
        <LinkComponent
          link="https://www.japan-guide.com/sakura/"
          text="Ver pronóstico de sakura 🌸"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "mapaResponse",
      message: "Aquí puedes consultar un mapa de Japón.",
      trigger: "mapaLink",
    },
    {
      id: "mapaLink",
      component: (
        <LinkComponent
          link="https://www.google.com/maps"
          text="Abrir Google Maps 🗺️"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "trabajoResponse",
      message: "Consulta ofertas de trabajo en Japón aquí.",
      trigger: "trabajoLink",
    },
    {
      id: "trabajoLink",
      component: (
        <LinkComponent
          link="https://jobs.gaijinpot.com/"
          text="Buscar trabajo en Japón 💼"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "transporteResponse",
      message: "Consulta el Japan Rail Pass para transporte en Japón.",
      trigger: "transporteLink",
    },
    {
      id: "transporteLink",
      component: (
        <LinkComponent
          link="https://www.japanrailpass.net/"
          text="Ver información sobre el JR Pass 🚆"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "idiomaResponse",
      message: "Recomiendo estas herramientas para aprender japonés.",
      trigger: "idiomaLink",
    },
    {
      id: "idiomaLink",
      component: (
        <LinkComponent
          link="https://www.duolingo.com/"
          text="Duolingo para aprender japonés 🏯"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "documentacionResponse",
      message:
        "Consulta los requisitos de documentación en la página de inmigración.",
      trigger: "documentacionLink",
    },
    {
      id: "documentacionLink",
      component: (
        <LinkComponent
          link="https://www.moj.go.jp/EN/"
          text="Ver documentación necesaria 📄"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "visaResponse",
      message:
        "Para información sobre visas, consulta la web oficial del gobierno.",
      trigger: "visaLink",
    },
    {
      id: "visaLink",
      component: (
        <LinkComponent
          link="https://www.mofa.go.jp/j_info/visit/visa/"
          text="Ver requisitos de visa 🛂"
        />
      ),
      trigger: "userInput",
    },
    {
      id: "culturaResponse",
      message:
        "Para más información sobre la cultura japonesa, visita esta web.",
      trigger: "culturaLink",
    },
    {
      id: "culturaLink",
      component: (
        <LinkComponent
          link="https://www.japan.travel/"
          text="Explora la cultura japonesa 🏯"
        />
      ),
      trigger: "userInput",
    }, // 🚨 Emergencias (Police, Ambulance, Fire Department)
    {
      id: "emergenciaResponse",
      message:
        "En caso de emergencia en Japón, puedes llamar a los siguientes números:",
      trigger: "emergenciaDetails",
    },
    {
      id: "emergenciaDetails",
      component: (
        <ul>
          <li>
            🚔 Policía: <strong>110</strong>
          </li>
          <li>
            🚑 Ambulancia: <strong>119</strong>
          </li>
          <li>
            🔥 Bomberos: <strong>119</strong>
          </li>
          <li>
            🌐 Encuentra más información:{" "}
            <a
              href="https://www.japan.travel/en/plan/emergency/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Guía de emergencias en Japón
            </a>
          </li>
        </ul>
      ),
      trigger: "userInput",
    }, // 🏥 Salud (Hospitals & Healthcare)
    {
      id: "saludResponse",
      message:
        "Si necesitas atención médica en Japón, aquí tienes información útil.",
      trigger: "saludLink",
    },
    {
      id: "saludLink",
      component: (
        <LinkComponent
          link="https://www.japan.travel/en/plan/hospitals-clinics/"
          text="Encuentra hospitales y clínicas en Japón 🏥"
        />
      ),
      trigger: "userInput",
    }, // 🛍️ Compras (Shopping)
    {
      id: "comprasResponse",
      message: "Japón es famoso por sus tiendas y centros comerciales.",
      trigger: "comprasLink",
    },
    {
      id: "comprasLink",
      component: (
        <LinkComponent
          link="https://www.timeout.com/tokyo/shopping"
          text="Descubre las mejores zonas de compras en Japón 🛍️"
        />
      ),
      trigger: "userInput",
    },
  ];

  // Chatbot theme using useTheme() colors
  const chatbotTheme = {
    background: theme.palette.background.default,
    fontFamily: theme.typography.fontFamily,

    headerTitleFont: "Poppins",
    botBubbleColor: theme.palette.primary.light,
    botFontColor: theme.palette.secondary.dark,
    userBubbleColor: theme.palette.secondary.main,
    userFontColor: theme.palette.primary.contrastText,
  };

  return (
    <div
      style={{
        zIndex: 9999,
        position: "fixed",
        right: 30,
        bottom: 80,
      }}
    >
      <ThemeProvider theme={chatbotTheme}>
        {/* Header with Close Button */}
        <div
          className="flex justify-between items-center px-4 py-3"
          style={{
            backgroundColor: theme.palette.primary.main,
            position: "relative",
            borderRadius: "1rem 1rem 0 0",
            marginBottom: "-30px",
            zIndex: 9999,
          }}
        >
          <span className="text-white text-bold">Chatea con NaviBot</span>
          <button
            onClick={() => onClose()} // Ensure it's a function
            className="text-white hover:text-gray-300"
          >
            <AiOutlineClose size={20} />
          </button>
        </div>

        {/* Chatbot Component */}
        <ChatBot
          steps={steps}
          botAvatar={botIcon}
          inputPlaceholder="Escribe un mensaje..."
          headerTitle=" "
        />
      </ThemeProvider>
    </div>
  );
};

export default ChatWithBot;
