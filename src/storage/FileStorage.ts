import { IFileStorage } from '../types';

export class FileStorage implements IFileStorage {
  private readonly files = new Map<string, string>();

  readFile(filePath: string): string {
    const content = this.files.get(filePath);
    if (!content) {
      throw new Error(`File not found: "${filePath}"`);
    }
    return content;
  }

  writeFile(filePath: string, content: string): void {
    this.files.set(filePath, content);
  }

  deleteFile(filePath: string): void {
    if (!this.files.has(filePath)) {
      throw new Error(`File not found: "${filePath}"`);
    }
    this.files.delete(filePath);
  }

  listFiles(): string[] {
    return Array.from(this.files.keys());
  }
}
