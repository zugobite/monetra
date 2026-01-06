---
name: Bug report
about: Create a report to help us improve
title: ""
labels: bug
assignees: ""
---

**Describe the bug**
A clear and concise description of what the bug is.

> **Note:** Please check our [Project Board](https://github.com/users/zugobite/projects/2) and [Roadmap](https://github.com/users/zugobite/projects/2/views/4) to see if this bug is already being tracked.

**To Reproduce**
Steps to reproduce the behavior:

1. Create Money object '...'
2. Perform operation '...'
3. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Code Snippet**

```typescript
// Please provide a minimal reproduction
import { Money, USD } from "monetra";

const m = Money.fromMajor("10.00", USD);
// ...
```

**Environment:**

- OS: [e.g. macOS, Windows, Linux]
- Node Version: [e.g. 18.x, 20.x, 22.x]
- Monetra Version: [e.g. 2.1.0]
- TypeScript Version (if applicable): [e.g. 5.3.0]

**Error Output (if applicable)**

```
Paste any error messages or stack traces here
```

**Additional context**
Add any other context about the problem here.
