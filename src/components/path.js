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
    "strokeColor",
    "strokeWidth",
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
      strokeColor,
      strokeWidth,
    } = this;
    const points = genPoints(
      data,
      boundary,
      { max, min },
      { minValues, maxValues }
    );
    const d = genPath(points, smooth ? radius : 0);

    return h("path", {
      attrs: {
        d,
        fill: "none",
        stroke: strokeColor ? strokeColor : `#30679A`,
        "stroke-width": strokeWidth,
      },
    });
  },
};
