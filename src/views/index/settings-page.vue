<template>
  <div id="settings-page" v-bind:style="{left: $parent.settingsPageStyleLeft}">
    <div class="profile-photo-box">
      <img v-bind:src="$parent.profilePhotoUrl" style="width:100%;height:100%;">
    </div>
    <div class="settings-page-button" @click.stop="$parent.linkToProfile">
      <img class="indicated-pic-profile" v-bind:src="$parent.profilePic">
      <div class="button-title">个人信息</div>
      <img class="goto-pic" v-bind:src="$parent.goToArrowPic">
    </div>
    <div class="settings-page-button" @click.stop="$parent.linkToRecord">
      <img class="indicated-pic-record" v-bind:src="$parent.recordPic">
      <div class="button-title">停车记录</div>
      <img class="goto-pic" v-bind:src="$parent.goToArrowPic">
    </div>
  </div>
</template>

<script>
  export default{
    name: 'settings-page'
  }
</script>

<style scoped>
#settings-page{width:80%; height: 100%; padding-left: 0.625rem; position: absolute; z-index: 100; top:0; font-size: 1.0625rem;background-color: #f2f2f2; transition: left .2s linear; border-radius: 0.625rem}
.settings-page-button{width: 90%; height: 3.125rem; border-top:1px solid limegreen;border-bottom:1px solid limegreen; margin:1.25rem auto;line-height: 3.125rem; display: flex; align-items: center;}
.settings-page-button img:first-child{margin: 0 0.5rem; width: 1.5625rem; height: 1.5625rem;}
.settings-page-button .button-title{width:80%;}
.settings-page-button .goto-pic{width: 0.5rem; height: 0.875rem; float: right; margin: 0 0.5rem;}
.profile-photo-box{width:6.25rem;height:6.25rem;margin:3.125rem auto;border-radius:3.125rem;overflow:hidden;}
</style>