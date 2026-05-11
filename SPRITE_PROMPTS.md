# פרומפטים לייצור Sprite Sheets — יום ירושלים

המשחק כרגע עובד עם הספרייטים שהועתקו מהפרויקט הקודם.
כשתרצה לייצר ספרייטים מותאמים לתוכן של יום ירושלים, יש כאן פרומפטים מוכנים להעתקה למחולל תמונות (Midjourney / DALL-E / Firefly / NanoBanana / Imagen / Stable Diffusion).

לאחר שתייצר תמונה — שמור אותה כ-PNG ב-`public/sprites/<filename>.png`.

---

## עקרונות סגנון משותפים (להוסיף לכל פרומפט!)

```
Style: Game Boy Color pixel art, 16x16 sprites,
top-down RPG perspective similar to Pokemon Gold/Silver,
limited color palette of olive green (#9bbc0f, #8bac0f, #306230, #0f380f),
warm cream highlights (#f7f5e6),
black 1px outline on all silhouettes,
no anti-aliasing, no gradients, flat shading,
transparent background.
```

### חוקי פלטה
- ✅ צבעים מלאים, ללא gradient, ללא anti-aliasing
- ✅ קונטור שחור 1px סביב כל דמות וטייל בולט
- ✅ רקע **שקוף** (transparent PNG)
- ❌ אין shading של 3+ גוונים

---

## A. דמויות התלמידים (4 sprite sheets)

כל דמות = **sprite sheet אחד של 64×64 פיקסלים** המחולק לרשת 4×4 של 16×16:

| | פריים 0 (idle) | פריים 1 (step R) | פריים 2 (idle) | פריים 3 (step L) |
|---|---|---|---|---|
| שורה 1 | פנים למטה | + רגל ימין | פנים למטה | + רגל שמאל |
| שורה 2 | פנים למעלה (עורף) | ... | ... | ... |
| שורה 3 | פרופיל ימינה | ... | ... | ... |
| שורה 4 | פרופיל שמאלה | ... | ... | ... |

> שמירה: `public/sprites/<id>.png`

### A1 — דניאל
```
Pokemon GBC pixel art character sprite sheet, 4x4 grid (4 directions x 4 walk frames),
each cell 16x16 pixels, total 64x64 transparent PNG.
Character: Israeli boy, 5th-grade (~10 years old), athletic build.
Brown short hair, light skin, navy blue T-shirt with white stripe across chest,
black shorts, white-and-blue sneakers, sports water bottle in hand.
Top-down 3/4 view. Black 1px outline. Limited Game Boy Color palette.
4 walk frames per direction.
File: daniel.png
```

### A2 — שירה
```
Pokemon GBC pixel art character sprite sheet, 4x4 grid, 16x16 cells, 64x64 transparent PNG.
Character: Israeli girl, 5th-grade (~10 years old), creative-looking.
Brown long hair tied in a side braid, light skin, pink T-shirt,
dark blue jeans, white sneakers, small notebook with star sticker in hand.
Top-down 3/4 view. Black 1px outline. GBC palette.
4 walk frames per direction.
File: shira.png
```

### A3 — אורי
```
Pokemon GBC pixel art character sprite sheet, 4x4 grid, 16x16 cells, 64x64 transparent PNG.
Character: Israeli boy, 5th-grade (~10 years old), studious look.
Black hair short and tidy, light skin, dark green T-shirt with a small pencil on chest,
beige cargo pants, brown sandals, holding a small history notebook.
Top-down 3/4 view. Black 1px outline. GBC palette.
4 walk frames per direction.
File: uri.png
```

### A4 — יעל
```
Pokemon GBC pixel art character sprite sheet, 4x4 grid, 16x16 cells, 64x64 transparent PNG.
Character: Israeli girl, 5th-grade (~10 years old), bright and curious.
Blonde wavy hair to shoulders, light skin, yellow T-shirt with a tiny tomato print,
red shorts, white sneakers, small camera around neck for food photos.
Top-down 3/4 view. Black 1px outline. GBC palette.
4 walk frames per direction.
File: yael.png
```

---

## B. דמויות NPC (8 sprite sheets)

באותה מתכונת (4×4 = 64×64 transparent PNG), אבל לא חייב את 4 הכיוונים — אפשר רק שורה אחת (פנים) אם רוצים לחסוך עבודה.

