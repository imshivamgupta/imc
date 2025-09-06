import { promises as fs } from "fs";
import { join } from "path";
import { ErrorHandler } from "../utils/errorHandler";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    if (method !== "POST") {
      setResponseStatus(event, 405);
      return ErrorHandler.createErrorResponse(new Error("Method not allowed"));
    }

    // Parse multipart form data
    const form = await readMultipartFormData(event);

    if (!form || form.length === 0) {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(new Error("No file uploaded"));
    }

    const imageFile = form.find((field) => field.name === "image");

    if (!imageFile || !imageFile.data || !imageFile.filename) {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(
        new Error("Image file is required")
      );
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!imageFile.type || !allowedTypes.includes(imageFile.type)) {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(
        new Error(
          "Invalid file type. Only JPEG, PNG, and WebP images are allowed"
        )
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.data.length > maxSize) {
      setResponseStatus(event, 400);
      return ErrorHandler.createErrorResponse(
        new Error("File size too large. Maximum size is 5MB")
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = imageFile.filename.split(".").pop()?.toLowerCase();
    const uniqueFilename = `user-${timestamp}.${fileExtension}`;

    // Define the public directory path
    const publicDir = join(process.cwd(), "public", "images", "users");
    const filePath = join(publicDir, uniqueFilename);

    // Ensure the directory exists
    try {
      await fs.access(publicDir);
    } catch {
      await fs.mkdir(publicDir, { recursive: true });
    }

    // Save the file
    await fs.writeFile(filePath, imageFile.data);

    // Return the public URL path
    const imageUrl = `/images/users/${uniqueFilename}`;

    return ErrorHandler.createSuccessResponse(
      { image_path: imageUrl },
      "Image uploaded successfully"
    );
  } catch (error) {
    setResponseStatus(event, 500);
    return ErrorHandler.createErrorResponse(error);
  }
});
