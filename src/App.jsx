import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import './App.css';
import SearchIcon from "./assets/search.svg";
import MovieCard from "./Components/MovieCard";
import Favourites from "./Components/Favourites";
import ContactUs from "./pages/Contact";
import Details from "./Components/Details";

const API_URL = import.meta.env.VITE_API_URL;

const MOVIES_PER_PAGE = 9;

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const searchMovies = async (title, page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}&s=${title}&page=${page}`);
      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search || []);
        setTotalResults(parseInt(data.totalResults, 10));
      } else {
        setMovies([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setMovies([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const term = query.get("q") || "Avengers";
    const page = parseInt(query.get("page"), 10) || 1;
    setSearchTerm(term);
    setCurrentPage(page);
    searchMovies(term, page);
  }, [location.search]);

  const handlePageChange = (newPage) => {
    const query = new URLSearchParams();
    query.set("q", searchTerm || "Avengers");
    query.set("page", newPage);
    navigate(`/?${query.toString()}`);
  };

  const totalPages = Math.ceil(totalResults / MOVIES_PER_PAGE);

  return (
    <>
      <header className="header">
        <h1 className="logo"><Link to="/">CineBinge</Link></h1>
        <nav className="nav">
          <Link to="/favourites" className="nav-item">Favourites</Link>
          <Link to="/contact" className="nav-item">Contact</Link>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <div className="search">
                <input
                  placeholder="Search for movies"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img src={SearchIcon} alt="search" onClick={() => handlePageChange(1)} />
              </div>

              {loading ? (
                <span className="loader"></span>
              ) : movies.length > 0 ? (
                <div className="container">
                  {movies.slice(0, MOVIES_PER_PAGE).map((movie) => (
                    <MovieCard key={movie.imdbID} movie={movie} />
                  ))}
                </div>
              ) : (
                <div className="empty">
                  <h2>No Movies Found</h2>
                </div>
              )}

              {totalResults > MOVIES_PER_PAGE && (
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
              )}
            </div>
          }
        />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/movie/:imdbID" element={<Details />} />
      </Routes>
    </>
  );
}


export default App;
