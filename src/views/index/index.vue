<template>
<div>
    <div id="container" @click="onClickContainer">
      <div id="map-box"></div>
      <div id="search-box" class="items-on-map">
        <input id="keyword" placeholder="输入关键字查询地点" v-model="keyword" />
        <button @click="searchPlace">搜索</button>
      </div>
      <div id="main-box" class="items-on-map" v-bind:style="{backgroundColor:mainButtonBgColor, color:mainButtonTextColor, borderColor: mainButtonBorderColor , zIndex: bubbleSelectParkingZIndex}" @click.stop="toPark">
        <p>{{mainButtonText}}</p>
      </div>
      <div id="settings-box" class="items-on-map">
        <img v-bind:src="settingsBoxPic" @click.stop="getSettings">
      </div>
      <div id="geolocation-box" class="items-on-map" v-show="isBookingStatus==false">
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
      <!-- <div class="items-on-map" style="top: 0rem; right: 0rem;">
        <button style="width: 6rem;height:2rem;" @click="trigParkIn">Trigger</button>
      </div> -->
      <transition name="fade">
        <div id="curtain" v-show="isCurtainShow"></div>
      </transition>
    </div>
    <settings-page></settings-page>
    <select-parking  v-if="isSelectParkingShow"></select-parking>
    <select-plate-number v-if="isSelectPlateNumberShow"></select-plate-number>
</div>
</template>

<script>
import SelectParking from './select-parking.vue'
import SettingsPage from './settings-page.vue'
import SelectPlateNumber from './select-plate-number.vue'

