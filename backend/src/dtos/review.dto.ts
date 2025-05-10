/**
 * DTO for creating a new review
 */
export interface CreateReviewDto {
  movieId: number;
  rating: number;
  comment: string;
  userId?: number;
}

/**
 * DTO for review response
 */
export interface ReviewResponseDto {
  id: number;
  movieId: number;
  rating: number;
  comment: string;
  userId?: number;
  createdAt: Date;
  updatedAt: Date;
}
