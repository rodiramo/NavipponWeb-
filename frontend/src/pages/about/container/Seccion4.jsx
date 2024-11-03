import React from 'react';

const Seccion4 = () => {
    return (
        <div className="bg-[#FA5564] mt-8 mb-8 flex flex-col md:flex-row items-center md:rounded-l-full py-12">
            <div className="w-full md:w-1/2 flex flex-col  md:items-start p-20">
                <h2 className="text-2xl font-bold mb-4">¿Por qué Japón?</h2>
                <p>
                    Viajar a Japón es una experiencia única que te sumerge en una cultura milenaria, paisajes impresionantes y tecnología de vanguardia. Descubrirás la serenidad de antiguos templos, la emoción de las ciudades modernas y la deliciosa gastronomía japonesa. <span className="font-bold">¡Japón te espera con maravillas inigualables!</span>
                </p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center p-4">
                <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/WLIv7HnZ_fE?start=13" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen>
                </iframe>
            </div>
        </div>
    );
}

export default Seccion4;