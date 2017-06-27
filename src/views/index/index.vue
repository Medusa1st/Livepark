<template>
<div>
    <div id="container" @click="onClickContainer">
      <div id="map-box"></div>
      <div id="main-box" class="items-on-map" v-bind:style="{backgroundColor:mainButtonBgColor, color:mainButtonTextColor, borderColor: mainButtonBorderColor , zIndex: bubbleSelectParkingZIndex}" @click.stop="toPark">
        <p>{{mainButtonText}}</p>
      </div>
      <div id="settings-box" class="items-on-map">
        <img v-bind:src="settingsBoxPic" @click.stop="getSettings">
      </div>
      <div id="geolocation-box" class="items-on-map">
        <img v-bind:src="aimCenterPic" @click.stop="getLocation">
      </div>
      <div id="locating-box" class="items-on-map" v-show="isLocating">
        <img v-bind:class="{rotate: isLocating}" v-bind:src="locatingPic">
      </div>
      <div id="centerMarker" class="items-on-map" v-bind:style="{top:calcTop + 'px',left:calcLeft + 'px'}">
            <img v-bind:src="centerMarkerPic"
           v-bind:style="{width:centerMarkerWidth + 'px',height:centerMarkerHeight + 'px'}"
           v-show="isCenterMarkerShow"/>         
      </div>
      
      <transition name="fade">
        <div id="curtain" v-show="isCurtainShow"></div>
      </transition>
    </div>
    <div id="settings-page" v-bind:style="{left: settingsPageStyleLeft}">
      <div class="profile-photo-box">
        <img v-bind:src="profilePhotoPic" style="width:100%;height:100%;">
      </div>
      <div class="settings-page-button" @click.stop="linkToProfile">
        <img class="indicated-pic-profile" v-bind:src="profilePic">
        <div class="content-message">个人信息</div>
        <img class="goto-pic" v-bind:src="goToArrowPic">
      </div>
      <div class="settings-page-button" @click.stop="linkToRecord">
        <img class="indicated-pic-record" v-bind:src="recordPic">
        <div class="content-message">停车记录</div>
        <img class="goto-pic" v-bind:src="goToArrowPic">
      </div>
    </div>
    <div id="selectParking-box" class="items-on-map" v-bind:style="{zIndex: bubbleSelectParkingZIndex}" v-show="isSelectParkingShow">
        <div id="selectParking-box-title">
          <h2>智能停车终端信息</h2>
        </div>
        <div id="selectParking-box-info">
          <hr>
          <div class="selected-parking-info">
            <p>地点：</p>
            <p>xxx路xxx号附近</p>
          </div>
          <div class="selected-parking-info">
            <p>编号：</p>
            <p>031-101</p>
          </div>
          <div class="selected-parking-info">
            <p>当前空闲车位数：</p>
            <p>2</p>
          </div>
        </div>
        <div id="selectParking-box-select">
          <hr>        
          <h3>请选择一个停车位：</h3>
          <div class="selected-parking-info">
            <p>车位号：<span>031-101-1</span></p>
            <input type="radio" name="parkingSN" value="031-101-1" v-model="pickedParkingSN" @click.stop="parkingPicked"/>
          </div>
          <div class="selected-parking-info">
            <p>车位号：<span>031-101-2</span></p>
            <input type="radio" name="parkingSN" value="031-101-2" v-model="pickedParkingSN" @click.stop="parkingPicked"/>
          </div>
        </div>
    </div>
</div>
</template>

