export const snapToClosest = (value: number, targets: number[]): number => {
  return targets.reduce((closest, candidate) => {
    return Math.abs(candidate - value) < Math.abs(closest - value)
      ? candidate
      : closest;
  }, targets[0]);
};

export const getCoord = (element: SVGElement, coord: 'x' | 'y') => {
  return parseFloat(element.getAttribute(coord) || '0');
};
