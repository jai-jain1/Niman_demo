# Cinematic entry: art prompts & file list

The invite's entry is built from **one video plus two frames taken from it**. The guest sees the closed gate (the video's first frame) with our live wax seal on top. Tapping the seal plays the video, and its last frame (the palace) crossfades into the hero, which shows that same frame. So the whole thing feels like one continuous shot.

Put every file in `public/invites/arjun-weds-meera/intro/` (for another couple, use their slug).

## Files

| File | Required | What it is | Size |
|---|---|---|---|
| `gate-open.mp4` | **Yes** | Gates swing open, camera glides through to the palace | 9:16, 1080×1920, 6–10 s, no audio, under 6 MB |
| `gate-closed.jpg` | **Yes** | The video's **first** frame | 1080×1920 |
| `palace-night.jpg` | **Yes** | The video's **last** frame (hero background) | 1080×1920 |
| `palace-night-wide.jpg` | Optional | Desktop version of the palace | 1920×1080 |
| `garland-top.png` | Optional | Transparent foreground garland across the top | 1080 wide |
| `florals-left.png` | Optional | Transparent foreground flowers, bottom-left | ~700 wide |
| `florals-right.png` | Optional | Same, bottom-right (a mirrored copy is fine) | ~700 wide |

If any required file is missing, the invite automatically uses the current illustrated gate. Missing optional files are simply skipped.

**Easiest route:** generate the gate image (Prompt 1), animate it into a video (Prompt 2), and drop the raw video into the folder. I can then compress it and extract `gate-closed.jpg` and `palace-night.jpg` from its first and last frames, so they match it pixel for pixel.

## Style line (add to the end of every image prompt)

> cinematic digital painting, hyper-detailed, royal Rajasthani and Mughal architecture in the style of the Udaipur City Palace, warm golden lamplight, deep maroon, ivory marble and antique gold colour palette, soft volumetric light, magical Indian wedding night atmosphere, 8k, sharp focus, no people, no text, no watermark, no logos

## Prompt 1: the closed gate (generate this first)

Aspect ratio **9:16**. Use Midjourney, Ideogram, Leonardo, Flux, Firefly, Higgsfield or similar.

> Vertical 9:16, perfectly symmetrical front view at eye level. Two tall ornate antique-gold palace doors, closed, set inside a carved white marble Mughal archway with pietra dura floral inlay in red and green stone. The upper half of each door is a brass jaali lattice glowing with warm candlelight from behind; below are round floral medallions, carved panels and rows of brass studs. A lush arch of white and blush roses, deep red roses and hanging strings of white jasmine frames the doorway, with a marigold toran across the top. A colourful rangoli and lit clay diyas sit on the marble threshold. The vertical seam between the two doors runs exactly through the centre of the image, and the centre of the doors at mid-height is plain (a wax seal will be placed there). The doorway fills most of the frame. + style line

Tips: regenerate until the seam is dead centre and the doors are symmetrical. Avoid any ribbon, lock or seal on the doors, because the site draws those itself.

## Prompt 2: the gate-opening video

Use an **image-to-video** tool (Kling, Runway, Higgsfield, Luma, Hailuo or Veo) with **Prompt 1's image as the start frame**. 9:16, 1080p, 6–10 seconds.

> The two ornate golden palace doors slowly swing open inward. Warm golden light floods through the widening gap and rose petals drift gently toward the camera. The camera glides smoothly forward through the doorway onto a white marble balcony, revealing a majestic white marble lake palace at night under a full moon, glowing arched windows reflected in still water, floating diyas on the lake. Slow, elegant, continuous cinematic dolly shot, symmetrical, no cuts.

Negative prompt (if the tool has one):

> people, text, logos, warping architecture, melting shapes, flicker, jump cut, fast motion, camera shake

Tips:
- If the tool supports an **end frame**, also generate Prompt 3 first and use it as the end frame.
- The **last second should be calm** (the camera settles on the palace), because the site crossfades on it.
- Turn the tool's audio off. The music comes from the site.

## Prompt 3: the palace (only if you want a separate end frame or desktop image)

> Vertical 9:16. A majestic white marble Rajasthani lake palace at night seen from a carved marble balcony, glowing arched windows, domes and chhatris lit with warm golden light, a full moon in a deep indigo starry sky, the palace reflected in perfectly still lake water, floating diyas and marigold petals on the water, brass lanterns on the balcony railing. Keep the upper-middle third of the sky calm and uncluttered (the couple's names appear there). + style line

For `palace-night-wide.jpg`, use the same prompt with **Horizontal 16:9** and add *"wider view with palace gardens and palm trees on both sides"*.

## Prompt 4: transparent foreground flowers (optional, adds depth)

Generate on white, then remove the background (remove.bg, Canva, Photoshop or Firefly) and export as PNG.

Garland (`garland-top.png`, landscape):

> A lush hanging garland border of orange and yellow marigolds, deep red and blush roses, white jasmine strings and green mango leaves, hanging down from the top edge, front view, photoreal, high detail, isolated on a plain white background

Corner flowers (`florals-left.png`, square):

> A lush corner arrangement of blush and deep red roses, white orchids, jasmine and green leaves, growing up from the bottom-left corner, photoreal, high detail, isolated on a plain white background

Mirror it horizontally for `florals-right.png`.

## Commands (I can run these for you)

```bash
# compress to web size, 9:16, no audio
ffmpeg -i raw.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -c:v libx264 -crf 24 -preset slow -pix_fmt yuv420p -movflags +faststart -an gate-open.mp4

# first frame -> closed gate still
ffmpeg -i gate-open.mp4 -vframes 1 -q:v 3 gate-closed.jpg

# last frame -> palace hero image
ffmpeg -sseof -0.1 -i gate-open.mp4 -update 1 -q:v 3 palace-night.jpg
```
