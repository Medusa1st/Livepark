<template>
<div>
    <div id="container">
      <div id="search-box">
      <input id="address" type="text" @keyup.enter="codeAddress()" v-model="searchAddress" placeholder="请输入地址关键字">
      <button @click="codeAddress()">search</button>
      <button @click="getCenter()">center</button>
      </div>
      <div id="centerMarker" v-bind:style="{top:calcTop + 'px',left:calcLeft + 'px'}">
      <img src="~assets/pin-red.png"
           v-bind:style="{width:centerMarkerWidth + 'px',height:centerMarkerHeight + 'px'}"/>
      </div>
      <div style="width:603px;padding-top:5px;;padding-left:5px;position:absolute;z-index:10000" id="routes"></div>
    </div>
</div>
</template>

<script>
var geocoder, map, marker = null,markersArray = [];
var directionsService = new qq.maps.DrivingService({
            complete : function(response){
                var start = response.detail.start,
                    end = response.detail.end;

/*                var anchor = new qq.maps.Point(6, 6),
                    size = new qq.maps.Size(24, 36),
                    start_icon = new qq.maps.MarkerImage(
                        'http://lbs.qq.com/javascript_v2/img/busmarker.png',
                        size,
                        new qq.maps.Point(0, 0),
                        anchor
                    ),
                    end_icon = new qq.maps.MarkerImage(
                        'http://lbs.qq.com/javascript_v2/img/busmarker.png',
                        size,
                        new qq.maps.Point(24, 0),
                        anchor

                    );
                start_marker && start_marker.setMap(null);
                end_marker && end_marker.setMap(null);*/
                clearOverlay(route_lines);
/*                start_marker = new qq.maps.Marker({
                      icon: start_icon,
                      position: start.latLng,
                      map: map,
                      zIndex:1
                });
                end_marker = new qq.maps.Marker({
                      icon: end_icon,
                      position: end.latLng,
                      map: map,
                      zIndex:1
                });*/
               directions_routes = response.detail.routes;
               var routes_desc=[];
               //所有可选路线方案
               for(var i = 0;i < directions_routes.length; i++){
                    var route = directions_routes[i],
                        legs = route;
                    //调整地图窗口显示所有路线
                    map.fitBounds(response.detail.bounds);
                    //所有路程信息
                    //for(var j = 0 ; j < legs.length; j++){
                        var steps = legs.steps;
                        route_steps = steps;
                        var polyline = new qq.maps.Polyline(
                            {
                                path: route.path,
                                strokeColor: '#3893F9',
                                strokeWeight: 6,
                                map: map
                            }
                        )
                        route_lines.push(polyline);
                         //所有路段信息
                        for(var k = 0; k < steps.length; k++){
                            var step = steps[k];
                            //路段途经地标
                            directions_placemarks.push(step.placemarks);
                            //转向
                            var turning  = step.turning,
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
                            var turning_img = '&nbsp;&nbsp;<span'+
                                ' style="margin-bottom: -4px;'+
                                'display:inline-block;background:'+
                                'url(http://lbs.qq.com/javascript_v2/img/turning.png) no-repeat '+
                                img_position+';width:19px;height:'+
                                '19px"></span>&nbsp;' ;
                            var p_attributes = [
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
               // var routes=document.getElementById('routes');
               // routes.innerHTML = routes_desc.join('<br>');
            }
        }),
        directions_routes,
        directions_placemarks = [],
        directions_labels = [],
        start_marker,
        end_marker,
        route_lines = [],
        step_line,
        route_steps = [];
const pinGreenSolid = require('./assets/pin-green-solid.png');
const pinBlueSolid = require('./assets/pin-blue-solid.png');
//添加标记
function addUserMarker(lat,lng){
    var size = new qq.maps.Size(24, 33),
        target_icon = new qq.maps.MarkerImage(
          pinGreenSolid,
          size,
          new qq.maps.Point(0, 0),
          );
    var location = new qq.maps.LatLng(lat, lng);
    var marker = new qq.maps.Marker({
        icon: target_icon,
        position: location,
        map: map,
        animation: qq.maps.MarkerAnimation.BOUNCE
    });
}
function addTargetMarker(lat,lng) {
    var size = new qq.maps.Size(24, 33),
        target_icon = new qq.maps.MarkerImage(
          pinBlueSolid,
          size,
          new qq.maps.Point(0, 0),
          );
    var location = new qq.maps.LatLng(lat, lng);
    var marker = new qq.maps.Marker({
        icon: target_icon,
        position: location,
        map: map
    });
    markersArray.push(marker);
    var markerIndex = markersArray.length;
    qq.maps.event.addListener(marker, 'click', function() {
        calcRoute(lat,lng);
    });
};
//清除地图上的marker
function clearOverlay(overlays){
    var overlay;
    while(overlay = overlays.pop()){
        overlay.setMap(null);
    }
};
function calcRoute(lat,lng){
    var start_lat = map.getCenter().lat;
    var start_lng = map.getCenter().lng;
    var stop_lat  = lat;
    var stop_lng  = lng;
    var policy = 'LEAST_TIME'; //LEAST_DISTANCE,AVOID_HIGHWAYS,REAL_TRAFFIC,PREDICT_TRAFFIC
    route_steps = [];

    directionsService.setLocation("上海");
    directionsService.setPolicy(qq.maps.DrivingPolicy[policy]);
    directionsService.search(new qq.maps.LatLng(start_lat, start_lng),
        new qq.maps.LatLng(stop_lat, stop_lng));
};
export default {
  name: 'app',
  data(){
    return {
      searchAddress: '',
      centerMarkerWidth: 48,
      centerMarkerHeight: 48,
      calcTop: '',
      calcLeft: ''
    }
  },
  mounted: function(){
    // console.log(this);
    this.calcTop = this.$el.clientHeight/2 - this.centerMarkerHeight;
    this.calcLeft= this.$el.clientWidth/2 - this.centerMarkerWidth/2;
    //Gps List
    var parkGPSList = [
    {lat: '31.308071816223425',lng: '121.5029525756836' },
    {lat: '31.308035149962773',lng: '121.51102066040039'},
    {lat: '31.3022783700433'  ,lng: '121.50629997253418'},
    {lat: '31.304368451830978',lng: '121.51320934295654'}
    // {lat: '31.305468476254635',lng: '121.50784492492676'}
    ]

    //定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
    map = new window.qq.maps.Map(document.getElementById("container"), {
        center: new window.qq.maps.LatLng(31.305468476254635, 121.50784492492676),      // 地图的中心地理坐标。
        zoom:15                                              // 地图的中心地理坐标。
    });

    //地址和经纬度之间进行转换服务
    //经度 Longitude
    //纬度 Latitude
    geocoder = new qq.maps.Geocoder();

    var listener = qq.maps.event.addListener(map,'click',
      function(event) {
          alert('您点击的位置为:[' + '纬度' + event.latLng.getLat() + ','
                                   + '经度' + event.latLng.getLng() + ']');
      }
    );
    addUserMarker(31.305468476254635,121.50784492492676);
    for (var i = 0; i < parkGPSList.length; i++) {
      addTargetMarker(parkGPSList[i].lat, parkGPSList[i].lng);
    };
  },
  methods:{
    codeAddress : function(){
        var address = document.getElementById("address").value;
        //对指定地址进行解析
        geocoder.getLocation("上海"+address);
        //设置服务请求成功的回调函数
        geocoder.setComplete(function(result) {
            map.setCenter(result.detail.location);
            var marker = new qq.maps.Marker({
                map: map,
                position: result.detail.location
            });
            map.zoomTo(14);
            //点击Marker会弹出反查结果
            qq.maps.event.addListener(marker, 'click', function() {
                alert("坐标地址为： " + result.detail.location);
            });
        });
        //若服务请求失败，则运行以下函数
        geocoder.setError(function() {
            alert("出错了，请输入正确的地址！！！");
        });
    },
    getCenter : function(){
      alert("latlng:" + map.getCenter());
    },
    getCenterTop : function(){
      return "100px";
    }
  }
}

</script>

<style>
*{
    margin:0px;
    padding:0px;
}
body{
    width:100%;
    height:100%;
}
#container{
    width:100vw;
    height: 100vh;
}
#search-box{
  position: absolute;
  z-index: 10000;
  top:6px;
  left: 10px;
  font-size: 17px;
}

#centerMarker{
  position: absolute;
  z-index: 10000;
}

#routes{
  font-size: 6px;
}
</style>
