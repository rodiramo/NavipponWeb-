import React from "react";
import { BsCheckLg } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

import { images, stables } from "../constants";
import { Link } from "react-router-dom";

const ExperienceCard = ({ experience, className }) => {
    return (
        <div
            className={`rounded-xl overflow-hidden shadow-[rgba(7,_65,_210,_0.1)_0px_9px_30px] ${className}`}
        >
            <Link to={`/experience/${experience.slug}`}>
                <img
                    src={
                        experience.photo
                            ? stables.UPLOAD_FOLDER_BASE_URL + experience.photo
                            : images.sampleExperienceImage
                    }
                    alt="title"
                    className="w-full object-cover object-center h-auto md:h-52 lg:h-48 xl:h-60"
                />
            </Link>
            <div className="p-5">
                <Link to={`/experience/${experience.slug}`}>
                    <h2 className="font-roboto font-bold text-xl text-dark-soft md:text-2xl lg:text-[28px]">
                        {experience.title}
                    </h2>
                    <p className="text-dark-light mt-3 text-sm md:text-lg">
                        {experience.caption}
                    </p>
                </Link>
                <div className="flex justify-between flex-nowrap items-center mt-6">
                    <div className="flex items-center gap-x-2 md:gap-x-2.5">
                        <img
                            src={
                                experience.user.avatar
                                    ? stables.UPLOAD_FOLDER_BASE_URL + experience.user.avatar
                                    : images.userImage
                            }
                            alt="experiencia"
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                            <h4 className="font-bold italic text-dark-soft text-sm md:text-base">
                                {experience.user.name}
                            </h4>
                            <div className="flex items-center gap-x-2">
                                <span
                                    className={`${experience.approved ? "bg-[#36B37E]" : "bg-[#FF4A5A]"
                                        } w-fit bg-opacity-20 p-1.5 rounded-full`}
                                >
                                    {experience.approved ? (
                                        <BsCheckLg className="w-1.5 h-1.5 text-[#36B37E]" />
                                    ) : (
                                        <AiOutlineClose className="w-1.5 h-1.5 text-[#FF4A5A]" />
                                    )}
                                </span>
                                <span className="italic text-dark-light text-xs md:text-sm">
                                    Experiencia {experience.approved ? "verificada" : "sin verificar"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <span className="font-bold text-dark-light italic text-sm md:text-base">
                        {new Date(experience.createdAt).getDate()}{" "}
                        {new Date(experience.createdAt).toLocaleString("default", {
                            month: "long",
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ExperienceCard;
