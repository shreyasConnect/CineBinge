import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import "./Favourites.css";

const API_URL = import.meta.env.VITE_API_URL;



const MOVIES_PER_PAGE = 8;

const Favourites = () => {
    const [favouriteMovies, setFavouriteMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);

    useEffect(() => {
        const fetchFavourites = async (page = 1) => {
            setLoading(true);
            const likedMovieIds = JSON.parse(localStorage.getItem("likedMovies")) || [];
            const startIndex = (page - 1) * MOVIES_PER_PAGE;
            const endIndex = startIndex + MOVIES_PER_PAGE;
            const currentPageMovies = likedMovieIds.slice(startIndex, endIndex);

            const moviePromises = currentPageMovies.map(async (id) => {
                const response = await fetch(`${API_URL}&i=${id}`);
                const data = await response.json();
                return data;
            });

            const movies = await Promise.all(moviePromises);
            setFavouriteMovies(movies.filter((movie) => movie.Response === "True"));
            setTotalResults(likedMovieIds.length);
            setLoading(false);
        };

        fetchFavourites(currentPage);
    }, [currentPage]);

    const totalPages = Math.ceil(totalResults / MOVIES_PER_PAGE);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="favourites-page">
            <h1 className="fav">Your Favourites</h1>

            {loading ? (
                <span className="loader"></span>
            ) : favouriteMovies.length > 0 ? (
                <>
                    <div className="container">
                        {favouriteMovies.map((movie) => (
                            <MovieCard key={movie.imdbID} movie={movie} />
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>

                        <span>Page {currentPage} of {totalPages}</span>

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <p className="no-fav">No favourites yet. Start liking some movies!</p>
            )}
        </div>
    );
};

export default Favourites;
