import { ICommand, IFileStorage } from '../types';

export abstract class BaseCommand implements ICommand {
  constructor(protected readonly storage: IFileStorage) {}

  abstract execute(): unknown;

  abstract undo(): void;

  abstract getDescription(): string;
}
