<template>
  <div id="container">
    <div id="minesweeper">
      <div id="panel">
        <!-- <div class="item"><input type="number" v-model="boardScale"></div> -->
        <!-- <div class="item"><input type="number" v-model="mineNumber"></div> -->
        <input id="scale" type="number" @change="initialGame">
        <input id="mine" type="number" @change="initialGame">
        <span>{{ timer }}</span>
        <button>START</button>
        <button>PAUSE</button>
        <button>RESET</button>
      </div>
      <div id="board">
        <div v-for="row in rows" :key="row">
          <span v-for="column in columns" :key="column" class="cell" :id="column + (row * boardScale)"
            :class="cells[column + (row * boardScale)].status" :data-type="cells[column + (row * boardScale)].type"
            @contextmenu.prevent="rightClick" @click="leftClick">
            <font-awesome-icon v-if="cells[column + (row * boardScale)].status === 'flagged'" :icon="['fas', 'flag']" />
            <font-awesome-icon v-else-if="cells[column + (row * boardScale)].status === 'questionMarked'"
              :icon="['fas', 'question']" />
            <font-awesome-icon v-if="cells[column + (row * boardScale)].status === 'mine'"
              :icon="['fas', 'explosion']" />
            <p v-if="cells[column + (row * boardScale)].status === cells[column + (row * boardScale)].type"
              class="mineCounter">
              {{ cells[column + (row * boardScale)].mineCounter }}
            </p>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref } from "vue"
const boardScale = ref(9);
const mineNumber = ref(10);
const rows = computed(() => Array.from({ length: boardScale.value }, (_, i) => i));
const columns = computed(() => Array.from({ length: boardScale.value }, (_, i) => i));
const cells = ref([]);
const timer = "00:00";

onBeforeMount(() => {
  setCells();
  setMines();
  setMineCounter();
})

function initialGame(event) {
  console.log(event.target.id)

  if(event.target.id === "scale") {
    boardScale.value = event.target.value;
    setCells();
    setMines();
    setMineCounter();
  }
}

// 初始化每個 cell
function setCells() {
  for (let i = 0; i < boardScale.value; i++) {
    for (let j = 0; j < boardScale.value; j++) {
      cells.value.push({
        id: j + (i * boardScale.value),
        type: 'empty',        /* empty, mine, counter */
        status: "initial",    /* initial, dug, flagged, marked */
        mineCounter: "",
        row: i,
        column: j
      });
    }
  }
}

// 隨機放設地雷
function setMines() {
  const set = new Set();
  while (set.size < mineNumber.value) {
    const number = Math.floor(Math.random() * Math.pow(boardScale.value, 2));
    cells.value[number].type = "mine";
    set.add(number)
  }
}

// 設定地雷周圍 8 格的數字
function setMineCounter() {
  // neighborIds 是地雷周圍 8 格的 cell id, 執行一次就將他們的 mineCounter 數 + 1.
  const counterHandler = function (neighborIds) {
    neighborIds.forEach(id => {
      cells.value[id].type = "counter";
      cells.value[id].mineCounter++;
    })
  }
  // 如果是地雷就遍歷周圍 8 格, 並執行 counterHandler().
  for (let id = 0; id < cells.value.length; id++) {
    if (cells.value[id].type === "mine") {
      relatedCellTraversal(id, counterHandler);
    }
  }
}

function leftClick() {
  let target = cells.value[event.target.id];
  if (event.target.tagName === "P") {
    target = cells.value[event.target.parentElement.id];
  }
  target.status = target.type;
  switch (target.type) {
    case "empty":
      dugEmpty(target.id);
      break;
    case "counter":
      break;
    case "mine":
      dugMine();
      break;
  }
}

// 掘到 empty 時
function dugEmpty(id) {
  // 打開相連的 cell
  const checkCellType = function (neighborIds) {
    neighborIds.forEach(id => {
      const cell = cells.value[id];
      if (cell.type === "empty" && cell.status === "initial") {           // 將全部相連的 empty cell 打開
        cell.status = cell.type;
        dugEmpty(cell.id);
      } else if (cell.type === "counter" && cell.status === "initial") {  // 將第一個相連的 counter cell 打開
        cell.status = cell.type;
      }
    })
  }
  // 如果是 empty cell 就遍歷他周圍 8 格, 並執行 checkCellType().
  relatedCellTraversal(id, checkCellType);
}

