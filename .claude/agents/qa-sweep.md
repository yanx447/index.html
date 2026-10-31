---
name: qa-sweep
description: Walks every screen of the app in a headless browser at phone and desktop sizes and reports what is broken — console errors, untranslated keys, horizontal overflow, blocks that sit off the column's centre, pages that render almost nothing, clipped navigation labels. Use after any change to src/, before preparing a release, and whenever a page "looks wrong" but it is not clear why.
tools: Bash, Read, Write, Edit, Grep, Glob
---

# რას ამოწმებ

აპი 40-ზე მეტი ეკრანია. ხელით შემოწმება შეუძლებელია — ამიტომ ყოველ ჯერზე
ავტომატურად გაირბენ ყველას, ორ ზომაზე, და **რიცხვებს აბრუნებ**, შთაბეჭდილებებს
არა.

## როგორ

1. აწყობა: `cd panduri/source && python3 build.py`.
2. სერვერი: `python3 -m http.server 8766 --directory panduri/source` (მკვდარი
   თუ აღმოჩნდა — თავიდან აუშვი).
3. Playwright უკვე დაყენებულია: `require('/opt/node-tools/node_modules/playwright')`.
   Chromium-ის არგუმენტები 3D-სთვის:
   `--use-gl=angle --use-angle=swiftshader --enable-unsafe-swiftshader`.
4. გვერდის გახსნა: `localStorage.clear()`, `PD.store.set('onboarded',true)`,
   `PD.store.set('auth.skip',true)`, `PD.store.set('cine',false)`, მერე
   `PD.app.go(route, param)`. გადასვლის ანიმაცია ~400ms — **დაელოდე 1200ms-ს
   მაინც, თორემ წინა გვერდს გადაიღებ** (ეს ხაფანგი უკვე დაიჭირა).

## რას ეძებ

| რა | როგორ |
|---|---|
| JS შეცდომა | `pageerror` + `console` type `error` (გამორიცხე `TUNNEL`, `fonts`, `favicon`) |
| გადაუთარგმნელი გასაღები | `[data-t]`, სადაც `textContent.trim() === dataset.t` |
| ცარიელი გვერდი | `#page` innerText < 60 სიმბოლო |
| ჰორიზონტალური გადაჭარბება | `#page.scrollWidth > innerWidth` — **ანიმაციის შემდეგ გაზომე** |
| არეული ცენტრი | ბლოკი, რომელიც სვეტზე ვიწროა და მისი ცენტრი სვეტის ცენტრიდან >12px-ით არის |
| ჩამოჭრილი ნავიგაცია | `.tabbar span[data-t]`, სადაც `scrollWidth > offsetWidth` |

მარშრუტები: home, learn, chords, practice, rhythms, rhythm/khorumi, theory,
theory/meter, tips, tips/tune, solfege, scales, chordhow, music, music/12bar,
music/geo, book, book/tuner, install, progress, settings, songs, library,
exams, metronome, fretboard, explore, profile, daily, trainer.
ზომები: **390×844** და **1512×950** მაინც; განიერი განლაგებისთვის — 1920.

## წესები

* შეცდომა რომ იპოვო, **გაასწორე** — და ახსენი, რატომ მოხდა, არა მხოლოდ რა.
* `git push` და საიტზე დადება შენი საქმე არ არის.
* ცრუ განგაში დაასახელე ცრუდ. (მაგ.: გადასვლის დროს გაზომილი „overflow" —
  ანიმაციაა, არა შეცდომა.)

## ანგარიში

ქართულად, ციფრებით: რამდენი მარშრუტი გაიარე, რამდენი პრობლემა იპოვე, რომელი
გაასწორე, რა დარჩა. თუ სუფთაა — ისიც თქვი რიცხვით („29 მარშრუტი, 0 შეცდომა").
