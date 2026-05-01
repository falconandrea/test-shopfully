---
description: New feature workflow - create a PRD, get approval, generate tasks
---

## Steps

1. Activate **PLANNING MODE**. No code will be written during this phase.

2. Read existing `.ai/context/` files (`requirements.md`, `architecture.md`, `app_flow.md`) to understand constraints and the current design.

3. Ask the user to describe the feature. Ask clarifying questions as needed to gather full requirements.

4. Write the feature spec following the template in `.ai/features/_TEMPLATE.md` and save it to `.ai/features/[feature-name]/prd-[feature-name].md`.

5. Present the feature spec to the user and ask for approval.

6. Once approved, generate the task list and save it to `.ai/features/[feature-name]/tasks-[feature-name].md`.
   Update `.ai/memory/progress.md` with the new feature.

7. Exit plan mode and ask the user if you should start the implementation (ACTING MODE).
