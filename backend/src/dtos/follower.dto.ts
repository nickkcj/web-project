/**
 * DTO for following a user
 */
export interface FollowUserDto {
  userId: number;
  followUserId: number;
}

/**
 * DTO for following response
 */
export interface FollowUserResponseDto {
  userId: number;
  followUserId: number;
}
