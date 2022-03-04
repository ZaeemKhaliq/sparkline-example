import Path from "./path";
import PathFilled from "./pathFilled";
import Gradient from "./gradient";

import { genPoints, genPath } from "../helpers/path";

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
    minValues: {
      type: Number,
      default: 20,
    },
    maxValues: {
      type: Number,
      default: 30,
    },
    strokeColor: {
      type: String,
    },
    strokeWidth: {
      type: Number,
      default: 1,
    },
    pathFillColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      firstRender: true,
    };
  },

  watch: {
    data: {
      immediate: true,
      handler() {
        this.$nextTick(async () => {
          if (this.$isServer || !this.$refs.path || !this.autoDraw) {
            return;
          }

          const props = this.$props;
          const path = this.$refs.path.$el;

          const length = path.getTotalLength();

          path.style.transition = "none";
          path.style.strokeDasharray = length + " " + length;
          path.style.strokeDashoffset = Math.abs(
            length - (this.lastLength || 0)
          );
          path.getBoundingClientRect();
          if (!this.lastLength) {
            path.style.transition = `stroke-dashoffset ${this.autoDrawDuration}ms ${this.autoDrawEasing}`;
          }
          path.style.strokeDashoffset = 0;

          if (this.lastLength) {
            this.firstRender = false;
          }

          let outerCircle = document.querySelector(".outer-circle");

          const { boundary, max, min } = props;
          const maxValue = max;
          const minValue = min;

          const points = genPoints(
            props.data,
            boundary,
            {
              max: maxValue,
              min: minValue,
            },
            { minValues: props.minValues, maxValues: props.maxValues }
          );

          const lastPoint = points[points.length - 1];

          if (
            outerCircle.dataset.cx !== "null" &&
            outerCircle.dataset.cy !== "null"
          ) {
            outerCircle.style.transformOrigin = `${Number(
              outerCircle.dataset.cx
            )}px ${Number(outerCircle.dataset.cy)}px`;
          } else if (this.lastLength) {
            outerCircle.style.transformOrigin = `${lastPoint.x + 3}px ${
              lastPoint.y
            }px`;
          }

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
      { minValues: props.minValues, maxValues: props.maxValues }
    );
    const lastPoint = points[points.length - 1];

    const path = genPath(points, props.radius);
    const drawDuration = props.autoDrawDuration;

    return h(
      "svg",
      {
        attrs: {
          width: width || "700",
          height: height || "200",
          viewBox: `0 0 ${viewWidth} ${viewHeight}`,
        },
      },
      [
        h(Gradient, {
          props,
        }),
        h(PathFilled, {
          props,
          ref: "pathFilled",
        }),
        h(Path, {
          props,
          ref: "path",
        }),
        props.isRecording
          ? h(
              "circle",
              {
                attrs: {
                  class: "outer-circle",
                  cx: `${!this.firstRender ? lastPoint.x + 3 : null}`,
                  cy: `${!this.firstRender ? lastPoint.y : null}`,
                  "data-cx": `${!this.firstRender ? lastPoint.x + 3 : null}`,
                  "data-cy": `${!this.firstRender ? lastPoint.y : null}`,
                  r: "5",
                  // style: `fill: #1DB55A; fill-opacity:0.2; `,
                },
              },
              [
                this.firstRender &&
                  h("animateMotion", {
                    attrs: {
                      dur: `${drawDuration}ms`,
                      path: path,
                      fill: "freeze",
                      calcMode: "spline",
                      keySplines: `0.25 0.1 0.25 1;
                    0.25 0.1 0.25 1;
                    0.25 0.1 0.25 1;
                    0.25 0.1 0.25 1`,
                      keyTimes: `0;0.25;0.4;0.55;1`,
                    },
                  }),
              ]
            )
          : null,
        props.isRecording
          ? h(
              "circle",
              {
                attrs: {
                  cx: `${this.firstRender ? null : lastPoint.x + 3}`,
                  cy: `${this.firstRender ? null : lastPoint.y}`,
                  r: "3",
                  style: `fill: white; stroke: #1DB55A; stroke-width: 1.5;`,
                },
              },
              [
                this.firstRender &&
                  h("animateMotion", {
                    attrs: {
                      dur: `${drawDuration}ms`,
                      path: path,
                      fill: "freeze",
                      calcMode: "spline",
                      keySplines: `0.25 0.1 0.25 1;
                    0.25 0.1 0.25 1;
                    0.25 0.1 0.25 1;
                    0.25 0.1 0.25 1`,
                      keyTimes: `0;0.25;0.4;0.55;1`,
                    },
                  }),
              ]
            )
          : null,
      ]
    );
  },
};
