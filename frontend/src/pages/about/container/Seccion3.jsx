import React from 'react';
import comunidad from '../../../assets/comunidad.png';

const Seccion3 = () => {
    return (
        <div className="bg-[#CDD9E1] mt-6 mb-4 flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 flex justify-start">
                <img src={comunidad} alt="Comunidad" className="m-0 p-0" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center md:items-start p-10">
                <h2 className="text-2xl font-bold mb-4">Nuestra comunidad</h2>
                <p className="text-center md:text-left">
                    Nuestra comunidad es fundamental para nosotros. Estamos deseando verla <span className="font-bold">crecer</span> y <span className="font-bold">florecer</span> con nuevos miembros apasionados por Japón. Que se animen a discusiones, compartir aventuras y conectar con amantes de la cultura japonesa de todo el mundo.
                </p>
            </div>
        </div>
    );
}

export default Seccion3;