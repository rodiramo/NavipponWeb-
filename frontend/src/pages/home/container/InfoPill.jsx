import React from 'react';
import pastilla1 from '../../../assets/pastilla1.png';
import pastilla2 from '../../../assets/pastilla2.png';
import pastilla3 from '../../../assets/pastilla3.png';

const InfoPill = () => {
    const pills = [
        {
            img: pastilla1,
            title: 'Filtra según tus preferencias',
            description: 'Descubre la magia de Japón adaptada a tus gustos. Nuestra app te permite filtrar atractivos turísticos por categorías.'
        },
        {
            img: pastilla2,
            title: 'Encuentra lo que buscas',
            description: 'Encuentra información detallada, imágenes inspiradoras y reseñas de otros viajeros para tomar decisiones informadas.'
        },
        {
            img: pastilla3,
            title: 'Arma tu itinerario y planea tu ruta',
            description: 'Organiza tu propio itinerario personalizado, y crea tus rutas de viaje al seleccionar tus lugares favoritos.'
        }
    ];

    return (
        <section className="relative p-8 -mt-12 rounded-t-3xl bg-white">
            <div className="text-center">
                <h3 className="text-2xl font-bold mb-2" style={{ fontSize: '2em' }}>¿Cómo funciona?</h3>
                <span className="text-lg" style={{ fontSize: '1.25em' }}>Navippon te ayuda a planificar tu viaje.</span>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                {pills.map((pill, index) => (
                    <div key={index} className="flex flex-col items-center text-center bg-white p-4 rounded-lg w-full md:w-1/3">
                        <img src={pill.img} alt={pill.title} className="mb-2 w-72 h-72 object-contain" />
                        <h4 className="text-lg font-bold mb-1" style={{ fontSize: '1.5em' }}>{pill.title}</h4>
                        <p style={{ fontSize: '1em' }}>{pill.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default InfoPill;