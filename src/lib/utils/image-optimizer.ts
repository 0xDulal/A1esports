export interface ImageOptimizerOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: "image/webp" | "image/jpeg" | "image/png";
}

export interface OptimizationResult {
  file: File;
  originalSize: number;
  optimizedSize: number;
  width: number;
  height: number;
  savedBytes: number;
  savedPercent: number;
}

/**
  Compresses and converts image files (PNG, JPG, HEIC, WEBP) to optimized WebP format
  using HTML5 Canvas API before uploading to storage.
 */
export async function compressAndOptimizeImage(
  file: File,
  options: ImageOptimizerOptions = {}
): Promise<OptimizationResult> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.82,
    format = "image/webp",
  } = options;

  const originalSize = file.size;

  // Don't touch SVGs or non-image files
  if (file.type === "image/svg+xml" || !file.type.startsWith("image/")) {
    return {
      file,
      originalSize,
      optimizedSize: originalSize,
      width: 0,
      height: 0,
      savedBytes: 0,
      savedPercent: 0,
    };
  }

  // Ensure window & HTMLImageElement exist (client-side only)
  if (typeof window === "undefined") {
    return {
      file,
      originalSize,
      optimizedSize: originalSize,
      width: 0,
      height: 0,
      savedBytes: 0,
      savedPercent: 0,
    };
  }

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Calculate aspect-ratio fit within maxWidth/maxHeight boundaries
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return resolve({
          file,
          originalSize,
          optimizedSize: originalSize,
          width,
          height,
          savedBytes: 0,
          savedPercent: 0,
        });
      }

      // Smooth scaling settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // If converting to JPEG or WEBP without alpha, fill background white for PNGs if needed
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            return resolve({
              file,
              originalSize,
              optimizedSize: originalSize,
              width,
              height,
              savedBytes: 0,
              savedPercent: 0,
            });
          }

          // Generate file extension based on format
          const ext = format === "image/webp" ? "webp" : format === "image/jpeg" ? "jpg" : "png";
          const baseName = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
          const optimizedFileName = `${baseName}.${ext}`;

          const optimizedFile = new File([blob], optimizedFileName, {
            type: format,
            lastModified: Date.now(),
          });

          const optimizedSize = optimizedFile.size;
          const savedBytes = Math.max(0, originalSize - optimizedSize);
          const savedPercent = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;

          // If original was already smaller than optimized result, keep original
          if (optimizedSize >= originalSize && file.type === format) {
            return resolve({
              file,
              originalSize,
              optimizedSize: originalSize,
              width,
              height,
              savedBytes: 0,
              savedPercent: 0,
            });
          }

          resolve({
            file: optimizedFile,
            originalSize,
            optimizedSize,
            width,
            height,
            savedBytes,
            savedPercent,
          });
        },
        format,
        quality
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      console.warn("Failed loading image for optimization, falling back to raw file", err);
      resolve({
        file,
        originalSize,
        optimizedSize: originalSize,
        width: 0,
        height: 0,
        savedBytes: 0,
        savedPercent: 0,
      });
    };

    img.src = objectUrl;
  });
}
