/**
 * ImageProcessor Class
 *
 * Processes and converts images to various formats (JPEG, PNG, WebP, AVIF)
 * with automatic directory structure and size adjustment.
 */

import sharp from "sharp";
import {promises as fs} from "fs";
import path from "path";
import crypto from "crypto";

export interface ImageDimensions {
  maxWidth?: number;
  maxHeight?: number;
}

export interface ImageQuality {
  quality?: number;
}

export interface TransparencyOptions {
  preserveTransparency?: boolean;
}

export interface SavedImage {
  url: string;
  previewUrl: string;
}

export class ImageProcessor {
  private readonly files: File[];
  private readonly basePath: string;
  private productId?: number;

  /**
   * @param productId - Optional product ID for path structure
   */
  constructor(productId?: number) {
    this.basePath = process.env.BASE_PRODUCT_IMAGE_SYS_PATH ?? "public/productImages";
    this.productId = productId;
    this.files = [];
  }

  /**
   * Adds more images to the internal array
   */
  addFiles(files: File[]): void {
    this.files.push(...files);
  }

  /**
   * Sets the product ID
   */
  setProductId(productId: number): void {
    this.productId = productId;
  }

  /**
   * Generates path according to schema: /ff/ff/ff/
   */
  private generatePath(buffer: Buffer<ArrayBufferLike>): string {
    const hash = crypto.createHash("md5").update(buffer).digest("hex");
    const firstChar = hash.slice(0, 2);
    const secondChar = hash.slice(2, 4);
    const thirdChar = hash.slice(4, 6);


    return `/${firstChar}/${secondChar}/${thirdChar}/`;
  }

