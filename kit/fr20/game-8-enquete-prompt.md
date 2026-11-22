# Prompt for a new chat: French 20-3Y capstone, game 8 "L'enquête" (Sierra-style point and click)

Copy everything below the line into a new chat in the "French Language Games" project.

---

You are continuing my French 20-3Y series "Le grand voyage" (Alberta French as a Second Language, 3-Year Program, 20-3Y). Games 1–6 are built and live. Game 8 is the capstone of the series. It is a crime-solving point-and-click adventure, styled as closely as possible on Sierra's **Police Quest** series (especially the VGA *Police Quest 1* remake and *Police Quest 3*), but educational. Read the project docs `claude/french-20-3y-game-plan.md` and `claude/game-picker-design.md` first, and use the `polished-2d-game-art` skill for all art.

## 0. How I want you to work
- **Before building, give me options to choose from** for the open decisions in section 9, using multiple-choice questions. Recommend one option for each. Skip any decision I have already answered in this chat.
- Vary gameplay from the other games. Games 1–4 are chat-and-choose, Bretagne uses planning puzzles, and Bruxelles uses comic pages. This game must feel like a real Sierra adventure, not a quiz with pictures.
- Keep it firmly educational: students must reason from evidence, build sentences, read for detail, order events in time, and write. Recall or guessing alone must not be enough to succeed.
- Rewards must follow good work. For example, the final written report must pass before the arrest cinematic plays.
- Send me drafts as soon as each piece is playable (style test room, then each act) so I can redirect early.
- Target play time: **60–90 minutes**, with save and restore.
- Polish matters: this is the capstone. Every room needs layered painted backgrounds, lighting from one side, contact shadows, readable props, smooth walking, and Sierra-style text boxes.

