# HoloCard — Priority Fix Prompt for Coding Agent

## How to use this prompt
Work through the phases **in order**. Do not start a phase until the previous one is verified complete. After each phase, run the listed verification checks and report back before moving on. If a fix requires a decision only the project owner can make (e.g. what the demo slug should be named), stop and ask instead of guessing.

Repo: `usmanashfaq1916/holocard`
Live: `https://holocard-fawn.vercel.app`

---

## Phase 1 — Remove exposed demo credentials (Security, do this first)

**Problem:** The README currently prints a working demo login in plain text:
`usman@demo.com` / `demo1234`

This is publicly visible to anyone who opens the repo from the site's footer link.

**Tasks:**
1. Remove the literal email/password pair from `README.md`.
2. Replace it with a pointer to how the demo account is created, e.g.:
   > "A demo account is seeded via `pnpm db:seed` — see `prisma/seed.ts` for credentials used in local development."
3. Open `prisma/seed.ts` (or wherever the seed script lives) and confirm the demo password is not something guessable/reused elsewhere. If it's fine for a local dev seed, leave it, but never print it in a public-facing doc again.
4. If a hosted demo login is still needed for recruiters/visitors, consider gating it behind a "Request Demo Access" link/email instead of a public credential.

**Verify before moving on:**
- [ ] `README.md` no longer contains any real credential pair
- [ ] Seed instructions still let a new dev get a working local demo account
- [ ] Git history isn't a concern (if this repo is meant to look professional going forward, a leaked-credential-in-history is generally low risk here since it's a placeholder demo account, not a real one — but flag if you want it scrubbed from history too)

---

## Phase 2 — Fix the mis-attributed sample card (Identity/trust risk)

**Problem:** `/card/usman-ashfaq` uses the real name "Usman Ashfaq" but populates it with placeholder data: title "Data Analyst at HoloCard," phone `+1 234 567 890`, email `usman@holocard.com`, location "New York, NY," and placeholder social links. This card is directly linked from the homepage's "Open Digital Card" demo button, so it's one click away from anyone browsing the site.

**Decision needed from project owner before coding:** Should this card:
- (A) be renamed to a clearly generic demo slug (e.g. `/card/demo-sample`, `/card/sample-profile`) and keep placeholder content, or
- (B) stay at `usman-ashfaq` and be filled in with real, correct info (title, actual contact info, actual location, actual LinkedIn/X)?

Default to **(A)** unless told otherwise — it's the safer, faster fix and avoids maintaining a "real" public profile as a demo artifact.

**Tasks (assuming option A):**
1. Rename/duplicate the sample card record so its slug is unambiguous as a demo (e.g. `demo-sample`).
2. Update every internal link pointing at `/card/usman-ashfaq` (homepage "Open Digital Card" button, any AR demo cross-links) to the new slug.
3. Either 410/redirect the old `usman-ashfaq` slug to the new demo slug, or repurpose it as your real card if you'd rather claim that vanity URL for yourself later.
4. Double check `/ar/usman-ashfaq` (the AR viewer for this same card) gets the same treatment.

**Verify before moving on:**
- [ ] No page with your real name shows fabricated contact details
- [ ] Homepage demo button still works end-to-end
- [ ] Old URL doesn't dead-end (redirect or clear "demo moved" message)

---

## Phase 3 — Fix broken social share links on the public card page

**Problem:** On `/card/[slug]`, the Facebook and LinkedIn share buttons build their share URL with an empty `u=` parameter, so the share dialog opens with no URL attached.

**Tasks:**
1. Locate the share-link construction logic (likely `lib/sharing.ts` or the `ShareButtons` component per the repo's architecture).
2. Ensure the canonical public URL for the card (`https://holocard-fawn.vercel.app/card/[slug]`, or `NEXT_PUBLIC_BASE_URL` + path) is passed into every share intent — Facebook, LinkedIn, Telegram, X, and Email — not just some of them.
3. Confirm this works both server-rendered and client-side (i.e. it isn't relying on `window.location.href` before hydration in a way that races).

**Verify before moving on:**
- [ ] Facebook share opens with the correct card URL pre-filled
- [ ] LinkedIn share opens with the correct card URL pre-filled
- [ ] X, Telegram, Email, Copy Link, and WhatsApp still work as before (no regression)

---

## Phase 4 — Confirm the 3D/AR experience actually loads (not just the shell)

**Problem:** Every 3D section on the site (hero, features demo, card preview, AR walkthrough) shows a "Loading 3D experience..." placeholder in a plain fetch. That's expected without JS execution, but it's worth confirming this isn't silently hanging for real users on slower devices/connections — this was flagged as a risk in the prior audit and should be closed out with actual testing, not assumption.

**Tasks:**
1. Test the homepage hero 3D card and `/ar/demo` on: a mid-range Android phone (or throttled Chrome DevTools mobile emulation with 3G/slow 4G throttling), and desktop Safari and Firefox (Three.js/WebGL support gaps are more common there than Chrome).
2. Add a timeout + fallback state: if the 3D scene hasn't mounted within ~8–10 seconds, show a static image/message ("3D preview unavailable — try on a different device") instead of an indefinite spinner.
3. Check browser console for WebGL context errors on any tested device.

**Verify before moving on:**
- [ ] 3D scenes load within a few seconds on a throttled mobile connection
- [ ] A real fallback exists if WebGL isn't supported or the model fails to load
- [ ] No console errors on Safari/Firefox

---

## Out of scope for this pass
Don't touch pricing copy, template designs, or FAQ content in this pass — those are working and unrelated to the issues above. Stay scoped to Phases 1–4 unless something you find while fixing these blocks the fix itself.
