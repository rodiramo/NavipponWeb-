import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaGlobe, FaClock, FaCalendarAlt, FaDollarSign } from 'react-icons/fa';
import { IoLocationSharp } from "react-icons/io5";
import { generalTags, attractionTags, hotelTags, restaurantTags } from './tags';

const Aside = ({ info }) => {
    console.log('Info:', info);  

    const renderTags = (tags, availableTags) => {
        return tags.map((tag, index) => {
            const tagInfo = availableTags.find(t => t.title === tag);
            return tagInfo ? (
                <div key={index} className="flex items-center mb-2">
                    <div className="icon-container mr-2">
                        {tagInfo.icon}
                    </div>
                    <span>{tagInfo.title}</span>
                </div>
            ) : null;
        });
    };

    return (
        <div>
            {/* Mapa de Google */}
            <div className="mt-12 md:mt-0 mb-12" style={{ height: '400px', position: 'relative' }}>
                <iframe
                    src={info.map}
                    width="100%"
                    height="100%"
                    style={{ border: 0, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    title="Mapa de Google"
                    className="w-full h-full rounded-lg"
                ></iframe>
            </div>

            {/* Información Útil */}
            <div className="bg-[#f4f4f4] p-4 rounded-lg text-black mb-4 max-w-md">
                <h4 className="font-bold mb-2">Información Útil</h4>
                <p><IoLocationSharp className="inline-block mr-2 text-[#FA5564]" /> Dirección: {info.address}</p>
                <p><FaPhoneAlt className="inline-block mr-2 text-[#FA5564]" /> Teléfono: {info.phone}</p>
                <p><FaEnvelope className="inline-block mr-2 text-[#FA5564]" /> Mail: {info.email}</p>
                <p><FaGlobe className="inline-block mr-2 text-[#FA5564]" /> Web: <a href={info.website} target="_blank" rel="noopener noreferrer">{info.website}</a></p>
                <p><FaClock className="inline-block mr-2 text-[#FA5564]" /> Horarios: {info.schedule}</p>
                <p><FaCalendarAlt className="inline-block mr-2 text-[#FA5564]" /> Época: {info.generalTags.season.join(', ')}</p>
                <p><FaDollarSign className="inline-block mr-2 text-[#FA5564]" /> Precio estimado: {info.price}</p>
            </div>

            {/* General */}
            <div className="bg-white border border-[#f4f4f4] rounded-lg text-black mb-4">
                <h4 className="font-bold mb-2 bg-[#f4f4f4] text-black p-2 rounded">Ubicación y Precio</h4>
                {renderTags(info.generalTags.location, generalTags.location)}
                {renderTags(info.generalTags.budget, generalTags.budget)}
            </div>

            {/* Atractivo */}
            {info.categories === 'Atractivos' && (
                <div className="bg-white border border-[#f4f4f4] rounded-lg text-black mb-4">
                    <h4 className="font-bold mb-2 bg-[#f4f4f4] text-black p-2 rounded">Tipo Atractivo</h4>
                    <div className="flex flex-row items-start text-center ml-2">
                        {renderTags(info.attractionTags, attractionTags)}
                    </div>
                </div>
            )}

            {/* Hotel */}
            {info.categories === 'Hoteles' && (
                <>
                    <div className="bg-white border border-[#f4f4f4] rounded-lg text-black mb-4">
                        <h4 className="font-bold mb-2 bg-[#f4f4f4] text-black p-2 rounded">Tipo de alojamiento</h4>
                        {renderTags(info.hotelTags.accommodation, hotelTags.accommodations)}
                    </div>

                    <div className="bg-white border border-[#f4f4f4] rounded-lg text-black mb-4">
                        <h4 className="font-bold mb-2 bg-[#f4f4f4] text-black p-2 rounded">Servicios</h4>
                        {renderTags(info.hotelTags.hotelServices, hotelTags.hotelServices)}
                    </div>

                    <div className="bg-white border border-[#f4f4f4] rounded-lg text-black mb-4">
                        <h4 className="font-bold mb-2 bg-[#f4f4f4] text-black p-2 rounded">Tipo de viaje</h4>
                        {renderTags(info.hotelTags.typeTrip, hotelTags.typeTrip)}
                    </div>
                </>
            )}

            {/* Restaurante */}
            {info.categories === 'Restaurantes' && (
                <>
                    <div className="bg-white border border-[#f4f4f4] rounded-lg text-black mb-4">
                        <h4 className="font-bold mb-2 bg-[#f4f4f4] text-black p-2 rounded">Tipo de restaurante</h4>
                        {renderTags(info.restaurantTags.restaurantTypes, restaurantTags.restaurantTypes)}
                    </div>

                    <div className="bg-white border border-[#f4f4f4] rounded-lg text-black mb-4">
                        <h4 className="font-bold mb-2 bg-[#f4f4f4] text-black p-2 rounded">Cocinas</h4>
                        {renderTags(info.restaurantTags.cuisines, restaurantTags.cuisines)}
                    </div>

                    <div className="bg-white border border-[#f4f4f4] rounded-lg text-black mb-4">
                        <h4 className="font-bold mb-2 bg-[#f4f4f4] text-black p-2 rounded">Servicios de restaurante</h4>
                        {renderTags(info.restaurantTags.restaurantServices, restaurantTags.restaurantServices)}
                    </div>
                </>
            )}
        </div>
    );
};

export default Aside;