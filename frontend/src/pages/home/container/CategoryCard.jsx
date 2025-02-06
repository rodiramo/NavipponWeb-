import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as MdIcons from "react-icons/md";
import * as TbIcons from "react-icons/tb";

const categories = [
    { icon: <MdIcons.MdOutlineHotel />, title: 'Hoteles', url: '/experience?category=Hoteles&region=', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: <MdIcons.MdOutlineRamenDining />, title: 'Restaurantes', url: '/experience?category=Restaurantes&region=', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { icon: <TbIcons.TbTorii />, title: 'Actividades', url: '/experience?category=Atractivos&region=', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
];

const CategoryCard = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (url) => {
        navigate(url);
    };

    return (
        <div className="category-carousel my-12 p-6">
            <h2 className="text-left mb-4 text-2xl">Navega por categoría</h2>
            <div className="flex flex-col md:flex-row justify-center md:space-x-8 space-y-4 md:space-y-0">
                {categories.map((category, index) => (
                    <div key={index} className="p-4 bg-white shadow-lg rounded-lg cursor-pointer" onClick={() => handleCategoryClick(category.url)}>
                        <div className="flex flex-col items-center text-center">
                            <div className="icon-container mb-4 flex justify-center items-center" style={{ width: '120px', height: '120px' }}>
                                {React.cloneElement(category.icon, { color: '#fa5564', size: '4em' })}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                            <p className="text-gray-600">{category.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryCard;