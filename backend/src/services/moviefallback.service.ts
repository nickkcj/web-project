import {Movie} from '@prisma/client';
import { prisma } from '../config/database';

export class MovieFallbackService {
    static async searchByTitle(query: string, page: number, pageSize: number = 10) {
        const skip = (page - 1) * pageSize;

        const [movies, total] = await Promise.all([
            prisma.movie.findMany({
                where: {
                    title: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
                skip,
                take: pageSize,
            }),
            prisma.movie.count({
                where: {
                    title: {
                        contains: query,
                        mode: 'insensitive',
                    },
                },
            }),
        ]);

        return this.buildResponse(movies, total, page, pageSize);
    }

    static async getPopularMovies(page: number, pageSize: number = 10) {
        const skip = (page - 1) * pageSize;

        const [movies, total] = await Promise.all([
            prisma.movie.findMany({
                orderBy: {
                    popularity: 'desc',
                },
                skip,
                take: pageSize,
            }),
            prisma.movie.count(),
        ]);

        return this.buildResponse(movies, total, page, pageSize);
    }

    static async getMovieDetails(movieId: number) {
        const movie = await prisma.movie.findUnique({
            where: { id: movieId },
        });

        if (!movie) {
            throw new Error(`Movie with ID ${movieId} not found in local database.`);
        }

        return movie;
    }

    private static buildResponse(movies: Movie[], total: number, page: number, pageSize: number) {
        const results = movies
        return {
            page,
            results,
            total_pages: Math.ceil(total / pageSize),
            total_results: total,
        };
    }
}
