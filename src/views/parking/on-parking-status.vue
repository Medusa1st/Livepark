<template>
    <div id="cp-on-parking-status">
      <pay></pay>
      <div class="page-title">
        <p>{{ title }}</p>   
      </div>
      <div class="on-parking-status-timer">
        <p>停车时长</p>
        <p>{{indicatedTime}}</p>
        <p>当前费用：<span>0.0</span>元</p>
        <!-- <p>您停车的地点位于：<span>xxx路xxx号</span>附近</p> -->
        <p>车位号：<span>031-101-1</span></p>
      </div>  
      <div class="on-parking-status-button" @click="stopParking">结束停车</div>
    </div>
</template>

<script>
import Pay from '../pay/pay.vue'
    export default{
        name: 'on-parking-status',
        data: function(){
            return{
                title: '停车信息',
                startTime: 0,
                indicatedTime: '',
                countInterval: null,
                cost: '0.00'
            }
        },
        components: {
          Pay
        },
        mounted: function(){
            this.startTime = new Date().getTime();
            this.indicatedTime = '00 : 00 : 00 ';

            this.countInterval = setInterval(() => {
              let currentTime = new Date().getTime();
              let spendTime = currentTime - this.startTime;
              let remainTime = Math.round(spendTime/1000);
              if(remainTime >= 0){
                let calcHour = parseInt(remainTime/3600);
                if(calcHour < 10){calcHour = '0' + calcHour;}
                let calcMinute = parseInt((remainTime % 3600)/60);
                if(calcMinute < 10){calcMinute = '0' + calcMinute;}
                let calcSecond = (remainTime % 3600) % 60;
                if(calcSecond < 10){calcSecond = '0' + calcSecond;}
                this.indicatedTime = calcHour + ' : ' + calcMinute + ' : ' + calcSecond;
              }else{
                //操作等待超时
                clearInterval(this.countInterval);
                alert('计算异常');
              }
            },1000)
        },
        methods: {
          stopParking: function(){
            this.$children[0].isPaymentShow = true;
            this.$children[0].onPrePayStatus = false;
            this.$children[0].onEndPayStatus = true;           
          }
        }
    }
</script>

<style lang="scss">
  #cp-on-parking-status{} 
  .page-title{padding: 0.8rem 0; margin-bottom: 1rem; background-color: LightGray; } 
  .page-title img{width: 0.5rem; height: 0.875rem; position: absolute; margin: 0 1rem; }
  .page-title p{font-size: 1rem; text-align: center; } 

  .on-parking-status-timer{width: 21rem; height: 12rem;text-align: center;margin: 2rem auto;background-color: #fff;border-radius: 0.5rem;}
  .on-parking-status-timer p:nth-child(1){font-size: 1.3rem; line-height: 3rem;}
  .on-parking-status-timer p:nth-child(2){font-size: 3.5rem; line-height: 3.5rem;}
  .on-parking-status-timer p:nth-child(3){font-size: 1rem; line-height: 3rem;}
  .on-parking-status-button{width: 21rem; height: 3rem;text-align: center;line-height:3rem;font-size: 1rem;background-color: #FF3030;color: #fff;margin: 2rem auto;border-radius: 0.5rem;}
</style>   