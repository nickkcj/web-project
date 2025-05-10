/**
 * DTO for creating a new like
 */
export interface CreateLikeDto {
  postId: number;
}

/**
 * DTO for like response
 */
export interface LikeResponseDto {
  id: number;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}