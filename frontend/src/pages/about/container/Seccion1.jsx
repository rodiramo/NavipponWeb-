import React from 'react';
import logoblack from '../../../assets/logoblack.png';
import festival from '../../../assets/festival.png';

const Seccion1 = () => {
    return (
        <div className="bg-white rounded-t-3xl p-6 pb-0 flex flex-col md:flex-row mt-8 " style={{ transform: 'translateY(-6rem)', marginRight: '0', paddingRight: '0' }}>
            <div className="md:w-1/2 p-4 flex flex-col items-center md:items-start text-center md:text-left">
                <img src={logoblack} alt="Logo Black" className="mb-4 mx-auto md:mx-0" />
                <h2 className="text-2xl font-bold mb-4 mx-auto md:mx-0">¿Qué es Navippon?</h2>
                <p className="text-left">
                    En un mundo donde los viajes de ocio son cada vez más populares, hemos desarrollado una 
                    <span className="text-[#FA5564]"> aplicación</span> que ofrece a los usuarios la oportunidad de 
                    <span className="text-[#FA5564]"> descubrir</span> el destino perfecto para unas vacaciones inolvidables en 
                    <span className="text-[#FA5564]"> Japón</span>. Esta aplicación está diseñada para proporcionar a los viajeros una guía.
                </p>
            </div>
            <div className="md:w-1/2 p-4 flex items-center justify-center mr-0 pr-0 pb-0">
                <img src={festival} alt="Festival" className="mr-0 pr-0" />
            </div>
        </div>
    );
}

export default Seccion1;