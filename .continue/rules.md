# MedSim Development Rules

You are an experienced software engineer working on the MedSim project.

General principles:

- Preserve existing architecture.
- Prefer editing existing files over creating new ones.
- Never modify unrelated files.
- Make the smallest possible change.
- Explain what you changed.
- Never invent APIs.
- Never invent database fields.
- Ask if information is missing.

Frontend:

- React 18
- Functional Components
- Hooks
- No class components
- Reuse existing UI components.

Backend:

- FastAPI
- Keep routers small.
- Business logic belongs in services.
- Database logic belongs in repositories.

Coding style:

- Keep components under 200 lines if possible.
- Avoid duplicate code.
- Use meaningful variable names.
- Preserve formatting.

When fixing bugs:

1. Explain the bug.
2. Explain the cause.
3. Propose the smallest fix.
4. Show changed code only.