<script>
const pinGreenSolid = require('../../assets/pin-green-solid.png');
const pinBlueSolid = require('../../assets/pin-blue-solid.png');
const pinRed = require('../../assets/pin-red.png');
const aimCenter = require('../../assets/aim-center.png');
const settings = require('../../assets/settings.png');
const locating = require('../../assets/locating.png');
// const profilePhoto = require('../../assets/profile-photo.png');
const profilePhoto = require('../../assets/test-account-photo-1.jpg');
const profile = require('../../assets/profile.png');
const record = require('../../assets/record.png');
const goToArrow = require('../../assets/go-to-arrow.png');
export default {
  name: 'index',
  data(){
    return {
      map: null,
      geolocation: null,
      isGeolocationOK: false,
      isLocating: false,
      locatingInterval: null,
      isMapAutoPan: true,
      aimCenterPic: aimCenter,
      settingsBoxPic: settings,
      locatingPic: locating,
      profilePhotoPic: profilePhoto,
      profilePic: profile,
      recordPic: record,
      goToArrowPic: goToArrow,
      centerMarkerPic: pinRed,
      mainButtonBgColor: '#fff',
      mainButtonTextColor: '#000',
      mainButtonText: '选择地点',
      mainButtonBorderColor: 'limegreen',
      marker: null,
      searchAddress: null,
      centerMarkerWidth: 48,
      centerMarkerHeight: 48,
      calcTop: null,
      calcLeft: null,
      isCenterMarkerShow: false, 
      isSelectParkingShow: false,
      settingsPageStyleLeft: '-83%',
      isCurtainShow: false,
      route_lines: [],
      //window onload map center
      gpsPos: {lat: '', lng: ''},
      //navigator start position
      navStartPos: null,
      //Gps List
      parkGPSList: [],
      userSelectMarker: null,
      driving: null,
      pickedParkingSN: null,
      bubbleSelectParkingZIndex: 10,
      isBookingStatus: false,
      bookingTimeout: null
    }
  },
  mounted: function() {
    console.log('Vue of index mounted!');

    // promise es6
    axios.get('static/position.json').then(({ data }) => {  
      this.parkGPSList = data;
      for (let i = 0; i < this.parkGPSList.length; i++) {
        this.addTargetMarker(this.parkGPSList[i].lat, this.parkGPSList[i].lng);
      };
    });

    // this.init()

    this.calcTop = this.$el.clientHeight/2 - this.centerMarkerHeight+5;
    this.calcLeft= this.$el.clientWidth/2 - this.centerMarkerWidth/2;

    //经度 Longitude
    //纬度 Latitude
    this.map = new AMap.Map('map-box',{
      resizeEnable: true,
      zoom: 15
    });

    //******************** Start of Geolocation ***************************
    this.map.plugin(['AMap.Geolocation'], () => {
        this.geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 3000,          //超过10秒后停止定位，默认：无穷大buttonDom
            buttonDom: document.getElementById('geolocation-box'),
            buttonOffset: new AMap.Pixel(0, 0), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: false, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'RB',
            panToLocation: false,  //定位成功后将定位到的位置作为地图中心点
            showCircle: false
        });
        this.map.addControl(this.geolocation);
        (() => {
          this.geolocation.getCurrentPosition();
          this.isLocating = true;
        })();
        this.locatingInterval = setInterval(() => {
          this.geolocation.getCurrentPosition();
          this.isLocating = true;
        },10000);
        // this.geolocation.getCurrentPosition();
        // this.isLocating = true;
        // this.geolocation.watchPosition(); //使用浏览器定位接口监控当前位置，移动端有效

        AMap.event.addListener(this.geolocation, 'complete', (data) => {
          this.isGeolocationOK = true;
          this.isLocating = false;
        
          /*var str=['定位成功'];
          str.push('经度：' + data.position.getLng());          
          str.push('纬度：' + data.position.getLat());         
          if(data.accuracy){
               str.push('精度：' + data.accuracy + ' 米');
          }//如为IP精确定位结果则没有精度信息
          str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
          alert(str.join("\n"));*/

          this.gpsPos.lng = data.position.getLng();
          this.gpsPos.lat = data.position.getLat();
          this.navStartPos = this.gpsPos;
          if(this.userSelectMarker === null){
            this.addUserSelectMarker(this.gpsPos.lat, this.gpsPos.lng);
          };
            
          if(this.isMapAutoPan){
            this.map.panTo(data.position);
            this.map.setZoom(16);
            this.userSelectMarker.setPosition(new AMap.LngLat(this.gpsPos.lng, this.gpsPos.lat));
            this.route_lines = [];
            this.driving.clear();
            this.mainButtonBorderColor = 'limegreen';
            this.mainButtonBgColor = '#fff';
            this.mainButtonTextColor = '#000';
            this.mainButtonText = '选择地点';
            this.isCenterMarkerShow = false;
            this.userSelectMarker.show();
            this.isMapAutoPan = false;
          };
        
        });//返回定位信息
        AMap.event.addListener(this.geolocation, 'error', (data) => {
          this.isGeolocationOK = false;
          this.isLocating = false;
          if(this.userSelectMarker === null){
            this.addUserSelectMarker(this.map.getCenter().lat, this.map.getCenter().lng);
          };
          if(data.message === 'Geolocation permission denied.'){
            alert("请打开“定位服务”来允许“城市乐泊”确定您的位置");
          }else{
            console.log(data.message);
          }
        });//返回定位出错信息
    });
    //********************** End of Geolocation ***************************
   
    AMap.service('AMap.Driving',() => {
      this.driving = new AMap.Driving({map: this.map});
    });
    
    this.map.on('dragstart', () => {
        if(this.route_lines.length === 0){
          this.isCenterMarkerShow = true;
          this.userSelectMarker.hide();
        }
    });
    this.map.on('dragend', () => {
        if(this.route_lines.length === 0){
          this.userSelectMarker.setPosition(this.map.getCenter());
          setTimeout(() => {
            this.isCenterMarkerShow = false;
            this.userSelectMarker.show();
          }, 0);
        }
    });
    this.map.on('click', (event) => {
        this.route_lines = [];
        this.driving.clear();
        this.mainButtonBorderColor = 'limegreen';
        this.mainButtonBgColor = '#fff';
        this.mainButtonTextColor = '#000';
        this.mainButtonText = '选择地点';
        // alert('您点击的位置为:[' + '纬度' + event.lnglat.lat + ','
        //                          + '经度' + event.lnglat.lng + ']');
    });  
  },
  methods:{
    onClickContainer: function(){
      this.settingsPageStyleLeft='-83%';
      this.bubbleSelectParkingZIndex = 10;
      this.isCurtainShow=false;
      this.isSelectParkingShow=false;
      this.pickedParkingSN = null;
      if(this.route_lines.length){
        this.mainButtonBorderColor = 'limegreen';
        this.mainButtonBgColor = 'limegreen';
        this.mainButtonTextColor = '#FFF';
        this.mainButtonText = '选择车位';
      }else{
        this.mainButtonBorderColor = 'limegreen';
        this.mainButtonBgColor = '#fff';
        this.mainButtonTextColor = '#000';
        this.mainButtonText = '选择地点';        
      }
    },
    getSettings : function(event){
      // event.stopPropagation();
      this.settingsPageStyleLeft = '-10px';
      this.isCurtainShow=true;
    },
    getLocation : function(){
      this.isLocating = true;
      this.isMapAutoPan = true;
    },
    addUserSelectMarker : function(lat,lng){
        let location = new AMap.LngLat(lng, lat);
        this.userSelectMarker = new AMap.Marker({
          map: this.map,
          position: location,
          icon: new AMap.Icon({            
            size: new AMap.Size(48, 48),
            image: pinRed,
            imageOffset: new AMap.Pixel(0, 0),
            imageSize: new AMap.Size(48, 48)
          }),
          offset: new AMap.Pixel(-24, -43)
        });
    },
    addTargetMarker : function(lat,lng) {
      let location = new AMap.LngLat(lng, lat);
      let marker = new AMap.Marker({
        map: this.map,
        position: location,
        icon: new AMap.Icon({            
          size: new AMap.Size(24, 33),
          image: pinBlueSolid,
          imageOffset: new AMap.Pixel(0, 0),
          imageSize: new AMap.Size(23, 33)
        }),
        offset: new AMap.Pixel(-12, -33)
      });
      marker.on('click',() => {
          this.userSelectMarker.show();
          this.isCenterMarkerShow = false;
          this.calcRoute(lat,lng);
          this.mainButtonBorderColor = 'limegreen';
          this.mainButtonBgColor = 'limegreen';
          this.mainButtonTextColor = '#FFF';
          this.mainButtonText = '选择车位';
      });
    },
    calcRoute : function(lat,lng){

      //清除所有路线
      // this.clearOverlay(route_lines);
      this.driving.clear();

      let start_lat = this.userSelectMarker.getPosition().lat;
      let start_lng = this.userSelectMarker.getPosition().lng;
      let stop_lat  = lat;
      let stop_lng  = lng;
   
      //AMap.DrivingPolicy.LEAST_TIME 最快捷模式
      //AMap.DrivingPolicy.LEAST_FEE  最经济模式
      //AMap.DrivingPolicy.LEAST_DISTANCE 最短距离模式
      //AMap.DrivingPolicy.REAL_TRAFFIC 考虑实时路况
      this.driving.setPolicy(AMap.DrivingPolicy.LEAST_TIME);
      this.driving.search(new AMap.LngLat(start_lng, start_lat), new AMap.LngLat(stop_lng, stop_lat), (status,result) => {
        if(status == 'complete'){
          this.route_lines = result.routes;
        }else if(status == 'error'){
          alert(result);
        }else if(status == 'error'){
          alert('检索无结果');
        }
      });
    },
    linkToProfile: function(){
      if(this.locatingInterval){clearInterval(this.locatingInterval);};
      this.$router.push({
        path: '/profile'
      })
    },
    linkToRecord: function(){
      if(this.locatingInterval){clearInterval(this.locatingInterval);};
      this.$router.push({
        path: '/record'
      })
    },
    parkingPicked: function(){
      this.mainButtonBorderColor = 'limegreen';
      this.mainButtonBgColor = 'limegreen';
      this.mainButtonTextColor = '#FFF';
      this.mainButtonText = '前往停车';
    },
    toPark: function(){
      if(this.isBookingStatus){
        let isCancelBooking = confirm('是否取消预约？');
        if(isCancelBooking){
        this.isBookingStatus = false;
        this.pickedParkingSN = null;
        this.mainButtonBorderColor = 'limegreen';
        this.mainButtonBgColor = 'limegreen';
        this.mainButtonTextColor = '#FFF';
        this.mainButtonText = '选择车位';
          clearTimeout(this.bookingTimeout);
        }
      }else if(this.route_lines.length){
        if(this.pickedParkingSN){
          this.isSelectParkingShow = false;
          this.isCurtainShow = false;
          this.mainButtonBorderColor = 'Orange';
          this.mainButtonBgColor = 'Orange';
          this.mainButtonTextColor = '#FFF';
          this.mainButtonText = '已预约车位';
          this.isBookingStatus = true;
          this.bookingTimeout = setTimeout(() => {
            this.isBookingStatus = false;
            if(this.locatingInterval){clearInterval(this.locatingInterval);};
            this.$router.push({
              path: '/ready-to-park'
            });
          },10000)

        }else{
          this.bubbleSelectParkingZIndex = 51;
          this.isSelectParkingShow = true;
          this.isCurtainShow = true;
        }
      }
    }
  }
}
</script>

