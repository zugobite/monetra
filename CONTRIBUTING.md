# Contributing to Monetra

First off, thanks for taking the time to contribute! Monetra is a critical financial library, and we value correctness above all else.

## How to Contribute

1.  **Fork the repository**
2.  **Create your feature branch** (`git checkout -b feature/amazing-feature`)
3.  **Commit your changes** (`git commit -m 'Add amazing feature'`)
4.  **Push to the branch** (`git push origin feature/amazing-feature`)
5.  **Open a Pull Request**

## Guidelines

### Issue Tracking & Roadmap

We use [GitHub Projects](https://github.com/users/zugobite/projects/2) to track our roadmap and active development.

- **Before starting work**: Please check the "In Progress" column to ensure no one else is working on the same task.
- **Picking up an issue**: Comment on the issue asking to be assigned, so we can move it to "In Progress".
- **Status Updates**: Check the board for the latest status on features and bugs.

### Code Style

- We use **TypeScript** with `strict: true`.
- No floating-point arithmetic is allowed.
- All operations must be immutable.
- Run `pnpm run lint` to ensure code style compliance.

### Testing

- **Correctness is paramount.**
- All new features must include comprehensive unit tests.
- Run `pnpm test` to verify your changes.
- Ensure 100% test coverage for new logic.

### Documentation

- Update `README.md` or `docs/` if you change public APIs.
- Add TSDoc comments to all exported functions and classes.

### Commits

- Keep commits atomic and well-described.
- We follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat: add allocation`, `fix: rounding error`).

## Development Workflow

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the package
pnpm run build

# Format code
pnpm run format
```
