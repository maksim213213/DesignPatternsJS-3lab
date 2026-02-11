# SOLID принципы в проекте

## 1. Single Responsibility Principle (SRP)

Каждый класс отвечает за одну область функциональности:

### ✅ FileStorage
```typescript
// ТОЛЬКО операции с файлами
export class FileStorage implements IFileStorage {
  readFile(filePath: string): string { ... }
  writeFile(filePath: string, content: string): void { ... }
  deleteFile(filePath: string): void { ... }
}
```

### ✅ SecureFileManager
```typescript
// ТОЛЬКО проверка доступа и логирование
export class SecureFileManager implements IFileStorage, IAccessControl {
  checkAccess(...): boolean { ... }
  getAccessLog(): AccessLogEntry[] { ... }
}
```

### ✅ Commands
```typescript
// Каждая команда - одна операция
class ReadFileCommand { /* чтение */ }
class WriteFileCommand { /* запись */ }
class DeleteFileCommand { /* удаление */ }
class ListFilesCommand { /* список */ }
```

### ✅ CommandHistory
```typescript
// ТОЛЬКО управление историей
class CommandHistory implements ICommandHistory {
  execute(command: ICommand): void { ... }
  undo(): void { ... }
  getHistory(): string[] { ... }
}
```

---

## 2. Open/Closed Principle (OCP)

Открыта для расширения, закрыта для модификации:

### ✅ Расширяемость через наследование
```typescript
// Легко добавить новую команду без изменения существующего кода
class CopyFileCommand extends BaseCommand {
  execute(): void { ... }
  undo(): void { ... }
  getDescription(): string { ... }
}

// CommandHistory работает с любой командой через интерфейс ICommand
```

### ✅ Расширяемость через интерфейсы
```typescript
// Можно заменить IFileStorage на другую реализацию
interface IFileStorage {
  readFile(filePath: string): string;
  writeFile(filePath: string, content: string): void;
  deleteFile(filePath: string): void;
  listFiles(): string[];
}

// Новая реализация - например с облаком
class CloudFileStorage implements IFileStorage { ... }
```

---

## 3. Liskov Substitution Principle (LSP)

Подтипы должны корректно заменять базовые типы:

### ✅ Команды как взаимозаменяемые
```typescript
const commands: ICommand[] = [
  new ReadFileCommand(storage, 'file.txt'),
  new WriteFileCommand(storage, 'file.txt', 'data'),
  new DeleteFileCommand(storage, 'file.txt'),
];

// Все работают одинаково через единый интерфейс
commands.forEach(cmd => history.execute(cmd));
```

### ✅ Хранилища как взаимозаменяемые
```typescript
function createSecureManager(
  storage: IFileStorage, // Абстракция
  level: AccessLevel
): SecureFileManager {
  return new SecureFileManager(storage, level);
}

// Работает с FileStorage, CloudFileStorage и др.
```

---

## 4. Interface Segregation Principle (ISP)

Клиенты не должны зависеть от интерфейсов, которые они не используют:

### ✅ Разделенные интерфейсы
```typescript
// Вместо одного большого интерфейса
interface IBigInterface {
  readFile(): string;
  writeFile(): void;
  checkAccess(): boolean;
  logAccess(): void;
  execute(): void;
  undo(): void;
}

// Используем несколько специализированных интерфейсов
interface IFileStorage {
  readFile(filePath: string): string;
  writeFile(filePath: string, content: string): void;
  deleteFile(filePath: string): void;
  listFiles(): string[];
}

interface IAccessControl {
  checkAccess(...): boolean;
  getAccessLog(): AccessLogEntry[];
}

interface ICommand {
  execute(): unknown;
  undo(): void;
  getDescription(): string;
}

// Класс реализует только нужные интерфейсы
class SecureFileManager implements IFileStorage, IAccessControl { ... }
```

---

## 5. Dependency Inversion Principle (DIP)

Зависеть от абстракций, а не от конкретных реализаций:

### ✅ Инверсия зависимостей
```typescript
// ПЛОХО: SecureFileManager зависит от FileStorage
class SecureFileManager {
  constructor(private storage: FileStorage) { ... }
}

// ХОРОШО: SecureFileManager зависит от IFileStorage
class SecureFileManager {
  constructor(private storage: IFileStorage) { ... }
}

// ХОРОШО: Commands зависят от IFileStorage
abstract class BaseCommand {
  constructor(protected storage: IFileStorage) { }
}
```

### ✅ Внедрение зависимостей
```typescript
// Легко использовать разные реализации
const realStorage = new FileStorage();
const cloudStorage = new CloudFileStorage();

const localUser = new SecureFileManager(realStorage, AccessLevel.READ);
const remoteUser = new SecureFileManager(cloudStorage, AccessLevel.READ);
```

---

## 📊 Применение DRY (Don't Repeat Yourself)

### ✅ Базовый класс для команд
```typescript
// Вместо дублирования логики в каждой команде
abstract class BaseCommand {
  constructor(protected storage: IFileStorage) { }
  abstract execute(): unknown;
  abstract undo(): void;
  abstract getDescription(): string;
}

// Каждая команда наследует базовую структуру
class ReadFileCommand extends BaseCommand { ... }
class WriteFileCommand extends BaseCommand { ... }
```

### ✅ Централизованные экспорты
```typescript
// src/commands/index.ts
export { BaseCommand } from './BaseCommand';
export { ReadFileCommand } from './ReadFileCommand';
export { WriteFileCommand } from './WriteFileCommand';
export { DeleteFileCommand } from './DeleteFileCommand';
export { ListFilesCommand } from './ListFilesCommand';
export { CommandHistory } from './CommandHistory';

// Использование
import { CommandHistory, ReadFileCommand } from './commands';
```

### ✅ Типы в одном месте
```typescript
// src/types/index.ts - единое определение типов
export enum AccessLevel { ... }
export enum OperationType { ... }
export interface IFileStorage { ... }
export interface IAccessControl { ... }
```

---

## 💡 Применение KISS (Keep It Simple, Stupid)

### ✅ Простые интерфейсы
```typescript
// Четкие, понятные методы без лишней сложности
interface IFileStorage {
  readFile(filePath: string): string;
  writeFile(filePath: string, content: string): void;
  deleteFile(filePath: string): void;
  listFiles(): string[];
}
```

### ✅ Простая логика доступа
```typescript
// Прямолинейная проверка
checkAccess(required: AccessLevel): boolean {
  const allowed = this.userLevel >= required;
  this.logAccess(allowed);
  
  if (!allowed) {
    throw new Error('Access denied');
  }
  
  return true;
}
```

### ✅ Четкая иерархия классов
```typescript
// Простое наследование, не множественное
class ReadFileCommand extends BaseCommand { }
class WriteFileCommand extends BaseCommand { }

// Не путать с чрезмерным использованием миксинов или сложных паттернов
```

---

## 🎯 Преимущества такой архитектуры

✅ **Легко тестировать** - каждый компонент изолирован  
✅ **Легко расширять** - добавление новых команд не требует изменений  
✅ **Легко поддерживать** - ясная структура и ответственность  
✅ **Переиспользуемость** - компоненты можно применять отдельно  
✅ **Гибкость** - легко менять реализацию хранилища  
✅ **Безопасность типов** - полная поддержка TypeScript  

---

## 📚 Ресурсы

- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [Design Patterns in TypeScript](https://refactoring.guru/design-patterns/typescript)
