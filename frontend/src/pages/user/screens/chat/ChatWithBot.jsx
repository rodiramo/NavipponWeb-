import React, { useState, useEffect } from 'react';
import { getUserProfile } from '../../../../services/index/users';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

const ChatWithBot = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const jwt = window.sessionStorage.getItem('jwt');
    if (jwt) {
      getUserProfile({ token: jwt })
        .then((userData) => {
          console.log('User Data:', userData);
          setUser(userData);
        })
        .catch((error) => {
          console.error('Error fetching user profile:', error);
          setUser(null);
        });
    }
  }, []);

  const steps = [
    {
      id: '1',
      message: 'こんにちは！ ¿En qué puedo ayudarte hoy con respecto a Japón?',
      trigger: 'userInput',
    },
    {
      id: 'userInput',
      user: true,
      trigger: ({ value }) => {
        const question = value.toLowerCase();
  
        if (question.includes('clima')) {
          return 'climaResponse';
        } else if (question.includes('comida')) {
          return 'comidaResponse';
        } else if (question.includes('cultura')) {
          return 'culturaResponse';
        } else if (question.includes('visa')) {
          return 'visaResponse';
        } else if (question.includes('documentación')) {
          return 'documentacionResponse';
        } else if (question.includes('idioma')) {
          return 'idiomaResponse';
        } else if (question.includes('transporte') || question.includes('tren') || question.includes('pases')) {
          return 'transporteResponse';
        } else if (question.includes('trabajo')) {
          return 'trabajoResponse';
        } else if (question.includes('mapa')) {
          return 'mapaResponse';
        } else if (question.includes('floración') || question.includes('sakura')) {
          return 'sakuraResponse';
        } else if (question.includes('alojamiento')) {
          return 'alojamientoResponse';
        } else if (question.includes('festivales')) {
          return 'festivalesResponse';
        } else if (question.includes('tarjetas') || question.includes('dinero')) {
          return 'tarjetasResponse';
        } else if (question.includes('propinas')) {
          return 'propinasResponse';
        } else if (question.includes('seguridad')) {
          return 'seguridadResponse';
        } else {
          return 'defaultResponse';
        }
      },
    },
    {
      id: 'climaResponse',
      message: 'El clima en Japón varía según la región y la estación. Consulta Weather.com: https://weather.com/',
      trigger: 'userInput',
    },
    {
      id: 'comidaResponse',
      message: 'Consulta la guía de Lonely Planet sobre comida japonesa: https://www.lonelyplanet.com/japan/food-and-drink',
      trigger: 'userInput',
    },
    {
      id: 'culturaResponse',
      message: 'Para más información sobre la cultura japonesa, visita https://www.japan.travel/',
      trigger: 'userInput',
    },
    {
      id: 'visaResponse',
      message: 'Para información sobre visas, visita https://www.mofa.go.jp/j_info/visit/visa/',
      trigger: 'userInput',
    },
    {
      id: 'documentacionResponse',
      message: 'Consulta los requisitos de documentación en la página de inmigración: https://www.moj.go.jp/EN/',
      trigger: 'userInput',
    },
    {
      id: 'idiomaResponse',
      message: 'Recomiendo usar Duolingo: https://www.duolingo.com/ o Google Translate: https://translate.google.com/',
      trigger: 'userInput',
    },
    {
      id: 'transporteResponse',
      message: 'Consulta Japan Rail Pass: https://www.japanrailpass.net/ o Hyperdia: https://www.hyperdia.com/',
      trigger: 'userInput',
    },
    {
      id: 'trabajoResponse',
      message: 'Consulta GaijinPot Jobs: https://jobs.gaijinpot.com/',
      trigger: 'userInput',
    },
    {
      id: 'mapaResponse',
      message: 'Consulta Google Maps para Japón: https://www.google.com/maps',
      trigger: 'userInput',
    },
    {
      id: 'sakuraResponse',
      message: 'La floración de los cerezos se celebra ampliamente. Consulta el pronóstico en: https://www.japan-guide.com/sakura/',
      trigger: 'userInput',
    },
    {
      id: 'alojamientoResponse',
      message: 'Encuentra alojamiento en Booking.com: https://www.booking.com/',
      trigger: 'userInput',
    },
    {
      id: 'festivalesResponse',
      message: 'Los festivales son increíbles en Japón. Consulta aquí: https://www.japan.travel/en/uk/inspiration/6-must-see-festivals/',
      trigger: 'userInput',
    },
    {
      id: 'tarjetasResponse',
      message: 'Es útil llevar efectivo en Japón. Para tarjetas de transporte, consulta: https://www.japanrailpass.net/',
      trigger: 'userInput',
    },
    {
      id: 'propinasResponse',
      message: 'En Japón no se acostumbra dejar propina. El servicio siempre está incluido.',
      trigger: 'userInput',
    },
    {
      id: 'seguridadResponse',
      message: 'Japón es uno de los países más seguros del mundo, pero siempre mantén tus pertenencias vigiladas.',
      trigger: 'userInput',
    },
    {
      id: 'defaultResponse',
      message: 'Lo siento, no tengo una respuesta para esa pregunta. ¿Puedes preguntar algo más sobre Japón?',
      trigger: 'userInput',
    },
  ];
  
  const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#00B2A9',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#00B2A9',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-100 text-gray-800 p-10 overflow-hidden">
      <ThemeProvider theme={theme}>
        <ChatBot steps={steps} />
      </ThemeProvider>
    </div>
  );
};

export default ChatWithBot;