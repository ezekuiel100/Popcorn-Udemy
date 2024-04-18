import { useState } from "react";
import { useMovie } from "./useMovie";
import { useLocalStorage } from "./useLocalStorage";
import Nav from "./components/Nav";
import Search from "./components/Search";
import Box from "./components/Box";
import Main from "./components/Main";
import MovieDetails from "./components/MovieDetails";
import Summary from "./components/Summary";
import MoviesList from "./components/MoviesList";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import WatchedList from "./components/WatchedList";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useMovie(query, handleCloseMovie);
  const [watched, setWatched] = useLocalStorage([], "watched");

  function handleCloseMovie() {
    setSelectedId("");
  }

  function handleSelectMovie(id) {
    setSelectedId((selected) => (id === selected ? null : id));
    setUserRating(0);
  }

  function handleWatched(movie) {
    setWatched([...watched, movie]);
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Nav movies={movies}>
        <Search query={query} onSetQuery={setQuery} />
      </Nav>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MoviesList movies={movies} handleSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleWatched}
              userRating={userRating}
              setUserRating={setUserRating}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
