import React, { useState, useRef, useEffect } from "react";
import { Send, X, User, Sparkles } from "lucide-react";
import { useTheme } from "@mui/material";

const ModernChatBot = ({ onClose, user }) => {
  const theme = useTheme();
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

  const getBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    // Saludos
    if (
      ["hola", "hi", "hello", "buenas", "konnichiwa"].some((word) =>
        message.includes(word)
      )
    ) {
      return `¡Konnichiwa! 🌸 ${
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

¿Qué te gustaría saber?`;
    }

    // Clima y estaciones
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
      return `🌤️ **CLIMA EN JAPÓN:**

🌸 **Primavera (Mar-May):** 10-20°C, sakura, muy popular
☀️ **Verano (Jun-Aug):** 25-35°C, húmedo, festivales matsuri  
🍂 **Otoño (Sep-Nov):** 15-25°C, colores increíbles, clima perfecto
❄️ **Invierno (Dic-Feb):** 0-10°C, nieve, menos turistas

**Fechas de sakura:**
• Tokyo: 20 marzo - 10 abril
• Kyoto: 25 marzo - 15 abril
• Osaka: 22 marzo - 12 abril

¿Te interesa alguna estación en particular?`;
    }

    // Comida
    if (
      ["comida", "gastronomía", "comer", "platos", "sushi", "ramen"].some(
        (word) => message.includes(word)
      )
    ) {
      return `🍜 **GASTRONOMÍA JAPONESA:**

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

¿Quieres saber sobre algún plato específico?`;
    }

    // Transporte
    if (
      ["transporte", "tren", "jr pass", "metro", "shinkansen"].some((word) =>
        message.includes(word)
      )
    ) {
      return `🚆 **TRANSPORTE EN JAPÓN:**

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

¿Necesitas ayuda planificando rutas específicas?`;
    }

    // Dinero
    if (
      ["dinero", "yen", "tarjeta", "efectivo", "atm"].some((word) =>
        message.includes(word)
      )
    ) {
      return `💰 **DINERO EN JAPÓN:**

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

¿Necesitas consejos sobre presupuesto diario?`;
    }

    // Ciudades - Tokyo
    if (
      ["tokyo", "tokio", "shibuya", "harajuku", "akihabara"].some((word) =>
        message.includes(word)
      )
    ) {
      return `🏙️ **TOKYO - LA METRÓPOLIS:**

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

¿Te interesa algún barrio específico?`;
    }

    // Ciudades - Kyoto
    if (
      ["kyoto", "kioto", "fushimi", "bamboo", "geisha"].some((word) =>
        message.includes(word)
      )
    ) {
      return `🏯 **KYOTO - CAPITAL CULTURAL:**

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

¿Quieres detalles sobre algún templo?`;
    }

    // Presupuesto
    if (
      ["presupuesto", "precio", "costo", "barato", "caro"].some((word) =>
        message.includes(word)
      )
    ) {
      return `💰 **PRESUPUESTO JAPÓN (por día/persona):**

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

¿Cuál es tu presupuesto aproximado?`;
    }

    // Cultura
    if (
      ["cultura", "costumbres", "tradiciones", "respeto", "etiqueta"].some(
        (word) => message.includes(word)
      )
    ) {
      return `🏯 **CULTURA JAPONESA:**

🙇‍♂️ **Etiqueta básica:**
• Inclínate al saludar
• Quítate zapatos en casas/templos
• No hables alto en transporte público
• No dejes propina (es ofensivo)

🥢 **En restaurantes:**
• Di "Itadakimasu" antes de comer
• Di "Gochisousama" después
• No claves palillos en arroz
• Está bien sorber fideos

⛩️ **En templos:**
• Inclínate en la entrada
• Lávate manos y boca
• Habla en voz baja
• Pregunta antes de fotografiar

🎌 **Valores importantes:**
• Respeto por otros
• Puntualidad
• Limpieza
• Trabajo en equipo

¿Hay alguna situación específica sobre la que tengas dudas?`;
    }

    // Emergencias
    if (
      ["emergencia", "ayuda", "hospital", "policía", "seguridad"].some((word) =>
        message.includes(word)
      )
    ) {
      return `🚨 **INFORMACIÓN DE EMERGENCIA:**

📞 **Números críticos:**
• 🚔 Policía: **110**
• 🚑 Ambulancia: **119**  
• 🔥 Bomberos: **119**

🌐 **Líneas en inglés:**
• Japan Hotline: **050-5814-7230**
• Tourist Hotline: **050-3816-2787**

🛡️ **Seguridad:**
• Japón es extremadamente seguro
• Baja criminalidad
• Caminar solo de noche es normal

🏥 **Hospitales internacionales:**
• Tokyo: St. Luke's International
• Osaka: Osaka University Hospital

📱 **Apps útiles:**
• Safety Tips (terremotos)
• Google Translate

¿Necesitas información sobre algún tema específico de seguridad?`;
    }

    // Respuesta por defecto
    return `🤔 Entiendo que preguntas sobre "${userMessage}". 

Puedo ayudarte con información detallada sobre:

🗾 **Destinos:** Tokyo, Kyoto, Osaka, Hiroshima, Monte Fuji
🎌 **Cultura:** Etiqueta, tradiciones, templos, festivales  
🍜 **Comida:** Platos típicos, restaurantes, precios
🚆 **Transporte:** JR Pass, trenes, metro, buses
💰 **Dinero:** Presupuesto, cambio, tarjetas, ATMs
🏨 **Alojamiento:** Hoteles, ryokans, hostels
🌸 **Estaciones:** Mejor época para viajar, clima
🛡️ **Seguridad:** Emergencias, hospitales, seguros

¿Podrías ser más específico sobre qué aspecto de Japón te interesa? Por ejemplo:
• "¿Cuánto cuesta un viaje de 10 días?"
• "¿Qué ver en Tokyo en 3 días?"
• "¿Cuál es la mejor época para ver sakura?"`;
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
        const botResponse = {
          id: Date.now() + 1,
          type: "bot",
          content: getBotResponse(inputValue),
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
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

  return (
    <div
      className="fixed right-6 bottom-6 w-96 h-[600px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden z-50"
      style={{
        backgroundColor: theme.palette.background.default,
        borderColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[700]
            : theme.palette.grey[300],
      }}
    >
      {/* Header */}
      <div
        className="text-white p-4 flex items-center justify-between"
        style={{ backgroundColor: theme.palette.primary.main }}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <img
              src="/assets/botIcon.png"
              alt="NaviBot"
              className="w-6 h-6 rounded-full"
            />
          </div>
          <div>
            <h3 className="font-bold text-lg">NaviBot 🌸</h3>
            <p className="text-sm opacity-90">Tu asistente de viajes a Japón</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{
          backgroundColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[900]
              : theme.palette.grey[50],
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
              className={`flex items-start space-x-2 max-w-[80%] ${
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
                      ? theme.palette.secondary.main
                      : theme.palette.mode === "dark"
                        ? theme.palette.grey[700]
                        : theme.palette.grey[100],
                  color:
                    message.type === "user"
                      ? theme.palette.secondary.contrastText
                      : theme.palette.primary.main,
                }}
              >
                {message.type === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <img
                    src="/assets/botIcon.png"
                    alt="Bot"
                    className="w-4 h-4 rounded-full"
                  />
                )}
              </div>
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
                  borderColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[600]
                      : theme.palette.grey[300],
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
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[100],
                  color: theme.palette.primary.main,
                }}
              >
                <img
                  src="/assets/botIcon.png"
                  alt="Bot"
                  className="w-4 h-4 rounded-full"
                />
              </div>
              <div
                className="p-3 rounded-2xl rounded-bl-md shadow-sm border"
                style={{
                  backgroundColor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  borderColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[600]
                      : theme.palette.grey[300],
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
            borderColor:
              theme.palette.mode === "dark"
                ? theme.palette.grey[600]
                : theme.palette.grey[300],
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
                className="text-xs p-2 rounded-lg transition-colors text-left"
                style={{
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[100],
                  color: theme.palette.text.primary,
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor =
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[600]
                      : theme.palette.grey[200];
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor =
                    theme.palette.mode === "dark"
                      ? theme.palette.grey[700]
                      : theme.palette.grey[100];
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
          borderColor:
            theme.palette.mode === "dark"
              ? theme.palette.grey[600]
              : theme.palette.grey[300],
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
              className="w-full p-3 rounded-xl resize-none focus:outline-none focus:ring-2 focus:border-transparent"
              rows="1"
              style={{
                minHeight: "44px",
                maxHeight: "120px",
                backgroundColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[800]
                    : theme.palette.background.default,
                color: theme.palette.text.primary,
                border: `1px solid ${
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[600]
                    : theme.palette.grey[300]
                }`,
                "--focus-ring-color": theme.palette.primary.main + "50",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.palette.primary.main;
                e.target.style.boxShadow = `0 0 0 2px ${theme.palette.primary.main}25`;
              }}
              onBlur={(e) => {
                e.target.style.borderColor =
                  theme.palette.mode === "dark"
                    ? theme.palette.grey[600]
                    : theme.palette.grey[300];
                e.target.style.boxShadow = "none";
              }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="w-11 h-11 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
          Presiona Enter para enviar
        </div>
      </div>
    </div>
  );
};

export default ModernChatBot;
