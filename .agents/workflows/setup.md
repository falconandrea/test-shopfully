---
description: New project setup protocol - interrogate requirements and generate context documentation
---

## Steps

1. Read `AGENTS.md` to internalize global rules. Activate **PLANNING MODE**. No code will be written during this phase.

2. Verify that `.ai/context/architecture.md` contains the correct stack details (not just the placeholder). If not, instruct the developer to fill it in first.

3. Follow the full interrogation framework in `.ai/prompts/project_setup.md` to run discovery with the developer.
   Ask questions phase by phase and wait for answers.

4. Once the interrogation is complete and approved, generate the context files in `.ai/context/`:
   - `architecture.md` (update with project-specific details)
   - `requirements.md`
   - `app_flow.md`
   - Update `.ai/memory/progress.md` with the initial status.

5. Confirm setup is complete.
