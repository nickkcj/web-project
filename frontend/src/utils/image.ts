import {PATH} from "../path";

export const getImageUrl = (path: string) => {
    const baseUrl = PATH.imageUrl;
    return `${baseUrl}${path}`;
};
