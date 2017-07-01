<template>
    <div id="cp-pay" v-show="isPaymentShow">
      <div class="pay-box">
        <p class="pay-title">支付</p>
        <hr>
        <p class="pay-to">乐派停车</p>
        <p class="pay-number">¥{{$parent.cost}}</p>
        <hr>
        <div class="pay-mode">
          <img src="../../assets/pay-logo.png" alt="">
          <p>支付方式：账户余额</p>
        </div>
        <hr>
        <div class="pay-button" @click="payOrder">确认支付</div>
      </div>
      <div class="curtain" @click="isPaymentShow=false"></div>
    </div>
</template>

<script>
  export default{
    name: 'pay',
    data(){
      return{
        isPaymentShow: false,
        onPrePayStatus: false,
        onEndPayStatus: false
      }
    },
    methods: {
      payOrder(){
        alert('支付成功');
        this.isPaymentShow = false;
        if(this.onPrePayStatus){   
          // clearInterval(this.countDownInterval);
          this.$parent.isPayFinished = true;
          this.$parent.toDoButtonName = '到达车位';
          this.$parent.indicatedInfo = '请在以下时间内完成【到达车位】或【取消停车】操作，超时将自动取消停车。'
        }else if(this.onEndPayStatus){
          this.$router.push('/');
        }
      }
    }
  }
</script>

<style scoped>
#cp-pay{
  position: absolute; 
  top: 0;
  left: 0;
  height: 100%;width: 100%; 
  display:-webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex; 
  /*align-items: center;*/
  /*justify-content: center;*/

}
.curtain{position: absolute; z-index:1; height: 100%;width: 100%;background-color:#000; opacity:0.5;}
.pay-title{font-size: 1.3rem;font-weight: bold;}
.pay-number{font-size: 2.5rem;}
.pay-box{position: absolute; top: 50%; left: 50%; margin-top: -10rem; margin-left: -9rem; z-index:2; width:18rem;border-radius: 0.5rem;background-color: #f2f2f2;text-align: center;padding: 1rem;}
.pay-mode{display: flex; align-items: center}
.pay-mode img{width: 2.1rem; height: 1.8rem; margin: 0 1rem;}
.pay-button{ width: 90%; height: 2.5rem; line-height: 2.5rem; border-radius: 0.5rem; margin:0 auto; background: limegreen; color: #fff;}
</style>