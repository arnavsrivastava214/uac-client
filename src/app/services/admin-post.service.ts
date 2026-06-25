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

  // ✅ LIVE BASE URL
  private API_BASE = 'https://uac-server.onrender.com';

  private publicPostBase = `${this.API_BASE}/api/posts`;
  private adminPostBase  = `${this.API_BASE}/api/admin/posts`;
  private authBase       = `${this.API_BASE}/api/uac/auth`;

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

  // ------------------------
// Gallery APIs
// ------------------------

uploadGalleryImages(formData: FormData): Observable<any> {
  return this.http.post(
    `${this.API_BASE}/api/admin/gallery`,
    formData
  );
}

getAdminGallery() {
  return this.http.get<any[]>(`${this.API_BASE}/api/admin/gallery`);
}

getGalleryImages(): Observable<string[]> {
  return this.http.get<string[]>(
    `${this.API_BASE}/api/gallery`
  );
}

deleteGalleryImage(id: string): Observable<void> {
  return this.http.delete<void>(
    `${this.API_BASE}/api/admin/gallery/${id}`
  );
}

googleLogin(payload: { idToken: string }): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(
    `${this.authBase}/students/google-login`,
    payload
  );
}
}
