import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  // Add these for the public feed
  likeCount?: number;
  isLikedByMe?: boolean;
}

export interface CreatePostPayload {
  title: string;
  description: string;
  image: File;
  notifyUsers: boolean;
}

export interface UpdatePostPayload {
  title: string;
  description: string;
}

export interface PostComment {
  id: number;
  comment: string;
  userName: string;
  createdAt: string;
}

export interface LikeResponse {
  liked: boolean;
  count: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface CommentPayload {
  comment: string;
}

export interface PublicPost extends Post {
  likeCount: number;
  isLikedByMe: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminPostService {

  private publicPostBase = 'http://localhost:3000/api/posts';
  private adminPostBase  = 'http://localhost:3000/api/admin/posts';
  private authBase       = 'http://localhost:3000/api/uac/auth';

  constructor(private http: HttpClient) {}


  getPublicPosts(): Observable<PublicPost[]> {
    return this.http.get<PublicPost[]>(
      `${this.publicPostBase}/public`
    );
  }
  

  likePost(postId: string): Observable<LikeResponse> {
    return this.http.post<LikeResponse>(
      `${this.publicPostBase}/${postId}/like`,
      {}
    );
  }

  addComment(postId: string, payload: CommentPayload): Observable<PostComment> {
    return this.http.post<PostComment>(
      `${this.publicPostBase}/${postId}/comments`,
      payload
    );
  }

  getComments(postId: string): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(
      `${this.publicPostBase}/${postId}/comments`
    );
  }

  // ------------------------
  // Student auth
  // ------------------------

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.authBase}/students/login`,
      payload
    );
  }

  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.authBase}/students/register`,
      payload
    );
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.authBase}/students/forgot-password`,
      { email }
    );
  }

  // (optional – agar frontend pe verify/reset lagana hai)
  verifyOtp(email: string, otp: string) {
    return this.http.post(
      `${this.authBase}/students/verify-otp`,
      { email, otp }
    );
  }

  resetPassword(email: string, otp: string, newPassword: string) {
    return this.http.post(
      `${this.authBase}/students/reset-password`,
      { email, otp, newPassword }
    );
  }

  // ------------------------
  // Admin post APIs
  // ------------------------

  createPost(formData: FormData): Observable<Post> {
    return this.http.post<Post>(this.adminPostBase, formData);
  }

  updatePostText(postId: string, payload: UpdatePostPayload): Observable<Post> {
    return this.http.put<Post>(
      `${this.adminPostBase}/${postId}`,
      payload
    );
  }

  deletePost(postId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.adminPostBase}/${postId}`
    );
  }

  getAllPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(this.adminPostBase);
  }

  getPostById(postId: string): Observable<Post> {
    return this.http.get<Post>(
      `${this.adminPostBase}/${postId}`
    );
  }

  verifyEmailOtp(email: string, otp: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.authBase}/students/verify-email-otp`,
      { email, otp }
    );
  }
  
  
}
