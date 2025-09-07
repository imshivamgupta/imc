import { db } from "../utils/database";
import type {
  Page,
  PageWithOwner,
  CreatePageRequest,
  UpdatePageRequest,
  QueryOptions,
} from "../types";

/**
 * Page service functions
 */

/**
 * Create a new page
 */
export async function createPage(
  ownerId: number,
  pageData: CreatePageRequest
): Promise<Page> {
  const { slug, title, content, description, is_public = true } = pageData;

  const result = await db.query<Page>(
    `INSERT INTO pages (slug, title, content, description, is_public, owner_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [slug, title, content, description, is_public, ownerId]
  );

  if (result.rows.length === 0) {
    throw new Error("Failed to create page");
  }

  return result.rows[0];
}

/**
 * Get a page by slug with owner information
 */
export async function getPageBySlug(
  slug: string
): Promise<PageWithOwner | null> {
  const result = await db.query<PageWithOwner>(
    `SELECT p.*, u.name as owner_name, u.email as owner_email
     FROM pages p
     JOIN users u ON p.owner_id = u.id
     WHERE p.slug = $1`,
    [slug]
  );

  return result.rows[0] || null;
}

/**
 * Get a page by ID with owner information
 */
export async function getPageById(id: number): Promise<PageWithOwner | null> {
  const result = await db.query<PageWithOwner>(
    `SELECT p.*, u.name as owner_name, u.email as owner_email
     FROM pages p
     JOIN users u ON p.owner_id = u.id
     WHERE p.id = $1`,
    [id]
  );

  return result.rows[0] || null;
}

/**
 * Get all public pages with pagination
 */
export async function getPublicPages(options: QueryOptions = {}): Promise<{
  pages: PageWithOwner[];
  total: number;
}> {
  const {
    limit = 10,
    offset = 0,
    orderBy = "created_at",
    orderDirection = "DESC",
  } = options;

  // Get total count
  const countResult = await db.query<{ count: string }>(
    "SELECT COUNT(*) as count FROM pages WHERE is_public = true"
  );
  const total = parseInt(countResult.rows[0].count, 10);

  // Get pages
  const result = await db.query<PageWithOwner>(
    `SELECT p.*, u.name as owner_name, u.email as owner_email
     FROM pages p
     JOIN users u ON p.owner_id = u.id
     WHERE p.is_public = true
     ORDER BY p.${orderBy} ${orderDirection}
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  return {
    pages: result.rows,
    total,
  };
}

/**
 * Get pages by owner
 */
export async function getPagesByOwner(
  ownerId: number,
  options: QueryOptions = {}
): Promise<{
  pages: Page[];
  total: number;
}> {
  const {
    limit = 10,
    offset = 0,
    orderBy = "created_at",
    orderDirection = "DESC",
  } = options;

  // Get total count
  const countResult = await db.query<{ count: string }>(
    "SELECT COUNT(*) as count FROM pages WHERE owner_id = $1",
    [ownerId]
  );
  const total = parseInt(countResult.rows[0].count, 10);

  // Get pages
  const result = await db.query<Page>(
    `SELECT * FROM pages
     WHERE owner_id = $1
     ORDER BY ${orderBy} ${orderDirection}
     LIMIT $2 OFFSET $3`,
    [ownerId, limit, offset]
  );

  return {
    pages: result.rows,
    total,
  };
}

/**
 * Update a page (only by owner)
 */
export async function updatePage(
  id: number,
  ownerId: number,
  updateData: UpdatePageRequest
): Promise<Page> {
  // Check if page exists and user is the owner
  const existingPage = await db.query<Page>(
    "SELECT * FROM pages WHERE id = $1 AND owner_id = $2",
    [id, ownerId]
  );

  if (existingPage.rows.length === 0) {
    throw new Error("Page not found or you don't have permission to edit it");
  }

  const updateFields: string[] = [];
  const updateValues: unknown[] = [];
  let paramCounter = 1;

  if (updateData.title !== undefined) {
    updateFields.push(`title = $${paramCounter++}`);
    updateValues.push(updateData.title);
  }

  if (updateData.content !== undefined) {
    updateFields.push(`content = $${paramCounter++}`);
    updateValues.push(updateData.content);
  }

  if (updateData.description !== undefined) {
    updateFields.push(`description = $${paramCounter++}`);
    updateValues.push(updateData.description);
  }

  if (updateData.is_public !== undefined) {
    updateFields.push(`is_public = $${paramCounter++}`);
    updateValues.push(updateData.is_public);
  }

  if (updateFields.length === 0) {
    throw new Error("No fields to update");
  }

  updateValues.push(id, ownerId);

  const result = await db.query<Page>(
    `UPDATE pages 
     SET ${updateFields.join(", ")}
     WHERE id = $${paramCounter++} AND owner_id = $${paramCounter++}
     RETURNING *`,
    updateValues
  );

  return result.rows[0];
}

/**
 * Delete a page (only by owner)
 */
export async function deletePage(
  id: number,
  ownerId: number
): Promise<boolean> {
  const result = await db.query(
    "DELETE FROM pages WHERE id = $1 AND owner_id = $2",
    [id, ownerId]
  );

  return (result.rowCount ?? 0) > 0;
}

/**
 * Check if slug is available
 */
export async function isSlugAvailable(
  slug: string,
  excludeId?: number
): Promise<boolean> {
  let query = "SELECT COUNT(*) as count FROM pages WHERE slug = $1";
  const params: unknown[] = [slug];

  if (excludeId) {
    query += " AND id != $2";
    params.push(excludeId);
  }

  const result = await db.query<{ count: string }>(query, params);
  return parseInt(result.rows[0].count, 10) === 0;
}

/**
 * Search pages by title or content
 */
export async function searchPages(
  searchTerm: string,
  includePrivate = false,
  ownerId?: number,
  options: QueryOptions = {}
): Promise<{
  pages: PageWithOwner[];
  total: number;
}> {
  const { limit = 10, offset = 0 } = options;

  let whereClause = "WHERE (p.title ILIKE $1 OR p.content ILIKE $1)";
  const params: unknown[] = [`%${searchTerm}%`];

  if (!includePrivate) {
    whereClause += " AND p.is_public = true";
  } else if (ownerId) {
    whereClause += " AND (p.is_public = true OR p.owner_id = $2)";
    params.push(ownerId);
  }

  // Get total count
  const countResult = await db.query<{ count: string }>(
    `SELECT COUNT(*) as count FROM pages p ${whereClause}`,
    params
  );
  const total = parseInt(countResult.rows[0].count, 10);

  // Get pages
  const searchParams = [...params, limit, offset];
  const result = await db.query<PageWithOwner>(
    `SELECT p.*, u.name as owner_name, u.email as owner_email
     FROM pages p
     JOIN users u ON p.owner_id = u.id
     ${whereClause}
     ORDER BY p.updated_at DESC
     LIMIT $${searchParams.length - 1} OFFSET $${searchParams.length}`,
    searchParams
  );

  return {
    pages: result.rows,
    total,
  };
}
