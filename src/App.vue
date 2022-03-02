<template>
  <div id="app">
    <h1>SPARKLINE</h1>

    <!-- Try entering last value as'0'. Only then the gradient renders correctly -->
    <label for="value-min" class="min-values"
      >Minimum number of values =
    </label>
    <input type="text" id="value-min" @change="handleMinimumChange" />
    <p :style="{ display: 'inline', marginLeft: '1rem' }">
      Currently set to: {{ minimumValues }}
    </p>

    <br />
    <br />

    <label for="value-max" class="max-values"
      >Maximum number of values =
    </label>
    <input type="text" id="value-max" @change="handleMaximumChange" />
    <p :style="{ display: 'inline', marginLeft: '1rem' }">
      Currently set to: {{ maximumValues }}
    </p>

    <br />

    <p>
      <b>Total Data Values ({{ dataValues.length }}): </b>
      <span v-for="(item, index) in dataValues" :key="index">{{ item }}, </span>
    </p>

    <p>
      <b
        >Selected data values according to max length ({{
          slicedDataValues.length
        }}):
      </b>
      <span v-for="(item, index) in slicedDataValues" :key="index"
        >{{ item }},
      </span>
    </p>

    <label for="add-value">Add value to end: </label>
    <input type="text" id="add-value" @change="handleAddValueChange" />
    <button :style="{ marginLeft: '1rem' }" @click="handleAddValue">Add</button>
    <button :style="{ marginLeft: '1rem' }" @click="addRandomValueEnd">
      Add random value
    </button>
    <button :style="{ marginLeft: '1rem' }" @click="handleRemoveEnd">
      Remove value from end
    </button>

    <br />

    <label for="add-first-index">Add value to beginning: </label>
    <input type="text" id="add-first-index" @change="handleFirstIndexChange" />
    <button :style="{ marginLeft: '1rem' }" @click="handleAddFirstIndex">
      Add
    </button>
    <button :style="{ marginLeft: '1rem' }" @click="addRandomValueStart">
      Add random value
    </button>
    <button :style="{ marginLeft: '1rem' }" @click="handleRemoveStart">
      Remove value from beginning
    </button>

    <br />

    <label>
      Add fill color:
      <input type="text" v-model="fillColor" />
    </label>
    <div class="sparkline-container">
      <Trend
        :data="dataValues"
        :padding="8"
        :radius="1"
        :stroke-width="1"
        :stroke-linecap="butt"
        :smooth="true"
        auto-draw
        isRecording
        :minValues="+minimumValues"
        :maxValues="+maximumValues"
        class="sparkline"
        :pathFillColor="fillColor"
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
  data() {
    return {
      minimumValues: 40,
      maximumValues: 60,
      dataValues: [
        0, 10, 15, 25, 30, 35, 40, 50, 60, 43, 12, 31, 46, 43, 37, 28, 10, 15,
        18, 21, 45, 38, 39, 17, 14, 11, 8, 7, 3, 9, 5, 15, 34, 38, 49, 45, 60,
        67, 70, 54, 51, 43, 40, 36, 34, 32, 28, 25, 14, 23, 32, 31, 30, 30, 26,
        23, 15, 19, 50,
      ],
      newValue: null,
      firstIndexValue: null,
      fillColor: "",
    };
  },
  methods: {
    handleMinimumChange(event) {
      if (!event.target.value) {
        this.minimumValues = 40;
      } else {
        this.minimumValues = +event.target.value;
      }

      if (+this.minimumValues > +this.maximumValues) {
        this.maximumValues = this.minimumValues;
      }
    },
    handleMaximumChange(event) {
      this.maximumValues = +event.target.value;

      if (+this.minimumValues > +this.maximumValues) {
        this.maximumValues = this.minimumValues;
      }

      if (!event.target.value) {
        if (+this.minimumValues > 60) {
          this.maximumValues = this.minimumValues;
        } else {
          this.maximumValues = 60;
        }
      }
    },
    handleAddValueChange(event) {
      if (
        (+event.target.value || +event.target.value === 0) &&
        !(+event.target.value < 0)
      ) {
        this.newValue = +event.target.value;
      } else {
        this.newValue = null;
      }
    },
    handleAddValue() {
      if (this.newValue || this.newValue === 0) {
        this.dataValues.push(this.newValue);
      }
    },
    handleFirstIndexChange(event) {
      if (
        (+event.target.value || +event.target.value === 0) &&
        !(+event.target.value < 0)
      ) {
        this.firstIndexValue = +event.target.value;
      } else {
        this.firstIndexValue = null;
      }
    },
    handleAddFirstIndex() {
      if (this.firstIndexValue || this.firstIndexValue === 0) {
        this.dataValues.unshift(this.firstIndexValue);
      }
    },
    addRandomValueEnd() {
      const value = Math.random() * Math.max(...this.dataValues, 0);
      this.dataValues.push(Math.trunc(value));
    },
    addRandomValueStart() {
      const value = Math.random() * Math.max(...this.dataValues, 0);
      this.dataValues.unshift(Math.trunc(value));
    },
    handleRemoveEnd() {
      this.dataValues.pop();
    },
    handleRemoveStart() {
      this.dataValues.shift();
    },
  },
  computed: {
    slicedDataValues() {
      let result = [];
      if (this.dataValues.length > this.maximumValues) {
        result = this.dataValues.slice(
          this.dataValues.length - this.maximumValues
        );
      } else {
        result = this.dataValues;
      }

      return result;
    },
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
  margin-top: 1rem;
}

.sparkline {
  border: 1px solid black;
}
</style>
