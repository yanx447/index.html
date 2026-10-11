# ჩემი სიყვარული 💘

A small, single-file romantic "will you be mine" webpage — a cute proposal
card with a runaway "no" button, confetti, floating hearts, and a heartfelt
message modal.

## View it

Just open [`index.html`](./index.html) in any modern browser, or enable
**GitHub Pages** for this repository (Settings → Pages → Deploy from branch
`main`, folder `/`) to get a live link.

## What it does

- **კი / არა (Yes / No) card** — clicking or hovering "არა" makes the button
  dodge away to a random spot inside the card, so it can never actually be
  pressed.
- **Confetti + sound** on "კი" (yes), followed by a modal with a personal
  message.
- **Floating hearts** drifting up the background continuously.
- Respects `prefers-reduced-motion` and is keyboard/focus accessible.

## Tech

Plain HTML, CSS, and vanilla JavaScript — no build step, no dependencies to
install. It pulls in two things from a CDN at runtime:

- [canvas-confetti](https://github.com/catdad/canvas-confetti) for the
  confetti burst
- Google Fonts (`Playfair Display`, `Poppins`)

## Customizing

Everything lives in the one `index.html` file:

- Update the name/question text inside `<h2>`.
- Edit the message paragraphs inside `#successModal`.
- Swap the `<audio>` sources for your own sound effects.
