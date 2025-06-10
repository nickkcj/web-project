/**
 * DTO for creating a new review
 */

export enum Visibility {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC'
}
export interface CreateReviewDto {
  movieId: number;
  rating: number;
  comment: string;
  userId?: number;
  visibility?: Visibility;
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
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
}
