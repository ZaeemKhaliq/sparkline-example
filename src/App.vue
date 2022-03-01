<template>
  <div id="app">
    <h1>SPARKLINE</h1>
    <div class="sparkline-container">
      <Trend
        :data="[0, 3, 6, 5, 3, 5, 3, 2, 1]"
        :padding="8"
        :radius="1"
        :stroke-width="1"
        :stroke-linecap="butt"
        :smooth="true"
        auto-draw
        isRecording
        :minXValues="10"
      ></Trend>
    </div>
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

.sparkline-container {
  height: 25rem;
}
</style>
