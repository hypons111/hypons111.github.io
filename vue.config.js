const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/' // 指定應用中所有資源的基本路徑。確保應用能夠正確地找到其依賴的靜態資源（如 JavaScript 檔、CSS 檔以及圖片等）
})
