import {PATH} from "../path";
import axiosInstance from "./axiosInstance";

export interface ReviewApiResponse {
    id: number;
    posterUrl: string;
    user: string;
    userId: string;
    rating: number;
    text: string;
    time: string;
    comments: {
        id: number;
        user: string;
        text: string;
    }[];
}

export const getReviews = async (): Promise<ReviewApiResponse[]> => {
    console.log("getReviews");

    const response = await axiosInstance.get<ReviewApiResponse[]>(PATH.REVIEWS);
    console.log(response.data);
    return response.data;
};