## 1. Repo and existing code
- Repo: `grownupmonkey/french-games` (GitHub Pages: `grownupmonkey.github.io/french-games/`). Attach it with push access (add_repo) and clone it.
- Built pages go in `20-3y/`. Source is `kit/fr20/`; build with `python3 build.py`, which writes single-file HTML pages.
- Shared pieces to reuse:
  - `profile.js`: `Store` (localStorage key `jeuxFr20.voyage`), `agree` and `fmt` (`{masc|fém}` agreement by the student's chosen gender), `esc`.
  - `journey.js`: the `JOURNEY` list of 8 stops, `stampSVG`, and `nextStop`. Change stop 8 to this game (id, place, title, file) and set `ready:true` when it ships.
  - `art.js`: `person(o)` characters (skin, hair, style, coat from `COATS`, hat, pants, scarf, glasses, …), `playerLook(p, extra)`, `faceSVG`, `shadow`, `svgDefs`. **The player character is the student's own traveller** from `voyage.html`, drawn with `person()` and the stored look. Add new coats (detective trench, police navy) to `COATS`.
  - `engine.js`: the step-based engine for games 1–6. Its step types include `tiles` (word tiles with targeted hints), `plan` (slots under constraints), `doc`, `number`, `letter` (guided writing checked section by section, grammar errors first, print or copy), `arrange`, and `finale`. It also has stamp download and print (`stampCard`, `downloadStamp`, `printStamp`) and French-only read-aloud (`pickVoice`: fr-CA, then fr-FR, otherwise read-aloud turns off with a message; never use an English voice).
- **Architecture for this game:** write a new adventure engine (`kit/fr20/src/adv-engine.js`, `adv.css`, and an `adventure.html` template) rather than forcing it into `engine.js`. Reuse the learning tasks by extracting the step renderers (`tiles`, `plan`, `letter`, `doc`, `number`) into a shared module with an API such as `runStep(step, container, onDone)`, and open them in a Sierra-style "dossier" overlay. If you refactor `engine.js`, re-run the automated playthroughs of games 1–6 (`play.py` through `play6.py`, using `solve.js`) and confirm they show no page errors.
- Known Chrome gotcha: gradients defined inside an SVG in a hidden section don't paint. Put shared `<defs>` in an always-visible zero-size `<svg>` appended to `document.body`.
- Testing: Playwright with `/usr/bin/google-chrome` against `python3 -m http.server`. Write a full automated playthrough (plus one run with deliberate bad recommendations and one failure screen). Check screenshots at 200% for jagged edges, blurry text, and missing shadows. Syntax-check the built script with `node --check`.
- When it ships: add it to the picker `GAMES` array in `index.html` (`open:true`, `href`), to `liste.html`, and to `README.md`; update the game plan doc; commit with a clear message.

## 2. Sierra / Police Quest look and feel
- **Screen:** a 16:10 stage (for example a 1280×800 logical size, scaled to fit) with a hidden icon bar that drops down when the pointer reaches the top edge (SCI style). The bar shows the score ("Points : 45 sur 300") and the in-game clock.
- **Verbs** (icons with French labels): Marcher, Regarder, Prendre / Utiliser (main), Parler, Objet sélectionné, Inventaire, Carnet (notebook), Options. Right-click cycles verbs as in Sierra games. The cursor changes per verb (SVG cursors, sharp on high-DPI screens).
- **Rooms:** painted, layered SVG backgrounds (back layer, walkable floor, foreground occluders such as desks or doorframes the player walks behind). The player walks along a walkable polygon with simple pathfinding, scales with depth, and has a walk cycle and a contact shadow. Exits are at screen edges or doors.
- **Text boxes:** the classic centred Sierra message box with a bevelled border and serif type, narrated in French by a dry, deadpan narrator. All text is HTML over the picture, never drawn into a canvas.
- **Score:** Police Quest's famous "by the book" points. Students earn points for correct procedure (putting on gloves before touching evidence, photographing before collecting, labelling evidence bags, telling a suspect their rights, logging evidence in the evidence room), for good recommendations, and for solving tasks. The score is shown at the end with a rank ("Agent·e débutant·e" up to "Inspecteur / Inspectrice émérite", with agreement by gender).
- **Failure screens:** Sierra-style "game over" screens with black humour and a "Restaurer" / "Réessayer" button that returns to the last checkpoint. Failures must teach procedure or French, never punish randomly. Examples:
  - Walking on the evidence: « Vous avez marché sur la preuve. L'avocat de la défense vous enverra une carte de remerciement. »
  - Touching evidence without gloves: « Bravo. Vos empreintes sont maintenant les seules sur la scène. Vous êtes votre suspect principal. »
  - Forgetting to log evidence: « La preuve a disparu dans la salle des preuves. Comme la moitié du café de l'équipe. »
- **Save / restore:** several save slots in localStorage (key `jeuxFr20.enquete`), plus an automatic save at each act. Show the Sierra reminder once: « Sauvegardez souvent. Les criminels, eux, ne vous attendront pas. »
- **Sound:** optional, off by default, never required. Read-aloud is French only, as above.
- **Tone:** cop-drama black humour (tired detectives, terrible station coffee, a sarcastic evidence clerk, a captain who has seen it all). It is dry, never silly, childish, or gory. No bodies, no gore, no real police insignia (use an invented generic badge), and no drawn trademarks.

## 3. Default story (draft — confirm or change it with me through options)
- **Setting:** Lafayette, Louisiana, the heart of Cajun country, on the eve of the Festivals acadiens et créoles. This keeps Cajun French and the link back to the Acadie stop (game 3) and the Grand Dérangement.
- **The crime:** a theft at a museum hosting a travelling exhibition, "Trésors de la francophonie." The thief took a set of antique jewels, the fictional *parure d'Évangéline* (a nod to the Acadian heroine of Longfellow's poem, and to St. Martinville), but left the other exhibits behind. Some of those exhibits were moved, and that is a clue. The exhibits come from the earlier stops (a ceinture fléchée, Acadian spoons, an attaya teapot, a Breton bowl, a Belgian comic page, and so on), so students must recall what they learned to read the scene.
- **The player:** the student's traveller, now the **lead investigator** (« enquêteur principal / enquêtrice principale »). They direct a small team of officers (for example agente Broussard, agent Thibodeaux, and sergent LeBlanc) plus a sarcastic evidence clerk and a weary captain.
- **Suspects (3–4), each tied to grammar from an earlier game:**
  - the night guard, whose alibi is full of *était en train de* plus passé composé;
  - the curator, from Montréal, who uses Québécois expressions;
  - a Belgian collector, who says *septante* and *nonante* (Bruxelles callback);
  - a Cajun musician at the dance hall, whose alibi depends on the band's set times.
