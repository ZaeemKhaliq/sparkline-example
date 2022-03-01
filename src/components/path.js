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
    "minXValues",
  ],

  render(h) {
    const { data, smooth, boundary, radius, max, min, minXValues } = this;
    const points = genPoints(data, boundary, { max, min }, minXValues);
    const d = genPath(points, smooth ? radius : 0);

    return h("path", {
      attrs: { d, fill: "url(#fill-color)", stroke: `#30679A` },
    });
  },
};
