/**
 * DTO for creating a new like
 */
export interface CreateLikeDto {
  postId: number;
  userId: number;
}

/**
 * DTO for like response
 */
export interface LikeResponseDto {
  id: number;
  postId: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

/**
 * DTO for toggle like response
 */
export interface ToggleLikeResponseDto {
  action: 'liked' | 'unliked';
  liked: boolean;
  like?: LikeResponseDto;
}

/**
 * DTO for like status check
 */
export interface LikeStatusDto {
  hasLiked: boolean;
}

/**
 * DTO for like count
 */
export interface LikeCountDto {
  count: number;
}