- **Mid-game bust:** officers catch the thief at a pawnshop in Breaux Bridge. « Le voleur / la voleuse était en train de vendre les bijoux quand nous sommes arrivés. » Only half the jewels are there, so an accomplice is involved.
- **Finale:** an airboat chase on the bayou at night, ending in the arrest at a fishing camp, as an animated cinematic.
- The culprit must be **deducible from evidence**: a timeline contradiction, the pawnshop camera, mud or receipts, and a statement that contradicts a document. A student who reasons well should be able to name the culprit before the confession.

## 4. Core mechanic: recommendations to officers
At briefing points (the whiteboard in the salle de briefing, and by radio in the field), the student gives the team recommendations:
- Sentence frames: « Je vous recommande de vérifier l'alibi du gardien. » / « Agente Broussard, je te recommande d'interroger le musicien. » / « Je recommande au sergent LeBlanc de surveiller le prêteur sur gages. » This uses *tu* with a partner and *vous* with the team or a superior (R 3.2), verb + *de* + infinitive (R 2.5d), and *à* + *le* = *au*.
- The student builds the recommendation from word tiles (reuse `tiles`), choosing the officer, the action, and the target. They then **back it with evidence from the inventory or notebook** (for example, the receipt). A recommendation without supporting evidence is refused by the captain (« Sur quelle base ? »), so guessing doesn't work.
- **Good recommendation:** the officer returns with a useful clue reported in the **passé composé**: « Nous avons trouvé des traces de boue sous la fenêtre. Le voisin a vu une camionnette rouge vers 23 h. »
- **Bad recommendation:** the officer returns with a **negation** report (R 2.11b): « Nous n'avons rien trouvé. Personne n'a vu le suspect. Il n'est pas sorti de chez lui. Elle n'a jamais visité le musée. » Bad recommendations also cost in-game time (the clock is running toward a deadline, such as the accomplice leaving on a boat at midnight) and points, but they never dead-end the game.
- Each report adds a card to the notebook, so students reread and use what they learn.

