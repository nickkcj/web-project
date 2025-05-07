export interface CreateReviewDto {
  movieId: string;
  rating: number;
  comment: string;
  userId?: number;
}
