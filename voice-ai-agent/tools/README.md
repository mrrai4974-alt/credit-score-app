# Agent Tools (Phase 7)

Each tool is a self-contained module implementing a common `Tool` interface so
the agent can decide when to call it. Planned tools:

1. Web search
2. Calculator
3. Date / time
4. Notes
5. Reminders
6. Website lookup

Tools are registered in a registry and exposed to Claude via tool-calling.
Nothing here is wired up yet — this folder documents the seam so tools can be
added without touching the UI or AI service.
