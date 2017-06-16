<template>
    <div id="cp-ready-to-parking">
      <div class="page-title">
        <img class="backto-pic" src="../../assets/back-to-arrow.png" @click="backToPage">
        <p>{{ title }}</p>   
      </div>  
      <div class="ready-parking-info">
        <p>智能停车终端检测到</p>
        <p>您已到达预约车位</p>
        <table>
          <tr>
            <th>车位号</th>
            <th>状态</th>
            <th>停入车辆牌号</th>
          </tr>
          <tr>
            <td id="serial-number">031-101-1</td>
            <td id="parking-status">已占用</td>
            <td id="serial-number">沪AB1234</td>
          </tr>
        </table>
      </div>
      <hr>
      <div class="wait-user-operation">
        <p>请在以下时间内完成【开始停车】或【取消停车】操作，超时将自动开始停车计时。</p>
        <p>{{indicatedTime}}</p>
      </div>
      
      <div class="ready-parking-buttons">
            <div @click="startPark">开始停车</div>
            <div @click="cancelPark">取消停车</div>
      </div>
    </div>
</template>

<script>
    export default{
        name: 'ready-to-parking',
        data: function(){
            return{
                title: '准备停车',
                startTime: null,
                actualWaitTime: 300000,
                indicatedTime: '',
                countDownInterval: null
            }
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
                this.startPark();
              }
            },1000)
        },
        methods: {
          backToPage: function(){
            clearInterval(this.countDownInterval);
            this.$router.push('/');
          },
          startPark: function(){
            clearInterval(this.countDownInterval);
            this.$router.push({
              path: '/on-parking-status'
            })            
          },
          cancelPark: function(){
            this.$router.push({
              path: '/'
            })
          }
        }
    }
</script>

<style lang="scss">
  #cp-ready-to-parking{} 
  .page-title{padding: 0.8rem 0; margin-bottom: 1rem; background-color: LightGray; } 
  .page-title img{width: 0.5rem; height: 0.875rem; position: absolute; margin: 0 1rem; }
  .page-title p{font-size: 1rem; text-align: center; } 

  table,tr,th,td{font-size: 1rem; margin: 1rem auto; width: 20rem; height: 3rem; border: 1px solid #000; text-align: center; }
  #serial-number{color: blue;font-weight: bold;}
  #parking-status{color: red;font-weight: bold;}
  .ready-parking-info{text-align: center;margin: 2rem 1rem;} 
  .ready-parking-info p:nth-child(1){font-size: 1rem; margin: 1rem auto;}
  .ready-parking-info p:nth-child(2){font-size: 1.5rem; margin: 1rem auto; color: green}
  .wait-user-operation{text-align: center;margin: 2rem 1rem;} 
  .wait-user-operation p:nth-child(1){font-size: 1rem;margin: 1rem auto;}
  .wait-user-operation p:nth-child(2){font-size: 3rem;margin: 1rem auto;}
  .ready-parking-buttons{display: flex; justify-content: space-between}
  .ready-parking-buttons div{width:10rem; height:3rem; margin: 0rem 1rem;text-align: center; line-height: 3rem;border-radius: 0.5rem;}
  .ready-parking-buttons div:nth-child(1){background-color: limegreen;color: #fff}
  .ready-parking-buttons div:nth-child(2){background-color: #FF3030;color: #fff}
</style>   