const pinGreenSolid = require('../../assets/pin-green-solid.png');
const pinBlueSolid = require('../../assets/pin-blue-solid.png');
const pinRed = require('../../assets/pin-red.png');
const aimCenter = require('../../assets/aim-center.png');
const settings = require('../../assets/settings.png');
const locating = require('../../assets/locating.png');
// const profilePhoto = require('../../assets/profile-photo.png');
const profilePhoto = require('../../assets/profile-photo.png');
const profile = require('../../assets/profile.png');
const record = require('../../assets/record.png');
const goToArrow = require('../../assets/go-to-arrow.png');
export default {
  name: 'index',
  data(){
    return {
      map: null,
      placeSearch: null,
      keyword: null,
      geolocation: null,
      isGeolocationOK: false,
      isLocating: false,
      locatingInterval: null,
      isMapAutoPan: true,
      aimCenterPic: aimCenter,
      settingsBoxPic: settings,
      locatingPic: locating,
      userName: '',
      userSex: '',
      profilePhotoUrl: profilePhoto,
      profilePic: profile,
      recordPic: record,
      goToArrowPic: goToArrow,
      centerMarkerPic: pinRed,
      mainButtonBgColor: '#fff',
      mainButtonTextColor: '#000',
      mainButtonText: '选择车位',
      mainButtonBorderColor: 'limegreen',
      marker: null,
      searchAddress: null,
      centerMarkerWidth: 48,
      centerMarkerHeight: 48,
      calcTop: null,
      calcLeft: null,
      isCenterMarkerShow: false, 
      isSelectParkingShow: false,
      isSelectPlateNumberShow: false,
      settingsPageStyleLeft: '-83%',
      isCurtainShow: false,
      route_lines: [],
      //window onload map center
      gpsPos: {lat: '', lng: ''},
      //navigator start position
      navStartPos: null,
      //Gps List
      parkingInfoList: [],
      userSelectMarker: null,
      driving: null,
      pickedParkingSN: null,
      bubbleSelectParkingZIndex: 10,
      isBookingStatus: false,
      bookingTimeout: null,
      inputProvince: '沪',
      userPlateNumberList: [
        {plateNumber: '沪AB1234', isDefault: true}
      ],
      currentSelectedPlateIndex: 0,
      currentSelectedPlateNum: 0,
      currentSelectedSN: '',
      currentRemainNum: ''
    }
  },
  components:{
    SelectParking,
    SettingsPage,
    SelectPlateNumber
  },
  mounted: function() {
    console.log('Vue of index mounted!');

    // promise es6
    axios.get(`usrdata/${this.getCookie('user')}.json`).then(({ data }) => {
      this.userSex = data.sex=='1'? '男':'女';
      this.userName = data.nickName;
      this.profilePhotoUrl = data.headImgUrl;
    });

    axios.get('static/parking-info.json').then(({ data }) => {
      this.parkingInfoList = data;
      for (let i = 0; i < this.parkingInfoList.length; i++) {
        this.addTargetMarker(this.parkingInfoList[i].position.lat, this.parkingInfoList[i].position.lng,this.parkingInfoList[i].sn,this.parkingInfoList[i].remainNum);
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

    AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],() => {
      let autoOptions = {
        city: "上海", //城市，默认全国
        input: "keyword"//使用联想输入的input的id
      };
      let autocomplete = new AMap.Autocomplete(autoOptions);
      this.placeSearch = new AMap.PlaceSearch({
            city:'上海',
            map: this.map
      })
      AMap.event.addListener(autocomplete, "select", (e) => {
         //TODO 针对选中的poi实现自己的功能
         this.keyword = e.poi.name;
         this.placeSearch.search(e.poi.name);
      });
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
          console.log('Start locating……');
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
            this.changeMainButtonToSelect();
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
    this.map.on('dragging', () => {
        if(this.route_lines.length === 0){
          this.userSelectMarker.setPosition(this.map.getCenter());
          setTimeout(() => {
            this.isCenterMarkerShow = false;
            this.userSelectMarker.show();
          }, 0);
        }
    });
    this.map.on('click', (event) => {
        if(!this.isBookingStatus){
          this.route_lines = [];
          this.driving.clear();
          this.placeSearch.clear();
          this.changeMainButtonToSelect();
          // alert('您点击的位置为:[' + '纬度' + event.lnglat.lat + ','
          //                          + '经度' + event.lnglat.lng + ']');
        }
    });  
  },
  methods:{
    onClickContainer: function(){
      this.isCurtainShow = false;
      this.settingsPageStyleLeft='-83%';
      this.bubbleSelectParkingZIndex = 10;
      this.isSelectParkingShow = false;
      this.isSelectPlateNumberShow = false;
      this.pickedParkingSN = null;
      if(this.route_lines.length){
        this.changeMainButtonToConfirm();
      }else{
        this.changeMainButtonToSelect();
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
    addTargetMarker : function(lat,lng,index,remainNum) {
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
          this.currentSelectedSN = index;
          this.currentRemainNum = remainNum;
          this.userSelectMarker.show();
          this.isCenterMarkerShow = false;
          this.calcRoute(lat,lng);
          this.changeMainButtonToConfirm();
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
        name: 'Profile',
        params: {
          userSex: this.userSex,
          userName: this.userName,
          photoUrl: this.profilePhotoUrl
        }
      })
    },
    linkToRecord: function(){
      if(this.locatingInterval){clearInterval(this.locatingInterval);};
      this.$router.push({
        path: '/record'
      })
    },
    parkingPicked: function(){
      this.changeMainButtonToConfirm();
    },
    toPark: function(){
      if(this.isBookingStatus){
        let isCancelBooking = confirm('是否取消预约？');
        if(isCancelBooking){
        this.isBookingStatus = false;
        this.pickedParkingSN = null;
        this.changeMainButtonToConfirm();
        clearTimeout(this.bookingTimeout);
        }
      }else if(this.route_lines.length){
        if(this.pickedParkingSN){
          if(this.isSelectPlateNumberShow == true){
            /*this.isSelectPlateNumberShow =false;
            this.isCurtainShow = false;
            this.mainButtonBorderColor = 'Orange';
            this.mainButtonBgColor = 'Orange';
            this.mainButtonTextColor = '#FFF';
            this.mainButtonText = '取消预约';
            this.isBookingStatus = true;
            this.bookingTimeout = setTimeout(() => {
              this.isBookingStatus = false;
              this.pickedParkingSN = null;
              this.mainButtonBorderColor = 'limegreen';
              this.mainButtonBgColor = 'limegreen';
              this.mainButtonTextColor = '#FFF';
              this.mainButtonText = '选择车位';
              clearTimeout(this.bookingTimeout);
            },600000)*/
            this.currentSelectedPlateNum =  this.userPlateNumberList[this.currentSelectedPlateIndex].plateNumber;

            this.$router.push({
              path: '/order/' + this.pickedParkingSN +'/'+ this.currentSelectedPlateNum
            });

          }else{
            this.isSelectParkingShow = false;
            this.isSelectPlateNumberShow =true;
          }
        }else{
          this.bubbleSelectParkingZIndex = 51;
          this.isSelectParkingShow = true;
          this.isCurtainShow = true;
        }
      }
    },
    trigParkIn(){
      this.isBookingStatus = false;
      this.$router.push({
        path: '/ready-to-park'
      });
    },
    searchPlace(){
      if(this.keyword){
        this.placeSearch.search(this.keyword);
      }
    },
    changeMainButtonToSelect(){
      this.mainButtonBorderColor = 'limegreen';
      this.mainButtonBgColor = '#fff';
      this.mainButtonTextColor = '#000';
      this.mainButtonText = '选择车位';
    },
    changeMainButtonToConfirm(){
      this.mainButtonBorderColor = 'limegreen';
      this.mainButtonBgColor = 'limegreen';
      this.mainButtonTextColor = '#FFF';
      this.mainButtonText = '确认选择';
    },
    getCookie(name){
      let arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
      if(arr=document.cookie.match(reg)){
        return unescape(arr[2]);
      }else{
        return null;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// @import 'animations/_rotate';

*{margin:0; padding:0;}
body{width:100%; height:100%;}
#container{position: relative;}
#map-box{width:100vw; height: 100vh; z-index: 1;}
.items-on-map{position: absolute; z-index: 10;}
#main-box{width: 10rem;height: 2.1875rem; line-height: 2rem; bottom: 1.75rem; left: 50%; margin-left: -5rem; font-size: 0.9375rem; text-align: center; border: 2px solid;border-radius: 1.25rem;}
#search-box{top: 1rem; left: 50%; width: 20rem; margin-left: -10rem;}
#search-box #keyword{width: calc(80% - 5px); height: 2rem; font-size: 1rem;}
#search-box button{width: calc(20% - 5px); height: 2rem; appearance:none; background-color: #fff;border-radius: 5px;position: relative; top: -2px;}
#settings-box{bottom: 1.6rem; left: 1rem;}
#settings-box img{width: 2rem; height: 2rem;}
#geolocation-box{bottom: 1.7rem; right: 1rem;}
#geolocation-box img{width: 2.2rem; height: 2.2rem;}
#locating-box{bottom: 4.2rem; right: 1.2rem;}
#locating-box img{width: 1.8rem; height: 1.6rem;}

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
