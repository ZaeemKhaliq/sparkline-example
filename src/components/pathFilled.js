import { genPoints, genPath } from "../helpers/path";

export default {
  props: [
    "smooth",
    "data",
    "boundary",
    "radius",
    "id",
    "max",
    "min",
    "minValues",
    "maxValues",
    "pathFillColor",
  ],

  render(h) {
    const {
      data,
      smooth,
      boundary,
      radius,
      max,
      min,
      minValues,
      maxValues,
      pathFillColor,
    } = this;
    const points = genPoints(
      data,
      boundary,
      { max, min },
      { minValues, maxValues }
    );
    const d = genPath(points, smooth ? radius : 0, "filled");

    return h("path", {
      attrs: {
        d,
        fill: pathFillColor ? pathFillColor : "url(#fill-color)",
      },
    });
  },
};
