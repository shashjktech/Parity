const at = (w: number, h: number) => ({
  x: (v: number) => (v * w).toFixed(1),
  y: (v: number) => (v * h).toFixed(1),
});

export function signupFooterPath(w: number, h: number): string {
  const { x, y } = at(w, h);
  return [
    `M ${x(0)} ${y(0.02)}`,
    `C ${x(0.18)} ${y(0.17)} ${x(0.4)} ${y(0.19)} ${x(0.62)} ${y(0.14)}`,
    `C ${x(0.8)} ${y(0.1)} ${x(0.92)} ${y(0.09)} ${x(1)} ${y(0.11)}`,
    `L ${x(1)} ${y(1)} L ${x(0)} ${y(1)} Z`,
  ].join(' ');
}

export function verifyFooterPath(w: number, h: number): string {
  const { x, y } = at(w, h);
  return [
    // 1. Start on the left edge, slightly above the trough
    `M ${x(0)} ${y(0.425)}`,
    // 2. Dip down and flatten into a wide, shallow trough (bottom near x ≈ 0.18)
    `C ${x(0.05)} ${y(0.455)} ${x(0.11)} ${y(0.471)} ${x(0.184)} ${y(0.471)}`,
    // 3. Long, smooth S-curve rising from the trough to a soft crest (x ≈ 0.83)
    `C ${x(0.40)} ${y(0.471)} ${x(0.62)} ${y(0.388)} ${x(0.828)} ${y(0.388)}`,
    // 4. Gentle roll-off from the crest down to the right edge
    `C ${x(0.90)} ${y(0.388)} ${x(0.96)} ${y(0.405)} ${x(1)} ${y(0.43)}`,
    // 5. Close around the bottom border
    `L ${x(1)} ${y(1)} L ${x(0)} ${y(1)} Z`,
  ].join(' ');
}