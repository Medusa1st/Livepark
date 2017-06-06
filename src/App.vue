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
      <!-- <div style="width:603px;padding-top:5px;;padding-left:5px;position:absolute;z-index:10000" id="routes"></div> -->
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
let map, directions_routes, directions_placemarks=[], route_lines=[], route_steps=[];
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
      geocoder: null, 
      // map: null, 
      marker: null,
      markersArray: [],
      searchAddress: null,
      centerMarkerWidth: 48,
      centerMarkerHeight: 48,
      calcTop: null,
      calcLeft: null,
      isCenterMarkerShow: false, 
      settingsPageStyleLeft: '-83%',
      isCurtainShow: false,
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
      directionsService : new qq.maps.DrivingService({
            complete : function(response){
                let start = response.detail.start,
                    end = response.detail.end;
                //清除所有路线
                //clearOverlay(this.route_lines);
               directions_routes = response.detail.routes;
               let routes_desc=[];
               //所有可选路线方案
               for(let i = 0;i < directions_routes.length; i++){
                    let route = directions_routes[i],
                        legs = route;
                    //调整地图窗口显示所有路线
                    map.fitBounds(response.detail.bounds);
                    //所有路程信息
                    //for(let j = 0 ; j < legs.length; j++){
                        let steps = legs.steps;
                        route_steps = steps;
                        let polyline = new qq.maps.Polyline(
                            {
                                path: route.path,
                                strokeColor: '#3893F9',
                                strokeWeight: 6,
                                map: map
                            }
                        )
                        route_lines.push(polyline);
                         //所有路段信息
                        for(let k = 0; k < steps.length; k++){
                            let step = steps[k];
                            //路段途经地标
                            directions_placemarks.push(step.placemarks);
                            //转向
                            let turning  = step.turning,
                                img_position;;
                            switch(turning.text){
                                case '左转':
                                    img_position = '0px 0px'
                                break;
                                case '右转':
                                    img_position = '-19px 0px'
                                break;
                                case '直行':
                                    img_position = '-38px 0px'
                                break;
                                case '偏左转':
                                case '靠左':
                                    img_position = '-57px 0px'
                                break;
                                case '偏右转':
                                case '靠右':
                                    img_position = '-76px 0px'
                                break;
                                case '左转调头':
                                    img_position = '-95px 0px'
                                break;
                                default:
                                    img_position = ''
                                break;
                            }
                            let turning_img = '&nbsp;&nbsp;<span'+
                                ' style="margin-bottom: -4px;'+
                                'display:inline-block;background:'+
                                'url(http://lbs.qq.com/javascript_v2/img/turning.png) no-repeat '+
                                img_position+';width:19px;height:'+
                                '19px"></span>&nbsp;' ;
                            let p_attributes = [
                                'onclick="renderStep('+k+')"',
                                'onmouseover=this.style.background="#eee"',
                                'onmouseout=this.style.background="#fff"',
                                'style="margin:5px 0px;cursor:pointer"'
                            ].join(' ');
                            routes_desc.push('<p '+p_attributes+' ><b>'+(k+1)+
                            '.</b>'+turning_img+step.instructions);
                        }
                    //}
               }
               //方案文本描述
               // let routes=document.getElementById('routes');
               // routes.innerHTML = routes_desc.join('<br>');
            }
        })
    }
  },
  mounted: function(){
    // console.log(this);
    this.calcTop = this.$el.clientHeight/2 - this.centerMarkerHeight;
    this.calcLeft= this.$el.clientWidth/2 - this.centerMarkerWidth/2;
    this.navStartPos = this.onLoadCenter;

    //定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
    map = new window.qq.maps.Map(document.getElementById("map-box"), {
        // 地图的中心地理坐标。
        center: new window.qq.maps.LatLng(this.onLoadCenter.lat, this.onLoadCenter.lng),  
        // 地图的中心地理坐标。   
        zoom:15,
        mapTypeControl: false,
        zoomControl: false
    });
    //地址和经纬度之间进行转换服务
    //经度 Longitude
    //纬度 Latitude
    this.geocoder = new qq.maps.Geocoder();
    this.addUserGPSMarker(this.onLoadCenter.lat, this.onLoadCenter.lng);
    this.addUserSelectMarker(this.navStartPos.lat, this.navStartPos.lng);
    for (let i = 0; i < this.parkGPSList.length; i++) {
      this.addTargetMarker(this.parkGPSList[i].lat, this.parkGPSList[i].lng);
    };
    /*let getLocationEvent = qq.maps.event.addListener(map,'click',
      function(event) {
          alert('您点击的位置为:[' + '纬度' + event.latLng.getLat() + ','
                                   + '经度' + event.latLng.getLng() + ']');
      }
    );*/
    let _this = this;
    let dragStartEvent = qq.maps.event.addListener(map, 'dragstart', function() {
        if(route_lines.length === 0){
          _this.isCenterMarkerShow=true;
          _this.userSelectMarker.setVisible(false);
        }
    });
    let dragEndEvent = qq.maps.event.addListener(map, 'dragend', function() {
        if(route_lines.length === 0){
          _this.userSelectMarker.setPosition(map.getCenter());
        }
    });
    let clickMapEvent = qq.maps.event.addListener(map, 'click', function(event) {
        _this.clearOverlay(route_lines);
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
      this.clearOverlay(route_lines);
      this.mainButtonBgColor = '#fff';
      this.mainButtonTextColor = '#000';
      this.mainButtonText = '选择地点';
      let center = new window.qq.maps.LatLng(this.onLoadCenter.lat, this.onLoadCenter.lng);
      map.setCenter(center);
      this.isCenterMarkerShow = false;
      this.userSelectMarker.setPosition(center);
      this.userSelectMarker.setVisible(true);
      // map.zoomTo(15);
    },
    //添加标记
    addUserGPSMarker : function(lat,lng){
        let size = new qq.maps.Size(24, 33),
            target_icon = new qq.maps.MarkerImage(
              pinGreenSolid,
              size,
              new qq.maps.Point(0, 0),
              );
        let location = new qq.maps.LatLng(lat, lng);
        let marker = new qq.maps.Marker({
            icon: target_icon,
            position: location,
            map: map,
            animation: qq.maps.MarkerAnimation.BOUNCE
        });
    },
    addUserSelectMarker : function(lat,lng){
        let size = new qq.maps.Size(48, 48),
            target_icon = new qq.maps.MarkerImage(
              pinRed,
              size,
              new qq.maps.Point(0, 0),
              );
        let location = new qq.maps.LatLng(lat, lng);
        this.userSelectMarker = new qq.maps.Marker({
            icon: target_icon,
            position: location,
            map: map
        });
    },
    addTargetMarker : function(lat,lng) {
      let size = new qq.maps.Size(24, 33),
          target_icon = new qq.maps.MarkerImage(
            pinBlueSolid,
            size,
            new qq.maps.Point(0, 0),
            );
      let location = new qq.maps.LatLng(lat, lng);
      let marker = new qq.maps.Marker({
          icon: target_icon,
          position: location,
          map: map
      });
      this.markersArray.push(marker);
      let markerIndex = this.markersArray.length;
      let _this = this;
      qq.maps.event.addListener(marker, 'click', function() {
          _this.userSelectMarker.setVisible(true);
          _this.isCenterMarkerShow = false;
          _this.calcRoute(lat,lng);
          _this.mainButtonBgColor = 'limegreen';
          _this.mainButtonTextColor = '#FFF';
          _this.mainButtonText = '前往停车';
      });
    },
    //清除地图上的marker
    clearOverlay : function(overlays){
      let overlay;
      while(overlay = overlays.pop()){
          overlay.setMap(null);
      }
    },
    calcRoute : function(lat,lng){

      //清除所有路线
      this.clearOverlay(route_lines);

      let start_lat = this.userSelectMarker.getPosition().lat;
      let start_lng = this.userSelectMarker.getPosition().lng;
      let stop_lat  = lat;
      let stop_lng  = lng;

      let policy = 'LEAST_TIME'; //LEAST_DISTANCE,AVOID_HIGHWAYS,REAL_TRAFFIC,PREDICT_TRAFFIC
      route_steps = [];

      this.directionsService.setLocation("上海");
      this.directionsService.setPolicy(qq.maps.DrivingPolicy[policy]);
      this.directionsService.search(new qq.maps.LatLng(start_lat, start_lng),
          new qq.maps.LatLng(stop_lat, stop_lng));
    },
    functionTBD: function(){
      alert("该功能正在开发过程中，尽情期待！")
    }
  }
}
</script>

<style lang="scss">
*{margin:0; padding:0;}
body{width:100%; height:100%;}
#map-box{width:100vw; height: 100vh; z-index: 1;}
.items-on-map{position: absolute; z-index: 10;}
/*#routes{font-size: 0.375rem;}*/

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
