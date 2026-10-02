const at = (width: number, height: number) => ({
  x: (value: number) => (value * width).toFixed(1),
  y: (value: number) => (value * height).toFixed(1),
});

export function setupFooterPath(width: number, height: number): string {
  const { x, y } = at(width, height);
  return [`M ${x(0)} ${y(0.08)}`, `C ${x(0.2)} ${y(0.18)} ${x(0.4)} ${y(0.16)} ${x(0.62)} ${y(0.11)}`, `C ${x(0.82)} ${y(0.06)} ${x(0.92)} ${y(0.09)} ${x(1)} ${y(0.04)}`, `L ${x(1)} ${y(1)} L ${x(0)} ${y(1)} Z`].join(' ');
}
