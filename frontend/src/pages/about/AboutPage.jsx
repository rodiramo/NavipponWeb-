import React from 'react'
import MainLayout from '../../components/MainLayout'
import Hero from './container/Hero';
import Seccion1 from './container/Seccion1';
import Seccion2 from './container/Seccion2';
import Seccion3 from './container/Seccion3';
import Seccion4 from './container/Seccion4';

const AboutPage = () => {
        return <MainLayout>
                <Hero />
                <Seccion1 />
                <Seccion2 />
                <Seccion3 />
                <Seccion4 />
        </MainLayout>
};

export default AboutPage
