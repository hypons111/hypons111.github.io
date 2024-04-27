# hypons111

## 2024-04-12
今日發現個 gh page refresh 嗰陣會 404，問咗一輪 chat gpt 先知，原來前端 router 分兩種：
1. hash mode      http://localhost:8080/#/clock
2. history mode   http://localhost:8080/clock

除咗喺 `vue create` 嗰陣可以揀用邊個 mode 之外，仲可以喺 router/index.js 度改：
```
import { createRouter, createWebHashHistory } from 'vue-router';    // hash mode
import { createRouter, createWebHistory } from 'vue-router'         // history mode

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),    // hash mode
  // history: createWebHistory(process.env.BASE_URL),     // history mode
  routes
})
```

### 點解 hash mode router 喺 gh page 同 server side refresh 畫面 __唔會__ 404?
ChatGPT：
首先 hash mode 嘅 url 係咁嘅樣： http://localhost:8080/#/clock。
而 # 後面嘅嘢唔會傳俾 server，所以refresh 嗰陣 server 只會收到 http://localhost:8080/ 然後連去 index.html。

### 點解 history mode router 喺 gh page 同 server side refresh 畫面會 404?
佢會喺個瀏覽器的地址欄度顯示 http://localhost:8080/clock，但其實佢無發出任何請求，佢只係渲染咗個頁面，之後偽造一個history俾瀏覽器記住，
到我要上一頁嗰陣佢就拎返呢個畫面出嚟，然後再改一改個瀏覽器history. 
到真係 refresh 頁面嗰陣佢就將成個 http://localhost:8080/clock 傳去server，但 server 無呢個路由，所以就屌你老母 404 嘞！！！

ChatGPT：
當你在使用 History 模式的 Vue Router 應用中導航到 /clock 路由時，Vue Router 會利用 HTML5 History API 的 pushState 方法來改變瀏覽器地址欄的 URL 至 http://localhost:8080/clock，同時不會向伺服器發出任何請求。
此時，Vue Router 根據路由設定動態渲染相應的頁面（例如 Clock 組件），但整個過程都在客戶端完成，伺服器不參與。
當你點擊瀏覽器的後退按鈕時，瀏覽器會觸發 popState 事件，Vue Router 會響應這個事件，並根據當前的 URL（從瀏覽器的歷史記錄中獲取）來決定渲染哪個組件，這一切都是在不發出任何請求的情況下完成的。
如果此時你刷新頁面，瀏覽器會將包括路由在內的完整 URL（http://localhost:8080/clock）發送到伺服器。因為這是一個單頁面應用，伺服器上實際上並沒有一個實際的 /clock 路徑，所以如果伺服器沒有被適當配置來處理這種情況（即重定向所有的請求到 index.html），就會返回一個 404 錯誤。

## hash mode 瀏覽歷史處理
導航：當用戶在應用內部進行導航時（例如點擊一個路由鏈接），Vue Router 會改變 URL 的 hash 部分，但不會導致頁面重新加載。這是通過簡單地修改 window.location.hash 來實現的。改變 hash 不會讓瀏覽器發送請求到服務器。
監聽 hashchange 事件：Vue Router 會監聽 window 對象上的 hashchange 事件。當用戶通過點擊前進或後退按鈕改變 URL 的 hash，或直接在地址欄修改 hash 並按下 Enter 鍵時，hashchange 事件會被觸發，Vue Router 則根據新的 hash 值來決定顯示哪個組件。
刷新頁面：如果用戶刷新頁面，瀏覽器會向服務器請求 URL 中 hash 之前的部分（即 http://localhost:8080/）。服務器返回應用的入口頁面（通常是 index.html），然後 Vue Router 會根據當前的 hash（比如 #/clock）來渲染對應的組件。由於 hash 部分不會發送到服務器，所以這不會導致 404 錯誤。

## history mode 瀏覽歷史處理
ChatGPT：
HTML5 History API 提供的 pushState 和 replaceState 方法允許開發者在不重新加載頁面的情況下更改瀏覽器的地址欄 URL。這是通過向瀏覽器的會話歷史（session history）中添加新的記錄或修改當前記錄來實現的。這裏詳細介紹一下這兩個方法及其使用場景：
pushState 和 replaceState
pushState 方法：此方法可以向歷史記錄棧添加一個新的記錄。當呼叫此方法並指定一個新的 URL 時，該 URL 會顯示在瀏覽器的地址欄中，但瀏覽器不會向該地址發送請求，頁面也不會重新加載。這允許單頁面應用（SPA）在用戶與應用互動時動態地改變 URL，而不需要從伺服器加載新頁面。
replaceState 方法：與 pushState 類似，replaceState 方法允許修改當前歷史記錄項目的 URL（以及可選的狀態對象）。調用此方法同樣不會導致頁面重新加載，也不會向伺服器發送請求。與 pushState 的不同之處在於，replaceState 不會在歷史記錄中添加新的記錄，而是替換當前的記錄。
popState 事件
當用戶點擊瀏覽器的前進或後退按鈕，或者使用 JavaScript 呼叫 history.back()、history.forward() 方法時，會觸發 popState 事件。應用可以監聽這個事件，根據歷史記錄的變化動態更新頁面內容，而不需要重新加載頁面。
通過結合使用 pushState、replaceState 以及監聽 popState 事件，開發者可以創建出既能動態響應 URL 變化又無需頁面重新加載的單頁面應用（SPA）。這樣的用戶體驗更接近於傳統的多頁面應用，同時又保持了 SPA 的快速響應和不重新加載的優點。

## 2024-04-27
公司 Node.js 太舊，deploy 失敗。而家用 '20.6.0' 再 push 一次。 
