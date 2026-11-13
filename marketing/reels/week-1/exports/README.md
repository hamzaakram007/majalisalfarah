# Week 1 — Rendered exports

Built with `../build_reels.py` from real product photos + supporting frames.

## Reels (Arabic · 9:16 · H.264)

| File | Duration | CTA |
| --- | --- | --- |
| `day1-brand-craft-majlis-AR.mp4` | ~17s | SAVE |
| `day2-sofa-before-after-AR.mp4` | ~22s | WhatsApp · Yanbu |
| `day3-three-curtain-mistakes-AR.mp4` | ~25s | SAVE + majalisalfarah.shop |
| `day4-this-or-that-sofas-AR.mp4` | ~16s | COMMENT ١/٢ |

## Stories stills

`story-s1-yanbu.jpg` · `story-s2-texture.jpg` · `story-s3-poll.jpg` · `story-s4-workshop.jpg` · `story-s5-visit.jpg` · `story-s6-curtains-ksa.jpg`

## Rebuild

```bash
cd marketing/reels/week-1
pip3 install pillow arabic-reshaper python-bidi
python3 build_reels.py
```

## Honest production notes

- **Day 2 “قبل” frame** uses a generated worn-sofa proxy for pacing. Replace with a real project before photo (same camera mark as after) before paid boost claiming a specific customer job.
- **After / product heroes** use real Majalis Alfarah catalog assets from the repo.
- **Curtain education frames** are generated lifestyle plates for teaching length/lining — swap in real Majalis curtain SKUs from `.shop` when filming on set.
- Add licensed music + burned captions in CapCut if you want trending audio; these masters are silent visual cuts with Arabic on-screen text.
- English cuts: re-run with EN strings or duplicate in CapCut.

## Publish checklist

1. Upload Day 4 first (fast engagement), then Day 1, Day 3, Day 2.  
2. Pin comment on Day 4: `١ ولا ٢؟`  
3. Day 2 WA link: `https://wa.me/966570169672`  
4. Day 3 link sticker / bio: `https://majalisalfarah.shop`  
5. Stories: add location pin Yanbu on S1/S5.  
