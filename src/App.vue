<template>
<div>
    <div id="container" @click="settingsPageStyleLeft='-83%';isCurtainShow=false">
      <div id="map-box"></div>
      <div id="main-box" class="items-on-map" v-bind:style="{backgroundColor:mainButtonBgColor, color:mainButtonTextColor}" @click="functionTBD">
        <p>{{mainButtonText}}</p>
      </div>
      <div id="tools-box" class="items-on-map">
        <img v-bind:src="aimCenterPic" @click="getCenter">
      </div>
      <div id="settings-box" class="items-on-map">
        <img v-bind:src="settingsBoxPic" @click="getSettings">
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
      <div class="settings-page-button" @click="functionTBD">
        <img class="indicated-pic-profile" v-bind:src="profilePic">
        <div class="content-message">个人资料</div>
        <img class="goto-pic" v-bind:src="goToArrowPic">
      </div>
      <div class="settings-page-button" @click="functionTBD">
        <img class="indicated-pic-record" v-bind:src="recordPic">
        <div class="content-message">停车记录</div>
        <img class="goto-pic" v-bind:src="goToArrowPic">
      </div>
    </div>
</div>
</template>

<script>
const pinGreenSolid = require('./assets/pin-green-solid.png');
const pinBlueSolid = require('./assets/pin-blue-solid.png');
const pinRed = require('./assets/pin-red.png');
const aimCenter = require('./assets/aim-center.png');
const settingsBox = require('./assets/settings.png');
const profilePhoto = require('./assets/profile-photo.png');
const profile = require('./assets/profile.png');
const record = require('./assets/record.png');
const goToArrow = require('./assets/go-to-arrow.png');
export default {
  name: 'app',
  data(){
    return {
      map: null,
      aimCenterPic: aimCenter,
      settingsBoxPic: settingsBox,
      profilePhotoPic: profilePhoto,
      profilePic: profile,
      recordPic: record,
      goToArrowPic: goToArrow,
      centerMarkerPic: pinRed,
      mainButtonBgColor: '#fff',
      mainButtonTextColor: '#000',
      mainButtonText: '选择地点',
      marker: null,
      searchAddress: null,
      centerMarkerWidth: 48,
      centerMarkerHeight: 48,
      calcTop: null,
      calcLeft: null,
      isCenterMarkerShow: false, 
      settingsPageStyleLeft: '-83%',
      isCurtainShow: false,
      route_lines: [],
      //window onload map center
      onLoadCenter: {lat: '31.305468476254635', lng: '121.50784492492676'},
      //navigator start position
      navStartPos: null,
      //Gps List
      parkGPSList: [
        {lat: '31.308071816223425',lng: '121.5029525756836' },
        {lat: '31.308035149962773',lng: '121.51102066040039'},
        {lat: '31.3022783700433',  lng: '121.50629997253418'},
        {lat: '31.304368451830978',lng: '121.51320934295654'},
        {lat: '31.293844235737975',lng: '121.50381088256836'},
        {lat: '31.31512980559464', lng: '121.51196479797363'},
        {lat: '31.309758448785676',lng: '121.52020454406738'},
        {lat: '31.31555143497141', lng: '121.49660110473633'},
        {lat: '31.282291914094',   lng: '121.51651382446289'},
        {lat: '31.373718178573974',lng: '121.44235610961914'},
        {lat: '31.258229203122266',lng: '121.57153129577637'},
        {lat: '31.16566270170272', lng: '121.33901596069336'},
        {lat: '31.30805348309488', lng: '121.48733139038086'}
      ],
      userSelectMarker: null,
      driving: null
    }
  },
  mounted: function(){
    console.log('Vue mounted!');
    let _this = this;

    this.calcTop = this.$el.clientHeight/2 - this.centerMarkerHeight;
    this.calcLeft= this.$el.clientWidth/2 - this.centerMarkerWidth/2;
    this.navStartPos = this.onLoadCenter;

    //经度 Longitude
    //纬度 Latitude
    this.map = new AMap.Map('map-box',{
      resizeEnable: true,
      zoom: 15,
      center: [this.onLoadCenter.lng, this.onLoadCenter.lat]
    });
   
    AMap.service('AMap.Driving',function(){
      _this.driving = new AMap.Driving({map: _this.map});
    });
  
    this.addUserGPSMarker(this.onLoadCenter.lat, this.onLoadCenter.lng);
    this.addUserSelectMarker(this.navStartPos.lat, this.navStartPos.lng);
    for (let i = 0; i < this.parkGPSList.length; i++) {
      this.addTargetMarker(this.parkGPSList[i].lat, this.parkGPSList[i].lng);
    };

    this.map.on('dragstart', function() {
        if(_this.route_lines.length === 0){
          _this.isCenterMarkerShow = true;
          _this.userSelectMarker.hide();
        }
    });
    this.map.on('dragend', function() {
        if(_this.route_lines.length === 0){
          _this.userSelectMarker.setPosition(_this.map.getCenter());
          setTimeout(function () {
            _this.isCenterMarkerShow = false;   
            _this.userSelectMarker.show();
          }, 0);
        }
    });
    this.map.on('click', function(event) {
        _this.route_lines = [];
        _this.driving.clear();
        _this.mainButtonBgColor = '#fff';
        _this.mainButtonTextColor = '#000';
        _this.mainButtonText = '选择地点';
        // alert('您点击的位置为:[' + '纬度' + event.latLng.getLat() + ','
        //                          + '经度' + event.latLng.getLng() + ']');
    });
  },
  methods:{
    getSettings : function(event){
      event.stopPropagation();
      this.settingsPageStyleLeft = '-10px';
      this.isCurtainShow=true;
    },
    getCenter : function(){
      this.route_lines = [];
      this.driving.clear();
      this.mainButtonBgColor = '#fff';
      this.mainButtonTextColor = '#000';
      this.mainButtonText = '选择地点';
      let center = new AMap.LngLat(this.onLoadCenter.lng, this.onLoadCenter.lat);
      this.map.setCenter(center);
      this.isCenterMarkerShow = false;
      this.userSelectMarker.setPosition(center);
      this.userSelectMarker.show();
      // map.zoomTo(15);
    },
    //添加标记
    addUserGPSMarker : function(lat,lng){
        let location = new AMap.LngLat(lng, lat);
        let marker = new AMap.Marker({
          map: this.map,
          position: location,
          icon: new AMap.Icon({            
            size: new AMap.Size(24, 33),
            image: pinGreenSolid,
            imageOffset: new AMap.Pixel(0, 0),
            imageSize: new AMap.Size(23, 33)
          }),
          offset: new AMap.Pixel(-12, -33),
          zIndex: 90
        });
        // marker.setAnimation('AMAP_ANIMATION_BOUNCE');

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
          offset: new AMap.Pixel(-24, -48)
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
      let _this = this;
      marker.on('click',function() {
          _this.userSelectMarker.show();
          _this.isCenterMarkerShow = false;
          _this.calcRoute(lat,lng);
          _this.mainButtonBgColor = 'limegreen';
          _this.mainButtonTextColor = '#FFF';
          _this.mainButtonText = '前往停车';
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
   
      let _this = this;
      //AMap.DrivingPolicy.LEAST_TIME 最快捷模式
      //AMap.DrivingPolicy.LEAST_FEE  最经济模式
      //AMap.DrivingPolicy.LEAST_DISTANCE 最短距离模式
      //AMap.DrivingPolicy.REAL_TRAFFIC 考虑实时路况
      this.driving.setPolicy(AMap.DrivingPolicy.LEAST_TIME);
      this.driving.search(new AMap.LngLat(start_lng, start_lat), new AMap.LngLat(stop_lng, stop_lat),function(status,result){
        if(status == 'complete'){
          _this.route_lines = result.routes;
        }else if(status == 'error'){
          alert(result);
        }else if(status == 'error'){
          alert('检索无结果');
        }
      });
    },
    functionTBD: function(){
      alert("该功能正在开发过程中，敬请期待！")
    }
  }
}
</script>

<style lang="scss">
*{margin:0; padding:0;}
body{width:100%; height:100%;}
#map-box{width:100vw; height: 100vh; z-index: 1;}
.items-on-map{position: absolute; z-index: 10;}

#main-box{width: 10rem;height: 2.1875rem; line-height: 2.1875rem; bottom: 1.75rem; left: 50%; margin-left: -5rem; font-size: 0.9375rem; text-align: center; border: 2px solid limegreen;border-radius: 1.25rem;}
#tools-box{bottom: 1.4375rem; right: 0.9375rem;}
#tools-box img{width: 2.8125rem; height: 2.8125rem;}

#settings-box{bottom: 1.4375rem; left: 0.9375rem;}
#settings-box img{width: 2.5rem; height: 2.5rem;}

#settings-page{width:80%; height: 100%; padding-left: 0.625rem; position: absolute; z-index: 100; top:0; font-size: 1.0625rem;background-color: #efefef; transition: left .2s linear; border-radius: 0.625rem}
.settings-page-button{width: 90%; height: 3.125rem; border-top:1px solid limegreen;border-bottom:1px solid limegreen; margin:1.25rem auto;line-height: 3.125rem; display: flex; align-items: center;}
.settings-page-button img:first-child{padding: 0 0.625rem; width: 1.5625rem; height: 1.5625rem;}
.settings-page-button .content-message{width:80%;}
.settings-page-button .goto-pic{width: 0.5rem; height: 0.875rem; float: right; padding: 0 0.625rem;}

.profile-photo-box{width:6.25rem;height:6.25rem;margin:3.125rem auto;border-radius:3.125rem;overflow:hidden;}

#curtain{width:100%; height: 100%; position: absolute; top:0; left: 0; z-index: 50; background-color:#000; opacity:0.5;}
#curtain.fade-enter-active, #curtain.fade-leave-active{transition: opacity .5s;}
#curtain.fade-enter, #curtain.fade-leave-active{opacity: 0;}
</style>
