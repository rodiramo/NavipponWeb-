import React from 'react';
import nube2 from '../../../assets/nube2.png';
import { BsBullseye } from "react-icons/bs";
import { FaRegHandshake, FaRegEye } from "react-icons/fa";

const Seccion2 = () => {
    return (
        <div className="bg-white flex flex-col items-center mt-0 pt-0">
            <img src={nube2} alt="Nube" className="mb-4 mx-auto" />
            <h2 className="text-2xl font-bold mb-2">Nuestros principios</h2>
            <span className="text-lg mb-8">Navippon te ayuda a planificar tu viaje</span>
            <div className="flex flex-col md:flex-row justify-around w-full">
                <div className="flex flex-col items-center p-4">
                    <BsBullseye className="text-8xl text-[#FA5564] mb-2" />
                    <h3 className="text-xl font-bold mb-2">Misión</h3>
                    <p className="text-center md:text-left">
                        Nuestra misión en Navippon es ser el <span className="text-[#FA5564]">compañero de confianza</span> de los viajeros que desean explorar la riqueza y la belleza de Japón. Nos dedicamos a proporcionar a nuestros usuarios las herramientas y la información necesaria para <span className="text-[#FA5564]">planificar viajes personalizados</span> y significativos.
                    </p>
                </div>
                <div className="flex flex-col items-center p-4">
                    <FaRegHandshake className="text-8xl text-[#FA5564] mb-2" />
                    <h3 className="text-xl font-bold mb-2">Valores</h3>
                    <p className="text-center md:text-left">
                        Amamos Japón en todas sus dimensiones y compartimos esa <span className="text-[#FA5564]">pasión</span> con nuestros usuarios. Nos esforzamos por promover la comprensión y el <span className="text-[#FA5564]">respeto</span> por la cultura japonesa en cada experiencia de viaje que ofrecemos.
                    </p>
                </div>
                <div className="flex flex-col items-center p-4">
                    <FaRegEye className="text-8xl text-[#FA5564] mb-2" />
                    <h3 className="text-xl font-bold mb-2">Visión</h3>
                    <p className="text-center md:text-left">
                        Nuestra visión en Navippon es convertirnos en la <span className="text-[#FA5564]">plataforma líder</span> para la exploración y planificación de viajes en Japón. Buscamos ser <span className="text-[#FA5564]">reconocidos por nuestra excelencia</span> en proporcionar a los viajeros una experiencia donde puedan descubrir la autenticidad de Japón.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Seccion2;