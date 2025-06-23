import axiosInstance from "./axiosInstance";
import {PATH} from "../path";

export interface PopularMovie {
    id: number;
    title: string;
    vote_average: number;
    poster_path: string;
}

export const getPopularMovies = async (limit: number): Promise<PopularMovie[]> => {
    const response = await axiosInstance.get<PopularMovie[]>(PATH.MOVIES.POPULAR, {
        params: { limit, page: 1 },
    });
    console.log("getPopularMovies: ", response.data);
    return response.data;
};
