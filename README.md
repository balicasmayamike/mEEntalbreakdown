# Master the Boards

Quiz, mock board exam and spaced-repetition flashcards for MATH, ESAS and EE. Pure HTML/CSS/JS, no build step.

## Deploy on GitHub Pages
1. Push the contents of this folder to a GitHub repo (index.html at the root).
2. Settings → Pages → Deploy from a branch → `main` / `(root)`.

## Add questions
- Topics live in `data/catalog.js` (name, id code, expected item count).
- Questions live in `data/math.js`, `data/esas.js`, `data/ee.js`:
  `{id:"ee-dcg-045",subject:"EE",subtopic:"DC GENERATORS",question:"...",choices:{A:"",B:"",C:"",D:""},answer:"B",solution:""}`
- `subtopic` must match a catalog name exactly. The Home page shows a warning for unknown subtopics or duplicate ids.
- Update the topic's `items` count in `catalog.js` when you add questions.
