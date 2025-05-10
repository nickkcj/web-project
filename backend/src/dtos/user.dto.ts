/**
 * DTO for creating a new user
 */
export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

/**
 * DTO for updating an existing user
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

/**
 * DTO for user response
 */
export interface UserResponseDto {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}