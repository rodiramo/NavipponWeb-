import React from 'react';
import cta from '../../../assets/cta.png';

const CTA = () => {
    return (
        <div className="bg-[#CDD9E1] p-0 m-0 mb-3 mt-3">
            <div className="w-full flex flex-col md:flex-row items-center p-0 m-0">
                <div className="md:w-1/2 mb-0 md:mb-0 md:ml-0 flex-shrink-0 p-0 m-0">
                    <img src={cta} alt="CTA" className="w-full h-full object-cover m-0" />
                </div>
                <div className="md:w-1/2 text-black p-8">
                    <h2 className="text-3xl mb-4">Haz de tu viaje un gran éxito con Navippon</h2>
                    <p className="mb-6">
                        Con Navippon, cada paso de tu viaje se transforma en una experiencia inolvidable. Personaliza tu aventura, descubre lugares únicos y crea recuerdos que durarán toda la vida. Deja que Navippon sea tu guía confiable en el viaje de tus sueños.
                    </p>
                    <button type="submit" className="bg-[#fa5564] text-white rounded-full px-6 py-3 w-full md:w-auto">
                        Explorar destinos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CTA;