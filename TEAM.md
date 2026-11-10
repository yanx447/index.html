# Panduri — Codex / Claude coordination

## Shared rules
- Read CLAUDE.md before changing the project.
- Hand-written source is in panduri/source/. Do not edit panduri/app/ by hand.
- Use separate Git worktrees and branches for concurrent implementation.
- Begin both worktrees from the same reviewed baseline. Existing uncommitted work must be preserved and included explicitly; a new worktree alone does not include it.
- Do not reset, clean, discard, commit, push or publish another agent's work.
- One integration owner (Codex) reviews changes, resolves conflicts, runs checks and generates the final app build.
- This file is a handoff document, not a live messaging channel. Check updates before starting a task; report changed paths and validation when handing off.

## Ownership for the next task
| Agent | Scope | Coordinate before editing |
| --- | --- | --- |
| Codex | UI, CSS, motion, route transitions, visual effects | app.css, app.js, motion.js, fx.js |
| Claude | Audio, microphone detection, learning functionality | audio.js, detector.js, engine.js, coach.js |

Shared infrastructure (core.js, ui.js, build.py, serve.py, package files), curriculum, tuning and fingering changes require coordination before editing. Follow the project's teacher-verification rules.

## Current handoff
- Status: preparing isolated workspaces; Claude has not been connected or started by Codex.
- Existing checkout has uncommitted work; do not assume HEAD is the current application.
- Latest Codex work: studio visual finish, desktop navigation dock, tool-card interaction effects, warmer UI cues, suppression of tap/select/toggle cues during microphone analysis or active practice.
- Local dev server: http://localhost:8182/panduri/app/ (only while the process remains running).
- Build dependency used this session: Pillow installed under /private/tmp/panduri-build-deps. Temporary files can disappear.
- Build command used: PYTHONPATH=/private/tmp/panduri-build-deps npm run dev
- Claude task: investigate chord-presence false positives caused by shared harmonics in detector.js.
- Phase 1 authorized: inspect chord-event consumers and write/run an isolated Node reproduction harness. Do not change production detector logic yet.
- Candidate fix is unproven; proceed to implementation only after reproduction and review. A failed reproduction requires reporting evidence, not silently closing the issue.
- Full worktree checkout was stopped because large binary files stalled disk I/O. Do not use /Volumes/NUKRI/Projects/panduri-claude-audio; its checkout is incomplete. Branch claude/chord-presence was reserved.
- Phase 1 research snapshot is READY at /private/tmp/panduri-claude-repro (not a Git worktree). It contains 58 current runtime source files and baseline-sha256.json. Open this folder in Claude Code; write only qa/ reproduction harness/results. Production implementation remains on hold until a reviewed worktree is ready.
- Allowed future production scope after review: panduri/source/src/detector.js only. Keep harness and results in qa/ under a task-specific name.
- Required matrix: each missing string, all three strings with one at 0 / -6 / -12 dB, adjacent wrong fret, multiple harmonic envelopes, 44.1 and 48 kHz. Report false positives and false negatives.
- Synthetic tests cannot establish real-instrument accuracy. Keep real-instrument validation explicitly pending.
- Measure CPU impact before claiming no increase; shared-harmonic checks must not be repeated inside the per-sample loop.
- No additional DSP agent is required for phase 1; coordinate before delegating further.

## Handoff format
Task / agent / branch and worktree / owned paths / changed paths / checks and results / unresolved issues.
