<template>
  <div id="cp-profile">
    <div class="page-title">
      <img class="backto-pic" src="../../assets/back-to-arrow.png" @click="$router.push('/')">
      <p>{{ title }}</p>   
    </div>  
    <div class="profile-info-items">
      <div id="profile-info-photo">
        <p>头像</p>
        <img src="../../assets/test-account-photo-1.jpg">
      </div>
      <hr>
      <div id="profile-info-nickname">
        <p>昵称</p>
        <p>城市乐泊</p>
      </div>
      <hr>
      <div id="profile-info-account">
        <p>账号</p>
        <p>LivePark</p>
      </div>
      <hr>
      <div id="profile-info-phonenumber">
        <p>手机号</p>
        <p>138****5678</p>
      </div>
      <hr>
      <div id="profile-info-carnumber">
        <p>车牌号</p>
        <p>沪AB1234</p>
      </div>
      <hr>
    </div>
    <!-- <router-link to="/">to index</router-link> -->
    <!-- <div style="text-align: center;margin: 3rem 0;">
      <button @click="" style="width:70%;height:3rem;">切换用户,仅供测试使用</button>   
    </div> -->

  </div>
</template>

<script>
  export default {
    name: 'profile',
    data: function() {
      return {
        title: '个人信息'
      }
    }
  }
</script>

<style lang="scss">
  .page-title{
    padding: 0.8rem 0;
    margin-bottom: 1rem; 
    background-color: LightGray;
  }
  .page-title img{
    width: 0.5rem;
    height: 0.875rem;
    // float: left;
    position: absolute;
    margin: 0 1rem;
  }
  .page-title p{
    font-size: 1rem;
    text-align: center;
  }
  .profile-info-items{
    padding: 0 0.8rem;
  }

  .profile-info-items img{
    width: 3rem;
    height: 3rem;
  }
  .profile-info-items div{
    margin: 1rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .profile-info-items div p:first-child{
    font-size: 1rem;
  }
  .profile-info-items div p:last-child{
    // color:#efefef;
    font-size: 0.8rem;
  }
</style>