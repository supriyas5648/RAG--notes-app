# Fixes

## 1. Notes not loading from DB
**File:** `backend/src/controllers/noteController.js` → `getNotes`
- Bug: `.select('_id title ...')` excluded `chunks`, then read `note.chunks.length` → 500 error → frontend showed "Failed to load notes".
- Fix: aggregation that returns `title`/`createdAt` and computes `chunkCount` via `$size` (no heavy embeddings loaded), sorted newest-first.

## 2. Removed empty preview card / answer beside question
**File:** `frontend/src/styles/Home.css`
- `.row-1` was a 3-column grid (`1fr 1fr 1fr`) for only 2 panels → empty gap where preview card was.
- Fix: changed to `1fr 1fr` and removed leftover `.preview-panel` rules.
- (Home.jsx already had preview removed and answer beside the question form.)

## 3. Answer never showed in UI
**File:** `frontend/src/pages/Home.jsx`
- Backend returns `{ success, data: { answer } }`, but code read `response.answer` (undefined).
- Fix: `const generatedAnswer = response.data?.answer ?? response.answer;`

## 4. Debug logs for answer generation
**File:** `backend/src/services/ragService.js` → `generateAnswer`
- Added logs (context, prompt, Groq request/response, answer) and safe access (`context?.length`, `response?.choices?.[0]?.message?.content`).
- Confirmed Groq + API key + model work; backend was fine — bug #3 was the real cause. Logs are temporary.
