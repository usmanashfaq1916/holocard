# HoloCard — AR Step-by-Step Demo Video
### Script + Storyboard (Landing Page Hero/Demo Video)

**Target length:** ~41 seconds (landing pages lose viewers fast — this is not a tutorial, it's a hook)
**Format:** Square (1:1) or vertical (9:16) master, since it'll likely get reused for LinkedIn/X too. Shoot in vertical, crop to square for the site if needed.
**Style:** Screen recording of the actual app, no narration required — on-screen captions only (most people watch landing page videos muted).

---

## Shot List / Storyboard

| # | Time | Shot | On-screen caption | Notes |
|---|------|------|--------------------|-------|
| 1 | 0:00–0:03 | Close-up: a physical/printed HoloCard business card on a desk, or a phone showing the share link/QR | "Your card, but different." | Cold open, no logo yet — create intrigue, make them ask "what's different?" |
| 2 | 0:03–0:07 | Phone camera opens, frames the QR code or NFC tap moment | "Scan. Tap. That's it." | Show the actual scan gesture, hand in frame for scale |
| 3 | 0:07–0:12 | Screen recording: phone camera frames QR → browser opens → 3D holographic card materializes with light sweep effect | "No app to download." | Key differentiator — show the holographic iridescence and light sweep, not just a flat 3D model |
| 4 | 0:12–0:18 | Screen recording: user tilts phone slowly — holographic sheen shifts across surface, light sweep moves, shadows adjust | "Tilt to explore." | Hero beat — hold it longer than the others, this is the "wow" moment |
| 5 | 0:18–0:22 | Screen recording: tap the LinkedIn icon on the card → flip animation reveals back face with QR code and contact options | "Tap for details." | Show the full flip animation, don't cut mid-animation |
| 6 | 0:22–0:26 | Screen recording: tap "Save Contact" → native iOS/Android share sheet appears with vCard attachment | "Save instantly." | Show the native share sheet — makes it feel real, not staged |
| 7 | 0:26–0:30 | Quick cut: same card loading on a different device (Android phone or tablet) | "Works on any device." | Reinforces the no-app advantage — no platform lock-in |
| 8 | 0:30–0:35 | Cut to HoloCard logo/wordmark on a clean background | "HoloCard — your card, in 3D." | End card |
| 9 | 0:35–0:41 | CTA text over the logo | "Try it free → holocard-fawn.vercel.app" | Hold for 6 seconds — long enough to screenshot the URL |

---

## Caption/Text Copy (exact wording, ready to drop into edit)

```
0:00  Your card, but different.
0:03  Scan. Tap. That's it.
0:07  No app to download.
0:12  Tilt to explore.
0:18  Tap for details.
0:22  Save instantly.
0:26  Works on any device.
0:30  HoloCard — your card, in 3D.
0:35  Try it free → holocard-fawn.vercel.app
```

Keep captions large, high-contrast, bottom-third of frame — assume muted autoplay.

---

## How to record it (since this needs to be a real screen capture, not a mockup)

1. **Use an actual phone, not desktop browser emulation.** The tilt/gyroscope effect only works on a real device and is the single most convincing moment in the video — a desktop mouse-drag version will look fake by comparison.
2. **Screen recording tool:** iOS — built-in Screen Recording (Control Center). Android — built-in screen recorder or AZ Screen Recorder for cleaner output.
3. **Record each shot 2-3 times.** The flip animation and tilt shots are timing-sensitive; you want options in the edit.
4. **Shoot shot #1 (physical card close-up) separately with a real camera**, not a screen recording — it's the only non-screen shot and sets up the "real world → digital" contrast.
5. **Lighting:** natural light near a window for the physical card shot; avoid screen glare on the phone for the screen-recorded parts (record indoors, away from direct sun).
6. **Editing:** CapCut or iMovie are enough for this — you need cuts, text overlays, and maybe a subtle zoom on the tilt shot. No music licensing headache: use a royalty-free upbeat/minimal track from CapCut's built-in library or YouTube Audio Library.

---

## Landing page implementation note
Once you have the final .mp4:
- Keep it under ~5MB if it's autoplaying in the hero section (compress with Handbrake, H.264, target ~1-2 Mbps bitrate at 1080p)
- Autoplay muted + loop, with a small unmute icon — don't rely on sound for the message since captions carry it
- Add a static poster frame (shot #4, the tilt moment, makes the best thumbnail) so it doesn't show a blank frame before the video loads
- The landing page (`app/page.tsx`) already has a video embed section with `<video>` element ready — just swap the `src` to point at the final `.mp4` when recorded

---

## Interactive walkthrough (already built)
The interactive HTML walkthrough described as an alternative is already live at `/holocard-ar-walkthrough`. It's a pure CSS/JS 3D card with cursor-tracking tilt, flip animation, and save-contact toast — visitors can try the tilt/flip themselves instead of watching it happen to someone else. The landing page links to it from the hero section ("Watch Walkthrough →") and from the video section ("Try it live →").
