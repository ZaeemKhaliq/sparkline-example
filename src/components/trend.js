import Path from "./path";
import Gradient from "./gradient";

import { genPoints } from "../helpers/path";

export default {
  name: "Trend",

  props: {
    data: {
      type: Array,
      required: true,
    },
    autoDraw: Boolean,
    autoDrawDuration: {
      type: Number,
      default: 2000,
    },
    autoDrawEasing: {
      type: String,
      default: "ease",
    },
    gradient: {
      type: Array,
      default: () => ["#000"],
    },
    gradientDirection: {
      type: String,
      default: "top",
    },
    max: {
      type: Number,
      default: -Infinity,
    },
    min: {
      type: Number,
      default: Infinity,
    },
    height: Number,
    width: Number,
    padding: {
      type: Number,
      default: 8,
    },
    radius: {
      type: Number,
      default: 10,
    },
    smooth: Boolean,
    isRecording: Boolean,
    minXValues: {
      type: Number,
      default: 10,
    },
  },

  watch: {
    data: {
      immediate: true,
      handler() {
        this.$nextTick(() => {
          if (this.$isServer || !this.$refs.path || !this.autoDraw) {
            return;
          }

          const path = this.$refs.path.$el;

          const length = path.getTotalLength();

          path.style.transition = "none";
          path.style.strokeDasharray = length + " " + length;
          path.style.strokeDashoffset = Math.abs(
            length - (this.lastLength || 0)
          );
          path.getBoundingClientRect();
          path.style.transition = `stroke-dashoffset ${this.autoDrawDuration}ms ${this.autoDrawEasing}`;
          path.style.strokeDashoffset = 0;
          this.lastLength = length;
        });
      },
    },
  },

  render(h) {
    if (!this.data || this.data.length < 2) return;
    const { width, height, padding } = this;
    const viewWidth = width || 300;
    const viewHeight = height || 75;
    const boundary = {
      minX: padding,
      minY: padding,
      maxX: viewWidth - padding,
      maxY: viewHeight - padding,
    };
    const props = this.$props;

    props.boundary = boundary;
    props.id = "vue-trend-" + this._uid;

    const maxValue = this.max;
    const minValue = this.min;

    const points = genPoints(
      props.data,
      boundary,
      {
        max: maxValue,
        min: minValue,
      },
      props.minXValues
    );
    const lastPoint = points[points.length - 1];
    console.log(points);

    return h(
      "svg",
      {
        attrs: {
          width: width || "100%",
          height: height || "100%",
          viewBox: `0 0 ${viewWidth} ${viewHeight}`,
        },
      },
      [
        h(Gradient, {
          props,
        }),
        h(Path, {
          props,
          ref: "path",
        }),
        props.isRecording
          ? h("circle", {
              attrs: {
                cx: `${lastPoint.x + 3}`,
                cy: `${lastPoint.y}`,
                r: "7",
                style: `fill: #1DB55A; fill-opacity:0.2;`,
              },
            })
          : null,
        props.isRecording
          ? h("circle", {
              attrs: {
                cx: `${lastPoint.x + 3}`,
                cy: `${lastPoint.y}`,
                r: "3",
                style: `fill: white; stroke: #1DB55A; stroke-width: 1.5;`,
              },
            })
          : null,
      ]
    );
  },
};
