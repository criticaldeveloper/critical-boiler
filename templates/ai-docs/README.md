# AI Docs

This folder gives coding agents and future maintainers enough context to work safely in `{{ projectName }}`.

## Project Snapshot

- Name: `{{ projectName }}`
- Generated: `{{ generatedAt }}`
- Technologies: {{ technologies }}

## How To Use This Folder

- Read `../AGENTS.md` before making code changes.
- Read `architecture.md` to understand entrypoints, routing, module boundaries, data flow, state, styling, and tests.
- Read `commands.md` before running install, dev, typecheck, lint, test, build, E2E, or format commands.
- Check `definition-of-done.md` before handing work back.
- Use `skills/` for repeatable implementation rules.
- Use `critical-boiler prompt <name>` for reusable task prompts; the CLI asks for values, prints the final prompt, and copies it to the clipboard.
- Add short decision notes when a choice would otherwise need to be rediscovered.

## Available Skills

{{ aiDocsSkillsSection }}

## Available Prompts

{{ aiDocsPromptsSection }}

## Frontend Styling Baseline

{{ frontendStylingBaselineSection }}

## Technology Notes

{{ aiDocsTechnologyNotes }}

## Project Notes

Add project-specific services, decisions, and notes below as the project becomes real. Keep architecture details in `architecture.md`, command details in `commands.md`, and completion criteria in `definition-of-done.md`.
