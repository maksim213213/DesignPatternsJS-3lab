import { BaseCommand } from './BaseCommand';
import { IFileStorage } from '../types';

export class DeleteFileCommand extends BaseCommand {
  private deletedContent: string | null = null;

  constructor(
    storage: IFileStorage,
    private readonly filePath: string,
  ) {
    super(storage);
  }

  execute(): void {
    this.deletedContent = this.storage.readFile(this.filePath);
    this.storage.deleteFile(this.filePath);
  }

  undo(): void {
    if (this.deletedContent !== null) {
      this.storage.writeFile(this.filePath, this.deletedContent);
    }
  }

  getDescription(): string {
    return `Delete file: ${this.filePath}`;
  }
}
