<template>
  <div id="app">
    <h1>SPARKLINE</h1>
    <Trend
      :data="[0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0]"
      :gradientDirection="top"
      :gradient="['#6fa8dc', '#42b983', '#2c3e50']"
      :padding="8"
      :radius="1.5"
      :stroke-width="1"
      :stroke-linecap="square"
      auto-draw
      smooth
      class="sparkline"
    ></Trend>
  </div>
</template>

<script>
import Trend from "./components/trend";

export default {
  name: "App",
  components: {
    Trend,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.sparkline {
  border: 1px solid black;
}
</style>
