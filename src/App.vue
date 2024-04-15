<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/clock">Clock</router-link> |
    <router-link to="/minesweeper">Minesweeper</router-link>
  </nav>
  <router-view/>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font-family: 'Courier New', Courier, monospace;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.container {
  width: 100vw;
  display: flex;
  justify-content: center;
}
</style>
