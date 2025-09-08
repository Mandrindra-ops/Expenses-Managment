import path from "path";
import { stat, readFile } from "fs/promises";
import {sanitizeFilename} from "../utils/utils";
import { getMimeType } from "../utils/utils";

const RECEIPTS_DIR = path.resolve("receipts");

export interface ReceiptResult {
  fileBuffer: Buffer;
  mimeType: string;
  size: number;
  filename: string;
  lastModified: Date;
}

export async function getReceiptFile(id: string): Promise<ReceiptResult> {
  const sanitizedId = sanitizeFilename(id);

  const possibleExtensions = [
    ".pdf", ".jpg", ".jpeg", ".png",
    ".gif", ".webp", ".tiff", ".bmp"
  ];

  let filePath: string | null = null;
  let foundExtension = "";

  for (const ext of possibleExtensions) {
    const testPath = path.join(RECEIPTS_DIR, `${sanitizedId}${ext}`);
    try {
      await stat(testPath);
      filePath = testPath;
      foundExtension = ext;
      break;
    } catch {
      continue;
    }
  }

  if (!filePath) {
    const testPath = path.join(RECEIPTS_DIR, sanitizedId);
    try {
      await stat(testPath);
      filePath = testPath;
    } catch {
      throw new Error("NOT_FOUND");
    }
  }

  const stats = await stat(filePath);

  if (!stats.isFile()) {
    throw new Error("NOT_FILE");
  }

  const fileBuffer = await readFile(filePath);
  const mimeType = getMimeType(filePath);

  return {
    fileBuffer,
    mimeType,
    size: stats.size,
    filename: `receipt-${sanitizedId}${foundExtension}`,
    lastModified: stats.mtime,
  };
}