// 掘到 mine 時
function dugMine() {
  cells.value.forEach(cell => {
    cell.status = cell.type;
  })
}


function rightClick(event) {
  let t = event.target;
  while (!t.id) {
    t = t.parentElement;
  }
  switch (cells.value[t.id].status) {
    case "initial":
      cells.value[t.id].status = "flagged";
      break;
    case "flagged":
      cells.value[t.id].status = "questionMarked";
      break;
    case "questionMarked":
      cells.value[t.id].status = "initial";
      break;
  }
}


// 遍歷某一格 cell 的周圍 8 格, 並對其執行 func. 
// func 統一宣告在呼叫 relatedCellTraversal() 的函數中.
function relatedCellTraversal(id, func) {
  const scale = boardScale.value
  /*
  (i-scale)     往上一格
  (i+scale)     往下一格
  (i-1)         往左一格
  (i+1)         往右一格
  (i-scale-1)   往左上一格
  (i-scale+1)   往右上一格
  (i+scale-1)   往左下一格
  (i+scale+1)   往右下一格
*/
  if/* 左上角 */(id === 0) {
    func([(id + 1), (id + scale), (id + scale + 1)]);
  } else if/* 右上角 */ (id === scale - 1) {
    func([(id - 1), (id + scale), id + scale - 1]);
  } else if/* 左下角 */ (id === Math.pow(scale, 2) - scale) {
    func([(id - scale), (id + 1), (id - scale + 1)]);
  } else if/* 右下角 */ (id === Math.pow(scale, 2) - 1) {
    func([(id - scale), (id - 1), (id - scale - 1)]);
  } else if/* 上邊界 */(cells.value[id].row === 0) {
    func([(id + scale), (id - 1), (id + 1), (id + scale - 1), (id + scale + 1)]);
  } else if/* 下邊界 */(cells.value[id].row === scale - 1) {
    func([(id - scale), (id - 1), (id + 1), (id - scale - 1), (id - scale + 1)]);
  } else if/* 左邊界 */(cells.value[id].column === 0) {
    func([(id - scale), (id + scale), (id + 1), (id - scale + 1), (id + scale + 1)]);
  } else if/* 右邊界 */(cells.value[id].column === scale - 1) {
    func([(id - scale), (id + scale), (id - 1), (id - scale - 1), (id + scale - 1)]);
  } else {
    func([(id - scale), (id + scale), (id - 1), (id + 1), (id - scale - 1), (id - scale + 1), (id + scale - 1), (id + scale + 1)]);
  }
}
</script>

<style lang="scss">
$text: lightseagreen;
$flag: gold;
$mine: red;
$questionMarke: white;
$lightgray: #b0b0b0;
$darkgray: #333333;



#container {
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    font-family: 'Courier New', Courier, monospace;
    font-weight: bold;
  }

  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  #panel {

    display: flex;

    &>* {
      flex: 1 1 2em;
    }
    input {
      width: 2em;
      text-align: center;
    }
  }

  #board {
    padding: 1px;
    background-color: $lightgray;
    border: 0.5em solid $darkgray;

    &>div {
      // row
      display: flex;

      // cell 基本樣式
      .cell {
        width: 3em;
        height: 3em;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: $darkgray;
        border: 2px solid $lightgray;
        font-size: 1em;
      }

      // 初始 cell
      .initial {
        & p {
          display: none;
        }
      }

      // 標註旗子
      .flagged {
        color: $flag;
      }

      // 標註問號
      .questionMarked {
        color: $questionMarke;
      }

      /* 已開的 empty */
      .empty {
        background-color: white;
      }

      /* 已開的 counter */
      .counter {
        background-color: white;
      }

      /* 已開的地雷 */
      .mine {
        background-color: white;
        color: $mine;
      }
    }
  }

}
</style>