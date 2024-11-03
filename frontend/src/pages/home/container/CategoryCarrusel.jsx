import React from 'react';
import Slider from 'react-slick';
import * as MdIcons from "react-icons/md";
import * as PiIcons from "react-icons/pi";
import * as TbIcons from "react-icons/tb";
import * as FaIcons from "react-icons/fa6";
import * as GiIcons from "react-icons/gi";
import * as LiaIcons from "react-icons/lia";
import * as BsIcons from "react-icons/bs";
import * as VscIcons from "react-icons/vsc";
import * as LuIcons from "react-icons/lu";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const categories = [
    { icon: <MdIcons.MdOutlineForest />, title: 'Naturaleza' },
    { icon: <MdIcons.MdOutlineBeachAccess />, title: 'Playa' },
    { icon: <TbIcons.TbBuildingMonument />, title: 'Monumento' },
    { icon: <MdIcons.MdOutlineRamenDining />, title: 'Gastronomía' },
    { icon: <LiaIcons.LiaCocktailSolid />, title: 'Noche' },
    { icon: <GiIcons.GiGreekTemple />, title: 'Museo' },
    { icon: <MdIcons.MdOutlineCoffee />, title: 'Cafés' },
    { icon: <MdIcons.MdOutlineShoppingBag />, title: 'Shooping' },
    { icon: <FaIcons.FaRegStar />, title: 'Ocio' },
    { icon: <GiIcons.GiPartyPopper />, title: 'Festival' },
    { icon: <BsIcons.BsRobot />, title: 'Tecnología' },
    { icon: <LiaIcons.LiaGamepadSolid />, title: 'Juegos' },
    { icon: <VscIcons.VscOctoface />, title: 'Anime' },
    { icon: <LuIcons.LuFerrisWheel />, title: 'Parques temáticos' },
    { icon: <GiIcons.GiSamuraiHelmet />, title: 'Samurai' },
    { icon: <MdIcons.MdOutlineTempleBuddhist />, title: 'Templo Budista' },
    { icon: <PiIcons.PiBirdBold />, title: 'Reserva de Aves' },
    { icon: <MdIcons.MdOutlineCastle />, title: 'Castillos' },
    { icon: <PiIcons.PiCross />, title: 'Templo Cristiano' },
    { icon: <TbIcons.TbTorii />, title: 'Templo Sintoísta' },
    { icon: <MdIcons.MdOutlineTempleHindu />, title: 'Templo Hindu' },
    { icon: <PiIcons.PiHandEyeLight />, title: 'Templo Jainita' },
    { icon: <FaIcons.FaRegMoon />, title: 'Templo islámico' },
    { icon: <PiIcons.PiStarOfDavid />, title: 'Templo judío' },
    { icon: <GiIcons.GiYinYang />, title: 'Templo Taoísta' },
    { icon: <GiIcons.GiAncientRuins />, title: 'Ruinas' },
    { icon: <MdIcons.MdOutlineHotTub />, title: 'Onsen' },
    { icon: <GiIcons.GiGrapes />, title: 'Viñedos' },
    { icon: <PiIcons.PiPawPrint />, title: 'Vida Silvestre' },
    { icon: <PiIcons.PiEyeBold />, title: 'Punto de interés' },
    { icon: <MdIcons.MdOutlineSurfing />, title: 'Surf' },
    { icon: <MdIcons.MdKayaking />, title: 'Kayak' },
    { icon: <FaIcons.FaPersonSkiing />, title: 'Esquí' },
    { icon: <GiIcons.GiProtectionGlasses />, title: 'Buceo' },
    { icon: <MdIcons.MdHiking />, title: 'Senderismo' },
];

const CategoryCarousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 10,
        slidesToScroll: 10,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 5,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            }
        ]
    };

    return (
        <div className="category-carousel my-12 p-6">
            <h2 className="text-left mb-4 text-2xl">Navega por categoría</h2>
            <Slider {...settings}>
                {categories.map((category, index) => (
                    <div key={index} className="p-4">
                        <div className="flex flex-col items-center text-center">
                            <div className="icon-container mb-4 bg-white shadow-lg rounded-full flex justify-center items-center" style={{ width: '80px', height: '80px' }}>
                                {React.cloneElement(category.icon, { color: '#fa5564', size: '2em' })}
                            </div>
                            <span className="text-[#8F9BB3]">{category.title}</span>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default CategoryCarousel;