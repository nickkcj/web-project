/**
 * DTO for creating a new comment
 */
export interface CreateCommentDto {
  content: string;
  postId: number;
  userId: number;
}

/**
 * DTO for comment response
 */
export interface CommentResponseDto {
  id: number;
  content: string;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}
