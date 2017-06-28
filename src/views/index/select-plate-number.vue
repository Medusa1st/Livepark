<template>
    <div id="selectPlateNumber-box" class="items-on-map" v-bind:style="{zIndex: $parent.bubbleSelectParkingZIndex}" v-show="$parent.isSelectPlateNumberShow">
      <div id="selectPlateNumber-box-title">
        <h3>选择车牌号</h3>
      </div>
      <div id="selectPlateNumber-box-option">
        <hr>
        <div class="option-content">
          <p>使用默认车牌</p>
          <input type="radio" name="default-number" value="default-number" checked="false" v-model="$parent.userPlateNumberOption">
        </div>
        <div class="tip-info" v-show="$parent.isTipInfoShow">您尚未注册车牌信息，请手动指定车牌号</div>
        <div class="option-content">
          <p>使用指定车牌</p>
          <input type="radio" name="user-select" value="user-select" v-model="$parent.userPlateNumberOption">
        </div>
        <div class="user-content" v-show="$parent.userPlateNumberOption == 'user-select'">
          <select name="province" id="province">
            <option value="shanghai">沪</option>
            <option value="jiangsu">苏</option>
            <option value="guangdong">粤</option>
            <option value="qinghai">青</option>
            <option value="xizang">藏</option>
            <option value="sichuan">川</option>
            <option value="ningxia">宁</option>
            <option value="hainan">琼</option>
            <option value="heilongjiang">黑</option>
            <option value="heinan">豫</option>
            <option value="zhejiang">浙</option>
            <option value="shandong">鲁</option>
            <option value="anhui">皖</option>
            <option value="fujian">闽</option>
            <option value="hebei">鄂</option>
            <option value="guangxi">桂</option>
            <option value="gansu">甘</option>
            <option value="shanxi">晋</option>
            <option value="neimenggu">蒙</option>
            <option value="shanxi">陕</option>
            <option value="jilin">吉</option>
            <option value="guizhou">贵</option>
          </select>
          <input type="text" name="user-plate-number" id="user-plate-number" @keyup="checkNumber">          
        </div>
        <div class="error-info" v-show="$parent.isErrorInfoShow">请输入正确的车牌号</div>
      </div>
  </div>
</template>

<script>
  export default{
    name: 'select-plate-number',
    methods:{
      checkNumber(e){
        e.currentTarget.value=e.currentTarget.value.replace(/[\W]/g,'');
        this.$parent.userPlateNumber = e.currentTarget.value;
      }
    }
  }

</script>

<style scoped>
#selectPlateNumber-box{width:18rem; border-radius: 0.5rem; top: 50%;left: 50%;margin-left: -9rem;margin-top: -9rem;background-color: #f2f2f2;text-align: center;}
#selectPlateNumber-box-title h3{ margin: 3px auto;}
#selectPlateNumber-box .option-content{display: flex; justify-content: space-between; margin: 0.8rem 1rem;}
#selectPlateNumber-box-option{margin: 0 0.6rem;}
#province{
  width: 3rem;
  height: 2rem;
}
#user-plate-number{
  width: 8rem;
  height: 2rem;
  font-size: 1.5rem;
  text-align: center;
}
.user-content{
  display: flex; justify-content: center; margin: 0.8rem 1rem 0.5rem;
}
.tip-info{
  color: #888888;
  font-size: 0.6rem;
  margin-bottom: 1rem;
}
.error-info{
  color: red;
  font-size: 0.6rem;
  margin-bottom: 1rem;
}
</style>