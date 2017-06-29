<template>
    <div id="selectPlateNumber-box" class="items-on-map" v-bind:style="{zIndex: $parent.bubbleSelectParkingZIndex}" v-show="$parent.isSelectPlateNumberShow">
      <div id="selectPlateNumber-box-title">
        <h3>选择车牌号</h3>
      </div>
      <div id="selectPlateNumber-box-option">
        <hr>
          <p>您当前绑定的车牌号为：<br></p>
          <span><b>沪AB1234</b></span>
          <hr>
          <p>您还可以：</p>
          <div class="user-content" v-show="isNewPlateNumberShow">
          <select name="province" id="province" v-model="inputProvince">
            <option value="沪">沪</option>
            <option value="苏">苏</option>
            <option value="粤">粤</option>
            <option value="青">青</option>
            <option value="藏">藏</option>
            <option value="川">川</option>
            <option value="宁">宁</option>
            <option value="琼">琼</option>
            <option value="黑">黑</option>
            <option value="豫">豫</option>
            <option value="浙">浙</option>
            <option value="鲁">鲁</option>
            <option value="皖">皖</option>
            <option value="闽">闽</option>
            <option value="鄂">鄂</option>
            <option value="桂">桂</option>
            <option value="甘">甘</option>
            <option value="晋">晋</option>
            <option value="蒙">蒙</option>
            <option value="陕">陕</option>
            <option value="吉">吉</option>
            <option value="贵">贵</option>
          </select>
          <input type="text" name="user-plate-number" id="user-plate-number" @keyup="checkNumber" maxlength="6" v-model="inputUserPlateNumber">
          <button @click="saveNewPlateNumber" class="inner-button">保存</button>
          <button @click="cancelNewPlateNumber" class="inner-button">取消</button>
        </div>
          <div class="error-info" v-show="isErrorInfoShow">请输入正确的车牌号</div>
          <button class="add-plate-number-button" @click="addNewPlateNumber">新增车牌</button>
          <hr>
        <p>当前使用车牌：</p>
        <div class="option-content" v-for="(item,index) of userPlateNumberList">
          <span>{{item.plateNumber}}</span>
          <input v-model="userSelectIndex" type="radio" name="user-select" :value="index" :checked="item.isDefault">
        </div>        
      </div>
  </div>
</template>

<script>
  export default{
    name: 'select-plate-number',
    data(){
      return {
        userSelectIndex: 0,
        isNewPlateNumberShow: false,
        inputUserPlateNumber: '',
        inputProvince: '沪',
        userPlateNumberList: [
          {plateNumber: '沪AB1234', isDefault: true}
        ],
        isErrorInfoShow: false
      }
    },
    methods:{
      addNewPlateNumber(){
        this.isNewPlateNumberShow = true;
        this.inputUserPlateNumber = '';
      },
      cancelNewPlateNumber(){
        this.isNewPlateNumberShow = false;
        this.isErrorInfoShow = false;
      },
      saveNewPlateNumber(){
        let letterNum = this.inputUserPlateNumber.replace(/[^A-Z]+/ig,"").length
        let isFisrtLetter = this.inputUserPlateNumber.charAt(0).replace(/[^A-Z]+/ig,"").length == 1;
        console.log(isFisrtLetter);
        if(letterNum >= 1 && letterNum <= 3 && isFisrtLetter){
          this.isNewPlateNumberShow = false;
          this.isErrorInfoShow = false;
          this.userPlateNumberList.push({plateNumber: this.inputProvince + this.inputUserPlateNumber, isDefault: false});
        }else{
          this.isErrorInfoShow = true;
        }
      },
      checkNumber(e){
        this.inputUserPlateNumber = e.currentTarget.value.replace(/[\W]/g,'').toUpperCase();
      }
    }
  }

</script>

<style scoped>
#selectPlateNumber-box{width:18rem; border-radius: 0.5rem; top: 50%;left: 50%;margin-left: -9rem;margin-top: -50%;background-color: #f2f2f2;text-align: center;}
#selectPlateNumber-box-title h3{ margin: 3px auto;}
.option-content{display: flex; justify-content: space-between; margin: 0.8rem 1rem;}
#selectPlateNumber-box-option{margin: 0 0.6rem;}
#selectPlateNumber-box-option p{text-align: left;}
#selectPlateNumber-box-option span{color: blue;}
#province{
  width: 3rem;
  height: 2rem;
}
#user-plate-number{
  width: 7rem;
  height: 2rem;
  font-size: 1.5rem;
  text-align: center;
}
.inner-button{
  width: 3rem;
  height: 2rem;
}
.user-content{
  display: flex; justify-content: center; margin: 0.8rem 0.5rem 0.5rem;
}
.error-info{
  color: red;
  font-size: 0.6rem;
}
.add-plate-number-button{
  width: 60%;
  height: 2rem;
  margin: 0.5rem 0;
}
</style>