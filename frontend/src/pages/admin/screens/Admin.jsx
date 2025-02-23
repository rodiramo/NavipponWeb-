import React, { useEffect, useState } from 'react';
import { getUserCount } from '../../../services/index/users';
import { getExperienceCount, getTopExperiences } from '../../../services/index/experiences';
import { getReviewCount } from '../../../services/index/reviews';
import { getPostCount } from '../../../services/index/posts';
import { getCommentCount } from '../../../services/index/comments';
import { getFavoritesCount } from '../../../services/index/favorites';
import useUser from '../../../hooks/useUser';
import { Typography } from '@mui/material';

const Admin = () => {
  const { jwt } = useUser();
  const [counts, setCounts] = useState({
    users: 0,
    experiences: 0,
    reviews: 0,
    posts: 0,
    comments: 0,
  });
  const [topExperiences, setTopExperiences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCount = await getUserCount(jwt);
        const experiencesCount = await getExperienceCount(jwt);
        const reviewsCount = await getReviewCount(jwt);
        const postsCount = await getPostCount(jwt);
        const commentsCount = await getCommentCount(jwt);
        const topExperiencesData = await getTopExperiences();

        // Obtener el conteo de favoritos para cada experiencia
        const experiencesWithFavorites = await Promise.all(
          topExperiencesData.map(async (experience) => {
            const favoritesData = await getFavoritesCount(experience._id);
            return { ...experience, favoritesCount: favoritesData.favoritesCount };
          })
        );

        console.log("Users count:", usersCount); 
        console.log("Experiences count:", experiencesCount);  
        console.log("Reviews count:", reviewsCount);  
        console.log("Posts count:", postsCount);  
        console.log("Comments count:", commentsCount);  
        console.log("Top experiences with favorites:", experiencesWithFavorites);  

        setCounts({
          users: usersCount,
          experiences: experiencesCount,
          reviews: reviewsCount,
          posts: postsCount,
          comments: commentsCount,
        });
        setTopExperiences(experiencesWithFavorites);
      } catch (error) {
        console.error('Error fetching counts', error);
      }
    };

    fetchData();
  }, [jwt]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 items-center justify-center">  
        <div className="p-4 bg-white rounded-lg shadow-md" style={{ width: '30%' }}>
          <h2 className="text-xl font-semibold">Users</h2>
          <p className="text-2xl">{counts.users}</p>
        </div>
        <div className="grid grid-cols-2 gap-4" style={{ width: '40%' }}>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Experiences</h2>
            <p className="text-2xl">{counts.experiences}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <p className="text-2xl">{counts.reviews}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4" style={{ width: '40%' }}>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Posts</h2>
            <p className="text-2xl">{counts.posts}</p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Comments</h2>
            <p className="text-2xl">{counts.comments}</p>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md" style={{ width: '90%' }}>
          <h2 className="text-xl font-semibold mb-2">Top Experiences</h2>
          <ul>
            {topExperiences.map((experience) => (
              <li key={experience._id} className="mb-2">
                <h3 className="text-lg font-semibold">{experience.title}</h3>
                <Typography variant="body2" color="text.secondary">
                  {experience.favoritesCount} Favoritos
                </Typography>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Admin;