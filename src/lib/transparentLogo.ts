const cachedUrls = new Map<string, Promise<string>>();
const resolvedUrls = new Map<string, string>();

export function getCachedTransparentCrestUrl(src: string): string | null {
  return resolvedUrls.get(src) ?? null;
}

/**
 * Loads an image asset and cleanly keys out light/white studio backgrounds
 * (plus crops out outer margin watermarks when detected for the Bullish Titan crest)
 * into a transparent PNG Object URL cached per session.
 */
export function loadTransparentCrestUrl(src: string): Promise<string> {
  const existing = cachedUrls.get(src);
  if (existing) return existing;

  const promise = new Promise<string>((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      resolve(src);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';

    img.onload = () => {
      try {
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) {
          resolve(src);
          return;
        }

        // Tight crop around the Bullish Titan shield crest for widescreen 2752x1536 sheet
        const isWideCrestSheet = w > h * 1.4;
        const sx = isWideCrestSheet ? Math.floor(w * 0.318) : 0;
        const sy = isWideCrestSheet ? Math.floor(h * 0.064) : 0;
        const sw = isWideCrestSheet ? Math.ceil(w * 0.376) : w;
        const sh = isWideCrestSheet ? Math.ceil(h * 0.916) : h;

        const maxOutW = 960;
        const scale = sw > maxOutW ? maxOutW / sw : 1;
        const outW = Math.max(1, Math.round(sw * scale));
        const outH = Math.max(1, Math.round(sh * scale));

        const canvas = document.createElement('canvas');
        canvas.width = outW;
        canvas.height = outH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(src);
          return;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
        const imageData = ctx.getImageData(0, 0, outW, outH);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a === 0) continue;

          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const spread = maxC - minC;
          const luma = 0.299 * r + 0.587 * g + 0.114 * b;

          // Pure white / near-white neutral studio background -> completely transparent
          if (luma > 228 && spread < 28) {
            data[i + 3] = 0;
          } else if (luma > 192 && spread < 42) {
            // Smooth anti-aliased edge feathering along gold borders & lettering
            const fade = Math.max(0, Math.min(1, (228 - luma) / 36));
            const satBoost = Math.min(1, spread / 38);
            const nextAlpha = Math.round(a * Math.max(fade, satBoost * 0.85));
            data[i + 3] = nextAlpha;

            // Suppress white fringe halo by shifting semi-transparent edge pixels toward brushed gold
            if (nextAlpha > 0 && nextAlpha < 238) {
              data[i] = Math.min(255, Math.round(r * 0.96));
              data[i + 1] = Math.round(g * 0.85);
              data[i + 2] = Math.round(b * 0.36);
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => {
          const finalUrl = blob ? URL.createObjectURL(blob) : canvas.toDataURL('image/png');
          resolvedUrls.set(src, finalUrl);
          resolve(finalUrl);
        }, 'image/png');
      } catch {
        resolve(src);
      }
    };

    img.onerror = () => resolve(src);
    img.src = src;
  });

  cachedUrls.set(src, promise);
  return promise;
}
