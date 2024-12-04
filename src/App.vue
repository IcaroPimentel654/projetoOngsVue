<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>

body {
    margin: 0;
    padding: 0;
    background-color: #2C3E50; 
    color: #ECF0F1;
}

#app {
  font-family: Arial, sans-serif;
}
.navbar {
  background-color: #007BFF;
  padding: 10px;
  text-align: center;
}
.nav-link {
  margin: 0 10px;
  color: #fff;
  text-decoration: none;
  font-size: 18px;
}
.nav-link:hover {
  text-decoration: underline;
}
</style>
