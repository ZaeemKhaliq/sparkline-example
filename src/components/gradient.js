export default {
  render(h) {
    return h("defs", [
      h(
        "linearGradient",
        {
          attrs: {
            id: "fill-color",

            x1: 0,
            y1: 0, // Top to bottom
            x2: 0,
            y2: 1,

            // x1: 0,
            // y1: 1, // Bottom to top
            // x2: 0,
            // y2: 0,
          },
        },
        [
          h("stop", {
            attrs: {
              offset: "0%",
              "stop-color": "rgba(195, 190, 255, 1)",
            },
          }),
          h("stop", {
            attrs: {
              offset: "90%",
              "stop-color": "white",
            },
          }),
        ]
      ),
    ]);
  },
};
