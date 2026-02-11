import { BaseCommand } from './BaseCommand';
import { IFileStorage } from '../types';

export class WriteFileCommand extends BaseCommand {
  private previousContent: string | null = null;
  private fileExisted = false;

  constructor(
    storage: IFileStorage,
    private readonly filePath: string,
    private readonly content: string,
  ) {
    super(storage);
  }

  execute(): void {
    try {
      this.previousContent = this.storage.readFile(this.filePath);
      this.fileExisted = true;
    } catch {
      this.previousContent = null;
      this.fileExisted = false;
    }

    this.storage.writeFile(this.filePath, this.content);
  }

  undo(): void {
    if (!this.fileExisted) {
      try {
        this.storage.deleteFile(this.filePath);
      } catch {
        // ignore
      }
    } else if (this.previousContent !== null) {
      this.storage.writeFile(this.filePath, this.previousContent);
    }
  }

  getDescription(): string {
    return `Write file: ${this.filePath}`;
  }
}
