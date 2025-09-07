// Example implementation structure for File Management APIs

export interface FileRecord {
  id: number;
  filename: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  file_type: "image" | "document" | "video" | "audio" | "other";
  user_id: number;
  is_public: boolean;
  download_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface FileUploadRequest {
  files: File[];
  is_public?: boolean;
  folder?: string;
}

export interface FileUploadResponse {
  uploaded_files: FileRecord[];
  failed_files?: { name: string; error: string }[];
}

// Database migration for files
// CREATE TABLE files (
//   id SERIAL PRIMARY KEY,
//   filename VARCHAR(255) NOT NULL,
//   original_name VARCHAR(255) NOT NULL,
//   file_path VARCHAR(500) NOT NULL,
//   file_size BIGINT NOT NULL,
//   mime_type VARCHAR(100) NOT NULL,
//   file_type VARCHAR(20) NOT NULL,
//   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
//   is_public BOOLEAN DEFAULT FALSE,
//   download_count INTEGER DEFAULT 0,
//   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE INDEX idx_files_user_id ON files(user_id);
// CREATE INDEX idx_files_file_type ON files(file_type);
// CREATE INDEX idx_files_created_at ON files(created_at);
