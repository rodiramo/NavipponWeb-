import heroabout from '../../../assets/heroabout.png';
import nube from '../../../assets/nube.png';

const Hero = () => {
    return (
        <section className="relative bg-cover bg-center h-[100vh] md:bg-right" style={{ backgroundImage: `url(${heroabout})`, backgroundSize: 'cover', backgroundPosition: 'right bottom' }}>
            <div className="flex flex-col items-center justify-center h-full">
                <h2 className="text-white text-6xl font-bold mb-4 text-center">Sobre Nosotros</h2>
                <img src={nube} alt="Nube" className="mt-5 mb-4" />
            </div>
        </section>
    );
};

export default Hero;