### B1 — המורה דבורה
```
Pokemon GBC pixel art teacher sprite sheet, 4x4 grid 64x64 transparent PNG,
each cell 16x16. Israeli female homeroom teacher, late 30s.
Long curly brown hair, light skin, red blouse with small print, dark beige skirt,
holding a clipboard with the class list.
Top-down 3/4 view. Black 1px outline. GBC palette.
File: teacher.png
```

### B2 — הספרנית
```
Pokemon GBC pixel art librarian sprite sheet, 4x4 grid, 64x64 transparent PNG.
Israeli woman, 50s, gentle and warm.
Brown hair in a low bun, light skin, cream colored cardigan,
dark navy long skirt, glasses on chain, holding a book stack.
Top-down 3/4 view. Black 1px outline. GBC palette.
File: librarian.png
```

### B3 — המנהלת
```
Pokemon GBC pixel art principal sprite sheet, 4x4 grid, 64x64 transparent PNG.
Israeli woman, 60s, kind authority figure.
Short gray hair, light skin, dark navy blazer over white shirt,
beige pants, holding a folder of permission slips.
Top-down 3/4 view. Black 1px outline. GBC palette.
File: principal.png
```

### B4 — הארכיאולוג (במצודת דוד)
```
Pokemon GBC pixel art archaeologist sprite sheet, 4x4 grid, 64x64 transparent PNG.
Israeli man, 40s, working at Tower of David.
Brown hair under a wide-brim sun hat, light skin, cream shirt with rolled sleeves,
dark khaki pants, holding a small archaeological brush.
Top-down 3/4 view. Black 1px outline. GBC palette.
File: archaeologist.png
```

### B5 — הרב (בכותל)
```
Pokemon GBC pixel art rabbi sprite sheet, 4x4 grid, 64x64 transparent PNG.
Israeli religious man, 60s, traditional appearance.
Gray beard, black hat (fedora-style), light skin, black coat over white shirt,
black pants, holding a small prayer book.
Top-down 3/4 view. Black 1px outline. GBC palette.
File: rabbi.png
```

### B6 — המוכר (במחנה יהודה)
```
Pokemon GBC pixel art market vendor sprite sheet, 4x4 grid, 64x64 transparent PNG.
Israeli man, 50s, energetic market vendor at Mahane Yehuda.
Gray short hair, light tan skin, yellow apron over a red shirt,
dark beige pants, holding a fresh pita.
Top-down 3/4 view. Black 1px outline. GBC palette.
File: vendor.png
```

### B7 — החיילת (בטיילת)
```
Pokemon GBC pixel art IDF female soldier sprite sheet, 4x4 grid, 64x64 transparent PNG.
Israeli woman, early 20s, in IDF education-corps uniform.
Black hair tied back in ponytail, light skin, olive-green uniform,
black combat boots, beret on shoulder, calm explainer pose.
Top-down 3/4 view. Black 1px outline. GBC palette.
File: soldier.png
```

### B8 — המדריך (במרכז העיר)
```
Pokemon GBC pixel art tour guide sprite sheet, 4x4 grid, 64x64 transparent PNG.
Israeli man, 40s, professional tour guide with Israeli flag bandana.
Brown hair, light skin, cream button-down shirt, dark khaki pants,
sun-hat with Israeli flag pin, holding a guide flag stick (small Israeli flag).
Top-down 3/4 view. Black 1px outline. GBC palette.
File: guide.png
```

---

## C. טיילסט ירושלים (אופציונלי - שדרוג למפת ירושלים)

המשחק משתמש כרגע ב-`town_tileset.png` הקודם.  אפשר להחליף לטיילסט ירושלמי אותנטי:

```
Pokemon GBC pixel art Jerusalem tileset, 256x256 transparent PNG, 8x8 grid of 16x16 tiles.
Theme: Jerusalem old city + modern center.  Limestone palette (#f0e0c0, #d4b888),
warm sandy tones, navy + cyan accents.  Black 1px outlines on all distinct tiles.

Row 1: limestone path (smooth), limestone+pebble, cobblestones, stairs (going up),
  stairs (going down), fountain center, fountain edge, drain grate.

Row 2: olive tree, fig tree, cypress tree, palm tree,
  small shrub, lavender bush, rosemary bush, pomegranate tree (with red fruit).

Row 3: sandstone wall (light), sandstone wall (dark/aged), arch opening,
  blue-tile wall (Armenian quarter style), white plaster wall, wooden door,
  iron gate, alley dead-end.

Row 4: market stall (red awning), market stall (yellow awning),
  market stall (green awning), spice display, fresh bread basket,
  pita oven, hummus pot, cafe table outdoor.

Row 5: Western Wall stones (large herodian blocks),
  notes-in-wall texture (small papers), prayer book on stand,
  oil lamp lit, oil lamp unlit, mezuzah on doorframe,
  Star of David carved in stone, Hebrew letter aleph carved in stone.

Row 6: Tower of David crenellation, Tower of David window slit,
  citadel base stones, watchtower top,
  flagpole with Israeli flag, flagpole with Jerusalem flag,
  cannon (decorative), historical sign.

Row 7: tayelet bench (overlooking view), tayelet railing,
  binoculars on stand, panorama plaque,
  road (asphalt), zebra crossing, traffic light, lamppost.

Row 8: tourist bus, taxi, light rail tram,
  ambulance (Magen David Adom), schoolbus,
  bicycle, scooter, electric scooter.
```

