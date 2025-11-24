# BC3reader

A package to read BC3 files in Javascript to parse and convert them to JSON.

## Installation

```bash
npm install bc3reader
```

## Usage

```typescript
import { parseBC3 } from 'bc3reader';

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Get the buffer
    const arrayBuffer = await file.arrayBuffer();

    // 2. Parse it
    const data = parseBC3(new Uint8Array(arrayBuffer));
  };
```

## License

MIT © [Lifo123](https://github.com/Lifo123)
