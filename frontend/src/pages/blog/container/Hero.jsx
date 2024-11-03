import React from 'react';
import heroblog from '../../../assets/heroblog.webp';
import nube from '../../../assets/nube.png';

const Hero = () => {
    return (
        <div className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url(${heroblog})` }}>
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="relative flex flex-col items-center justify-center h-full text-white text-center">
                <h2 className="text-4xl md:text-6xl font-bold">Lee los artículos más interesantes</h2>
                <img src={nube} alt="Nube" className="mt-5" />
            </div> 
        </div>
    );
}

export default Hero;