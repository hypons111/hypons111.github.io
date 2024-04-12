<template>
  <div class="container">
    <div id="clcok">
      <div id="circle">
        <div id="hPointer" class="pointer" :style="{ transform: `rotate(${hDegree}deg)` }">
          <span class="number" :style="{ transform: `translate(-50%, 10px) rotate(${-hDegree}deg)` }">
            <p>{{ hNumber }}</p>
          </span>
        </div>
        <div id="mPointer" class="pointer" :style="{ transform: `rotate(${mDegree}deg)` }">
          <span class="number" :style="{ transform: `translate(-50%, 10px) rotate(${-mDegree}deg)` }">
            <p>{{ mNumber }}</p>
          </span>
        </div>
        <div id="sPointer" class="pointer" :style="{ transform: `rotate(${sDegree}deg)` }">
          <span class="number" :style="{ transform: `translate(-50%, 10px) rotate(${-sDegree}deg)` }">
            <p>{{ sNumber }}</p>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
const hNumber = ref();
const mNumber = ref();
const sNumber = ref();
const hDegree = ref();
const mDegree = ref();
const sDegree = ref();
let interval;

onMounted(() => {
  setCurrentTime()
  run();
})

onBeforeUnmount(() => {
  clearInterval(interval);
})

function setCurrentTime() {
  const DATE = new Date();
  const hour = DATE.getHours();
  const minute = DATE.getMinutes();
  const second = DATE.getSeconds();
  hNumber.value = hour === 0 ? "24" : hour;
  mNumber.value = minute === 0 ? "60" : minute;
  sNumber.value = second === 0 ? "60" : second;
  hDegree.value = hour * 30;
  mDegree.value = minute * 6;
  sDegree.value = second * 6;
}

function run() {
  interval = setInterval(() => {
    setCurrentTime();
  }, 1000)
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
}

#clcok {

  display: flex;
  justify-content: center;
  align-items: center;

  #circle {
    position: relative;
    width: 15em;
    height: 15em;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15em;
    border: 0.25em solid #404040;

    .pointer {
      width: 0;
      position: absolute;
      bottom: 50%;
      border-width: 0;
      transform-origin: 50% 100%;

      .number {
        position: absolute;
        left: 50%;
        width: 1.5em;
        height: 1.5em;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        text-align: center;
        line-height: 1.5em;
        font-size: 2em;
        color: #404040;
      }
    }

    #hPointer {
      height: 0.75em;

      .number {
        top: -2em;

        p {
          font-size: 3rem;
        }
      }
    }

    #mPointer {
      height: 3.5em;

      .number {
        top: -1.75em;

        p {
          font-size: 2rem;
        }
      }
    }

    #sPointer {
      height: 5.5em;

      .number {
        top: -1.5em;

        p {
          font-size: 1rem;
        }
      }
    }
  }
}

@media only screen and (min-width: 576px) {
  #clcok {

    #circle {
      width: 30em;
      height: 30em;
      border-radius: 30em;
      border: 0.5em solid #404040;

      .pointer {
        border: 2px solid #404040;
      }

      #hPointer {
        width: 1em;
        height: 7.5em;
      }

      #mPointer {
        width: 0.5em;
        height: 10em;
      }

      #sPointer {
        width: 0em;
        height: 12.5em;
      }
    }
  }
}
</style>