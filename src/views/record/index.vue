<template>
  <div id="cp-record">
    <div class="page-title">
      <img class="backto-pic" src="../../assets/back-to-arrow.png" @click="$router.push('/')">
      <p>{{ title }}</p>   
    </div>  
    <div class="record-info-items">
      <div>
        <p>车位号：<span>031-101-2</span></p>
        <p>时段：<span>2017.5.1 12:34:55</span> 至 <span>2017.5.1 13:05:58</span></p>
        <p>时长：<span>31分03秒</span></p>
        <p>消费：<span>¥5.00 </span></p>
        <hr>
      </div>    
      <div>
        <p>车位号：<span>097-053-1</span></p>
        <p>时段：<span>2017.4.21 08:12:05</span> 至 <span>2017.4.21 13:21:30</span></p>
        <p>时长：<span>05时09分25秒</span></p>
        <p>消费：<span>¥45.00 </span></p>
        <hr>
      </div>  
      <div>
        <p>车位号：<span>131-067-1</span></p>
        <p>时段：<span>2017.4.10 18:12:33</span> 至 <span>2017.4.10 20:08:33</span></p>
        <p>时长：<span>01时56分00秒</span></p>
        <p>消费：<span>¥15.00 </span></p>
        <hr>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'record',
    data: function() {
      return {
        title: '停车记录'
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
  .record-info-items{
    padding: 0 0.8rem;
    font-size: 0.8rem;
  }
  .record-info-items div{
    margin-bottom: 0.5rem;
  }
</style>