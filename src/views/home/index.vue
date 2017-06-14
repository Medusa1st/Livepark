<template>
  <div id="cp-home">
    <p>{{ msg }}</p>
    <router-link to="/">to index</router-link>
    <button @click="$router.push('/')">to inde page</button>
    <button @click="toIndexPage">to inde page 2</button> 
  </div>
</template>

<script>
  export default {
    name: 'home',
    data: function() {
      return {
        msg: 'nihao'
      }
    },
    methods: {
      toIndexPage: function() {
        this.$router.push({
          path: '/'
        })
      }
    }
  }
</script>

<style lang="sass">
  #cp-home
    p
      color: red
      font-size: 10em
</style>