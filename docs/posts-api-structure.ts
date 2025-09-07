// Example implementation structure for Posts/Blog APIs

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  user_id: number;
  category_id?: number;
  status: "draft" | "published" | "archived";
  view_count: number;
  like_count: number;
  comment_count: number;
  tags?: string[];
  published_at?: Date;
  created_at: Date;
  updated_at: Date;
  // Joined fields
  author?: Pick<User, "id" | "name" | "image_path">;
  category?: Category;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category_id?: number;
  tags?: string[];
  status?: "draft" | "published";
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  post_count: number;
  created_at: Date;
}

// Database migrations for posts
// CREATE TABLE categories (
//   id SERIAL PRIMARY KEY,
//   name VARCHAR(100) NOT NULL UNIQUE,
//   slug VARCHAR(100) NOT NULL UNIQUE,
//   description TEXT,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE posts (
//   id SERIAL PRIMARY KEY,
//   title VARCHAR(255) NOT NULL,
//   content TEXT NOT NULL,
//   excerpt TEXT,
//   featured_image VARCHAR(255),
//   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
//   status VARCHAR(20) DEFAULT 'draft',
//   view_count INTEGER DEFAULT 0,
//   like_count INTEGER DEFAULT 0,
//   comment_count INTEGER DEFAULT 0,
//   published_at TIMESTAMP,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE post_tags (
//   id SERIAL PRIMARY KEY,
//   post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
//   tag VARCHAR(50) NOT NULL,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE post_likes (
//   id SERIAL PRIMARY KEY,
//   post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
//   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   UNIQUE(post_id, user_id)
// );
