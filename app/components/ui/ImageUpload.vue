<template>
  <div class="image-upload-container">
    <div class="form-group">
      <label for="image-upload" class="image-upload-label">
        {{ label || "Profile Image" }}
        <span v-if="!required" class="optional-text">(Optional)</span>
      </label>

      <!-- Image Preview -->
      <div v-if="previewUrl" class="image-preview-container">
        <div class="image-preview">
          <img
            :src="previewUrl"
            :alt="label || 'Preview'"
            class="preview-image"
          />
          <button
            type="button"
            @click="removeImage"
            class="remove-image-btn"
            :disabled="uploading"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Upload Area -->
      <div
        v-if="!previewUrl"
        class="upload-area"
        :class="{ 'drag-over': isDragOver, 'has-error': error }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="handleDragLeave"
        @drop.prevent="handleDrop"
        @click="triggerFileInput"
      >
        <div class="upload-content">
          <div class="upload-icon">📸</div>
          <p class="upload-text">
            <span v-if="uploading">Uploading...</span>
            <span v-else>Click to upload or drag and drop</span>
          </p>
          <p class="upload-hint">PNG, JPG, WebP up to 5MB</p>
        </div>

        <div v-if="uploading" class="upload-progress">
          <div class="progress-bar">
            <div class="progress-fill"></div>
          </div>
        </div>
      </div>

      <!-- Hidden File Input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        @change="handleFileSelect"
        class="hidden-file-input"
        :disabled="uploading"
      />

      <!-- Error Message -->
      <div v-if="error" class="upload-error">
        {{ error }}
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="upload-success">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string;
  label?: string;
  required?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string | null): void;
  (e: "upload-success", imagePath: string): void;
  (e: "upload-error", error: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  label: "Profile Image",
  required: false,
});

const emit = defineEmits<Emits>();

// Reactive state
const fileInput = ref<HTMLInputElement>();
const previewUrl = ref<string>("");
const uploading = ref(false);
const isDragOver = ref(false);
const error = ref("");
const successMessage = ref("");

// Initialize preview URL from props
watchEffect(() => {
  if (props.modelValue) {
    previewUrl.value = props.modelValue;
  } else {
    previewUrl.value = "";
  }
});

// File validation
const validateFile = (file: File): string | null => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return "Invalid file type. Please select a PNG, JPG, or WebP image.";
  }

  if (file.size > maxSize) {
    return "File size too large. Please select an image smaller than 5MB.";
  }

  return null;
};

// Upload file to server
const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await $fetch<{
      success: boolean;
      data: { image_path: string };
      error?: string;
    }>("/api/upload-image", {
      method: "POST",
      body: formData,
    });

    if (response.success && response.data?.image_path) {
      return response.data.image_path;
    } else {
      throw new Error(response.error || "Upload failed");
    }
  } catch (err: any) {
    throw new Error(err.data?.error || err.message || "Upload failed");
  }
};

// Handle file selection and upload
const processFile = async (file: File) => {
  error.value = "";
  successMessage.value = "";

  // Validate file
  const validationError = validateFile(file);
  if (validationError) {
    error.value = validationError;
    return;
  }

  uploading.value = true;

  try {
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    previewUrl.value = objectUrl;

    // Upload file
    const imagePath = await uploadFile(file);

    // Clean up object URL
    URL.revokeObjectURL(objectUrl);

    // Update with server URL
    previewUrl.value = imagePath;
    successMessage.value = "Image uploaded successfully!";

    // Emit events
    emit("update:modelValue", imagePath);
    emit("upload-success", imagePath);

    // Clear success message after 3 seconds
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);
  } catch (err: any) {
    console.error("Upload error:", err);
    error.value = err.message || "Failed to upload image";
    previewUrl.value = "";

    emit("upload-error", error.value);
  } finally {
    uploading.value = false;
  }
};

// Event handlers
const triggerFileInput = () => {
  if (!uploading.value) {
    fileInput.value?.click();
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
  // Clear input so same file can be selected again
  target.value = "";
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  if (uploading.value) return;

  const files = event.dataTransfer?.files;
  const file = files?.[0];

  if (file) {
    processFile(file);
  }
};

const removeImage = () => {
  if (uploading.value) return;

  previewUrl.value = "";
  error.value = "";
  successMessage.value = "";

  emit("update:modelValue", null);
};

// Cleanup on unmount
onBeforeUnmount(() => {
  if (previewUrl.value && previewUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped>
.image-upload-container {
  width: 100%;
}

.form-group {
  margin-bottom: 1rem;
}

.image-upload-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
  font-size: 0.875rem;
}

.optional-text {
  color: #6b7280;
  font-weight: normal;
  font-size: 0.8rem;
}

.image-preview-container {
  margin-bottom: 1rem;
}

.image-preview {
  position: relative;
  display: inline-block;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.preview-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  line-height: 1;
  transition: background-color 0.2s;
}

.remove-image-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.8);
}

.remove-image-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f9fafb;
  position: relative;
}

.upload-area:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.upload-area.drag-over {
  border-color: #3b82f6;
  background-color: #eff6ff;
  transform: scale(1.02);
}

.upload-area.has-error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.upload-content {
  pointer-events: none;
}

.upload-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.upload-text {
  margin: 0.5rem 0;
  color: #374151;
  font-weight: 500;
}

.upload-hint {
  margin: 0;
  color: #6b7280;
  font-size: 0.75rem;
}

.upload-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
}

.progress-bar {
  width: 100%;
  height: 100%;
  background-color: #e5e7eb;
  border-radius: 0 0 0.5rem 0.5rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  animation: progress-animation 1.5s ease-in-out infinite;
  width: 100%;
}

@keyframes progress-animation {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.hidden-file-input {
  display: none;
}

.upload-error {
  background-color: #fee2e2;
  color: #dc2626;
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #fecaca;
}

.upload-success {
  background-color: #dcfce7;
  color: #166534;
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  border: 1px solid #bbf7d0;
}

@media (max-width: 640px) {
  .upload-area {
    padding: 1.5rem 1rem;
  }

  .preview-image {
    width: 100px;
    height: 100px;
  }
}
</style>
