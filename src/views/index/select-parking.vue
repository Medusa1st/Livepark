<template>
    <div id="selectParking-box" class="items-on-map" v-bind:style="{zIndex: $parent.bubbleSelectParkingZIndex}" v-show="$parent.isSelectParkingShow">
      <div id="selectParking-box-title">
        <h3>目的地信息</h3>
      </div>
      <div id="selectParking-box-info">
        <hr>
        <!--<div class="select-content">
          <p>地点：</p>
          <span>xxx路xxx号附近</span>
        </div>-->
        <div class="select-content">
          <p>终端编号：</p>
          <span>{{$parent.currentSelectedSN}}</span>
        </div>
        <div class="select-content">
          <p>当前空闲车位数：</p>
          <span>{{$parent.currentRemainNum}}</span>
        </div>
      </div>
      <div id="selectParking-box-select">
        <hr>        
        <h4>请选择一个停车位</h4>
        <div class="select-content" v-for="n of $parent.currentRemainNum">
          <p>车位号：<span>{{$parent.currentSelectedSN}}-{{n}}</span></p>
          <input type="radio" :name="$parent.currentSelectedSN + '-' + n" :value="$parent.currentSelectedSN + '-' + n" v-model="$parent.pickedParkingSN" @click.stop="$parent.parkingPicked"/>
        </div>
        <!-- <div class="select-content">
          <p>车位号：<span>{{$parent.currentSelectedSN}}-2</span></p>
          <input type="radio" name="031-101-2" value="031-101-2" v-model="$parent.pickedParkingSN" @click.stop="$parent.parkingPicked"/>
        </div> -->
      </div>
      <div id="selectParking-box-price">
        <hr>
        <h4>目的地停车价格</h4>
        <div class="select-content">        
          <p>6:00 — 18:00</p>
          <span>免费2小时<br>超过10元/小时</span>
        </div>
        <div class="select-content">
          <p>18:00 — 次日6:00</p>
          <span>5元/小时</span>    
        </div>
      </div>
  </div>
</template>

<script>
  export default{
    name: 'select-parking'
  }
</script>

<style scoped>
#selectParking-box{width:18rem; border-radius: 0.5rem; top: 50%;left: 50%;margin-left: -9rem;margin-top: -50%;background-color: #f2f2f2;text-align: center;}
#selectParking-box .select-content{display: flex; justify-content: space-between; margin: 0.5rem 1rem;}
#selectParking-box .select-content p{font-size: 1rem;}
#selectParking-box .select-content span{font-size: 0.8rem; color: blue}
#selectParking-box-title h3{ margin: 3px auto;}
#selectParking-box-info{margin: 0 0.6rem;}
#selectParking-box-select,#selectParking-box-price{margin: 0 0.6rem;}
#selectParking-box-select h4,#selectParking-box-price h4{margin: 4px;}
</style>