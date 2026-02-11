import { ICommand, ICommandHistory } from '../types';

export class CommandHistory implements ICommandHistory {
  private readonly history: ICommand[] = [];

  execute(command: ICommand): void {
    command.execute();
    this.history.push(command);
  }

  undo(): void {
    if (this.history.length === 0) {
      return;
    }

    const lastCommand = this.history.pop();
    if (lastCommand) {
      lastCommand.undo();
    }
  }

  undoAll(): void {
    while (this.history.length > 0) {
      this.undo();
    }
  }

  getHistory(): string[] {
    return this.history.map((cmd) => cmd.getDescription());
  }

  printHistory(): void {
    console.log('Command History:');
    if (this.history.length === 0) {
      console.log('  (empty)');
      return;
    }
    this.history.forEach((command, index) => {
      console.log(`  ${index + 1}. ${command.getDescription()}`);
    });
  }
}
