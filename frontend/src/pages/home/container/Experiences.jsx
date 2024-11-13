import React from "react";
import { FaArrowRight } from "react-icons/fa";
import ExperienceCard from "../../../components/ExperienceCard";
import { useQuery } from "@tanstack/react-query";
import { getAllExperiences } from "../../../services/index/experiences";
import { toast } from "react-hot-toast";
import ExperienceCardSkeleton from "../../../components/ExperienceCardSkeleton";
import ErrorMessage from "../../../components/ErrorMessage";
import { Link } from "react-router-dom";

const Experiences = ({ user, token }) => {  
    console.log("Experiences - user:", user);
    console.log("Experiences - token:", token);

    const { data, isLoading, isError } = useQuery({
        queryFn: () => getAllExperiences("", 1, 6),
        queryKey: ["experiences"],
        onError: (error) => {
            toast.error(error.message);
            console.log(error);
        },
    });

    return (
        <section className="flex flex-col container mx-auto px-5 py-10">
            <h2 className="text-left pt-4 mb-4 text-2xl">Navega nuestras últimas experiencias</h2>
            <div className=" flex flex-wrap md:gap-x-5 gap-y-5 pb-10 mt-3">
                {isLoading ? (
                    [...Array(3)].map((item, index) => (
                        <ExperienceCardSkeleton
                            key={index}
                            className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                        />
                    ))
                ) : isError ? (
                    <ErrorMessage message="No se pudieron obtener los detalles de la publicación" />
                ) : (
                    data?.data.slice(0, 3).map((experience) => (
                        <ExperienceCard
                            key={experience._id}
                            experience={experience}
                            className="w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-21px)]"
                            user={user}  
                            token={token}  
                        />
                    ))
                )}
            </div>
            <Link
                to="/experience"
                className="mx-auto flex items-center gap-x-2 font-bold text-primary border-2 border-primary px-6 py-3 rounded-lg"
            >
                <span>Leer más experiencias</span>
                <FaArrowRight className="w-3 h-3" />
            </Link>
        </section>
    );
};

export default Experiences;