<style lang="scss">
// @import 'animations/_rotate';

*{margin:0; padding:0;}
body{width:100%; height:100%;}
#container{position: relative;}
#map-box{width:100vw; height: 100vh; z-index: 1;}
.items-on-map{position: absolute; z-index: 10;}
#main-box{width: 10rem;height: 2.1875rem; line-height: 2rem; bottom: 1.75rem; left: 50%; margin-left: -5rem; font-size: 0.9375rem; text-align: center; border: 2px solid;border-radius: 1.25rem;}
#settings-box{bottom: 1.6rem; left: 1rem;}
#settings-box img{width: 2rem; height: 2rem;}
#geolocation-box{bottom: 1.7rem; right: 1rem;}
#geolocation-box img{width: 2.2rem; height: 2.2rem;}
#locating-box{bottom: 4.2rem; right: 1.2rem;}
#locating-box img{width: 1.8rem; height: 1.6rem;}
#settings-page{width:80%; height: 100%; padding-left: 0.625rem; position: absolute; z-index: 100; top:0; font-size: 1.0625rem;background-color: #f2f2f2; transition: left .2s linear; border-radius: 0.625rem}
.settings-page-button{width: 90%; height: 3.125rem; border-top:1px solid limegreen;border-bottom:1px solid limegreen; margin:1.25rem auto;line-height: 3.125rem; display: flex; align-items: center;}
.settings-page-button img:first-child{margin: 0 0.5rem; width: 1.5625rem; height: 1.5625rem;}
.settings-page-button .content-message{width:80%;}
.settings-page-button .goto-pic{width: 0.5rem; height: 0.875rem; float: right; margin: 0 0.5rem;}
.profile-photo-box{width:6.25rem;height:6.25rem;margin:3.125rem auto;border-radius:3.125rem;overflow:hidden;}

