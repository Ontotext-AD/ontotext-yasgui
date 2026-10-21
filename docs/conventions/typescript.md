# TypeScript conventions

- Prefer type inference when the type is obvious; annotate when it aids clarity or at a public API boundary.
- Avoid `any`. Use `unknown` when a type is genuinely uncertain, then narrow. Code inside `Yasgui/` uses `any`
  heavily; don't spread it into new code.
- Inline a value used once, such as a translation key. Extract a constant when it's shared, or when its name
  explains a magic value.

Doc comments follow [JSDoc conventions](jsdoc.md).

## Errors

The question to ask before adding an error class is **"does a caller need to catch this and branch?"**

- **Custom error class** — when the failure crosses a module boundary and the caller must react to it (retry, pick
  a message, fall back). Branching needs something more reliable than matching on `message`.
- **Generic `Error`** — when the throw means *this should never happen*: a violated precondition or invariant.
  The message is for the person reading the stack trace.

A custom error costs a file, its JSDoc and its tests — it should buy someone a decision. Don't add one per throw site.

### Writing one

- Prefer **one class with a `kind` discriminant** over a class hierarchy. Branch on `kind`, not on `instanceof`.
- Always set `this.name` explicitly — otherwise it stringifies as plain `Error` once minified.
- Always forward the originating error as `cause`.
- Name the file after the class (`query-execution-error.ts`) and keep it in `src/models/`.

```typescript
export type QueryExecutionErrorKind = 'timeout' | 'aborted' | 'server';

export class QueryExecutionError extends Error {
  constructor(
    readonly kind: QueryExecutionErrorKind,
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'QueryExecutionError';
  }
}
```

The component targets ES2017, so `Error`'s `{ cause }` option isn't available; keep `cause` as a field.