## 5. Grammar and skills (20-3Y codes as recorded in the plan doc)
- **Passé composé** (R 2.7a–c), including *être* verbs and agreement, in reports and in the student's written report.
- **Negation in the passé composé** (R 2.11b): *ne… pas, ne… rien, ne… personne, ne… jamais, ne… plus*.
- **Recognition only — être en train de in the imperfect, interrupted by the passé composé:** « J'**étais en train de** fermer la porte quand j'**ai entendu** un bruit. » Students never have to produce the imperfect. They identify the background action versus the interrupting event and use them to place events on the timeline. Add a short hint card the first time it appears.
- **Time words for the timeline:** *d'abord, ensuite, puis, après, enfin, avant de + inf., après avoir…* (recognition only), *pendant que, quand, vers 21 h, à minuit moins le quart, la veille, le lendemain, ce soir-là*.
- **Recommendation grammar:** *je vous / te recommande de* + infinitive; *tu / vous*.
- **Recall from games 1–6** (each must be needed, not just mentioned):
  - Québec: partitifs (ordering at the diner or station cafeteria); *venir de* vs. futur proche (« Il vient de partir » vs. « Il va partir »).
  - Montréal: impératif (orders to officers on the radio); prepositions of location (« sous le comptoir », « derrière la vitrine ») to find hidden evidence.
  - Acadie: *qui / que* to identify suspects (« la femme qui portait un chapeau », « l'homme que le gardien a vu »).
  - Dakar: possessives (whose item?), comparatives / superlatives (comparing suspects' height from the camera image).
  - Bretagne: pronominal verbs in alibis (« Je me couche toujours à 22 h »), *il faut* + infinitive (procedure).
  - Bruxelles: object pronouns in interrogation (« Vous l'avez vue ? Je lui ai parlé. »); Belgian numbers.
- **Critical thinking tasks:**
  - **Timeline board:** drag events onto a timeline using time words and statements, then find the gap or contradiction.
  - **Contradictions in interrogation:** present an inventory item or notebook card to contradict a statement (Police Quest procedure crossed with careful reading).
  - **Exhibit labels:** use what students learned in earlier stops to work out which exhibit was moved and why.
  - **Documents:** read receipts, a band set list, a bus schedule, and camera timestamps, and calculate (reuse `doc` and `number`).

## 6. Writing and reward
- Near the end, the student writes the **rapport d'enquête** for the procureur / procureure (reuse `letter`, checked section by section, grammar errors first). It requires passé composé narration with time words, at least two negation sentences (what the investigation ruled out), one recommendation (« Je recommande de… »), and naming the culprit with evidence (*qui / que* sentences).
- Only a passing report unlocks the warrant and then the **animated finale**: the airboat chase on the bayou at night and the arrest at the fishing camp, starring the student's character. Include one dark-humour line from the captain at the end.
- End screen: final score and rank, the passport stamp for stop 8 (download PNG or print, as in other games), and, because this is the capstone, a **completed passport view showing all eight stamps** and a downloadable "Diplôme du grand voyage" with the student's name.

## 7. Suggested structure (60–90 minutes, about 12–15 rooms)
1. **Prologue (5 min):** station: office, briefing room, cafeteria (partitifs), evidence room clerk. Tutorial for the verbs and the icon bar.
2. **Act 1: crime scene (15–20 min):** museum hall, guard's post, loading dock. Procedure (gloves, photos, evidence bags), the guard's statement (*était en train de*), exhibit labels, first recommendations.
3. **Act 2: witnesses and suspects (20 min):** curator's office, dance hall (bal cajun), the collector's hotel. Alibis, documents, timeline board.
4. **Act 3: following leads (20 min):** officer reports (passé composé or negation), pawnshop bust in Breaux Bridge, the accomplice clue.
5. **Act 4: interrogation and report (15 min):** interrogation room with contradictions; reading the suspect's rights in French; the written report.
6. **Finale (5–10 min):** warrant, airboat chase, arrest, stamp, full passport, diploma.

## 8. Accessibility and classroom constraints
- Works in Chrome on school laptops at any window size; no install, no login. Progress is in the browser only.
- Every hotspot is also reachable by keyboard (Tab to cycle hotspots, Enter to use the current verb). Include a "Montrer les zones" (show hotspots) option for students who get stuck, which costs no points, plus a hint system from the team (« Je vous recommande de retourner voir le gardien… ») that costs a few points.
- English glosses on hover for new words (Cajun French terms included: *char* = car, *espérer* = to wait, *asteur* = now, *fais do-do*, *bayou*), as in the earlier games.
- No flashing effects. The text box stays until dismissed.

## 9. Open decisions — offer me options before building
1. **Visual style:** (a) crisp painted-vector "VGA homage" (Sierra composition, palette and text boxes, drawn sharp under the polished-2d-game-art rules) — recommended; (b) true pixel art at a low resolution scaled up in whole-number steps.
2. **Interface:** (a) SCI icon bar (point and click) — recommended; (b) a typed French parser like the early Police Quest games (« prendre les gants », « parler au gardien »); (c) icon bar plus parser moments at key points.
3. **Setting:** (a) Lafayette, Cajun country (recommended, Acadie link); (b) New Orleans; (c) another francophone location.
4. **Player role:** (a) the traveller as a young lead investigator now; (b) "ten years after the great voyage," the traveller has become a detective (capstone flashback to earlier trips); (c) a guest investigator on an exchange program with the local police.
5. **Crime:** (a) jewel theft with an accomplice (recommended); (b) a theft that turns into a disappearance; (c) something else.
6. **Failure screens:** (a) Sierra-style game over with restore (recommended); (b) softer: the captain stops you and you retry immediately.
7. **Culprit and suspects:** confirm the cast in section 3 or change it.

## 10. Order of work
1. Ask the section 9 questions.
2. Build a **style test room** (one room, the player walking with depth scaling and shadow, one surface with evidence, one text box, the icon bar). Check it at 200% and send me a screenshot.
3. Build the adventure engine (rooms, walking, verbs, inventory, notebook, dialogue, flags, score, clock, save / restore, failure screens, dossier overlay for learning tasks).
4. Write the full script in French (narration, dialogue, reports, good and bad recommendation outcomes) and send it to me for review before drawing every room.
5. Build act by act, sending a playable draft after each act.
6. Finale animation, stamp, completed passport, diploma.
7. Automated playthroughs (good path, bad recommendations, one failure), 200% screenshots, regression on games 1–6 if shared code changed.
8. Picker, list, README, journey and plan doc updates; commit and push.
