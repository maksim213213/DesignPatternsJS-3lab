# File Access Management System

TypeScript implementation of a secure file management system using Proxy and Command design patterns.

## Overview

A system that manages access to files on a server with multiple security levels and audit logging.

### Proxy Pattern
SecureFileManager controls access to files based on user permission levels:
- READ (1): View and list files
- WRITE (2): Read and modify files
- ADMIN (3): Full access including deletion

### Command Pattern
File operations as executable commands:
- ReadFileCommand - Read a file
- WriteFileCommand - Write/modify a file
- DeleteFileCommand - Delete a file
- ListFilesCommand - List all files
- CommandHistory - Execute and undo commands

## Architecture

```
┌─────────────────────────────────────────────────────┐
│         SecureFileManager (Proxy)                   │
│  ├─ Access control based on levels                 │
│  ├─ Operation logging & audit trail                │
│  └─ Enforces security policies                     │
└────────────────┬────────────────────────────────────┘
                 │ controls
┌─────────────────────────────────────────────────────┐
│         FileStorage (Real Object)                   │
│  ├─ File read/write operations                     │
│  ├─ File deletion                                   │
│  └─ File listing                                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│         Command Classes                             │
│  ├─ BaseCommand (abstract)                         │
│  ├─ ReadFileCommand                                │
│  ├─ WriteFileCommand                               │
│  ├─ DeleteFileCommand                              │
│  ├─ ListFilesCommand                               │
│  └─ CommandHistory (manages execution & undo)      │
└─────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
src/
├── types/
│   └── index.ts              # Type definitions & interfaces
├── storage/
│   └── FileStorage.ts        # Real file storage implementation
├── access/
│   └── SecureFileManager.ts  # Proxy for access control
├── commands/
│   ├── BaseCommand.ts        # Abstract base for all commands
│   ├── ReadFileCommand.ts    # Read command
│   ├── WriteFileCommand.ts   # Write command
│   ├── DeleteFileCommand.ts  # Delete command
│   ├── ListFilesCommand.ts   # List files command
│   ├── CommandHistory.ts     # Command history & undo
│   └── index.ts              # Commands barrel export
├── example.ts                # Usage examples
└── test.ts                   # Unit tests

dist/                         # Compiled JavaScript output
```

## 🎯 SOLID Principles Applied

### ✅ **Single Responsibility**
Each class handles one concern:
- `FileStorage` → File operations only
- `SecureFileManager` → Access control only
- Each `Command` → Single file operation
- `CommandHistory` → History management only

### ✅ **Open/Closed Principle**
- System is open for extension (new commands)
- Closed for modification (existing code doesn't change)
- Abstract `BaseCommand` allows new command types

### ✅ **Liskov Substitution**
- All commands implement `ICommand` interface
- Can be used interchangeably through `CommandHistory`

### ✅ **Interface Segregation**
- `IFileStorage` - file operations
- `IAccessControl` - access control
- `ICommand` - command execution
- `ICommandHistory` - history management
- Clients depend only on needed interfaces

### ✅ **Dependency Inversion**
- Classes depend on abstractions (`IFileStorage`, `ICommand`)
- Not on concrete implementations
- Easy to mock and test

## 💡 KISS & DRY

- **KISS**: Minimal complexity, straightforward implementations
- **DRY**: 
  - `BaseCommand` - reusable command base
  - `AccessLevel` enum - avoid string literals
  - Centralized exports in `index.ts` files

## 🚀 Installation

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run build

# Run examples
npm start

# Run tests
npm test
```

## 📖 Usage Example

```typescript
import { AccessLevel } from './types';
import { FileStorage } from './storage/FileStorage';
import { SecureFileManager } from './access/SecureFileManager';
import { 
  WriteFileCommand, 
  ReadFileCommand, 
  CommandHistory 
} from './commands';

// Create storage
const storage = new FileStorage();

// Create user with limited access
const user = new SecureFileManager(storage, AccessLevel.WRITE);

// Create command history
const history = new CommandHistory();

// Execute commands
history.execute(new WriteFileCommand(user, 'file.txt', 'Hello'));
history.execute(new ReadFileCommand(user, 'file.txt'));

// Undo last command
history.undo();

// View access log
user.printAccessLog();
```

## 🔍 Access Levels

| Level | Read | Write | Delete | Use Case |
|-------|------|-------|--------|----------|
| NONE  | ❌   | ❌    | ❌     | No access |
| READ  | ✅   | ❌    | ❌     | Viewers |
| WRITE | ✅   | ✅    | ❌     | Editors |
| ADMIN | ✅   | ✅    | ✅     | Administrators |

## 📊 Features

✅ **Multi-level Access Control**
- Role-based access restrictions
- Detailed audit logging
- Attempt tracking (success/failure)

✅ **Command History with Undo**
- Execute operations as commands
- Rollback to previous states
- Full command history tracking

✅ **Security & Audit**
- All operations logged with timestamp
- Access denied attempts recorded
- User level and required level tracked

✅ **Type Safety**
- Full TypeScript support
- Strict type checking enabled
- Interface-based design

✅ **Error Handling**
- Meaningful error messages
- Graceful failure handling
- Access denial explanations

## 🧪 Testing

Run the comprehensive test suite:

```bash
npm test
```

Tests cover:
- Basic file storage operations
- Access level enforcement
- Command execution
- Undo functionality
- Error handling
- Multiple user scenarios
- Audit logging

## 📝 License

MIT
