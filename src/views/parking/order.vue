<template>
    
    <div id="cp-order">
      <pay></pay>
      <div class="page-title">
        <img class="backto-pic" src="../../assets/back-to-arrow.png" @click="backToPage">
        <p>{{ title }}</p>   
      </div>      
      <div class="ready-parking-info">
        <p class="info-title">您的预约信息</p> 
        <div>
          <p class="info-name">车位号</p>
          <span class="serial-number">{{$route.params.sn}}</span>
        </div>
        <div>
          <p class="info-name">车牌号</p>
          <span class="serial-number">{{$route.params.pn}}</span>
        </div>
        <p class="price-info">预付款费用：<span>10元</span></p>
        <hr>
      </div>
      <div class="wait-user-operation">
        <p v-show="isPayFinished">{{aftePayInfo}}</p>
        <p>{{indicatedInfo}}</p>
        <p>{{indicatedTime}}</p>
      </div>  
      <div class="ready-parking-buttons">
            <div @click="startPark">{{toDoButtonName}}</div>
            <div @click="cancelPark">取消停车</div>
      </div>
    </div>
</template>

<script>
import Pay from '../pay/pay.vue'

    export default{
        name: 'order',
        data: function(){
            return{
                title: '准备停车',
                startTime: null,
                actualWaitTime: 600000,
                indicatedTime: '',
                countDownInterval: null,
                cost: '10.00',
                isPayFinished: false,
                aftePayInfo: '您的预付款已支付成功!',
                toDoButtonName: '预付款停车',
                indicatedInfo: '请在以下时间内完成【预付款停车】或【取消停车】操作，超时将自动取消停车。',

            }
        },
        components: {
          Pay
        },
        mounted: function(){
            let actualWaitSec = this.actualWaitTime/1000;
            this.indicatedTime = parseInt(actualWaitSec/60) + ' 分 ' + (actualWaitSec % 60) +' 秒';

            this.startTime = new Date().getTime();
            this.countDownInterval = setInterval(() => {
              let currentTime = new Date().getTime();
              let spendTime = currentTime - this.startTime;
              let remainTime = Math.round((this.actualWaitTime - spendTime)/1000);
              if(remainTime >= 0){
                this.indicatedTime = parseInt(remainTime/60) + ' 分 ' + (remainTime % 60) +' 秒';
              }else{
                //操作等待超时
                clearInterval(this.countDownInterval);
                this.cancelPark();
              }
            },1000)
        },
        methods: {
          backToPage: function(){
            clearInterval(this.countDownInterval);
            this.$router.push('/');
          },
          startPark: function(){
            switch(this.toDoButtonName){
              case '预付款停车':
                this.$children[0].isPaymentShow = true;
                this.$children[0].onPrePayStatus = true;
                this.$children[0].onEndPayStatus = false;
                break;
              case '到达车位':
                this.$router.push({
                path: '/on-parking-status/' + this.$route.params.sn +'/'+ this.$route.params.pn});
                break;
            }




          },
          cancelPark: function(){
            this.$router.push({
              path: '/'
            })
          }
        }
    }
</script>

<style scoped>
  #cp-order{position:fixed; width:100%;height:100%;} 
  .page-title{padding: 0.8rem 0; margin-bottom: 1rem; background-color: LightGray; } 
  .page-title img{width: 0.5rem; height: 0.875rem; position: absolute; margin: 0 1rem; }
  .page-title p{font-size: 1rem; text-align: center; } 

  table,tr,th,td{font-size: 1rem; margin: 1rem auto; width: 20rem; height: 3rem; border: 1px solid #000; text-align: center; }

  .ready-parking-info{text-align: center;margin: 1rem 1rem 1rem;} 
  .info-title{font-size: 1.5rem; margin: 1rem auto; color: #000}
  .info-name{font-size: 1rem; margin-top: 0.5rem; color: #888888}
  .serial-number{font-size: 1.3rem; color: blue;font-weight: bold;}
  .price-info{margin-top: 0.5rem;color: #888888;}

  .wait-user-operation{text-align: center;margin: 1.5rem 1rem;} 
  .wait-user-operation p:nth-child(1){font-size: 1rem;margin: 1rem auto;color: green;font-weight: bold;}
  .wait-user-operation p:nth-child(2){font-size: 1rem;margin: 1rem auto;}
  .wait-user-operation p:nth-child(3){font-size: 3rem;margin: 1rem auto;}
  .ready-parking-buttons{display: flex; justify-content: space-between}
  .ready-parking-buttons div{width:10rem; height:3rem; margin: 0rem 1rem;text-align: center; line-height: 3rem;border-radius: 0.5rem;}
  .ready-parking-buttons div:nth-child(1){background-color: limegreen;color: #fff}
  .ready-parking-buttons div:nth-child(2){background-color: #FF3030;color: #fff}
</style>   