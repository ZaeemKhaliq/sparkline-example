import { checkCollinear, getDistance, moveTo } from "./math";

/**
 *  Calculate the coordinate
 * @param  {number[]|object[]}  arr
 * @param  {object}             boundary
 * @return {object[]}
 */
export function genPoints(
  arr,
  { minX, minY, maxX, maxY },
  { max, min },
  { minValues, maxValues }
) {
  maxValues = maxValues < minValues ? minValues : maxValues;

  arr = arr.length > maxValues ? arr.slice(arr.length - maxValues) : arr;
  arr = arr.map((item) => (typeof item === "number" ? item : item.value));

  const minValue = Math.min(...arr, min) - 0.001;
  const length = arr.length >= minValues ? arr.length - 1 : minValues - 1;
  const gridX = (maxX - minX) / length;
  const gridY = (maxY - minY) / (Math.max(...arr, max) + 0.001 - minValue);

  return arr.map((value, index) => {
    return {
      x: index * gridX + minX,
      y:
        maxY -
        (value - minValue) * gridY +
        +(index === arr.length - 1) * 0.00001 -
        +(index === 0) * 0.00001,
    };
  });
}

/**
 * From https://github.com/unsplash/react-trend/blob/master/src/helpers/DOM.helpers.js#L18
 */
export function genPath(points, radius, pathType) {
  let maxPoint;
  if (pathType === "filled") {
    maxPoint = Math.max(...points.map((point) => point.y));

    const pointsObj = { x: points[points.length - 1].x, y: maxPoint };
    points.push(pointsObj);
  }

  const start = points.shift();

  return (
    `M${start.x} ${pathType === "filled" ? maxPoint : start.y}` +
    points
      .map((point, index) => {
        const next = points[index + 1];
        const prev = points[index - 1] || start;
        const isCollinear = next && checkCollinear(next, point, prev);

        if (!next || isCollinear) {
          if (pathType === "filled" && index === 0) {
            return `L${start.x} ${point.y}L${point.x} ${point.y}`;
          }
          return `L${point.x} ${point.y}`;
        }

        const threshold = Math.min(
          getDistance(prev, point),
          getDistance(next, point)
        );

        const isTooCloseForRadius = threshold / 2 < radius;
        const radiusForPoint = isTooCloseForRadius ? threshold / 2 : radius;

        const before = moveTo(prev, point, radiusForPoint);
        const after = moveTo(next, point, radiusForPoint);

        if (pathType === "filled" && index === 0) {
          return `L${start.x} ${start.y}L${before.x} ${before.y}S${point.x} ${point.y} ${after.x} ${after.y}`;
        }
        if (index === points.length - 2 && pathType === "filled") {
          return `L${before.x} ${before.y}S${point.x} ${point.y} ${point.x} ${point.y}`;
        }

        return `L${before.x} ${before.y}S${point.x} ${point.y} ${after.x} ${after.y}`;
      })
      .join("")
  );
}
