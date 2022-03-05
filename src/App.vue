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
        >Selected data values according to set max values ({{
          slicedDataValues.length
        }}):
      </b>
      <span v-for="(item, index) in slicedDataValues" :key="index"
        >{{ item }},
      </span>
    </p>

    <div class="add-value-container">
      <div class="add-first-index-div">
        <div class="add-first-index-input">
          <label for="add-first-index">Add value to beginning: </label>
          <input
            type="text"
            id="add-first-index"
            @change="handleFirstIndexChange"
          />
        </div>
        <div class="add-first-index-buttons">
          <button class="add-button" @click="handleAddFirstIndex">Add</button>
          <button
            class="add-random-button"
            :style="{ marginLeft: '1rem' }"
            @click="addRandomValueStart"
          >
            Add random value
          </button>
          <button
            class="remove-button"
            :style="{ marginLeft: '1rem' }"
            @click="handleRemoveStart"
          >
            Remove value from beginning
          </button>
        </div>
      </div>

      <div class="add-value-div">
        <div class="add-value-input">
          <label for="add-value">Add value to end: </label>
          <input type="text" id="add-value" @change="handleAddValueChange" />
        </div>
        <div class="add-value-buttons">
          <button class="add-button" @click="handleAddValue">Add</button>
          <button
            class="add-random-button"
            :style="{ marginLeft: '1rem' }"
            @click="addRandomValueEnd"
          >
            Add random value
          </button>
          <button
            class="remove-button"
            :style="{ marginLeft: '1rem' }"
            @click="handleRemoveEnd"
          >
            Remove value from end
          </button>
        </div>
      </div>
    </div>

    <div class="graph-controls">
      <div class="fill-color">
        <label for="graph-fill-color"> Change fill color </label>
        <input type="text" id="graph-fill-color" v-model="fillColor" />
      </div>
      <div class="stroke-color">
        <label for="stroke-color"> Change line color </label>
        <input type="text" id="stroke-color" v-model="strokeColor" />
      </div>

      <div class="stroke-width">
        <label for="stroke-width"> Change line width </label>
        <input type="number" id="stroke-width" v-model="strokeWidth" min="0" />
      </div>

      <div class="outer-circle-radius">
        <label for="outer-circle-radius"> Change outer circle radius </label>
        <input
          type="number"
          id="outer-circle-radius"
          v-model="outerCircleRadius"
          min="0"
        />
      </div>

      <div class="inner-circle-radius">
        <label for="inner-circle-radius"> Change inner circle radius </label>
        <input
          type="number"
          id="inner-circle-radius"
          v-model="innerCircleRadius"
          min="0"
        />
      </div>

      <div class="inner-circle-stroke-width">
        <label for="inner-circle-stroke-width">
          Change inner circle stroke width
        </label>
        <input
          type="number"
          id="inner-circle-stroke-width"
          v-model="innerCircleStrokeWidth"
          min="0"
        />
      </div>
    </div>
    <div class="sparkline-container">
      <Trend
        class="sparkline"
        :data="dataValues"
        :padding="8"
        :radius="8"
        :smooth="true"
        auto-draw
        :isRecording="true"
        :autoDrawDuration="2000"
        :minValues="+minimumValues"
        :maxValues="+maximumValues"
        :pathFillColor="fillColor"
        :strokeColor="strokeColor"
        :strokeWidth="strokeWidth"
        :innerCircleRadius="innerCircleRadius"
        :outerCircleRadius="outerCircleRadius"
        :innerCircleStrokeWidth="innerCircleStrokeWidth"
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
        30, 30, 30, 35, 40, 50, 60, 43, 12, 31, 46, 43, 37, 28, 10, 15, 18, 21,
        45, 38, 39, 17, 14, 11, 8, 7, 3, 9, 5, 15, 34, 38, 49, 45, 60, 67, 70,
        54, 51, 43, 40, 36, 34, 32, 28, 25, 14, 23, 32, 31, 30, 30, 26, 23, 15,
        19, 50,
      ],
      newValue: null,
      firstIndexValue: null,
      fillColor: "",
      strokeColor: "",
      strokeWidth: 1,
      outerCircleRadius: 5,
      innerCircleRadius: 3,
      innerCircleStrokeWidth: 1.5,
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
}

.add-value-container {
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
}

.add-value-buttons,
.add-first-index-buttons {
  margin-top: 0.5rem;
}

.add-button,
.add-random-button,
.remove-button {
  border: none;
  padding: 0.3rem 0.7rem;
  border-radius: 0.3rem;
  cursor: pointer;
}

.add-button {
  background-color: rgb(49, 204, 132);
  color: white;
}

.add-button:hover {
  background-color: rgb(39, 170, 109);
}

.add-random-button {
  background-color: rgb(0, 119, 255);
  color: white;
}

.add-random-button:hover {
  background-color: rgb(20, 101, 194);
}

.remove-button {
  background-color: rgb(240, 49, 49);
  color: white;
}

.remove-button:hover {
  background-color: rgb(184, 31, 31);
}

.graph-controls {
  margin-top: 1rem;
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
}

.graph-controls .fill-color,
.graph-controls .stroke-color,
.graph-controls .stroke-width,
.graph-controls .outer-circle-radius,
.graph-controls .inner-circle-radius,
.graph-controls .inner-circle-stroke-width {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.graph-controls input {
  height: 1.3rem;
  font-size: 1.1rem;
  padding: 0.5rem;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
}

.graph-controls input[type="number"] {
  height: 1.4rem;
  width: 3rem;
}

.sparkline-container {
  height: 25rem;
  margin-top: 1rem;
}

.sparkline {
  border: 1px solid black;
}

.outer-circle {
  fill: #1db55a;
  transform: scale(0.7);
  animation: pulse 2s infinite ease;
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    fill-opacity: 1;
  }

  70% {
    transform: scale(2);
    fill-opacity: 0;
  }

  100% {
    transform: scale(0.7);
    fill-opacity: 0;
  }
}
</style>
