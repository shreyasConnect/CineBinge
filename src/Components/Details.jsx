import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Details.css";
import Liked from "../assets/liked.svg";
import Like from "../assets/like.svg";

const Details = () => {
    const { imdbID } = useParams();
    const [movie, setMovie] = useState(null);
    const [liked, setLiked] = useState(() => {
        const likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || [];
        return likedMovies.includes(imdbID);
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}&i=${imdbID}&plot=full`);
                if (!response.ok) throw new Error("Failed to fetch movie details");
                const data = await response.json();
                setMovie(data);
            } catch (error) {
                setError("Failed to load movie details. Please try again later.");
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [imdbID]);

    const toggleLike = () => {
        setLiked((prev) => {
            const updatedLiked = !prev;
            const likedMovies = JSON.parse(localStorage.getItem("likedMovies")) || [];
            if (updatedLiked) {
                localStorage.setItem("likedMovies", JSON.stringify([...likedMovies, imdbID]));
            } else {
                const updatedList = likedMovies.filter(id => id !== imdbID);
                localStorage.setItem("likedMovies", JSON.stringify(updatedList));
            }
            return updatedLiked;
        });
    };

    if (loading) {
        return <span className="loader"></span>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return movie ? (
        <div className="details-container">
            <div className="poster">
                <img src={movie.Poster !== "N/A" ? movie.Poster : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNL9vI5ADG08H_DNtnJ8fzBD9ydPAdzFeKvw&s"} alt={movie.Title} />
                <button className="like-button" onClick={toggleLike}>
                    <img src={liked ? Liked : Like} alt="like button" />
                </button>
            </div>
            <div className='info'>
                <h1>{movie.Title}</h1>
                <p><strong>Year:</strong> {movie.Year}</p>
                <p><strong>Rated:</strong> {movie.Rated}</p>
                <p><strong>Released:</strong> {movie.Released}</p>
                <p><strong>Runtime:</strong> {movie.Runtime}</p>
                <p><strong>Genre:</strong> {movie.Genre}</p>
                <p><strong>Director:</strong> {movie.Director}</p>
                <p><strong>Writer:</strong> {movie.Writer}</p>
                <p><strong>Actors:</strong> {movie.Actors}</p>
                <p><strong>Plot:</strong> {movie.Plot}</p>
                <p><strong>Language:</strong> {movie.Language}</p>
                <p><strong>Country:</strong> {movie.Country}</p>
                <p><strong>Awards:</strong> {movie.Awards}</p>
                <p><strong>IMDb Rating:</strong> {movie.imdbRating}</p>
                <p><strong>Box Office:</strong> {movie.BoxOffice}</p>
                <p><strong>Production:</strong> {movie.Production}</p>
            </div>
        </div>
    ) : (
        <div className="error">Movie not found.</div>
    );
};

export default Details;
