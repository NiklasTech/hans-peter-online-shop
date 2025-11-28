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

export class ImageProcessor {
  private readonly files: File[];
  private readonly basePath: string;
  private productId?: number;

  /**
   * @param basePath - Base output path (e.g., "public/productImages")
   * @param productId - Optional product ID for path structure
   */
  constructor(basePath: string = "public/productImages", productId?: number) {
    this.basePath = basePath;
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
   * Generates path according to schema: /[a-f]/[a-f]/[productId]/filename.extension
   */
  private generatePath(filename: string, extension: string): string {
    const hash = crypto.createHash("md5").update(filename).digest("hex");
    const firstChar = hash[0];
    const secondChar = hash[1];

    const productIdPart = this.productId ? `/${this.productId}` : "";

    return `/${firstChar}/${secondChar}${productIdPart}/${filename}.${extension}`;
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
   * @param dimensions - Maximum dimensions (optional)
   * @param options - Quality and transparency options (optional, default quality: 75)
   * @returns Path of the saved image (relative to basePath)
   */
  async saveAsAvif(
    file: File,
    dimensions?: ImageDimensions,
    options?: ImageQuality & TransparencyOptions
  ): Promise<string> {
    const buffer = await this.fileToBuffer(file);
    const filename = path.parse(file.name).name;
    const relativePath = this.generatePath(filename, "avif");
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

    // AVIF conversion
    await image
      .avif({
        quality: options?.quality ?? 75,
      })
      .toFile(fullPath);

    return relativePath;
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