  /**
   * Creates the directory structure if not present
   */
  private async ensureDirectory(filePath: string): Promise<void> {
    const dir = path.dirname(filePath);
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, {recursive: true});
    }
  }

  /**
   * Converts File to Buffer
   */
  private async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * Saves an image as JPEG
   *
   * @param file - The image to convert
   * @param dimensions - Maximum dimensions (optional)
   * @param options - Quality options (optional, default: 85)
   * @returns Path of the saved image (relative to basePath)
   */
  async saveAsJpeg(
    file: File,
    dimensions?: ImageDimensions,
    options?: ImageQuality
  ): Promise<string> {
    const buffer = await this.fileToBuffer(file);
    const filename = path.parse(file.name).name;
    const relativePath = this.generatePath(filename, "jpg");
    const fullPath = path.join(this.basePath, relativePath);

    await this.ensureDirectory(fullPath);

    let image = sharp(buffer);

    // Size adjustment
    if (dimensions?.maxWidth || dimensions?.maxHeight) {
      image = image.resize(dimensions.maxWidth, dimensions.maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // JPEG conversion
    await image
      .jpeg({
        quality: options?.quality ?? 85,
        mozjpeg: true,
      })
      .toFile(fullPath);

    return relativePath;
  }

  /**
   * Saves an image as PNG
   *
   * @param file - The image to convert
   * @param dimensions - Maximum dimensions (optional)
   * @param options - Quality and transparency options (optional)
   * @returns Path of the saved image (relative to basePath)
   */
  async saveAsPng(
    file: File,
    dimensions?: ImageDimensions,
    options?: ImageQuality & TransparencyOptions
  ): Promise<string> {
    const buffer = await this.fileToBuffer(file);
    const filename = path.parse(file.name).name;
    const relativePath = this.generatePath(filename, "png");
    const fullPath = path.join(this.basePath, relativePath);

    await this.ensureDirectory(fullPath);

    let image = sharp(buffer);

    // Size adjustment
    if (dimensions?.maxWidth || dimensions?.maxHeight) {
      image = image.resize(dimensions.maxWidth, dimensions.maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Transparency handling
    if (options?.preserveTransparency === false) {
      image = image.flatten({background: {r: 255, g: 255, b: 255}});
    }

    // PNG conversion
    await image
      .png({
        quality: options?.quality ?? 85,
        compressionLevel: 9,
      })
      .toFile(fullPath);

    return relativePath;
  }

  /**
   * Saves an image as WebP
   *
   * @param file - The image to convert
   * @param dimensions - Maximum dimensions (optional)
   * @param options - Quality and transparency options (optional, default quality: 85)
   * @returns Path of the saved image (relative to basePath)
   */
  async saveAsWebp(
    file: File,
    dimensions?: ImageDimensions,
    options?: ImageQuality & TransparencyOptions
  ): Promise<string> {
    const buffer = await this.fileToBuffer(file);
    const filename = path.parse(file.name).name;
    const relativePath = this.generatePath(filename, "webp");
    const fullPath = path.join(this.basePath, relativePath);

    await this.ensureDirectory(fullPath);

    let image = sharp(buffer);

    // Size adjustment
    if (dimensions?.maxWidth || dimensions?.maxHeight) {
      image = image.resize(dimensions.maxWidth, dimensions.maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Transparency handling
    if (options?.preserveTransparency === false) {
      image = image.flatten({background: {r: 255, g: 255, b: 255}});
    }

    // WebP conversion
    await image
      .webp({
        quality: options?.quality ?? 85,
      })
      .toFile(fullPath);

    return relativePath;
  }

  /**
   * Saves an image as AVIF
   *
   * @param file - The image to convert
   * @param imageType
   * @param dimensions - Maximum dimensions (optional)
   * @param options - Quality and transparency options (optional, default quality: 75)
   * @returns Path of the saved image (relative to basePath)
   */
  protected async saveImage(
    file: File,
    imageType:  "avif" | "jpeg" | "jpg" | "png" | "webp",
    dimensions?: ImageDimensions,
    options?: ImageQuality & TransparencyOptions
  ): Promise<string> {
    const buffer = await this.fileToBuffer(file);
    const filename = path.parse(file.name).name;
    const relativePath = path.join(this.generatePath(buffer), `${filename}.${imageType}`);
    const fullPath = path.join(this.basePath, relativePath);
    const previewPath = path.join(this.basePath, relativePath.replace(`.${imageType}`, `_preview.${imageType}`));

    await this.ensureDirectory(fullPath);

    let image = sharp(buffer);

    // Size adjustment
    if (dimensions?.maxWidth || dimensions?.maxHeight) {
      image = image.resize(dimensions.maxWidth, dimensions.maxHeight, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    
    const previewImage = image.resize(400, 400, {
      fit: "inside",
      withoutEnlargement: true,
    })

    // Transparency handling
    if (options?.preserveTransparency === false) {
      image = image.flatten({background: {r: 255, g: 255, b: 255}});
    }

    // AVIF conversion
    switch (imageType) {
      case "avif":
        await image.avif({quality: options?.quality ?? 60,}).toFile(fullPath);
        await previewImage.avif({quality: options?.quality ?? 50,}).toFile(previewPath);
        break;
      case "jpeg":
      case "jpg":
        await image.jpeg({quality: options?.quality ?? 70,}).toFile(fullPath);
        await previewImage.jpeg({quality: options?.quality ?? 60,}).toFile(previewPath);
        break;
      case "webp":
        await image.webp({quality: options?.quality ?? 65,}).toFile(fullPath);
        await previewImage.webp({quality: options?.quality ?? 55,}).toFile(previewPath);
        break;
      case "png":
        await image.png({compressionLevel: 7,}).toFile(fullPath);
        await previewImage.png({compressionLevel: 7,}).toFile(previewPath);
        break;
    }

    return `${process.env.BASE_PRODUCT_IMAGE_URL}${relativePath}`;
  }

  /**
   * Helper method to generate preview path and hash
   */
  private generatePreviewPath(productId: number, imageIndex?: number): { relativePath: string; fullPath: string } {
    const filename = imageIndex !== undefined ? `${productId}_${imageIndex}_preview` : `${productId}_preview`;
    const hash = crypto.createHash("md5").update(filename).digest("hex");
    const firstChar = hash[0];
    const secondChar = hash[1];

    const relativePath = `/${firstChar}/${secondChar}/${productId}/${filename}.avif`;
    const fullPath = path.join(this.basePath, relativePath);

    return { relativePath, fullPath };
  }

  /**
   * Creates a low-resolution preview image from the first product image
   *
   * @param file - The image to convert
   * @param productId - The product ID for naming
   * @returns URL of the saved preview image
   */
  async createPreviewImage(file: File, productId: number): Promise<string> {
    const buffer = await this.fileToBuffer(file);
    const { relativePath, fullPath } = this.generatePreviewPath(productId);

    await this.ensureDirectory(fullPath);

    await sharp(buffer)
      .resize(400, 400, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .avif({
        quality: 60,
      })
      .toFile(fullPath);

    return `${process.env.BASE_PRODUCT_IMAGE_URL}${relativePath}`;
  }

  /**
   * Creates a preview for a specific product image
   *
   * @param file - The image to convert
   * @param productId - The product ID
   * @param imageIndex - The index of the image
   * @returns URL of the saved image preview
   */
  async createImagePreview(file: File, productId: number, imageIndex: number): Promise<string> {
    const buffer = await this.fileToBuffer(file);
    const { relativePath, fullPath } = this.generatePreviewPath(productId, imageIndex);

    await this.ensureDirectory(fullPath);

    await sharp(buffer)
      .resize(400, 400, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .avif({
        quality: 55,
      })
      .toFile(fullPath);

    return `${process.env.BASE_PRODUCT_IMAGE_URL}${relativePath}`;
  }

  /**
   * Deletes the preview image for a product if it exists
   *
   * @param productId - The product ID
   */
  async deletePreviewImage(productId: number): Promise<void> {
    const { fullPath } = this.generatePreviewPath(productId);

    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.log(`Preview image not found or couldn't be deleted: ${fullPath}`);
    }
  }

  /**
   * Deletes a specific image preview
   *
   * @param productId - The product ID
   * @param imageIndex - The index of the image
   */
  async deleteImagePreview(productId: number, imageIndex: number): Promise<void> {
    const { fullPath } = this.generatePreviewPath(productId, imageIndex);

    try {
      await fs.unlink(fullPath);
    } catch (error) {
      console.log(`Image preview not found or couldn't be deleted: ${fullPath}`);
    }
  }

  /**
   * Processes all images and returns paths
   *
   * @param format - Target format
   * @param dimensions - Maximum dimensions (optional)
   * @param options - Format-specific options (optional)
   * @returns Array of paths of saved images
   */
  async processAll(
    format: "jpeg" | "png" | "webp" | "avif",
    dimensions?: ImageDimensions,
    options?: ImageQuality & TransparencyOptions
  ): Promise<string[]> {
    const paths: string[] = [];

    for (const file of this.files) {
      let path: string;

      switch (format) {
        case "jpeg":
          path = await this.saveAsJpeg(file, dimensions, options);
          break;
        case "png":
          path = await this.saveAsPng(file, dimensions, options);
          break;
        case "webp":
          path = await this.saveAsWebp(file, dimensions, options);
          break;
        case "avif":
          path = await this.saveAsAvif(file, dimensions, options);
          break;
      }

      paths.push(path);
    }

    return paths;
  }

  /**
   * Deletes an image file by its URL path
   *
   * @param url - The relative URL path of the image (e.g., "/a/b/123/image.avif")
   * @returns Promise that resolves when file is deleted
   */
  async deleteImageByUrl(url: string): Promise<void> {
    try {
      const fullPath = path.join(this.basePath, url);
      await fs.unlink(fullPath);
      console.log(`Deleted image: ${fullPath}`);
    } catch (error) {
      // File might not exist or already deleted, log but don't throw
      console.warn(`Could not delete image at ${url}:`, error);
    }
  }

  /**
   * Deletes multiple images by their URL paths
   *
   * @param urls - Array of relative URL paths
   * @returns Promise that resolves when all files are deleted
   */
  async deleteImagesByUrls(urls: string[]): Promise<void> {
    await Promise.all(urls.map(url => this.deleteImageByUrl(url)));
  }

  /**
   * Creates multiple versions of an image in different formats
   *
   * @param file - The image to convert
   * @param formats - Array of formats
   * @param dimensions - Maximum dimensions (optional)
   * @param options - Format-specific options (optional)
   * @returns Object with paths for each format
   */
  async createMultipleVersions(
    file: File,
    formats: ("jpeg" | "png" | "webp" | "avif")[],
    dimensions?: ImageDimensions,
    options?: ImageQuality & TransparencyOptions
  ): Promise<Record<string, string>> {
    const versions: Record<string, string> = {};

    for (const format of formats) {
      switch (format) {
        case "jpeg":
          versions.jpeg = await this.saveAsJpeg(file, dimensions, options);
          break;
        case "png":
          versions.png = await this.saveAsPng(file, dimensions, options);
          break;
        case "webp":
          versions.webp = await this.saveAsWebp(file, dimensions, options);
          break;
        case "avif":
          versions.avif = await this.saveAsAvif(file, dimensions, options);
          break;
      }
    }

    return versions;
  }
}
