/**
 * Shape of the hero photo: wave on top, cream "tongue" at top-right (where the
 * handwritten tagline sits), gentle curve on the bottom.
 * All numbers are fractions of the hero box, so it works at any size.
 */
export function buildHeroClipPath(w: number, h: number): string {
  const x = (f: number) => (f * w).toFixed(1);
  const y = (f: number) => (f * h).toFixed(1);

  return [
    // Start at top-left
    `M ${x(0)} ${y(0)}`,

    // -------------------------
    // TOP WAVE
    // -------------------------
    `C ${x(0.16)} ${y(0.20)}
       ${x(0.38)} ${y(0.29)}
       ${x(0.61)} ${y(0.30)}`,

    `C ${x(0.77)} ${y(0.30)}
       ${x(0.90)} ${y(0.25)}
       ${x(1)} ${y(0.21)}`,

    // -------------------------
    // RIGHT EDGE
    // -------------------------
    `L ${x(1)} ${y(0.94)}`,

    // -------------------------
    // BOTTOM WAVE
    // -------------------------
    `C ${x(0.86)} ${y(0.99)}
       ${x(0.65)} ${y(1.00)}
       ${x(0.46)} ${y(0.98)}`,

    `C ${x(0.27)} ${y(0.96)}
       ${x(0.10)} ${y(0.91)}
       ${x(0)} ${y(0.83)}`,

    // Close left edge
    `L ${x(0)} ${y(0)}`,

    'Z',
  ].join(' ');
}