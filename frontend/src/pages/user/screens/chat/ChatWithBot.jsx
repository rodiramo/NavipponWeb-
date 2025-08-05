import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  X,
  User,
  Sparkles,
  RotateCcw,
  ExternalLink,
  MapPin,
  Utensils,
  Train,
  CloudSun,
} from "lucide-react";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ChatWithBot = ({ onClose, user }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: `こんにちは！ ${
        user?.name ? user.name + "-san" : ""
      } 🌸 Soy NaviBot, tu asistente personal de viaje para Japón. ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Navigation helper function
  const createNavigationButton = (text, path, icon) => {
    return {
      text,
      path,
      icon,
      action: () => {
        navigate(path);
        onClose();
      },
    };
  };

  // Enhanced bot response with navigation links
  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Saludos
    if (
      ["hola", "hi", "hello", "buenas", "konnichiwa"].some((word) =>
        message.includes(word)
      )
    ) {
      return {
        content: `¡Konnichiwa! 🌸 ${
          user?.name ? user.name + "-san," : ""
        } Soy tu asistente especializado en viajes a Japón. Puedo ayudarte con:

🗓️ Planificación de viaje
🌤️ Clima y mejores épocas  
🍜 Gastronomía japonesa
🚆 Transporte y JR Pass
🏯 Cultura y tradiciones
🎎 Festivales y eventos
🗼 Destinos turísticos
💰 Presupuesto y dinero
🛡️ Seguridad y emergencias

¿Qué te gustaría saber?`,
        buttons: [
          createNavigationButton("🗼 Ver Experiencias", "/experience", MapPin),
          createNavigationButton("📖 Leer Artículos", "/blog", ExternalLink),
        ],
      };
    }

    if (
      [
        "clima",
        "tiempo",
        "temperatura",
        "estación",
        "primavera",
        "verano",
        "otoño",
        "invierno",
      ].some((word) => message.includes(word))
    ) {
      return {
        content: `🌤️ **CLIMA EN JAPÓN:**

🌸 **Primavera (Mar-May):** 10-20°C, sakura, muy popular
☀️ **Verano (Jun-Aug):** 25-35°C, húmedo, festivales matsuri  
🍂 **Otoño (Sep-Nov):** 15-25°C, colores increíbles, clima perfecto
❄️ **Invierno (Dic-Feb):** 0-10°C, nieve, menos turistas

**Fechas de sakura:**
• Tokyo: 20 marzo - 10 abril
• Kyoto: 25 marzo - 15 abril
• Osaka: 22 marzo - 12 abril

¿Te interesa alguna estación en particular?`,
        buttons: [
          createNavigationButton(
            "🌤️ Ver Clima Japón",
            "https://weather.com/weather/tenday/l/Tokyo+Japan",
            CloudSun
          ),
          createNavigationButton(
            "🌸 Experiencias Primavera",
            "/experience?season=spring",
            MapPin
          ),
        ],
      };
    }

    // Comida
    if (
      ["comida", "gastronomía", "comer", "platos", "sushi", "ramen"].some(
        (word) => message.includes(word)
      )
    ) {
      return {
        content: `🍜 **GASTRONOMÍA JAPONESA:**

🥢 **Platos imprescindibles:**
• Sushi & Sashimi 🍣
• Ramen (Shoyu, Miso, Tonkotsu) 🍜
• Tempura 🍤
• Okonomiyaki 🥞
• Takoyaki 🐙
• Katsu 🍖
• Yakitori 🍗

🏪 **Dónde comer:**
• Konbini (7-Eleven): Comida barata 24/7
• Restaurantes de cadena: Yoshinoya, Ichiran
• Mercados: Tsukiji, Kuromon

💰 **Precios:**
• Konbini: $3-8
• Restaurante casual: $8-15
• Restaurante medio: $20-40

¿Quieres saber sobre algún plato específico?`,
        buttons: [
          createNavigationButton(
            "🍜 Experiencias Gastronómicas",
            "/experience?category=food",
            Utensils
          ),
          createNavigationButton(
            "📖 Guías de Comida",
            "/blog?category=gastronomia",
            ExternalLink
          ),
          createNavigationButton(
            "📍 Restaurantes por Región",
            "/experience?type=restaurant",
            MapPin
          ),
        ],
      };
    }

    // Transporte
    if (
      ["transporte", "tren", "jr pass", "metro", "shinkansen"].some((word) =>
        message.includes(word)
      )
    ) {
      return {
        content: `🚆 **TRANSPORTE EN JAPÓN:**

🎫 **JR PASS:**
• 7 días: $280 USD
• 14 días: $450 USD  
• 21 días: $575 USD
• Incluye shinkansen (excepto Nozomi)
• DEBE comprarse antes del viaje

🚄 **Tiempos de viaje:**
• Tokyo-Kyoto: 2h 15min
• Tokyo-Osaka: 2h 30min
• Tokyo-Hiroshima: 4h

🎫 **IC Cards (transporte local):**
• Suica/Pasmo (Tokyo)
• Icoca (Osaka/Kyoto)
• Funciona en todo Japón

¿Necesitas ayuda planificando rutas específicas?`,
        buttons: [
          createNavigationButton(
            "🎫 Reservar JR Pass",
            "https://www.jrpass.com/",
            Train
          ),
          createNavigationButton(
            "🗺️ Planificar Rutas",
            "https://www.hyperdia.com/en/",
            MapPin
          ),
        ],
      };
    }

    // Dinero
    if (
      ["dinero", "yen", "tarjeta", "efectivo", "atm"].some((word) =>
        message.includes(word)
      )
    ) {
      return {
        content: `💰 **DINERO EN JAPÓN:**

💴 **Efectivo es rey:**
• 80% de lugares solo aceptan efectivo
• Lleva siempre yenes contigo
• Billetes: ¥1000, ¥5000, ¥10000

🏧 **Cajeros ATM:**
• 7-Eleven: Acepta tarjetas extranjeras
• Japan Post: En oficinas postales
• Comisión: $3-5 por retiro

💳 **Tarjetas aceptadas en:**
• Hoteles grandes
• Tiendas departamentales  
• Combinis principales

💡 **Recomendación:** Lleva $200-300 en efectivo por semana

¿Necesitas consejos sobre presupuesto diario?`,
        buttons: [
          createNavigationButton(
            "💱 Convertidor de Moneda",
            "https://xe.com/currencyconverter/convert/?Amount=1&From=USD&To=JPY",
            ExternalLink
          ),
          createNavigationButton(
            "📊 Calculadora de Presupuesto",
            "/blog?category=presupuesto",
            ExternalLink
          ),
          createNavigationButton(
            "🏦 Localizador de ATMs",
            "https://www.seven-eleven.co.jp/english/",
            MapPin
          ),
        ],
      };
    }

    // Ciudades - Tokyo
    if (
      ["tokyo", "tokio", "shibuya", "harajuku", "akihabara"].some((word) =>
        message.includes(word)
      )
    ) {
      return {
        content: `🏙️ **TOKYO - LA METRÓPOLIS:**

🎯 **Barrios principales:**
• Shibuya: Cruce famoso, vida nocturna
• Harajuku: Moda kawaii, Takeshita Street
• Akihabara: Electrónicos, anime, manga
• Ginza: Lujo, compras exclusivas
• Asakusa: Tradicional, Senso-ji Temple

🗼 **Atracciones top:**
• Tokyo Skytree (634m)
• Tokyo Tower
• Palacio Imperial
• Mercado Tsukiji Outer
• TeamLab Borderless

📅 **Itinerario sugerido:**
**1-2 días:** Shibuya → Harajuku → Asakusa
**3+ días:** + Akihabara → Ginza → Ueno

¿Te interesa algún barrio específico?`,
        buttons: [
          createNavigationButton(
            "🏙️ Experiencias en Tokyo",
            "/region/tokyo",
            MapPin
          ),
          createNavigationButton(
            "📖 Guía de Tokyo",
            "/blog?tag=tokyo",
            ExternalLink
          ),
        ],
      };
    }

    // Ciudades - Kyoto
    if (
      ["kyoto", "kioto", "fushimi", "bamboo", "geisha"].some((word) =>
        message.includes(word)
      )
    ) {
      return {
        content: `🏯 **KYOTO - CAPITAL CULTURAL:**

⛩️ **Templos imprescindibles:**
• Fushimi Inari: 10,000 torii gates
• Kinkaku-ji: Pabellón Dorado
• Kiyomizu-dera: Vistas de la ciudad
• Ginkaku-ji: Pabellón Plateado

🎋 **Barrios especiales:**
• Gion: Distrito de geishas
• Arashiyama: Bosque de bambú
• Pontocho: Callejón de restaurantes

👘 **Experiencias únicas:**
• Ceremonia del té
• Vestir kimono
• Ver maiko/geisha

📅 **Plan 2-3 días:**
**Día 1:** Fushimi Inari → Gion
**Día 2:** Arashiyama → Kinkaku-ji

¿Quieres detalles sobre algún templo?`,
        buttons: [
          createNavigationButton(
            "🏯 Experiencias en Kyoto",
            "/region/kyoto",
            MapPin
          ),
          createNavigationButton(
            "👘 Experiencias Culturales",
            "/experience?category=culture",
            ExternalLink
          ),
        ],
      };
    }

    // Presupuesto
    if (
      ["presupuesto", "precio", "costo", "barato", "caro"].some((word) =>
        message.includes(word)
      )
    ) {
      return {
        content: `💰 **PRESUPUESTO JAPÓN (por día/persona):**

🏕️ **Mochilero:** $40-60 USD
• Hostel: $20-30
• Comida: $15-25  
• Transporte: $5-10

🏨 **Medio:** $80-150 USD
• Hotel: $50-80
• Comida: $25-50
• Transporte: $10-20

💎 **Alto:** $200+ USD
• Hotel de lujo: $150+
• Restaurantes: $50+

💡 **Consejos para ahorrar:**
• Come en konbinis
• Hostels y capsule hotels
• Camina (muy seguro)
• Day passes de transporte

¿Cuál es tu presupuesto aproximado?`,
        buttons: [
          createNavigationButton(
            "📊 Calculadora de Presupuesto",
            "/blog?category=presupuesto",
            ExternalLink
          ),
          createNavigationButton(
            "🏨 Experiencias Económicas",
            "/experience?budget=low",
            MapPin
          ),
        ],
      };
    }

    // Respuesta por defecto
    return {
      content: `🤔 Entiendo que preguntas sobre "${userMessage}". 

Puedo ayudarte con información detallada sobre:

🗾 **Destinos:** Tokyo, Kyoto, Osaka, Hiroshima, Monte Fuji
🎌 **Cultura:** Etiqueta, tradiciones, templos, festivales  
🍜 **Comida:** Platos típicos, restaurantes, precios
🚆 **Transporte:** JR Pass, trenes, metro, buses
💰 **Dinero:** Presupuesto, cambio, tarjetas, ATMs
🏨 **Alojamiento:** Hoteles, ryokans, hostels
🌸 **Estaciones:** Mejor época para viajar, clima
🛡️ **Seguridad:** Emergencias, hospitales, seguros

¿Podrías ser más específico sobre qué aspecto de Japón te interesa?`,
      buttons: [
        createNavigationButton(
          "🗼 Explorar Experiencias",
          "/experience",
          MapPin
        ),
        createNavigationButton("📖 Leer Guías", "/blog", ExternalLink),
      ],
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(
      () => {
        const botResponse = getBotResponse(inputValue);
        const responseMessage = {
          id: Date.now() + 1,
          type: "bot",
          content: botResponse.content,
          buttons: botResponse.buttons || [],
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, responseMessage]);
        setIsTyping(false);
      },
      1000 + Math.random() * 1000
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const restartConversation = () => {
    setMessages([
      {
        id: 1,
        type: "bot",
        content: `こんにちは！ ${
          user?.name ? user.name + "-san" : ""
        } 🌸 Soy NaviBot, tu asistente personal de viaje para Japón. ¿En qué puedo ayudarte hoy?`,
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    setIsTyping(false);
  };

  const quickActions = [
    {
      label: "🗓️ Planificar viaje",
      action: "Ayúdame a planificar mi viaje a Japón",
    },
    {
      label: "🌸 Mejor época",
      action: "¿Cuál es la mejor época para viajar a Japón?",
    },
    { label: "💰 Presupuesto", action: "¿Cuánto cuesta un viaje a Japón?" },
    { label: "🍜 Comida", action: "Cuéntame sobre la comida japonesa" },
  ];

  const handleQuickAction = (action) => {
    setInputValue(action);
    inputRef.current?.focus();
  };

  // Handle external links
  const handleButtonClick = (button) => {
    if (button.path.startsWith("http")) {
      // External link
      window.open(button.path, "_blank", "noopener,noreferrer");
    } else {
      // Internal navigation
      button.action();
    }
  };

  return (
    <div
      className="fixed right-1 bottom-20 sm:left-auto w-96 max-w-[calc(100vw-1rem)] h-[600px] max-h-[calc(100vh-5rem)] rounded-2xl shadow-2xl border flex flex-col overflow-hidden z-50"
      style={{
        zIndex: 999999,
        backgroundColor: theme.palette.background.default,
        borderColor: theme.palette.grey[300],
      }}
    >
      {/* Header */}
      <div
        className="text-white p-4 flex items-center justify-between"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img
              src="/assets/botIcon.png"
              alt="NaviBot"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">NaviBot</h3>
            <p className="text-sm opacity-90">Tu asistente de viajes a Japón</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Restart conversation */}
          <button
            onClick={restartConversation}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            title="Reiniciar conversación"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            title="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundColor: theme.palette.background.default,
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex items-start space-x-2 max-w-[85%] ${
                message.type === "user"
                  ? "flex-row-reverse space-x-reverse"
                  : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}
                style={{
                  backgroundColor:
                    message.type === "user"
                      ? theme.palette.secondary.light
                      : theme.palette.grey[100],
                  color:
                    message.type === "user"
                      ? theme.palette.secondary.dark
                      : theme.palette.primary.main,
                }}
              >
                {message.type === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <img
                    src="/assets/botIcon.png"
                    alt="NaviBot"
                    className="w-6 h-6 rounded-full"
                  />
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <div
                  className={`p-3 rounded-2xl shadow-sm ${
                    message.type === "user"
                      ? "rounded-br-md"
                      : "rounded-bl-md border"
                  }`}
                  style={{
                    backgroundColor:
                      message.type === "user"
                        ? theme.palette.secondary.main
                        : theme.palette.background.paper,
                    color:
                      message.type === "user"
                        ? theme.palette.secondary.contrastText
                        : theme.palette.text.primary,
                  }}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  <div
                    className={`text-xs mt-1 opacity-70`}
                    style={{
                      color:
                        message.type === "user"
                          ? theme.palette.secondary.contrastText
                          : theme.palette.text.secondary,
                    }}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {/* Action Buttons */}
                {message.buttons && message.buttons.length > 0 && (
                  <div className="flex flex-col space-y-2">
                    {message.buttons.map((button, index) => {
                      const IconComponent = button.icon;
                      return (
                        <button
                          key={index}
                          onClick={() => handleButtonClick(button)}
                          className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 hover:shadow-md"
                          style={{
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.primary.contrastText,
                            border: `1px solid ${theme.palette.primary.main}`,
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor =
                              theme.palette.primary.dark;
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor =
                              theme.palette.primary.main;
                          }}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{button.text}</span>
                          {button.path.startsWith("http") && (
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[85%]">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: theme.palette.grey[100],
                  color: theme.palette.primary.main,
                }}
              >
                <img
                  src="/assets/botIcon.png"
                  alt="NaviBot"
                  className="w-6 h-6 rounded-full"
                />
              </div>
              <div
                className="p-3 rounded-2xl rounded-bl-md shadow-sm border"
                style={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderColor: theme.palette.grey[300],
                }}
              >
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{ backgroundColor: theme.palette.text.secondary }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: theme.palette.text.secondary,
                      animationDelay: "0.1s",
                    }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: theme.palette.text.secondary,
                      animationDelay: "0.2s",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length === 1 && (
        <div
          className="p-4 border-t"
          style={{
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.grey[300],
          }}
        >
          <div
            className="text-xs mb-2"
            style={{ color: theme.palette.text.secondary }}
          >
            Acciones rápidas:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.action)}
                className="text-xs p-2 rounded-full transition-all text-left hover:scale-105 hover:shadow-md"
                style={{
                  backgroundColor: theme.palette.secondary.light,
                  color: theme.palette.text.primary,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = theme.palette.secondary.main;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor =
                    theme.palette.secondary.light;
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className="p-4 border-t"
        style={{
          backgroundColor: theme.palette.background.paper,
        }}
      >
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pregúntame sobre Japón..."
              className="w-full p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:border-transparent transition-all"
              style={{
                minHeight: "70px",
                maxHeight: "100px",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.grey[300]}`,
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.palette.primary.main;
                e.target.style.boxShadow = `0 0 0 2px ${theme.palette.primary.main}25`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.palette.grey[300];
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="w-11 h-11 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
            style={{ backgroundColor: theme.palette.primary.main }}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = theme.palette.primary.dark;
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = theme.palette.primary.main;
              }
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div
          className="text-xs mt-2 text-center"
          style={{ color: theme.palette.text.secondary }}
        >
          <Sparkles className="w-3 h-3 inline mr-1" />
          Presiona Enter para enviar •{" "}
          {messages.length > 1 && `${messages.length - 1} mensajes`}
        </div>
      </div>
    </div>
  );
};

export default ChatWithBot;
