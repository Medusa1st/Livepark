<template>
  <div id="app1">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app1'
}
</script>

<style lang="sass">
  @import 'config'
  @import 'base/base'
  .fade-enter-active,
  .fade-leave-active
    transition: all .2s ease
  .fade-enter,
  .fade-leave-active
    opacity: 0
</style>
