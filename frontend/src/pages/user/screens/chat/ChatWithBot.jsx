import React, { useState, useEffect } from "react";
import { getUserProfile } from "../../../../services/index/users";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import { useTheme } from "@mui/material";
import "../../../../css/ChatBot.css";
import botIcon from "../../../../assets/botIcon.png";
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
    }, 500);
  }, []);

  // Apply dynamic styles for dark/light theme
  useEffect(() => {
    const addCustomStyles = () => {
      // Remove existing custom style if it exists
      const existingStyle = document.getElementById("chatbot-custom-styles");
      if (existingStyle) {
        existingStyle.remove();
      }

      // Create new style element
      const style = document.createElement("style");
      style.id = "chatbot-custom-styles";
      style.textContent = `
        .rsc-input {
          background-color: ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[800]
              : theme.palette.common.white
          } !important;
          color: ${
            theme.palette.mode === "dark"
              ? theme.palette.common.white
              : theme.palette.common.black
          } !important;
          border: 1px solid ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[600]
              : theme.palette.grey[300]
          } !important;
          border-radius: 8px !important;
        }
        
        .rsc-input::placeholder {
          color: ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[400]
              : theme.palette.grey[600]
          } !important;
        }
        
        .rsc-input:focus {
          border-color: ${theme.palette.primary.main} !important;
          outline: none !important;
          box-shadow: 0 0 0 2px ${theme.palette.primary.main}25 !important;
        }

        .rsc-submit-button {
          background-color: ${theme.palette.primary.main} !important;
          border: none !important;
          border-radius: 8px !important;
        }

        .rsc-submit-button:hover {
          background-color: ${theme.palette.primary.dark} !important;
        }

        .rsc-container {
          background-color: ${theme.palette.background.default} !important;
          border: 1px solid ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[700]
              : theme.palette.grey[300]
          } !important;
          border-radius: 16px !important;
        }

        .rsc-os-option {
          background-color: ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[700]
              : theme.palette.grey[100]
          } !important;
          color: ${
            theme.palette.mode === "dark"
              ? theme.palette.common.white
              : theme.palette.common.black
          } !important;
          border: 1px solid ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[600]
              : theme.palette.grey[300]
          } !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
        }

        .rsc-os-option:hover {
          background-color: ${theme.palette.primary.main} !important;
          color: ${theme.palette.common.white} !important;
          transform: translateY(-1px) !important;
        }

        .rsc-message {
          color: ${
            theme.palette.mode === "dark"
              ? theme.palette.common.white
              : theme.palette.common.black
          } !important;
        }

        .rsc-ts {
          color: ${
            theme.palette.mode === "dark"
              ? theme.palette.grey[400]
              : theme.palette.grey[600]
          } !important;
        }
      `;

      document.head.appendChild(style);
    };

    // Add styles immediately
    addCustomStyles();

    // Also add styles when chatbot elements are loaded
    const observer = new MutationObserver(() => {
      if (document.querySelector(".rsc-container")) {
        addCustomStyles();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      const existingStyle = document.getElementById("chatbot-custom-styles");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [theme]);

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
      message: `こんにちは！ ${
        user?.name ? user.name + "-san" : ""
      } 🌸 Soy NaviBot, tu asistente personal de viaje para Japón. ¿En qué puedo ayudarte hoy?`,
      trigger: "mainMenu",
    },
    {
      id: "mainMenu",
      options: [
        {
          value: "planificar",
          label: "🗓️ Planificar mi viaje",
          trigger: "planificarViaje",
        },
        {
          value: "informacion",
          label: "ℹ️ Información general",
          trigger: "userInput",
        },
        {
          value: "emergencia",
          label: "🚨 Información de emergencia",
          trigger: "emergenciaResponse",
        },
        {
          value: "frases",
          label: "🗣️ Frases útiles en japonés",
          trigger: "frasesUtiles",
        },
      ],
    },
    {
      id: "planificarViaje",
      message:
        "¡Perfecto! Te ayudo a planificar tu viaje a Japón. ¿Qué aspecto te interesa más?",
      trigger: "planningOptions",
    },
    {
      id: "planningOptions",
      options: [
        { value: "cuando_ir", label: "📅 ¿Cuándo ir?", trigger: "cuandoIr" },
        {
          value: "presupuesto",
          label: "💰 Presupuesto",
          trigger: "presupuestoResponse",
        },
        {
          value: "itinerario",
          label: "🗺️ Crear itinerario",
          trigger: "itinerarioResponse",
        },
        { value: "que_llevar", label: "🎒 Qué llevar", trigger: "queLlevar" },
        {
          value: "volver_menu",
          label: "↩️ Volver al menú",
          trigger: "mainMenu",
        },
      ],
    },
    {
      id: "userInput",
      user: true,
      trigger: ({ value }) => {
        const question = value.toLowerCase();

        // Saludos
        if (
          ["hola", "hi", "hello", "buenas", "saludos", "konnichiwa"].some(
            (word) => question.includes(word)
          )
        ) {
          return "greetingResponse";
        }

        // Clima y estaciones
        if (
          [
            "clima",
            "tiempo",
            "frío",
            "calor",
            "temperatura",
            "estación",
            "primavera",
            "verano",
            "otoño",
            "invierno",
          ].some((word) => question.includes(word))
        ) {
          return "climaDetallado";
        }

        // Comida
        if (
          [
            "comida",
            "gastronomía",
            "comer",
            "platos",
            "restaurante",
            "sushi",
            "ramen",
            "sake",
          ].some((word) => question.includes(word))
        ) {
          return "comidaDetallada";
        }

        // Cultura y tradiciones
        if (
          [
            "cultura",
            "costumbres",
            "tradiciones",
            "religión",
            "templos",
            "santuarios",
            "geishas",
            "samurai",
          ].some((word) => question.includes(word))
        ) {
          return "culturaDetallada";
        }

        // Documentación y visa
        if (
          [
            "visa",
            "pasaporte",
            "documentos",
            "inmigración",
            "aduana",
            "entrada",
          ].some((word) => question.includes(word))
        ) {
          return "documentacionDetallada";
        }

        // Idioma
        if (
          [
            "idioma",
            "japonés",
            "hablar",
            "comunicar",
            "inglés",
            "traducir",
          ].some((word) => question.includes(word))
        ) {
          return "idiomaDetallado";
        }

        // Transporte
        if (
          [
            "transporte",
            "tren",
            "jr pass",
            "metro",
            "bus",
            "taxi",
            "shinkansen",
            "bullet train",
          ].some((word) => question.includes(word))
        ) {
          return "transporteDetallado";
        }

        // Alojamiento
        if (
          [
            "hotel",
            "alojamiento",
            "ryokan",
            "hostel",
            "airbnb",
            "dormir",
            "hospedaje",
          ].some((word) => question.includes(word))
        ) {
          return "alojamientoDetallado";
        }

        // Dinero y tarjetas
        if (
          [
            "dinero",
            "yen",
            "tarjeta",
            "efectivo",
            "banco",
            "cajero",
            "atm",
            "cambio",
          ].some((word) => question.includes(word))
        ) {
          return "dineroDetallado";
        }

        // Festivales y eventos
        if (
          [
            "festival",
            "evento",
            "celebración",
            "sakura",
            "hanami",
            "matsuri",
            "fuegos",
          ].some((word) => question.includes(word))
        ) {
          return "festivalesDetallados";
        }

        // Seguridad
        if (
          [
            "seguro",
            "seguridad",
            "peligro",
            "delincuencia",
            "robo",
            "safe",
          ].some((word) => question.includes(word))
        ) {
          return "seguridadDetallada";
        }

        // Internet y comunicación
        if (
          [
            "wifi",
            "internet",
            "móvil",
            "celular",
            "sim",
            "pocket wifi",
            "conexión",
          ].some((word) => question.includes(word))
        ) {
          return "internetDetallado";
        }

        // Compras
        if (
          [
            "compras",
            "shopping",
            "tiendas",
            "souvenirs",
            "tax free",
            "descuentos",
          ].some((word) => question.includes(word))
        ) {
          return "comprasDetalladas";
        }

        // Ciudades específicas
        if (
          ["tokyo", "tokio", "shibuya", "harajuku", "akihabara"].some((word) =>
            question.includes(word)
          )
        ) {
          return "tokyoInfo";
        }
        if (
          ["kyoto", "kioto", "fushimi", "bamboo", "geisha"].some((word) =>
            question.includes(word)
          )
        ) {
          return "kyotoInfo";
        }
        if (
          ["osaka", "takoyaki", "dotonbori", "castle"].some((word) =>
            question.includes(word)
          )
        ) {
          return "osakaInfo";
        }
        if (
          ["hiroshima", "peace", "miyajima", "torii"].some((word) =>
            question.includes(word)
          )
        ) {
          return "hiroshimaInfo";
        }
        if (
          ["fuji", "monte fuji", "kawaguchi", "hakone"].some((word) =>
            question.includes(word)
          )
        ) {
          return "fujiInfo";
        }

        // Etiqueta y comportamiento
        if (
          [
            "etiqueta",
            "comportamiento",
            "modales",
            "respeto",
            "bow",
            "shoes",
          ].some((word) => question.includes(word))
        ) {
          return "etiquetaDetallada";
        }

        // Salud
        if (
          [
            "hospital",
            "médico",
            "salud",
            "enfermo",
            "medicina",
            "seguro médico",
          ].some((word) => question.includes(word))
        ) {
          return "saludDetallada";
        }

        return "defaultResponse";
      },
    },

    // Respuestas detalladas
    {
      id: "greetingResponse",
      message: `¡Konnichiwa! 🌸 ${
        user?.name ? user.name + "-san," : ""
      } Soy tu asistente especializado en viajes a Japón. Puedo ayudarte con:\n\n🗓️ Planificación de viaje\n🌤️ Clima y mejores épocas\n🍜 Gastronomía japonesa\n🚆 Transporte y JR Pass\n🏯 Cultura y tradiciones\n🎎 Festivales y eventos\n🗼 Destinos turísticos\n💰 Presupuesto y dinero\n🛡️ Seguridad y emergencias\n\n¿Qué te gustaría saber?`,
      trigger: "userInput",
    },

    {
      id: "cuandoIr",
      message:
        "📅 **Las mejores épocas para viajar a Japón:**\n\n🌸 **Primavera (Mar-May):** Sakura, clima templado, muy popular\n☀️ **Verano (Jun-Aug):** Caluroso y húmedo, festivales matsuri\n🍂 **Otoño (Sep-Nov):** Colores increíbles, clima perfecto\n❄️ **Invierno (Dic-Feb):** Nieve, iluminaciones, menos turistas\n\n¿Qué estación prefieres?",
      trigger: "estacionOptions",
    },

    {
      id: "estacionOptions",
      options: [
        { value: "primavera", label: "🌸 Primavera", trigger: "primaveraInfo" },
        { value: "verano", label: "☀️ Verano", trigger: "veranoInfo" },
        { value: "otono", label: "🍂 Otoño", trigger: "otonoInfo" },
        { value: "invierno", label: "❄️ Invierno", trigger: "inviernoInfo" },
        { value: "volver", label: "↩️ Volver", trigger: "planningOptions" },
      ],
    },

    {
      id: "primaveraInfo",
      message:
        "🌸 **PRIMAVERA (Marzo-Mayo):**\n\n**Clima:** 10-20°C, templado y agradable\n**Sakura:** Floración de cerezos (finales marzo-mayo)\n**Qué llevar:** Capas, chaqueta ligera, paraguas\n**Pros:** Paisajes hermosos, clima ideal\n**Contras:** Muy turístico, precios altos\n\n**Fechas aproximadas de sakura:**\n• Tokyo: 20 marzo - 10 abril\n• Kyoto: 25 marzo - 15 abril\n• Osaka: 22 marzo - 12 abril",
      trigger: "masInfo",
    },

    {
      id: "veranoInfo",
      message:
        "☀️ **VERANO (Junio-Agosto):**\n\n**Clima:** 25-35°C, muy húmedo\n**Rainy season:** Junio-julio (mucha lluvia)\n**Festivales:** Tanabata, Obon, fuegos artificiales\n**Qué llevar:** Ropa ligera, protector solar, paraguas\n**Pros:** Festivales increíbles, vida nocturna\n**Contras:** Calor agobiante, mucha humedad\n\n⚠️ **Evita:** Obon (mediados agosto) - todo cerrado",
      trigger: "masInfo",
    },

    {
      id: "otonoInfo",
      message:
        "🍂 **OTOÑO (Septiembre-Noviembre):**\n\n**Clima:** 15-25°C, perfecto para caminar\n**Colores:** Hojas rojas y doradas espectaculares\n**Qué llevar:** Capas, chaqueta, calzado cómodo\n**Pros:** Clima ideal, paisajes hermosos, menos turistas\n**Contras:** Pueden haber tifones en septiembre\n\n**Mejores lugares para colores:**\n• Nikko • Hakone • Kyoto • Nara",
      trigger: "masInfo",
    },

    {
      id: "inviernoInfo",
      message:
        "❄️ **INVIERNO (Diciembre-Febrero):**\n\n**Clima:** 0-10°C, seco y soleado\n**Nieve:** Abundante en norte y montañas\n**Iluminaciones:** Tokyo, Osaka (nov-feb)\n**Qué llevar:** Abrigo, guantes, calzado antideslizante\n**Pros:** Menos turistas, precios bajos, esquí\n**Contras:** Frío, algunos sitios cerrados\n\n**Actividades:** Esquí, aguas termales (onsen), iluminaciones",
      trigger: "masInfo",
    },

    {
      id: "masInfo",
      options: [
        {
          value: "presupuesto",
          label: "💰 Hablar de presupuesto",
          trigger: "presupuestoResponse",
        },
        {
          value: "itinerario",
          label: "🗺️ Crear itinerario",
          trigger: "itinerarioResponse",
        },
        { value: "volver", label: "↩️ Volver al menú", trigger: "mainMenu" },
      ],
    },

    {
      id: "presupuestoResponse",
      message:
        "💰 **PRESUPUESTO PARA JAPÓN (por día/persona):**\n\n🏕️ **Mochilero:** $40-60 USD\n• Hostel: $20-30\n• Comida: $15-25\n• Transporte: $5-10\n\n🏨 **Medio:** $80-150 USD\n• Hotel: $50-80\n• Comida: $25-50\n• Transporte: $10-20\n\n💎 **Alto:** $200+ USD\n• Hotel de lujo: $150+\n• Restaurantes: $50+\n• Experiencias premium\n\n**JR Pass 7 días:** $280\n**JR Pass 14 días:** $450",
      trigger: "presupuestoOptions",
    },

    {
      id: "presupuestoOptions",
      options: [
        {
          value: "consejos_ahorro",
          label: "💡 Consejos para ahorrar",
          trigger: "consejosAhorro",
        },
        {
          value: "dinero_efectivo",
          label: "💵 Dinero y pagos",
          trigger: "dineroDetallado",
        },
        { value: "volver", label: "↩️ Volver", trigger: "planningOptions" },
      ],
    },

    {
      id: "consejosAhorro",
      message:
        "💡 **CONSEJOS PARA AHORRAR EN JAPÓN:**\n\n🍜 **Comida:**\n• Konbini (7-Eleven, Family Mart)\n• Restaurantes de cadena (Yoshinoya, Matsuya)\n• Bento del supermercado\n• Happy hours (17:00-19:00)\n\n🏨 **Alojamiento:**\n• Hostels y capsule hotels\n• Business hotels\n• Ryokans económicos\n• Airbnb en áreas residenciales\n\n🚆 **Transporte:**\n• Caminar (muy seguro)\n• Bicicletas de alquiler\n• Day passes locales\n• Evitar taxis",
      trigger: "masInfo",
    },

    {
      id: "itinerarioResponse",
      message:
        "🗺️ **CREEMOS TU ITINERARIO PERFECTO**\n\n¿Cuántos días tienes para tu viaje?",
      trigger: "diasViaje",
    },

    {
      id: "diasViaje",
      options: [
        { value: "7dias", label: "7 días", trigger: "itinerario7dias" },
        { value: "10dias", label: "10 días", trigger: "itinerario10dias" },
        { value: "14dias", label: "14+ días", trigger: "itinerario14dias" },
        {
          value: "personalizado",
          label: "🎯 Personalizado",
          trigger: "itinerarioPersonalizado",
        },
      ],
    },

    {
      id: "itinerario7dias",
      message:
        "🗺️ **ITINERARIO 7 DÍAS - CLÁSICO:**\n\n**Día 1-3: TOKYO**\n• Shibuya, Harajuku, Akihabara\n• Senso-ji, Tokyo Skytree\n• Tsukiji Outer Market\n\n**Día 4-5: KYOTO**\n• Fushimi Inari, Kinkaku-ji\n• Arashiyama Bamboo Grove\n• Gion District\n\n**Día 6: NARA**\n• Todai-ji Temple\n• Deer Park\n\n**Día 7: TOKYO**\n• Compras y última exploración",
      trigger: "itinerarioMasInfo",
    },

    {
      id: "itinerario10dias",
      message:
        "🗺️ **ITINERARIO 10 DÍAS - COMPLETO:**\n\n**Día 1-4: TOKYO**\n• Exploración completa + día en Nikko\n\n**Día 5-7: KYOTO**\n• Templos, bambú, geishas + día en Nara\n\n**Día 8-9: OSAKA**\n• Dotonbori, Osaka Castle, Takoyaki\n\n**Día 10: HIROSHIMA**\n• Peace Memorial, Miyajima Island\n\n**Vuelta a Tokyo para vuelo**",
      trigger: "itinerarioMasInfo",
    },

    {
      id: "itinerario14dias",
      message:
        "🗺️ **ITINERARIO 14+ DÍAS - EXPLORER:**\n\n**Día 1-5: TOKYO & ALREDEDORES**\n• Tokyo completo + Nikko + Kamakura\n\n**Día 6-9: KYOTO & KANSAI**\n• Kyoto + Nara + Osaka\n\n**Día 10-12: HIROSHIMA & CHUGOKU**\n• Hiroshima + Miyajima + Himeji\n\n**Día 13-14: MONTE FUJI**\n• Hakone + Lagos Fuji + Onsen\n\n**BONUS:** Kanazawa, Takayama, Japanese Alps",
      trigger: "itinerarioMasInfo",
    },

    {
      id: "itinerarioPersonalizado",
      message:
        "🎯 **ITINERARIO PERSONALIZADO**\n\n¿Qué tipo de experiencias buscas?",
      trigger: "tipoExperiencia",
    },

    {
      id: "tipoExperiencia",
      options: [
        {
          value: "cultura",
          label: "🏯 Cultura tradicional",
          trigger: "itinerarioCultura",
        },
        {
          value: "moderna",
          label: "🏙️ Japón moderno",
          trigger: "itinerarioModerno",
        },
        {
          value: "naturaleza",
          label: "🗻 Naturaleza y onsen",
          trigger: "itinerarioNaturaleza",
        },
        {
          value: "anime",
          label: "🎌 Anime y pop culture",
          trigger: "itinerarioAnime",
        },
      ],
    },

    {
      id: "itinerarioCultura",
      message:
        "🏯 **JAPÓN TRADICIONAL:**\n\n**KYOTO (3-4 días):**\n• Kinkaku-ji, Ginkaku-ji\n• Fushimi Inari\n• Ceremonia del té\n• Noche en ryokan\n\n**NARA (1 día):**\n• Todai-ji, Kasuga Taisha\n\n**NIKKO (1 día):**\n• Toshogu Shrine\n\n**TAKAYAMA (2 días):**\n• Pueblo tradicional\n• Shirakawa-go\n\n**KANAZAWA (1 día):**\n• Kenroku-en Garden",
      trigger: "itinerarioMasInfo",
    },

    {
      id: "itinerarioModerno",
      message:
        "🏙️ **JAPÓN MODERNO:**\n\n**TOKYO (4-5 días):**\n• Shibuya, Shinjuku\n• Tokyo Skytree, Tokyo Tower\n• Ginza, Roppongi\n• TeamLab Borderless\n\n**OSAKA (2-3 días):**\n• Dotonbori nightlife\n• Universal Studios\n• Sumiyoshi Taisha\n\n**HIROSHIMA (1 día):**\n• Ciudad moderna reconstruida\n\n**EXTRA:** Fukuoka, Sapporo",
      trigger: "itinerarioMasInfo",
    },

    {
      id: "itinerarioNaturaleza",
      message:
        "🗻 **NATURALEZA Y ONSEN:**\n\n**HAKONE (2 días):**\n• Monte Fuji views\n• Onsen experience\n\n**NIKKO (2 días):**\n• Lago Chuzenji\n• Waterfalls\n\n**TAKAYAMA (2 días):**\n• Japanese Alps\n• Shirakawa-go\n\n**KUMANO KODO (2 días):**\n• Pilgrimage trails\n\n**YAKUSHIMA (3 días):**\n• Bosques prehistóricos",
      trigger: "itinerarioMasInfo",
    },

    {
      id: "itinerarioAnime",
      message:
        "🎌 **ANIME & POP CULTURE:**\n\n**TOKYO (4-5 días):**\n• Akihabara (electronics)\n• Harajuku (fashion)\n• Otaku culture spots\n• Studio Ghibli Museum\n• Pokemon Center\n\n**OSAKA (2 días):**\n• Den Den Town\n• Anime shops\n\n**EXTRA SPOTS:**\n• Enoshima (Slam Dunk)\n• Hida-Takayama (Your Name)\n• Various anime pilgrimage sites",
      trigger: "itinerarioMasInfo",
    },

    {
      id: "itinerarioMasInfo",
      options: [
        {
          value: "transporte_info",
          label: "🚆 Info de transporte",
          trigger: "transporteDetallado",
        },
        { value: "que_llevar", label: "🎒 Qué llevar", trigger: "queLlevar" },
        { value: "volver", label: "↩️ Volver al menú", trigger: "mainMenu" },
      ],
    },

    {
      id: "queLlevar",
      message:
        "🎒 **QUÉ LLEVAR A JAPÓN:**\n\n📋 **DOCUMENTOS:**\n• Pasaporte (vigencia 6+ meses)\n• Boleto de avión de vuelta\n• Seguro de viaje\n• Licencia internacional (si vas a manejar)\n\n👕 **ROPA:**\n• Capas según estación\n• Zapatos cómodos para caminar\n• Zapatos fáciles de quitar (templos)\n• Ropa conservadora para templos\n\n📱 **TECNOLOGÍA:**\n• Adaptador de enchufe (Tipo A/B)\n• Power bank\n• Pocket WiFi o SIM card",
      trigger: "queLlevarMas",
    },

    {
      id: "queLlevarMas",
      message:
        "🎒 **MÁS COSAS IMPORTANTES:**\n\n💊 **SALUD:**\n• Medicamentos personales\n• Botiquín básico\n• Máscaras faciales (opcional pero común)\n\n💰 **DINERO:**\n• Efectivo en yenes\n• Tarjetas sin comisión internacional\n\n📚 **ÚTILES:**\n• Guía de frases japonesas\n• App de traducción offline\n• Mapa físico de backup\n• Toallas pequeñas (no dan en baños)\n\n⚠️ **NO OLVIDES:**\n• Los enchufes son diferentes\n• Muchos lugares solo aceptan efectivo",
      trigger: "masInfo",
    },

    // Información detallada por temas
    {
      id: "climaDetallado",
      message:
        "🌤️ **CLIMA EN JAPÓN POR REGIONES:**\n\n🏙️ **HONSHU (Tokyo, Kyoto, Osaka):**\n• Primavera: 10-20°C, lluvia ocasional\n• Verano: 25-35°C, muy húmedo\n• Otoño: 15-25°C, perfecto\n• Invierno: 0-10°C, seco\n\n🏔️ **HOKKAIDO (Sapporo):**\n• Más frío, mucha nieve en invierno\n• Verano fresco y agradable\n\n🌺 **OKINAWA:**\n• Subtropical, cálido todo el año\n• Temporada de tifones: mayo-noviembre",
      trigger: "climaLink",
    },

    {
      id: "climaLink",
      component: (
        <div>
          <LinkComponent
            link="https://www.jma.go.jp/bosai/forecast/"
            text="🌤️ Pronóstico oficial JMA"
          />
          <br />
          <LinkComponent
            link="https://www.timeanddate.com/weather/japan"
            text="🌡️ Clima por ciudades"
          />
        </div>
      ),
      trigger: "userInput",
    },

    {
      id: "comidaDetallada",
      message:
        "🍜 **GUÍA GASTRONÓMICA COMPLETA:**\n\n🥢 **PLATOS IMPRESCINDIBLES:**\n• Sushi & Sashimi 🍣\n• Ramen (Shoyu, Miso, Tonkotsu) 🍜\n• Tempura (mariscos y verduras fritas) 🍤\n• Okonomiyaki (pizza japonesa) 🥞\n• Takoyaki (bolitas de pulpo) 🐙\n• Katsu (cerdo empanizado) 🍖\n• Yakitori (pollo a la parrilla) 🍗\n• Udon & Soba (fideos) 🍲\n• Onigiri (bolas de arroz) 🍙\n• Mochi (dulce de arroz) 🍡",
      trigger: "comidaTipos",
    },

    {
      id: "comidaTipos",
      message:
        "🏪 **DÓNDE COMER:**\n\n🏪 **KONBINI (24/7):**\n• 7-Eleven, FamilyMart, Lawson\n• Comida barata y deliciosa\n• Onigiri, bento boxes, snacks\n\n🍜 **RESTAURANTES:**\n• Ichiran (ramen)\n• Yoshinoya (gyudon)\n• Sushiro (sushi económico)\n• CoCo Curry\n\n🎰 **VENDING MACHINES:**\n• Bebidas calientes y frías\n• Algunas hasta ramen\n\n⏰ **HORARIOS:**\n• Desayuno: 7-10am\n• Almuerzo: 11:30-2pm\n• Cena: 6-10pm",
      trigger: "comidaEtiqueta",
    },

    {
      id: "comidaEtiqueta",
      message:
        '🥢 **ETIQUETA AL COMER:**\n\n✅ **SÍ hacer:**\n• Inclínate antes de comer\n• Sorber ramen es normal\n• Usa palillos correctamente\n• Di "Itadakimasu" antes\n• Di "Gochisousama" después\n\n❌ **NO hacer:**\n• Clavar palillos en arroz\n• Pasar comida con palillos\n• Dejar propina\n• Hablar muy alto\n• Desperdiciar comida\n\n💰 **PRECIOS PROMEDIO:**\n• Konbini: $3-8\n• Restaurante casual: $8-15\n• Restaurante medio: $20-40',
      trigger: "comidaLink",
    },

    {
      id: "comidaLink",
      component: (
        <div>
          <LinkComponent
            link="https://www.tabelog.com/"
            text="🍴 Tabelog - Yelp japonés"
          />
          <br />
          <LinkComponent
            link="https://www.gurunavi.com/"
            text="🗾 Gurunavi - Restaurantes"
          />
        </div>
      ),
      trigger: "userInput",
    },

    {
      id: "transporteDetallado",
      message:
        "🚆 **SISTEMA DE TRANSPORTE:**\n\n🎫 **JR PASS - Japan Rail Pass:**\n• 7 días: $280 USD\n• 14 días: $450 USD\n• 21 días: $575 USD\n• Incluye shinkansen (excepto Nozomi)\n• DEBE comprarse antes del viaje\n\n🚄 **SHINKANSEN (Bullet Train):**\n• Tokyo-Kyoto: 2h 15min\n• Tokyo-Osaka: 2h 30min\n• Tokyo-Hiroshima: 4h\n• Reservas gratuitas con JR Pass",
      trigger: "transporteLocal",
    },

    {
      id: "transporteLocal",
      message:
        "🚇 **TRANSPORTE LOCAL:**\n\n🎫 **IC CARDS:**\n• Suica (Tokyo) / Pasmo (Tokyo)\n• Icoca (Osaka/Kyoto)\n• Funciona en todo Japón\n• Recarga en máquinas\n• También para konbinis\n\n🚌 **OTROS TRANSPORTES:**\n• Metro: Muy puntual, limpio\n• Buses: Buenos para zonas rurales\n• Taxis: Caros ($10+ por km)\n• Bicicletas: Alquiler $10/día\n\n📱 **APPS ÚTILES:**\n• Google Maps (funciona perfecto)\n• Hyperdia (horarios de tren)\n• JR East (info oficial)",
      trigger: "transporteConsejos",
    },

    {
      id: "transporteConsejos",
      message:
        "🚆 **CONSEJOS DE TRANSPORTE:**\n\n⏰ **HORARIOS:**\n• Rush hours: 7-9am, 5-7pm\n• Último tren: ~12am\n• Primer tren: ~5am\n• ¡Los trenes son súper puntuales!\n\n🎒 **ETIQUETA:**\n• No comer en trenes locales\n• Silenciar teléfono\n• Ofrecer asiento a mayores\n• Quitarse mochila\n• No hablar por teléfono\n\n💡 **TIPS:**\n• Compra JR Pass antes del viaje\n• Reserva asientos en shinkansen\n• Ten efectivo para buses rurales",
      trigger: "transporteLink",
    },

    {
      id: "transporteLink",
      component: (
        <div>
          <LinkComponent
            link="https://www.japanrailpass.net/"
            text="🎫 Sitio oficial JR Pass"
          />
          <br />
          <LinkComponent
            link="https://www.hyperdia.com/"
            text="🚅 Hyperdia - Horarios"
          />
        </div>
      ),
      trigger: "userInput",
    },

    {
      id: "dineroDetallado",
      message:
        "💰 **DINERO Y PAGOS EN JAPÓN:**\n\n💴 **EFECTIVO ES REY:**\n• 80% de lugares solo aceptan efectivo\n• Lleva siempre yenes contigo\n• Billetes: ¥1000, ¥2000, ¥5000, ¥10000\n• Monedas: ¥1, ¥5, ¥10, ¥50, ¥100, ¥500\n\n🏧 **CAJEROS (ATM):**\n• 7-Eleven: Acepta tarjetas extranjeras\n• Japan Post: En oficinas postales\n• Algunos bancos principales\n• Comisión: $3-5 por retiro",
      trigger: "dineroTarjetas",
    },

    {
      id: "dineroTarjetas",
      message:
        "💳 **TARJETAS DE CRÉDITO:**\n\n✅ **ACEPTAN:**\n• Hoteles grandes\n• Tiendas departamentales\n• Restaurantes de cadena\n• Combinis principales\n• JR Pass online\n\n❌ **NO ACEPTAN:**\n• Restaurantes pequeños\n• Taxis\n• Templos\n• Mercados locales\n• Vending machines\n\n💡 **RECOMENDACIONES:**\n• Lleva $200-300 en efectivo por semana\n• Tarjeta sin comisión internacional\n• Avisa a tu banco del viaje",
      trigger: "dineroConversion",
    },

    {
      id: "dineroConversion",
      message:
        "💱 **CONVERSIÓN Y PRESUPUESTO:**\n\n📊 **PRECIOS REFERENCIALES:**\n• Café: ¥300-500 ($2-4)\n• Comida konbini: ¥500-800 ($4-6)\n• Ramen: ¥800-1200 ($6-9)\n• Metro: ¥200-400 ($1.5-3)\n• Hotel business: ¥8000-15000 ($60-110)\n\n💱 **CAMBIO DE DINERO:**\n• Aeropuerto: Conveniente pero caro\n• Bancos: Mejor rate, horarios limitados\n• Tiendas de cambio: En ciudades grandes\n\n🧮 **TIP:** ¥100 ≈ $0.75 USD (aprox)",
      trigger: "dineroLink",
    },

    {
      id: "dineroLink",
      component: (
        <div>
          <LinkComponent
            link="https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=JPY"
            text="💱 Conversor de moneda actual"
          />
          <br />
          <LinkComponent
            link="https://www.postbank.co.jp/int/service/atmcard/"
            text="🏧 ATMs Japan Post"
          />
        </div>
      ),
      trigger: "userInput",
    },

    {
      id: "culturaDetallada",
      message:
        "🏯 **CULTURA JAPONESA PROFUNDA:**\n\n⛩️ **RELIGIÓN:**\n• Shinto: Religión nativa, santuarios\n• Budismo: Templos, meditación\n• Muchos japoneses practican ambas\n• Respeta los espacios sagrados\n\n🎭 **ARTES TRADICIONALES:**\n• Kabuki, Noh (teatro)\n• Ikebana (arreglos florales)\n• Origami (papel plegado)\n• Caligrafía (shodō)\n• Ceremonia del té (sadō)",
      trigger: "culturaModerna",
    },

    {
      id: "culturaModerna",
      message:
        "🎌 **CULTURA MODERNA:**\n\n📺 **POP CULTURE:**\n• Anime y manga\n• J-Pop y J-Rock\n• Cosplay\n• Gaming culture\n• Kawaii culture\n\n🏢 **SOCIEDAD:**\n• Trabajo en equipo (teamwork)\n• Respeto por jerarquías\n• Puntualidad extrema\n• Limpieza y orden\n• Tecnología avanzada\n\n👘 **VESTIMENTA:**\n• Kimono: Ocasiones especiales\n• Yukata: Verano, festivales\n• Uniforme escolar icónico",
      trigger: "culturaComportamiento",
    },

    {
      id: "culturaComportamiento",
      message:
        "🙇‍♂️ **COMPORTAMIENTO SOCIAL:**\n\n✅ **VALORES IMPORTANTES:**\n• Wa (armonía): No destacar negativamente\n• Respect: A mayores y autoridad\n• Paciencia: No mostrar frustración\n• Humildad: No presumir\n• Limpieza: Responsabilidad personal\n\n🎌 **CONCEPTOS ÚNICOS:**\n• Omotenashi: Hospitalidad sincera\n• Ikigai: Razón de ser\n• Kaizen: Mejora continua\n• Mono no aware: Belleza de lo efímero\n• Ganbatte: ¡Haz tu mejor esfuerzo!",
      trigger: "culturaLink",
    },

    {
      id: "culturaLink",
      component: (
        <div>
          <LinkComponent
            link="https://www.japan.travel/en/culture/"
            text="🎎 Cultura japonesa oficial"
          />
          <br />
          <LinkComponent
            link="https://www.tofugu.com/"
            text="🏮 Tofugu - Blog cultural"
          />
        </div>
      ),
      trigger: "userInput",
    },

    {
      id: "etiquetaDetallada",
      message:
        "🙇‍♂️ **ETIQUETA ESENCIAL:**\n\n👋 **SALUDOS:**\n• Inclínate al conocer gente\n• Intercambia tarjetas de negocio con ambas manos\n• No estreches manos a menos que te extiendan la mano\n\n👟 **ZAPATOS:**\n• Quítate zapatos en: casas, templos, ryokans\n• Usa pantuflas proporcionadas\n• Sandalias especiales para baño\n\n🚇 **TRANSPORTE PÚBLICO:**\n• Forma filas ordenadas\n• Deja salir antes de entrar\n• No hables por teléfono\n• Ofrece asiento a mayores/embarazadas",
      trigger: "etiquetaMas",
    },

    {
      id: "etiquetaMas",
      message:
        '🍜 **RESTAURANTES:**\n• No dejes propina (es ofensivo)\n• Di "Itadakimasu" antes de comer\n• Di "Gochisousama" después\n• No claves palillos en arroz\n• Está bien sorber fideos\n\n⛩️ **TEMPLOS Y SANTUARIOS:**\n• Inclínate en la entrada (torii)\n• Lávate manos y boca\n• No toques objetos sagrados\n• Fotos: pregunta primero\n• Habla en voz baja\n\n🎁 **REGALOS:**\n• Envuelve bonito\n• Usa ambas manos para dar/recibir\n• El receptor no abre el regalo inmediatamente',
      trigger: "etiquetaTabues",
    },

    {
      id: "etiquetaTabues",
      message:
        "❌ **TABÚES IMPORTANTES:**\n\n🚫 **EVITA:**\n• Señalar con el dedo\n• Sonarte la nariz en público\n• Tatuajes visibles en onsen/piscinas\n• Comer mientras caminas\n• Hablar alto en público\n• Tirar basura (no hay basureros)\n\n🆘 **EN CRISIS:**\n• No pierdas la calma\n• Pide ayuda educadamente\n• Los japoneses son muy serviciales\n• Usa apps de traducción\n\n💡 **RECUERDA:**\n• Los japoneses perdonan errores de extranjeros\n• El esfuerzo por respetar se aprecia",
      trigger: "userInput",
    },

    {
      id: "frasesUtiles",
      message:
        "🗣️ **FRASES ESENCIALES EN JAPONÉS:**\n\n👋 **BÁSICOS:**\n• こんにちは (Konnichiwa) - Hola\n• ありがとうございます (Arigatou gozaimasu) - Gracias\n• すみません (Sumimasen) - Disculpe/Perdón\n• はい/いいえ (Hai/Iie) - Sí/No\n• わかりません (Wakarimasen) - No entiendo\n\n🆘 **EMERGENCIA:**\n• 助けて (Tasukete) - ¡Ayuda!\n• 病院 (Byouin) - Hospital\n• 警察 (Keisatsu) - Policía\n• 英語話せますか (Eigo hanasemasu ka) - ¿Habla inglés?",
      trigger: "frasesRestaurante",
    },

    {
      id: "frasesRestaurante",
      message:
        "🍜 **EN RESTAURANTES:**\n• いただきます (Itadakimasu) - Antes de comer\n• ごちそうさま (Gochisousama) - Después de comer\n• お会計お願いします (Okaikei onegaishimasu) - La cuenta, por favor\n• これください (Kore kudasai) - Esto, por favor\n• おいしい (Oishii) - ¡Delicioso!\n\n🚇 **TRANSPORTE:**\n• 駅 (Eki) - Estación\n• 切符 (Kippu) - Boleto\n• いくらですか (Ikura desu ka) - ¿Cuánto cuesta?\n• どこですか (Doko desu ka) - ¿Dónde está?",
      trigger: "frasesCompras",
    },

    {
      id: "frasesCompras",
      message:
        "🛒 **COMPRAS:**\n• いくらですか (Ikura desu ka) - ¿Cuánto cuesta?\n• 高い (Takai) - Caro\n• 安い (Yasui) - Barato\n• 買います (Kaimasu) - Lo compro\n• 見てるだけです (Miteru dake desu) - Solo estoy mirando\n\n😅 **ÚTILES:**\n• ゆっくり話してください (Yukkuri hanashite kudasai) - Hable más despacio\n• もう一度 (Mou ichido) - Una vez más\n• 大丈夫 (Daijoubu) - Está bien/No hay problema\n• お疲れ様 (Otsukaresama) - Buen trabajo (muy común)",
      trigger: "frasesLink",
    },

    {
      id: "frasesLink",
      component: (
        <div>
          <LinkComponent
            link="https://www.tofugu.com/japanese/useful-japanese-phrases/"
            text="📚 Más frases útiles"
          />
          <br />
          <LinkComponent
            link="https://translate.google.com/"
            text="🗣️ Google Translate (funciona offline)"
          />
        </div>
      ),
      trigger: "userInput",
    },

    // Información de ciudades específicas
    {
      id: "tokyoInfo",
      message:
        "🏙️ **TOKYO - LA METRÓPOLIS:**\n\n🎯 **BARRIOS PRINCIPALES:**\n• Shibuya: Cruce famoso, vida nocturna\n• Harajuku: Moda kawaii, Takeshita Street\n• Akihabara: Electrónicos, anime, manga\n• Ginza: Lujo, compras exclusivas\n• Asakusa: Tradicional, Senso-ji Temple\n• Shinjuku: Rascacielos, Golden Gai\n• Roppongi: Vida nocturna internacional\n\n🗼 **ATRACCIONES TOP:**\n• Tokyo Skytree (634m)\n• Tokyo Tower\n• Palacio Imperial\n• Mercado Tsukiji Outer\n• TeamLab Borderless",
      trigger: "tokyoDias",
    },

    {
      id: "tokyoDias",
      message:
        "📅 **TOKYO EN DIFERENTES DÍAS:**\n\n**1 DÍA:** Shibuya → Harajuku → Asakusa\n**2 DÍAS:** + Akihabara → Ginza → Tokyo Tower\n**3 DÍAS:** + Ueno → Shinjuku → Roppongi\n**4+ DÍAS:** + Day trips a Nikko, Kamakura\n\n🚇 **TRANSPORTE:**\n• JR Yamanote Line: Conecta principales barrios\n• Metro Tokyo: Muy eficiente\n• Day Pass: ¥800-1590\n\n💰 **PRESUPUESTO DIARIO:**\n• Económico: $50-80\n• Medio: $100-150\n• Alto: $200+",
      trigger: "masInfoCiudades",
    },

    {
      id: "kyotoInfo",
      message:
        "🏯 **KYOTO - CAPITAL CULTURAL:**\n\n⛩️ **TEMPLOS IMPRESCINDIBLES:**\n• Fushimi Inari: 10,000 torii gates\n• Kinkaku-ji: Pabellón Dorado\n• Kiyomizu-dera: Vistas de la ciudad\n• Ginkaku-ji: Pabellón Plateado\n• Tō-ji: Pagoda de 5 pisos\n\n🎋 **BARRIOS ESPECIALES:**\n• Gion: Distrito de geishas\n• Arashiyama: Bosque de bambú\n• Pontocho: Callejón de restaurantes\n• Higashiyama: Calles preservadas\n\n👘 **EXPERIENCIAS:**\n• Ceremonia del té\n• Vestir kimono\n• Ver maiko/geisha",
      trigger: "kyotoDias",
    },

    {
      id: "kyotoDias",
      message:
        "📅 **KYOTO PLAN:**\n\n**DÍA 1:** Fushimi Inari (mañana) → Gion (tarde)\n**DÍA 2:** Arashiyama bambú → Kinkaku-ji\n**DÍA 3:** Kiyomizu-dera → Higashiyama\n\n🚌 **TRANSPORTE:**\n• Kyoto City Bus: Day pass ¥600\n• Keihan línea: A Fushimi Inari\n• JR Pass funciona en algunas líneas\n\n🍵 **COMIDA ESPECIAL:**\n• Kaiseki (alta cocina)\n• Tofu cuisine\n• Matcha y wagashi\n• Yudofu (tofu caliente)",
      trigger: "masInfoCiudades",
    },

    {
      id: "osakaInfo",
      message:
        "🥟 **OSAKA - COCINA DE JAPÓN:**\n\n🍜 **COMIDA FAMOSA:**\n• Takoyaki: Bolitas de pulpo\n• Okonomiyaki: Pizza japonesa\n• Kushikatsu: Brochetas fritas\n• Yakiniku: Carne a la parrilla\n\n🎪 **ATRACCIONES:**\n• Dotonbori: Distrito de entretenimiento\n• Osaka Castle: Castillo histórico\n• Universal Studios Japan\n• Kuromon Ichiba Market\n• Sumiyoshi Taisha Shrine\n\n🌃 **VIDA NOCTURNA:**\n• Dotonbori: Neones y restaurantes\n• Shinsekai: Área retro\n• Amerikamura: Cultura joven",
      trigger: "osakaDias",
    },

    {
      id: "osakaDias",
      message:
        "📅 **OSAKA ITINERARIO:**\n\n**DÍA 1:** Osaka Castle → Dotonbori\n**DÍA 2:** Universal Studios (día completo)\n**DÍA 3:** Kuromon Market → Sumiyoshi → Shinsekai\n\n🚇 **TRANSPORTE:**\n• Osaka Metro: Day pass ¥800\n• Osaka Amazing Pass: ¥2800 (incluye atracciones)\n• JR Pass: Para líneas JR\n\n💡 **TIP:** Osaka es más barata que Tokyo para comer",
      trigger: "masInfoCiudades",
    },

    {
      id: "hiroshimaInfo",
      message:
        "☮️ **HIROSHIMA - HISTORIA Y PAZ:**\n\n🕊️ **MEMORIAL DE PAZ:**\n• Peace Memorial Park\n• Atomic Bomb Dome (Genbaku Dome)\n• Peace Memorial Museum\n• Memorial Cenotaph\n\n⛩️ **MIYAJIMA ISLAND:**\n• Itsukushima Shrine\n• Torii flotante famoso\n• Mejor con marea alta\n• Deeritos amigables\n\n🏰 **OTROS SITIOS:**\n• Hiroshima Castle\n• Shukkeien Garden",
      trigger: "hiroshimaDias",
    },

    {
      id: "hiroshimaDias",
      message:
        "📅 **HIROSHIMA PLAN:**\n\n**MAÑANA:** Peace Memorial Park y Museum\n**TARDE:** Ferry a Miyajima Island\n**NOCHE:** Regreso a Hiroshima\n\n🚢 **TRANSPORTE:**\n• JR Pass incluye ferry a Miyajima\n• Tram dentro de Hiroshima\n• Todo es caminable\n\n🍜 **COMIDA LOCAL:**\n• Hiroshima-style okonomiyaki\n• Ostras frescas (Miyajima)\n• Momiji manju (dulce local)",
      trigger: "masInfoCiudades",
    },

    {
      id: "fujiInfo",
      message:
        "🗻 **MONTE FUJI - ÍCONO DE JAPÓN:**\n\n👁️ **MEJORES VISTAS:**\n• Lago Kawaguchi: Reflejo perfecto\n• Hakone: Onsen con vista\n• Chureito Pagoda: Foto clásica\n• Fuji Five Lakes region\n\n🥾 **ESCALADA (Jul-Sep):**\n• 4 rutas principales\n• 5-8 horas subida\n• 3-5 horas bajada\n• Refugios en la montaña\n\n♨️ **HAKONE EXPERIENCIA:**\n• Onsen (aguas termales)\n• Ryokan tradicional\n• Hakone Open-Air Museum\n• Pirate ship en Lake Ashi",
      trigger: "fujiDias",
    },

    {
      id: "fujiDias",
      message:
        "📅 **FUJI REGION PLAN:**\n\n**OPCIÓN 1 - Day Trip desde Tokyo:**\n• Kawaguchi Lake (2-3 horas)\n• Chureito Pagoda vista\n• Regreso mismo día\n\n**OPCIÓN 2 - Hakone (2 días):**\n• Día 1: Llegada, onsen, ryokan\n• Día 2: Lake Ashi, museo, regreso\n\n🚃 **TRANSPORTE:**\n• JR Pass hasta Kofu → Bus\n• Hakone Free Pass: ¥5000\n• Incluye transporte local + descuentos",
      trigger: "masInfoCiudades",
    },

    {
      id: "masInfoCiudades",
      options: [
        {
          value: "otra_ciudad",
          label: "🏙️ Otra ciudad",
          trigger: "ciudadOptions",
        },
        {
          value: "transporte_ciudades",
          label: "🚅 Transporte entre ciudades",
          trigger: "transporteDetallado",
        },
        { value: "volver", label: "↩️ Volver al menú", trigger: "mainMenu" },
      ],
    },

    {
      id: "ciudadOptions",
      options: [
        { value: "nara", label: "🦌 Nara", trigger: "naraInfo" },
        { value: "kanazawa", label: "🌸 Kanazawa", trigger: "kanazawaInfo" },
        { value: "takayama", label: "🏔️ Takayama", trigger: "takayamaInfo" },
        { value: "nikko", label: "⛩️ Nikko", trigger: "nikkoInfo" },
      ],
    },

    {
      id: "naraInfo",
      message:
        "🦌 **NARA - PRIMERA CAPITAL:**\n\n🏛️ **PRINCIPALES SITIOS:**\n• Todai-ji Temple: Gran Buda de bronce\n• Nara Park: 1000+ ciervos libres\n• Kasuga Taisha: 3000 linternas\n• Kofuku-ji Temple: Pagoda de 5 pisos\n\n🦌 **CIERVOS DE NARA:**\n• Considerados mensajeros de dioses\n• Puedes comprar galletas especiales (¥200)\n• Son salvajes pero acostumbrados a humanos\n• ¡Cuidado! Pueden ser agresivos por comida\n\n⏰ **TIEMPO NECESARIO:** 1 día (day trip desde Kyoto/Osaka)",
      trigger: "masInfoCiudades",
    },

    {
      id: "kanazawaInfo",
      message:
        "🌸 **KANAZAWA - JOYA OCULTA:**\n\n🌺 **KENROKU-EN GARDEN:**\n• Uno de los 3 jardines más bellos de Japón\n• Especial en todas las estaciones\n• Mejor en primavera y otoño\n\n🏯 **OTROS SITIOS:**\n• Higashi Chaya District: Casas de té\n• Kanazawa Castle\n• 21st Century Museum\n• Omicho Market: Mariscos frescos\n\n🍣 **COMIDA:** Mariscos del Mar de Japón, especialmente cangrejo",
      trigger: "masInfoCiudades",
    },

    {
      id: "takayamaInfo",
      message:
        "🏔️ **TAKAYAMA - ALPES JAPONESES:**\n\n🏘️ **SANMACHI SUJI:**\n• Calles preservadas del período Edo\n• Casas de madera tradicionales\n• Sake breweries\n• Tiendas de artesanías\n\n🚌 **SHIRAKAWA-GO:**\n• Pueblo Patrimonio UNESCO\n• Casas gassho-zukuri (techo de paja)\n• 1 hora en bus desde Takayama\n\n♨️ **ONSEN:** Perfectos después del senderismo\n\n⏰ **TIEMPO:** 2-3 días para área completa",
      trigger: "masInfoCiudades",
    },

    {
      id: "nikkoInfo",
      message:
        '⛩️ **NIKKO - PATRIMONIO CULTURAL:**\n\n🏛️ **TOSHOGU SHRINE:**\n• Mausoleo del shogun Tokugawa\n• Decoraciones elaboradas y coloridas\n• "No hablar, no ver, no escuchar el mal"\n\n🏞️ **NATURALEZA:**\n• Lake Chuzenji\n• Kegon Falls (99m)\n• Senderismo en montañas\n\n🚃 **ACCESO:** 2 horas desde Tokyo (JR Pass válido)\n⏰ **TIEMPO:** Day trip o 2 días con naturaleza',
      trigger: "masInfoCiudades",
    },

    // Emergencias y información crítica
    {
      id: "emergenciaResponse",
      message:
        "🚨 **NÚMEROS DE EMERGENCIA:**\n\n📞 **NÚMEROS CRÍTICOS:**\n• 🚔 Policía: **110**\n• 🚑 Ambulancia: **119**\n• 🔥 Bomberos: **119**\n• 🌊 Guardia Costera: **118**\n\n🌐 **LÍNEAS EN INGLÉS:**\n• Japan Hotline: **050-5814-7230**\n• Tokyo Hotline: **03-5285-8185**\n• Tourist Hotline: **050-3816-2787**",
      trigger: "emergenciaMas",
    },

    {
      id: "emergenciaMas",
      message:
        "🏥 **INFORMACIÓN MÉDICA:**\n\n🏨 **HOSPITALES INTERNACIONALES:**\n• Tokyo: St. Luke's, Tokyo Medical Center\n• Osaka: Osaka University Hospital\n• Kyoto: Kyoto University Hospital\n\n💊 **FARMACIAS:**\n• Matsumoto Kiyoshi (ドラッグストア)\n• Drugs disponibles sin receta son limitados\n• Lleva medicamentos propios\n\n📱 **APPS DE EMERGENCIA:**\n• Safety Tips (terremotos)\n• Google Translate (cámara)\n• Emergency SOS (iPhone/Android)",
      trigger: "emergenciaEmbajada",
    },

    {
      id: "emergenciaEmbajada",
      message:
        "🏛️ **EMBAJADAS Y CONSULADOS:**\n\n📍 **PRINCIPALES UBICACIONES:**\n• US Embassy Tokyo: Akasaka\n• UK Embassy: Ichigaya\n• Canadian Embassy: Akasaka\n• Australian Embassy: Mita\n\n📋 **EN CASO DE EMERGENCIA:**\n• Contacta tu embajada inmediatamente\n• Ten copia digital de pasaporte\n• Registra tu viaje en tu embajada\n• Seguro de viaje obligatorio\n\n🆘 **SI PIERDES PASAPORTE:**\n• Reporta a policía local\n• Contacta embajada para pasaporte temporal",
      trigger: "emergenciaLink",
    },

    {
      id: "emergenciaLink",
      component: (
        <div>
          <LinkComponent
            link="https://www.jnto.go.jp/emergency/eng/mi_guide.html"
            text="🚨 Guía oficial de emergencias"
          />
          <br />
          <LinkComponent
            link="https://www.japan.travel/en/plan/safety-tips/"
            text="📱 App Safety Tips"
          />
        </div>
      ),
      trigger: "mainMenu",
    },

    // Otras respuestas detalladas
    {
      id: "seguridadDetallada",
      message:
        "🛡️ **SEGURIDAD EN JAPÓN:**\n\n✅ **MUY SEGURO:**\n• Tasa de criminalidad extremadamente baja\n• Caminar solo de noche es normal\n• Niños van solos a la escuela\n• Puedes dejar cosas y las encuentras\n\n🚨 **RIESGOS NATURALES:**\n• Terremotos: Frecuentes pero preparados\n• Tsunamis: En costas\n• Tifones: Agosto-octubre\n• Erupciones volcánicas: Raras\n\n📱 **PREPARACIÓN:**\n• Descarga Safety Tips app\n• Conoce rutas de evacuación del hotel\n• Ten plan de comunicación",
      trigger: "userInput",
    },

    {
      id: "internetDetallado",
      message:
        "📶 **INTERNET Y COMUNICACIÓN:**\n\n📱 **OPCIONES DE INTERNET:**\n• Pocket WiFi: ¥500-800/día\n• SIM Cards: ¥1000-3000\n• Free WiFi: Limitado pero creciendo\n\n🗾 **PROVEEDORES:**\n• SoftBank, DoCoMo, au\n• Global WiFi, Japan Wireless\n• Puedes recoger en aeropuerto\n\n📍 **FREE WIFI SPOTS:**\n• Konbinis (7-Eleven, Family Mart)\n• Starbucks, McDonald's\n• Estaciones JR principales\n• Centros comerciales",
      trigger: "internetLink",
    },

    {
      id: "internetLink",
      component: (
        <div>
          <LinkComponent
            link="https://www.globalwifi.com.mx/"
            text="📶 Global WiFi rental"
          />
          <br />
          <LinkComponent
            link="https://www.ntt.com/personal/services/mobile/one-mobile/datatabi/en/sim.html"
            text="📱 Prepaid SIM cards"
          />
        </div>
      ),
      trigger: "userInput",
    },

    {
      id: "comprasDetalladas",
      message:
        "🛍️ **GUÍA DE COMPRAS:**\n\n🏬 **DÓNDE COMPRAR:**\n• Shibuya/Harajuku: Moda joven\n• Ginza: Lujo y departamentales\n• Akihabara: Electrónicos, anime\n• Ameyoko: Mercado tradicional\n• Don Quijote: Todo 24/7\n\n💰 **TAX FREE:**\n• 8-10% de descuento\n• Mínimo ¥5000 por tienda\n• Muestra pasaporte\n• No abras el paquete en Japón\n\n🎁 **SOUVENIRS POPULARES:**\n• Kit Kat sabores únicos\n• Furoshiki (telas para envolver)\n• Sake y whisky japonés\n• Productos de belleza\n• Artesanías tradicionales",
      trigger: "userInput",
    },

    {
      id: "documentacionDetallada",
      message:
        "📋 **DOCUMENTACIÓN COMPLETA:**\n\n✈️ **ENTRADA A JAPÓN:**\n• Pasaporte vigente (6+ meses)\n• No se requiere visa para turismo <90 días\n• Boleto de avión de salida\n• Prueba de fondos económicos\n• Seguro de viaje (recomendado)\n\n📝 **EN INMIGRACIÓN:**\n• Completa tarjeta de desembarque\n• Toma de huellas digitales\n• Foto digital\n• Preguntas sobre propósito del viaje\n\n🚫 **PROHIBIDO INGRESAR:**\n• Drogas (pena de muerte)\n• Armas\n• Ciertos medicamentos\n• Pornografía\n• Productos de origen animal sin declarar",
      trigger: "userInput",
    },

    {
      id: "saludDetallada",
      message:
        "🏥 **SISTEMA DE SALUD:**\n\n💊 **ANTES DEL VIAJE:**\n• Seguro de viaje internacional obligatorio\n• Vacunas: No requeridas, pero recomendadas rutinarias\n• Lleva medicamentos en envases originales\n• Carta médica si tomas medicamentos controlados\n\n🏨 **HOSPITALES RECOMENDADOS:**\n• Tokyo: International Medical Center\n• Osaka: Sumitomo Hospital\n• Kyoto: Japanese Red Cross Hospital\n\n💰 **COSTOS:**\n• Consulta: ¥3000-10000\n• Sin seguro puede ser muy caro\n• Farmacias: Medicamentos limitados",
      trigger: "userInput",
    },

    {
      id: "alojamientoDetallado",
      message:
        "🏨 **TIPOS DE ALOJAMIENTO:**\n\n🏮 **RYOKAN:**\n• Hotel tradicional japonés\n• Habitaciones tatami\n• Cena kaiseki incluida\n• Onsen (aguas termales)\n• $100-500/noche\n\n🏢 **BUSINESS HOTEL:**\n• Habitaciones pequeñas pero eficientes\n• Ubicación céntrica\n• Desayuno básico\n• $50-100/noche\n\n🛏️ **CAPSULE HOTEL:**\n• Experiencia única\n• Espacios mínimos\n• Muy limpios\n• $25-50/noche\n\n🏠 **OTROS:**\n• Love hotels: Para parejas\n• Hostels: Para mochileros\n• Minshuku: Pensiones familiares",
      trigger: "alojamientoConsejos",
    },

    {
      id: "alojamientoConsejos",
      message:
        "💡 **CONSEJOS DE ALOJAMIENTO:**\n\n📅 **RESERVAS:**\n• Booking.com, Agoda funcionan bien\n• Ryokan: Mejor reservar directo\n• Golden Week/Obon: Reserva con meses de anticipación\n\n🏨 **QUÉ ESPERAR:**\n• Habitaciones pequeñas\n• Servicio impecable\n• Check-in: 3pm, Check-out: 10am\n• Slippers y amenities incluidos\n\n📍 **UBICACIÓN:**\n• Cerca de estaciones es clave\n• Tokyo: Shibuya, Shinjuku\n• Kyoto: Central Kyoto\n• Osaka: Namba, Umeda",
      trigger: "userInput",
    },

    {
      id: "festivalesDetallados",
      message:
        "🎎 **FESTIVALES POR ESTACIÓN:**\n\n🌸 **PRIMAVERA:**\n• Hanami (mar-may): Picnics bajo sakura\n• Golden Week (29 abr-5 may): ¡Todo cerrado!\n• Kanda Matsuri (may): Tokyo\n\n☀️ **VERANO:**\n• Gion Matsuri (jul): Kyoto\n• Tanabata (7 jul): Festival de las estrellas\n• Fuegos artificiales: Todo el país\n• Obon (mediados ago): Honrar ancestros\n\n🍂 **OTOÑO:**\n• Jidai Matsuri (22 oct): Kyoto\n• Momiji-gari: Ver hojas rojas\n• Meiji Jingu Festival (nov): Tokyo\n\n❄️ **INVIERNO:**\n• Illuminations (nov-feb)\n• Hatsumode (1-3 ene): Primera visita al templo\n• Setsubun (3 feb): Lanzar frijoles",
      trigger: "festivalesLink",
    },

    {
      id: "festivalesLink",
      component: (
        <div>
          <LinkComponent
            link="https://www.japan-guide.com/e/e2063.html"
            text="🎪 Calendario completo de festivales"
          />
          <br />
          <LinkComponent
            link="https://www.jnto.go.jp/eng/attractions/festival/"
            text="🎎 Festivales oficiales JNTO"
          />
        </div>
      ),
      trigger: "userInput",
    },

    {
      id: "defaultResponse",
      message:
        "🤔 Lo siento, no tengo información específica sobre esa pregunta. Pero puedo ayudarte con:\n\n• 🗓️ Planificación de viaje\n• 🌤️ Clima y estaciones\n• 🍜 Comida japonesa\n• 🚆 Transporte\n• 🏯 Cultura y tradiciones\n• 🏙️ Ciudades específicas\n• 💰 Presupuesto\n• 🚨 Emergencias\n\n¿Hay algo específico que te gustaría saber?",
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
          <span className="text-white text-bold">Chatea con NaviBot 🌸</span>
          <button
            onClick={() => onClose()}
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
          width="400px"
          height="600px"
        />
      </ThemeProvider>
    </div>
  );
};

export default ChatWithBot;
