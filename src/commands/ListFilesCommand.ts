import { BaseCommand } from './BaseCommand';
import { IFileStorage } from '../types';

export class ListFilesCommand extends BaseCommand {
  private result: string[] = [];

  constructor(storage: IFileStorage) {
    super(storage);
  }

  execute(): string[] {
    this.result = this.storage.listFiles();
    return this.result;
  }

  undo(): void {
    this.result = [];
  }

  getDescription(): string {
    return 'List files';
  }
}
