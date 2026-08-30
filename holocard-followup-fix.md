# HoloCard — Follow-Up Fix: Card Page Still Half-Fixed

## Context
A previous pass on `/card/usman-ashfaq` partially updated the bio text (it now correctly
mentions Python, SQL, Power BI, Data Visualization) but left every other field — title,
phone, email, location, LinkedIn, X — untouched with fake placeholder data. A card that's
half-real and half-fake on someone's actual name is worse than one that's obviously a demo:
it now reads like a broken sync, not an intentional sample.

This is a single, narrow fix. Do not touch pricing, templates, FAQ, or anything outside
what's listed below.

---

## Task 1 — Finish or abandon the identity fix on `/card/usman-ashfaq`

**Decision (make this first, don't guess):** Is this record meant to become Usman's real,
public card, or is it meant to be a generic demo?

- **If it's meant to be a real card:** update every remaining field to match reality —
  correct job title/employer (not "at HoloCard"), a real or intentionally omitted phone
  number, a real contact email, correct location (Lahore, Pakistan — or omit the field if
  he'd rather not show a city), and his real LinkedIn/X URLs (or remove those links if he
  doesn't want them public here).
- **If it's meant to be a demo:** revert the bio back to generic placeholder text too (so it's
  consistently fake, not a strange mix), and rename the slug away from `usman-ashfaq` to
  something unambiguous like `demo-sample`. Redirect the old slug or repoint the homepage's
  "Open Digital Card" button to the new slug.

Default to the demo-slug path unless told otherwise — same as before, it's the safer and
faster of the two options and doesn't require maintaining a real public profile as a sample
artifact.

**Verify:**
- [ ] Every field on the card is either fully accurate or fully generic — no more mixed state
- [ ] If real, no field contains a placeholder value anywhere (title, phone, email, location, socials)
- [ ] If demo, slug no longer contains a real person's name

---

## Task 2 — Fix remaining broken share links

**Problem:** On `/card/[slug]`, Facebook and Telegram share buttons still build their share
URL with an empty `url=`/`u=` parameter. Facebook: `facebook.com/sharer/sharer.php?u=`.
Telegram: `t.me/share/url?url=&text=...`. X's share link works correctly and can be used as
the reference implementation.

**Task:**
1. Find the share-link builder (likely `lib/sharing.ts` per the repo structure).
2. Confirm the canonical card URL (`NEXT_PUBLIC_BASE_URL` + `/card/[slug]`) is being
   interpolated into **every** platform's share URL, not just X's.
3. Check LinkedIn's share link too — the previous audit flagged it as empty; recheck since
   it may share the same builder function as Facebook/Telegram.

**Verify:**
- [ ] Facebook share opens with the card URL pre-filled
- [ ] Telegram share opens with the card URL pre-filled
- [ ] LinkedIn share opens with the card URL pre-filled
- [ ] X, Copy Link, WhatsApp, Email, vCard still work (no regressions)

---

## Out of scope
Don't touch anything else on this pass — bio content elsewhere, pricing, templates, FAQ,
3D loading. This is strictly the card-page identity fields and the three broken share links.
