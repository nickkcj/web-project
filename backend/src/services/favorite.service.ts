import { prisma } from '../config/database';

export class FavoriteService {
  private constructor() {}

  public static async toggleFavorite(userId: number, movieId: number) {
    
    let movie = await prisma.movie.findUnique({
      where: { id: movieId }
    });

    if (!movie) {
      
      
      throw new Error('Movie not found. Please add movie to database first.');
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId
        }
      }
    });

    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          userId_movieId: {
            userId,
            movieId
          }
        }
      });
      return { action: 'unfavorited' as const, favorited: false };
    } else {
      const favorite = await prisma.favorite.create({
        data: {
          userId,
          movieId
        },
        include: {
          movie: true
        }
      });
      return { action: 'favorited' as const, favorited: true, favorite };
    }
  }

  public static async hasUserFavorited(userId: number, movieId: number): Promise<boolean> {
    const favorite = await prisma.favorite.findUnique({
      where: { userId_movieId: { userId, movieId } }
    });
    return !!favorite;
  }

  public static async getUserFavorites(userId: number) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        movie: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  public static async createMovieIfNotExists(movieData: {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    popularity: number;
    original_language: string;
  }) {
    return prisma.movie.upsert({
      where: { id: movieData.id },
      update: movieData,
      create: movieData
    });
  }
}