import { FC, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import FilterRow from "./FilterRow";
import MovieGrid from "./MovieGrid";
import services from "../../services/index";
import { getImageUrl } from "../../utils/image";

export interface Movie {
  id: number;
  title: string;
  year: string;
  poster: string;
  tag?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const filterLabels = ["Trending", "Top IMDb", "Ação", "Comédia", "Drama"];

const Discovery: FC = () => {
  const [activeFilter, setActiveFilter] = useState(filterLabels[0]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userResults, setUserResults] = useState<User[]>([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [followedUsers, setFollowedUsers] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<'movies' | 'users'>('movies');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [userStats, setUserStats] = useState<Record<number, {reviews: number, followers: number, following: number}>>({});

  useEffect(() => {
    if (activeTab === 'users') {
      fetchAllUsers();
    } else {
      fetchTrending();
    }
    setSearchQuery('');
    setUserResults([]);
    setError(null);
  }, [activeTab]);

  const updateFollowedUsers = async (userId: number | null) => {
    if (!userId) return;
    try {
      const following = await services.getFollowing(userId);
      const ids = following.map((u: any) => u.followingId ?? u.following?.id).filter(Boolean);
      setFollowedUsers(ids);
    } catch {
      setFollowedUsers([]);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await services.getUserProfile();
        setCurrentUserId(user.id);
        await updateFollowedUsers(user.id);
      } catch (err) {
        setCurrentUserId(null);
        setFollowedUsers([]);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchTrending = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await services.getPopularMovies();
      
      const moviesData = Array.isArray(response) ? response : response.results || [];
      
      setMovies(
        moviesData.map((m: any) => ({
          id: m.id,
          title: m.title,
          year: m.release_date?.slice(0, 4) ?? "",
          poster: m.poster_path
            ? getImageUrl(m.poster_path)
            : "/placeholder.jpg",
        }))
      );
    } catch (err: any) {
      console.error('Error fetching popular movies:', err);
      setError(err.message ?? "Erro ao buscar filmes");
    } finally {
      setLoading(false);
    }
  };

  const fetchFilter = async (genreId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await services.getMoviesByGenre(genreId);
      
      const moviesData = Array.isArray(response) ? response : response.results || [];
      
      setMovies(
        moviesData.map((m: any) => ({
          id: m.id,
          title: m.title,
          year: m.release_date?.slice(0, 4) ?? "",
          poster: m.poster_path
            ? getImageUrl(m.poster_path)
            : "/placeholder.jpg",
        }))
      );
    } catch (err: any) {
      console.error('Error fetching popular movies:', err);
      setError(err.message ?? "Erro ao buscar filmes");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    setUserSearchLoading(true);
    try {
      const users = await services.getUsers();
      setUserResults(users);
    } catch (err) {
      setError('Erro ao buscar usuários');
    } finally {
      setUserSearchLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchQuery(term);
    if (!term.trim()) {
      if (activeTab === 'movies') {
        fetchTrending();
      } else {
        fetchAllUsers();
      }
      return;
    }
    if (activeTab === 'movies') {
      setLoading(true);
      setError(null);
      try {
        const response = await services.searchMovies(term);
        const moviesData = Array.isArray(response) ? response : response.results || [];
        setMovies(
          moviesData.map((m: any) => ({
            id: m.id,
            title: m.title,
            year: m.release_date?.slice(0, 4) ?? "",
            poster: m.poster_path
              ? getImageUrl(m.poster_path)
              : "/placeholder.jpg",
          }))
        );
        setActiveFilter("Resultados");
      } catch (err: any) {
        setError(err.message ?? "Erro na pesquisa");
      } finally {
        setLoading(false);
      }
    } else {
      setUserSearchLoading(true);
      try {
        const users = await services.getUsers();
        const filtered = users.filter((u: User) =>
          u.name.toLowerCase().includes(term.toLowerCase()) ||
          u.email.toLowerCase().includes(term.toLowerCase())
        );
        setUserResults(filtered);
      } catch (err) {
        setError('Erro ao buscar usuários');
      } finally {
        setUserSearchLoading(false);
      }
    }
  };

  const handleFilter = (label: string) => {
    setActiveFilter(label);
    switch (label) {
      case "Trending":
        fetchTrending();
        break;
      case "Ação":
        fetchFilter(28);
        break;
      case "Comédia":
        fetchFilter(35);
        break;
      case "Drama":
        fetchFilter(18);
        break;
      default:
        fetchTrending();
    }
  };

  const handleFollow = async (userId: number) => {
    try {
      await services.followUser(userId);
      await updateFollowedUsers(currentUserId);
    } catch (err) {
      alert("Erro ao seguir usuário");
    }
  };

  const handleUnfollow = async (userId: number) => {
    try {
      await services.unfollowUser(userId);
      await updateFollowedUsers(currentUserId);
    } catch (err) {
      alert("Erro ao deixar de seguir usuário");
    }
  };

  useEffect(() => {
    if (activeTab !== 'users' || userResults.length === 0) return;
    const fetchStats = async () => {
      const stats: Record<number, {reviews: number, followers: number, following: number}> = {};
      await Promise.all(userResults.map(async (user) => {
        if (user.id === currentUserId) return;
        try {
          const [reviews, followers, following] = await Promise.all([
            services.getReviewsByUserId(user.id),
            services.getFollowers(user.id),
            services.getFollowing(user.id)
          ]);
          stats[user.id] = {
            reviews: Array.isArray(reviews) ? reviews.length : 0,
            followers: Array.isArray(followers) ? followers.length : 0,
            following: Array.isArray(following) ? following.length : 0
          };
        } catch {
          stats[user.id] = {reviews: 0, followers: 0, following: 0};
        }
      }));
      setUserStats(stats);
    };
    fetchStats();
  }, [userResults, activeTab, currentUserId]);

  return (
    <div className="px-5 pb-16 max-w-5xl mx-auto">
      <div className="flex justify-center mb-6">
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('movies')}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              activeTab === 'movies'
                ? 'bg-white text-slate-900'
                : 'text-white hover:bg-slate-700'
            }`}
          >
            Filmes
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-md font-semibold transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-slate-900'
                : 'text-white hover:bg-slate-700'
            }`}
          >
            Usuários
          </button>
        </div>
      </div>
      <SearchBar
        onSearch={handleSearch}
        activeTab={activeTab}
      />
      {activeTab === 'movies' && (
        <>
          <FilterRow
            filters={filterLabels}
            active={activeFilter}
            onChange={handleFilter}
          />
          {loading ? (
            <div className="min-h-[50vh] flex items-center justify-center text-slate-400">
              Carregando filmes…
            </div>
          ) : error ? (
            <div className="min-h-[50vh] flex items-center justify-center text-red-400">
              {error}
            </div>
          ) : (
            <MovieGrid movies={movies} />
          )}
        </>
      )}
      {activeTab === 'users' && (
        <div>
          <h2 className="text-slate-100 text-2xl font-bold mb-6">
            {searchQuery ? `Usuários encontrados` : 'Todos os Usuários'}
          </h2>
          {userSearchLoading ? (
            <div className="text-center py-12">
              <div className="text-white text-xl">Carregando usuários...</div>
            </div>
          ) : userResults.filter(u => u.id !== currentUserId).length > 0 ? (
            <div className="flex flex-row row-break flex-wrap gap-6 itens-center justify-center">
              {userResults.filter(user => user.id !== currentUserId).map((user) => (
                <div key={user.id} className="bg-slate-800 rounded-lg p-4 flex flex-col justify-center h-28 w-[25rem] min-w-0">
                  <div className="flex items-center gap-4 w-full h-full">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate max-w-[350px]" title={user.name}>{user.name}</h3>
                      <p className="text-gray-400 text-sm truncate max-w-[350px]" title={user.email}>{user.email}</p>
                    </div>
                    <button
                      className={`px-3 py-1 rounded shrink-0 text-white text-xs ${followedUsers.includes(user.id) ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      onClick={() => followedUsers.includes(user.id) ? handleUnfollow(user.id) : handleFollow(user.id)}
                    >
                      {followedUsers.includes(user.id) ? <span className="block leading-tight">Deixar<br/>de seguir</span> : "Seguir"}
                    </button>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-slate-300">
                    <span>Reviews: {userStats[user.id]?.reviews ?? '-'}</span>
                    <span>Seguidores: {userStats[user.id]?.followers ?? '-'}</span>
                    <span>Seguindo: {userStats[user.id]?.following ?? '-'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                {searchQuery ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Discovery;