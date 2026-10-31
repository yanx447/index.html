# ფანდური — Panduri Learning

An app that teaches the Georgian three-string panduri on a real instrument: it
listens through the microphone, waits for the learner, and shows the teacher's
own material. This file holds the rules that hold for every piece of work in
this repository. The agents in `.claude/agents/` all inherit them.

## Where things are

| Path | What it is |
|---|---|
| `panduri/source/` | **The project.** Hand-written source, the build script, the 3D pipeline. Work here. |
| `panduri/source/src/*.js` | Every module. Plain JS, no framework, one global namespace `PD`. |
| `panduri/source/build.py` | `python3 build.py` → `dist/app/` (the PWA) and `dist/artifact.html` (one file). |
| `panduri/source/src3d/`, `render/` | The 3D left hand: 819 solved poses, the mesh, the pose solver. |
| `panduri/app/` | **Built output, deployed.** Never edit by hand — it is overwritten by every build. |
| `panduri/app/media/` | The teacher's recordings. The one copy; the source build reads them from here. |
| `panduri/scripts/native-setup.sh` | Builds the real Android and iOS projects (Capacitor, `com.yanx.panduri`). |

Build, then deploy, is: `cd panduri/source && python3 build.py` → copy `dist/app/.`
over `panduri/app/` → commit → push. **Agents do not do the last two steps.**

## The instrument — never change these without asking

* Three strings, **17 frets**. Tuning **A · C♯ · E**.
* Internally string `1` is **A** — the bass, the teacher's **„მე-3 სიმი"**;
  string `2` is **C♯** („მე-2 ხმა"); string `3` is **E** („1-ლი ხმა", the thin
  string, which he also calls „1-ლი სიმი"). Do not swap this mapping.
* Chord positions and fingerings are **computed from the tuning** in
  `theory.js`, not typed in. The teacher's own fingering rule (the thumb holds
  the bass, the index and its neighbours take the two voices above) lives in
  `teacherFingers()`.
* The four rhythms — **kazbeguri, mtiuluri, khorumi, acharuli** — keep their
  exact order, strokes and accents. Khorumi counts **5/8 = 3/8 + 2/8**, „1-2-3,
  1-2".

## What may be said, and how it must be marked

Nothing about panduri technique may be invented. Every card, chapter and tip
carries a source badge, and it must be true:

* `teacher` — the teacher's own words or data.
* `general` — ordinary music theory or practice advice, true of any instrument.
* `fact` — a fact the app can derive itself (a note on a fret, an interval).
* `draft` — written but **not yet confirmed by him**. Say so on the page.

If a change would add, alter or reorder curriculum, technique or fingerings:
**ask him first**, or make it editable in Author Studio. Demo content is
labelled as demo. When something is not known, the app says so rather than
filling the gap.

## Hard rules

* **No secret ever reaches the app.** No service-role key, no API key in any
  file under `source/` or `app/`. Server-side SQL holds the owner check.
* The owner's email appears only in the server's `is_owner()`. Never in a
  header, URL or payload to any other service.
* The microphone is analysed **on the device**. Nothing is uploaded.
* No fake login, no fake recognition, no button that does nothing.
* Touch must never complete a note — only `devTouch` does, for testing.
* `dist/artifact.html` must stay **under 16 MiB**.

## Language

The app is Georgian first, English second; every string lives in
`PD.i18n.add({...})` as `['ka', 'en']`. Keys are namespaced per module
(`bk.*`, `gn.*`, `ins.*`) — **check a new prefix is not already taken**, because
`PD.i18n.add` silently loses a collision and the wrong Georgian appears.

Use `data-t` for plain text and `data-th` where the string carries markup.

## Commits

End every commit message with:

```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_019Bxi4f5zMRf6rePzLrypuA
```

Write what changed and *why*, and name anything that was found broken on the
way. Do not describe unfinished work as finished.

## Reporting

Reports and replies are in **Georgian**, with technical terms left in English
(`service worker`, `grid`, `commit`). Be concrete: numbers, file names, what
was measured. If something could not be verified, say that instead of implying
it was.
