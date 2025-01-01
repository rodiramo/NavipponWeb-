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
      trigger: ({ value, steps }) => {
        const question = value.toLowerCase();
        if (question.includes('clima')) {
          return 'climaResponse';
        } else if (question.includes('comida')) {
          return 'comidaResponse';
        } else if (question.includes('cultura')) {
          return 'culturaResponse';
        } else {
          return 'defaultResponse';
        }
      },
    },
    {
      id: 'climaResponse',
      message: 'El clima en Japón varía según la región y la estación. En general, tiene cuatro estaciones bien definidas.',
      trigger: 'userInput',
    },
    {
      id: 'comidaResponse',
      message: 'La comida japonesa es muy variada y deliciosa. Algunos platos populares son sushi, ramen y tempura.',
      trigger: 'userInput',
    },
    {
      id: 'culturaResponse',
      message: 'La cultura japonesa es rica y diversa, con una historia que abarca miles de años. Incluye tradiciones como el té, el ikebana y el sumo.',
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