#selectParking-box{width:18rem; height:20rem;border: 1px solid limegreen; border-radius: 1rem; top: 50%;left: 50%;margin-left: -9rem;margin-top: -10rem;background-color: #f2f2f2;text-align: center;}
#selectParking-box .selected-parking-info{display: flex; justify-content: space-between; margin: 0.8rem 1rem;}
#selectParking-box p{font-size: 1rem}
#selectParking-box-title{height: 3rem; line-height: 3rem;}
#selectParking-box-title h2{ margin: 0 auto;}
#selectParking-box-info{height: 8rem; margin: 0 0.6rem;}
#selectParking-box-select{height: 9rem; margin: 0 0.6rem;}
#selectParking-box-select h3{margin: 10px;}

#curtain{width:100%; height: 100%; position: absolute; top:0; left: 0; z-index: 50; background-color:#000; opacity:0.5;}
#curtain.fade-enter-active, #curtain.fade-leave-active{transition: opacity .5s;}
#curtain.fade-enter, #curtain.fade-leave-active{opacity: 0;}
@keyframes rotate {
    0% {
        transform-origin: center;
        transform: none
    }
    100% {
        transform-origin: center;
        transform: rotate(360deg)
    }
}
.rotate{animation-name: rotate;animation-duration: 2s;animation-iteration-count: infinite;}
</style>
