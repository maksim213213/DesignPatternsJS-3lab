import { BaseCommand } from './BaseCommand';
import { IFileStorage } from '../types';

export class ReadFileCommand extends BaseCommand {
  private result: string | null = null;

  constructor(
    storage: IFileStorage,
    private readonly filePath: string,
  ) {
    super(storage);
  }

  execute(): string {
    this.result = this.storage.readFile(this.filePath);
    return this.result;
  }

  undo(): void {
    this.result = null;
  }

  getDescription(): string {
    return `Read file: ${this.filePath}`;
  }
}
