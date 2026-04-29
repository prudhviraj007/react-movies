import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

const MOVIES_API_URL = "https://jsonfakery.com/movies/paginated";

const mergeMovies = (currentMovies, newMovies) => {
  const movieMap = new Map();

  [...currentMovies, ...newMovies].forEach((movie) => {
    movieMap.set(movie.id, movie);
  });

  return Array.from(movieMap.values());
};

const getMovieYear = (releaseDate) => {
  if (!releaseDate) {
    return "Unknown";
  }

  const date = new Date(releaseDate);

  if (Number.isNaN(date.getFullYear())) {
    return "Unknown";
  }

  return date.getFullYear();
};

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [searchPool, setSearchPool] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [totalMovies, setTotalMovies] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    from: 0,
    to: 0,
  });
  const [error, setError] = useState("");
  const searchInputRef = useRef(null);
  const resultsRef = useRef(null);

  const loadMovies = useCallback(async (page = 1) => {
    try {
      setError("");
      setIsLoading(true);

      const response = await fetch(`${MOVIES_API_URL}?page=${page}`);

      if (!response.ok) {
        throw new Error("Unable to fetch movies");
      }

      const movieResponse = await response.json();

      setMovies(movieResponse.data);
      setSearchPool((currentMovies) =>
        mergeMovies(currentMovies, movieResponse.data)
      );
      setTotalMovies(movieResponse.total);
      setPagination({
        currentPage: movieResponse.current_page,
        lastPage: movieResponse.last_page,
        from: movieResponse.from,
        to: movieResponse.to,
      });

      if (page === 1) {
        [2, 3, 4, 5].forEach(async (searchPage) => {
          try {
            const searchResponse = await fetch(
              `${MOVIES_API_URL}?page=${searchPage}`
            );
            const searchMovieResponse = await searchResponse.json();

            setSearchPool((currentMovies) =>
              mergeMovies(currentMovies, searchMovieResponse.data)
            );
          } catch {
            // Search still works with the pages already loaded.
          }
        });
      }
    } catch {
      setError("Movies could not be loaded. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMovies();
  }, [loadMovies]);

  const filteredMovies = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();
    const movieSource = searchValue ? searchPool : movies;

    if (!searchValue) {
      return movieSource;
    }

    return movieSource.filter((movie) =>
      `${movie.original_title} ${movie.original_language} ${
        movie.overview
      } ${getMovieYear(movie.release_date)}`
        .toLowerCase()
        .includes(searchValue)
    );
  }, [movies, searchPool, searchTerm]);

  const recommendedMovies = useMemo(
    () =>
      [...movies]
        .sort((a, b) => b.vote_average - a.vote_average)
        .slice(0, 4),
    [movies]
  );

  const rankedRecommendationMovies = useMemo(() => {
    const rankingSource = searchTerm.trim() ? filteredMovies : movies;

    return [...rankingSource]
      .sort(
        (a, b) =>
          b.vote_average - a.vote_average || b.popularity - a.popularity
      )
      .slice(0, 5);
  }, [filteredMovies, movies, searchTerm]);

  const topSearchMovies = useMemo(
    () => [...movies].sort((a, b) => b.popularity - a.popularity).slice(0, 4),
    [movies]
  );

  const pageNumbers = useMemo(() => {
    const startPage = Math.max(1, pagination.currentPage - 2);
    const endPage = Math.min(pagination.lastPage, startPage + 4);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }, [pagination.currentPage, pagination.lastPage]);

  const heroMovie = recommendedMovies[0];

  const scrollToMovieResults = () => {
    const resultsTop =
      (resultsRef.current?.getBoundingClientRect().top || 0) +
      window.scrollY -
      88;

    window.scrollTo(0, Math.max(resultsTop, 0));
  };

  const handlePageChange = async (page, event) => {
    event.currentTarget.blur();
    scrollToMovieResults();
    await loadMovies(page);
    requestAnimationFrame(scrollToMovieResults);
    setTimeout(scrollToMovieResults, 50);
  };

  const handleExploreMovies = () => {
    searchInputRef.current?.focus();
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <section className="wrapper gap-12">
        <div className="grid min-h-[70vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-light-200">
              Movie discovery
            </p>
            <h1 className="mx-0 text-left">Find Movies Here</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-light-200 sm:text-lg">
              More here: browse real API movies, search by name, and discover
              ranked recommendations from the movie list.
            </p>

            <div className="mt-8 w-full max-w-2xl rounded-lg bg-light-100/5 px-4 py-3">
              <input
                className="w-full bg-transparent py-2 text-base text-white outline-none placeholder:text-light-200"
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search movies by name, language, overview, or year"
                ref={searchInputRef}
                type="search"
                value={searchTerm}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                className="rounded-lg bg-white px-5 py-3 font-semibold text-primary transition hover:bg-light-100"
                onClick={handleExploreMovies}
                type="button"
              >
                Explore More
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-light-100/10 bg-light-100/5 p-5 shadow-inner shadow-light-100/10">
            <div
              className="aspect-[4/5] rounded-lg bg-cover bg-center p-5"
              style={{
                backgroundImage: heroMovie
                  ? `linear-gradient(180deg, rgba(3,0,20,0.12), rgba(3,0,20,0.92)), url(${heroMovie.backdrop_path || heroMovie.poster_path})`
                  : "radial-gradient(circle at top,#AB8BFF 0%,#30265c 38%,#0f0d23 75%)",
              }}
            >
              <div className="flex h-full flex-col justify-end rounded-lg border border-white/10 bg-black/20 p-5">
                <p className="text-sm uppercase tracking-[0.2em] text-light-100">
                  Weekend watchlist
                </p>
                <h2 className="mt-3 text-4xl">
                  {heroMovie?.original_title || "Now Showing"}
                </h2>
                <p className="mt-4 leading-7 text-light-200">
                  {heroMovie
                    ? `Rating ${heroMovie.vote_average?.toFixed(1)} - Popularity ${heroMovie.popularity}`
                    : "A top API movie will appear here when movies load."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-6">
          <div
            className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"
            ref={resultsRef}
          >
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-light-200">
                Movie results
              </p>
              <h2 className="mt-2">
                {searchTerm ? "Search results" : "Paginated movies"}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-gray-100">
              {searchTerm
                ? `Showing ${filteredMovies.length} searched movies with ranked recommendations.`
                : `Showing ${pagination.from || 0}-${
                    pagination.to || 0
                  } of ${totalMovies.toLocaleString()} API movies.`}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {error && (
              <p className="rounded-lg bg-dark-100 p-5 text-light-200">
                {error}
              </p>
            )}

            {isLoading && (
              <p className="rounded-lg bg-dark-100 p-5 text-light-200">
                Loading movies from API...
              </p>
            )}

            {!isLoading && filteredMovies.length === 0 && (
              <p className="rounded-lg bg-dark-100 p-5 text-light-200">
                No movies found. Try another movie name or page.
              </p>
            )}

            {filteredMovies.map((movie) => (
                <article
                  className="overflow-hidden rounded-lg border border-light-100/10 bg-dark-100 shadow-inner shadow-light-100/10"
                  key={movie.id}
                >
                  <div className="relative h-72 bg-primary">
                    <img
                      alt={movie.original_title}
                      className="h-full w-full object-cover"
                      src={movie.poster_path}
                    />
                    <span className="absolute bottom-4 left-4 rounded bg-white px-3 py-1 text-sm font-bold text-primary">
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="line-clamp-1 text-lg font-bold text-white">
                      {movie.original_title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-100">
                      {movie.original_language?.toUpperCase()} -{" "}
                      {getMovieYear(movie.release_date)}
                    </p>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-light-200">
                      {movie.overview}
                    </p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-light-200">
                      Popularity {movie.popularity}
                    </p>
                  </div>
                </article>
              ))}
          </div>

          {!searchTerm && pagination.lastPage > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                className="rounded-lg border border-light-100/20 px-4 py-2 font-semibold text-white transition hover:border-light-100/50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading || pagination.currentPage === 1}
                onClick={(event) =>
                  handlePageChange(pagination.currentPage - 1, event)
                }
                type="button"
              >
                Previous
              </button>

              {pageNumbers.map((pageNumber) => (
                <button
                  className={`rounded-lg px-4 py-2 font-semibold transition ${
                    pagination.currentPage === pageNumber
                      ? "bg-white text-primary"
                      : "border border-light-100/20 text-white hover:border-light-100/50"
                  }`}
                  disabled={isLoading}
                  key={pageNumber}
                  onClick={(event) => handlePageChange(pageNumber, event)}
                  type="button"
                >
                  {pageNumber}
                </button>
              ))}

              <button
                className="rounded-lg border border-light-100/20 px-4 py-2 font-semibold text-white transition hover:border-light-100/50 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={
                  isLoading || pagination.currentPage === pagination.lastPage
                }
                onClick={(event) =>
                  handlePageChange(pagination.currentPage + 1, event)
                }
                type="button"
              >
                Next
              </button>
            </div>
          )}
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-light-100/10 bg-light-100/5 p-6 shadow-inner shadow-light-100/10">
            <h2>
              {searchTerm
                ? "Recommended movies by ranking"
                : "More recommended movies"}
            </h2>
            <div className="mt-5 grid gap-3">
              {rankedRecommendationMovies.map((movie, index) => (
                <div
                  className="flex items-center justify-between gap-4 rounded-lg bg-primary p-4"
                  key={movie.id}
                >
                  <div className="flex items-center gap-4">
                    <span className="grid size-9 place-items-center rounded bg-white font-bold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-white">
                        {movie.original_title}
                      </p>
                      <p className="mt-1 text-sm text-gray-100">
                        Rating {movie.vote_average?.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <span className="rounded bg-white px-3 py-1 text-sm font-bold text-primary">
                    {getMovieYear(movie.release_date)}
                  </span>
                </div>
              ))}

              {rankedRecommendationMovies.length === 0 && (
                <p className="rounded-lg bg-primary p-4 text-light-200">
                  Search a movie name to see ranked recommendations.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-light-100/10 bg-light-100/5 p-6 shadow-inner shadow-light-100/10">
            <h2>Top search movies</h2>
            <div className="mt-5 grid gap-3">
              {topSearchMovies.map((movie, index) => (
                <div
                  className="flex items-center gap-4 rounded-lg bg-primary p-4"
                  key={movie.id}
                >
                  <span className="grid size-9 place-items-center rounded bg-white font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-white">
                      {movie.original_title}
                    </p>
                    <p className="mt-1 text-sm text-gray-100">
                      Popularity {movie.popularity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Home;
