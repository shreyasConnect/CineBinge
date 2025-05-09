import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';
import Liked from "../assets/liked.svg";
import Like from "../assets/like.svg";

const MovieCard = ({ movie: { imdbID, Year, Poster, Title, Type } }) => {
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();

    // Check if the movie is already liked on initial render
    useEffect(() => {
        const likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || [];
        setLiked(likedMovies.includes(imdbID));
    }, [imdbID]);

    const toggleLike = () => {
        const likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || [];

        if (liked) {
            // Unlike the movie
            const updatedLikes = likedMovies.filter((id) => id !== imdbID);
            localStorage.setItem("likedMovies", JSON.stringify(updatedLikes));
            setLiked(false);
        } else {
            // Like the movie
            likedMovies.push(imdbID);
            localStorage.setItem("likedMovies", JSON.stringify(likedMovies));
            setLiked(true);
        }
    };

    const handleCardClick = () => {
        navigate(`/movie/${imdbID}`);
    };

    return (
        <div className="movie" key={imdbID} >
            <div>
                <p onClick={handleCardClick}>{Year}</p>
            </div>

            <div onClick={handleCardClick}>
                <img
                    src={Poster !== "N/A" ? Poster : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNL9vI5ADG08H_DNtnJ8fzBD9ydPAdzFeKvw&s"}
                    alt={Title}
                />
            </div>

            <div>
                <span onClick={handleCardClick}>{Type}</span>
                <h3 onClick={handleCardClick}>{Title}</h3>
                <button className="like-button" onClick={toggleLike}>
                    <img
                        src={liked ? Liked : Like}
                        alt="like button"
                        className="like-icon"
                    />
                </button>
            </div>
        </div>
    );
};

export default MovieCard;