---

## D. תמונת רקע למסך הפתיחה (אופציונלי)

```
Pokemon GBC pixel art Jerusalem skyline at golden hour, 320x240 transparent PNG.
Scene: panoramic view of Jerusalem old city from the Tayelet (Promenade).
Foreground: silhouettes of 4 elementary-school children with backpacks looking out.
Mid-ground: olive trees, cypress trees.
Background: golden Dome of the Rock, Tower of David, Old City walls,
warm amber-orange sunset gradient (only 4-5 color steps, GBC style),
small cypress trees, scattered church/synagogue spires.
Pixel art only, no anti-aliasing, GBC palette.
Title text overlay area at top: leave empty space.
File: title_bg.png
```

---

## D. פנים הבית — Interior Tileset (חדש!)

המשחק כעת תומך בכניסה לבתים: בית הספר, הספרייה, ומצודת דוד מבפנים.
כעת אנו משתמשים בטיילים הקיימים (cobblestones, wallStone, prayerBook, cafeTable וכו'),
אבל אם תרצה טיילסט מותאם אישית לאינטריארים, השתמש בפרומפט הבא:

```
Pokemon GBC pixel art INTERIOR tileset for school + library + museum scenes,
256x256 transparent PNG, 8x8 grid of 16x16 tiles.
Theme: Israeli classroom + library + museum interior.
Limestone/wood palette: warm browns (#8b6038, #4a3018), cream (#f7f5e6),
muted blue (#3070a0) for accents.  Black 1px outlines on all distinct objects.

Row 1 (Floors): wooden parquet floor, dark wood floor, checkered tile floor,
  red carpet, blue carpet, mosaic floor, marble floor, stone floor.

Row 2 (Walls): plaster wall (cream), plaster wall with picture frame,
  plaster wall with window (closed shutters), plaster wall with window (open),
  brick wall (interior), wood paneling, wallpaper (subtle pattern), corner trim.

Row 3 (Classroom): blackboard (with chalk lines), whiteboard,
  student desk + chair (front view), student desk + chair (side view),
  teacher's lectern, classroom map (Israel), pencil cup, school bag.

Row 4 (Library): tall bookshelf (full of books, brown spines),
  tall bookshelf (full of books, mixed colors),
  short bookshelf, librarian desk, reading lamp on table,
  globe on stand, encyclopedia stack, ladder for high shelves.

Row 5 (Museum / Tower of David interior): glass display case (small artifact),
  glass display case (ancient pottery), open Torah scroll on stand,
  oil lamp menorah (7-branch), info plaque on stand, ancient coin display,
  archaeological brush + tools, model of the Old City.

Row 6 (Furniture - shared): wooden chair, wooden bench, round table,
  square dining table, sofa (red), sofa (blue), bookcase (small), nightstand.

Row 7 (Decor): Israeli flag standing, Jerusalem flag standing,
  potted olive plant, potted cypress, framed Hebrew verse,
  hanging chandelier, ceiling light, exit sign (Hebrew "יציאה").

Row 8 (Doors / Stairs): wooden interior door, glass door, double door,
  staircase up, staircase down, classroom door (with window),
  library archway, museum entrance.
```

> שמירה: `public/sprites/interior_tileset.png`

לאחר שתייצר אותו, צריך לעדכן את `src/engine/tiles.ts`:
1. להוסיף `'interior'` ל-`SheetKey`
2. להוסיף `interior_tileset` כ-sheet שלישי שנטען
3. להוסיף ערכי `TILESET_MAP` לפנים: `desk: { sheet: 'interior', col: 2, row: 2 }` וכו'

עד שה-PNG מוכן, פנים הבית ב-3 המפות (`schoolInterior`, `libraryInterior`, `towerInterior`) משתמשות ב-tiles הקיימים: cobblestones כרצפה, אבני סנדסטון לקירות, cafeTable כשולחנות, prayerBook כספרים, וכו'. זה עובד אבל פחות מדויק.

---

## D2. ספרייט שלטים (signs_tileset.png)

שלטי הדרך לכל מיקום — כמו השלט "מגדל דוד" שהיה ב-`town_tileset` המקורי, אבל עכשיו אחד פר מקום עם שם המקום כתוב עליו בעברית.

הסגנון: עמוד עץ חום קצר תחת לוח-עץ/אבן עם שם המקום בכתב עברי קריא, בסגנון פיקסל-art GBC. הטקסט הוא הדבר העיקרי — לא איקון.

```
A 3x3 grid pixel art tileset, transparent background, 64x64 pixels per
cell, GBC limited palette, crisp pixel-art style, hard pixel edges,
NO anti-aliasing, NO smoothing.

Each cell shows a freestanding wooden Jerusalem-style signpost: a short
brown wooden post planted in the bottom of the cell, with a wider
rectangular placard on top.  The placard has a limestone/cream face
with a darker wooden frame, and the place name is written across it
in CLEAR READABLE HEBREW pixel-font letters (block-style 5-7px tall,
high contrast, dark brown or black on the cream face).

Hebrew signs (right-to-left), one per cell:

Row 0:
  (0,0) "בית הספר"        — schoolyard sign, cream placard
  (0,1) "ספרייה"          — library hut sign, cream placard with a tiny
                            blue book icon next to the text
  (0,2) "לאוטובוס"        — bus stop sign, yellow/cream placard with a
                            small black arrow pointing down

Row 1:
  (1,0) "מגדל דוד"        — Tower of David sign, sandstone gray placard
                            with a tiny crenellation silhouette above the
                            text (matches the original town_tileset sign)
  (1,1) "הכותל"           — Western Wall sign, cream placard with a
                            tiny Star-of-David dot above the text
  (1,2) "מחנה יהודה"      — market sign, cream placard with red/yellow/
                            green stripe along the top edge

Row 2:
  (2,0) "טיילת חאס"       — promenade sign, sky-blue placard with a tiny
                            mountain-skyline silhouette above the text
  (2,1) "מרכז העיר"       — city-center sign, cream placard with two
                            thin blue stripes (Israel flag colors) and
                            a tiny Star of David
  (2,2) "טקס יום ירושלים" — ceremony sign (auditorium stage), gold/cream
                            placard with a small blue Star of David;
                            text may use 2 lines if needed

Important:
- The Hebrew text MUST be the focal point of each sign, large enough to
  read at the rendered size.  Use a chunky block-style pixel font.
- All signs share the same overall shape and proportions; only the
  placard colors, mini-icons, and text differ.
- Transparent background outside the signpost.
- Wooden post is identical brown across all 9 cells.

File: signs_tileset.png
```

**הערה לדיוק:** הספרייט הקיים ב-`town_tileset.png` (שורה 5, עמודה 7) הוא דוגמה טובה — שלט אבן בצבע קרם עם הכיתוב "מגדל דוד" מעליו. כל אחד מ-9 השלטים החדשים אמור להיות באותו סגנון ויזואלי, רק עם השם המתאים.

> שמירה: `public/sprites/signs_tileset.png`

לאחר שתייצר אותו, צריך לעדכן את `src/engine/tiles.ts`:
1. להוסיף `'signs'` ל-`SheetKey`
2. להוסיף `startTilesheetLoad('signs')` לפונקציית `preloadTilesheets`
3. ב-`detectGrid` ליצור פיצול של 3x3 לסט הזה (במקום 8x8) או לטעון ידנית
4. להוסיף ערכי `TILESET_MAP` לכל 9 השלטים:
   ```typescript
   signSchool:    { sheet: 'signs', col: 0, row: 0 },
   signLibrary:   { sheet: 'signs', col: 1, row: 0 },
   signBus:       { sheet: 'signs', col: 2, row: 0 },
   signTower:     { sheet: 'signs', col: 0, row: 1 },
   signKotel:     { sheet: 'signs', col: 1, row: 1 },
   signMarket:    { sheet: 'signs', col: 2, row: 1 },
   signTayelet:   { sheet: 'signs', col: 0, row: 2 },
   signCenter:    { sheet: 'signs', col: 1, row: 2 },
   signCeremony:  { sheet: 'signs', col: 2, row: 2 },
   ```

עד שה-PNG מוכן, השלטים מצויירים פרוצדורלית בקוד (`tileBuilders` ב-`tiles.ts`) עם הצבעים והאיקונים בסיסיים — שונים פר מיקום.

---

## E. רעיונות לאלמנטים נוספים

אם תרצה להעמיק את המשחק בעתיד, אלו פרומפטים אפשריים נוספים:

### E1 — הר הבית (קופת תפילה דיגיטלית)
```
Pixel art icon, 16x16 transparent PNG.
Folded paper note with tiny Hebrew text on it.
File: kotel_note.png
```

### E2 — שופר ליום ירושלים
```
Pixel art icon, 16x16 transparent PNG.
A traditional ram's horn shofar, brown-curled spiral, on transparent background.
Flat shading, GBC palette.
File: shofar.png
```

### E3 — אבן עתיקה
```
Pixel art icon, 16x16 transparent PNG.
Single ancient herodian stone block — large rectangular limestone with
characteristic margin border (dressed edges), beige with darker shadow.
Flat GBC palette.
File: ancient_stone.png
```

---

## איך להחליף ספרייט קיים

1. צור את ה-PNG לפי פרומפט
2. שמור ב-`public/sprites/<id>.png` (שם הקובץ זהה לזה הרשום בפרומפט)
3. רענן את הדפדפן — המשחק יטען את החדש אוטומטית (שיטת `getCharacterSprite`)
4. הספרייט הפרוצדורלי (fallback בקוד) יתחלף בזה החדש

הספרייטים שהמשחק כבר משתמש בהם (מהפרויקט "צוות חשיבה"):
- `daniel.png`, `shira.png`, `uri.png`, `yael.png` — לא מוחלפים אוטומטית, צריך לייצר חדשים
- ה-`town_tileset.png` ו-`desert_tileset.png` — כן מועתקים לטובת התשתית

> **חשוב:** אם לא מספקים PNG, המשחק עדיין עובד — הוא משתמש בספרייט פרוצדורלי שמצויר בקוד. יותר פשוט אבל פחות יפה.

---

## כלים מומלצים

| כלי | יתרון | חיסרון |
|------|-------|--------|
| **Adobe Firefly** | טוב במיוחד לפיקסל-art | מנוי |
| **DALL-E 3** | מבין הוראות מורכבות | פיקסלים לפעמים מטושטשים |
| **Midjourney** | איכות גבוהה | נוטה ל-detailed art |
| **NanoBanana / Imagen 3** | מהיר | פחות שליטה |

**טיפ ל-Midjourney:** הוסיפו `--ar 1:1 --niji` והגיעו ל-`--no antialiasing --no gradient`.
**טיפ ל-DALL-E:** הוסיפו `"strict 16-bit pixel art, no smoothing, sharp pixel boundaries"`.
**טיפ ל-Firefly:** Style: **Pixel art**, Visual intensity: **High**.

---

## דייקנות עובדות במשחק

המשחק נכתב במקסימום דייקנות. אם תרצה לעדכן/לוודא, אלו המקורות:

| עובדה | מקור |
|-------|------|
| ירושלים מוזכרת בתנ"ך כ-669 פעמים | אנציקלופדיה יהודית, מחקרים בלשוניים |
| המצודה נבנתה לפני כ-2200 שנה | ארכיאולוגיה — שרידים חשמונאיים והרודיאניים |
| השם "מצודת דוד" - מהביזנטים | מסורת נוצרית מסוף תקופת הזהב, לא מקראי |
| הכותל - חלק מקיר התמך של הר הבית | יוסף בן מתתיהו, כתבי הורדוס |
| מחנה יהודה - שכונה משנת 1887 | רשומות עירייה, יהושע ילין |
| ירושלים - 7 גבעות (פולקלורי) | מסורת עירונית, לא מקור היסטורי מובהק |
| יום ירושלים - כ״ח באייר | חקיקת הכנסת, 12 במאי 1968 |
| ירושלים נכבשה כ-44 פעמים | Eric H. Cline, "Jerusalem Besieged" |
| גובה הר הצופים | מפת ישראל - 826 מטר |
| כ-מיליון תושבים בעיר | סטטיסטיקה של ירושלים, 2024 |
| שירי ירושלים שצוטטו | "ירושלים של זהב" - נעמי שמר 1967 |

אם תזהה אי-דיוק, פתח/י קובץ `src/game/interactives/interactives.ts` או `dialogues.ts` ועדכן/י.
