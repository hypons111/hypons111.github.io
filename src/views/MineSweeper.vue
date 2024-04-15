<template>
  <div class="container">
    <div id="minesweeper">
      <div id="panel">
        <button class="item" @click="setGameStates(1)">NEW GAME</button>
        <input class="item" v-model="timer">
        <!-- <button class="item" @click="setGameStates(2)">PAUSE</button> -->
        <button class="item" @click="setGameStates(0)">RESET</button>
      </div>

      <div id="board" v-if="gameStates.currentStatus !== 0">
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

      <div v-else id="newGameWrapper">
        <p> Minesweeper </p>
        <div>
          <label for="boardScale">Size : </label>
          <input type="number" id="boardScale" class="item" v-model="boardScale">
        </div>
        <div>
          <label for="mineNumber">Mine : </label>
          <input type="number" id="mineNumber" class="item" v-model="mineNumber">
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
const boardScale = ref(9);
const mineNumber = ref(1);
const rows = computed(() => Array.from({ length: boardScale.value }, (_, i) => i));
const columns = computed(() => Array.from({ length: boardScale.value }, (_, i) => i));
const cells = ref([]);
const timer = ref("00:00:00");
const gameStates = ref({
  currentStatus : 0,
  // status: {
  //   0: "none",
  //   1: "start",
  //   2: "pause",
  //   3: "win",
  //   4: "lost"
  // }
})

// 控制遊戲狀態
function setGameStates(statusCode) {
  gameStates.value.currentStatus = statusCode;
  switch (statusCode) {
    case 0:
      break;
    case 1:
      setCells();
      setMines();
      setMineCounter();
      setTimer();
      break;
    case 2:
      break;
    case 3:
    alert("WIN");
      break;
    case 4:
    alert("Lose");
      digAllCells();
      break;
  }
}

// 初始化每個 cell
function setCells() {
  cells.value = [];
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

function setTimer() {}

// 設定地雷周圍 8 格的數字
function setMineCounter() {
  // neighborIds 是地雷周圍 8 格的 cell id, 執行一次就將他們的 mineCounter 數 + 1.
  const counterHandler = function (neighborIds) {
    neighborIds.forEach(id => {
      if (cells.value[id].type !== "mine") {
        cells.value[id].type = "counter";
        cells.value[id].mineCounter++;
      }
    })
  }
  // 如果是地雷就遍歷周圍 8 格, 並執行 counterHandler().
  for (let id = 0; id < cells.value.length; id++) {
    if (cells.value[id].type === "mine") {
      relatedCellTraversal(id, counterHandler);
    }
  }
}

// 打開 cell
function leftClick(event) {
  let target = cells.value[event.target.id];
  target.status = target.type;
  switch (target.type) {
    case "empty":
      dugEmpty(target.id);
      break;
    case "counter":
      break;
    case "mine":
      setGameStates(4);
      break;
  }
}

// 標註旗子 / 問號
function rightClick(event) {
  let t = event.target;
  while (!t.id) {
    t = t.parentElement;
  }
  switch (cells.value[t.id].status) {
    case "initial":
      cells.value[t.id].status = "flagged";
      checkWin();
      break;
    case "flagged":
      cells.value[t.id].status = "questionMarked";
      break;
    case "questionMarked":
      cells.value[t.id].status = "initial";
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

// 檢查是不是破關 
// 破關條件：全部地雷都被標註旗子 和 旗子數量等於地雷數量
function checkWin() {
  const result = cells.value.filter(cell => cell.type === "mine" && cell.status === "flagged");
  if (result.length === mineNumber.value) {
    setGameStates(3);
  }
}

// 打開全部 cells
function digAllCells() {
  cells.value.forEach(cell => {
    cell.status = cell.type;
  })
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
$text: Blue;
$flag: gold;
$mine: red;
$questionMarke: white;
$lightgray: #b0b0b0;
$darkgray: #333333;

#minesweeper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  #panel {
    width: 30em;
    display: flex;
    justify-content: center;
    // border: 0.5em solid $darkgray;
    margin-bottom: 1em;
    
    .item {
      text-align: center;
      width: 20%;
    }
  }
  
  #newGameWrapper {
    width: 30em;
    height: 30em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: $lightgray;
    border: 1px solid $darkgray;

    > div {
      width: 20em;
      display: flex;
      justify-content: center;
      margin-top: 0.5em;

      input {
        width: 3em;
        margin-left: 1em;
      }
    }

    p {
      font-size: 1.5em;
      font-weight: bolder;
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
        width: 2em;
        height: 2em;
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
        font-weight: bolder;
        color: $text;
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