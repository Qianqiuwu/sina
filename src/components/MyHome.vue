<template>
  <div class="bgm">
    <h1>欢迎来到宜家便利店的进销存管理系统</h1>
    <!-- <div id="containes">
      <div
        class="input-card"
        style="width: auto; z-index: 9999; position: fixed"
      >
        <div class="input-item">
          <button class="btn" @click="traffic.show()">显示图层</button>
        </div>
        <div class="input-item">
          <button class="btn" @click="traffic.hide()">隐藏图层</button>
        </div>
        <div class="input-item">
          <button class="btn" @click="initMap()">定位</button>
        </div>
        <div class="input-item">
          <h5>位置信息：{{ results }}</h5>
        </div>
      </div>
    <div
        id="myPageTop"
        style="width: auto; z-index: 9999; position: fixed; right: 10%"
      >
        <input id="tipinput" v-model="keyword" />
      </div> 
    </div>  -->
  </div>
</template>

<script type="text/javascript">
import AMapLoader from '@amap/amap-jsapi-loader'
window._AMapSecurityConfig = {
  securityJsCode: '1d088c87933f4941935e2e04cfbb2609',
}
export default {
  data() {
    return {
      // 图层
      map: null,
      layer: null,
      traffic: null,
      placeSearch: null,
      autoComplete: null,
      keyword: '',
      results: '',
    }
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: '54a317e6dbc1ced8518d1aec6f24dada', // 申请好的Web端开发者Key，首次调用 load 时必填
        version: '2.0', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [''], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          // 创建并添加图层
          this.layers(AMap)
          this.map = new AMap.Map('containes', {
            //设置地图容器id
            resizeEnable: true,
            zoom: 10, //初始化地图级别
            layers: [this.layer],
            // pitch:75, // 地图俯仰角度，有效范围 0 度- 83 度
            // viewMode: '3D', //是否为3D地图模式
            // center: [105.602725, 37.076636], //初始化地图中心点位置
          })
          this.map.add(this.traffic)
          // 浏览器定位
          this.Geolocation(AMap)
          this.AutoComplete(AMap)
          this.getLngLatLocation(AMap)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 显示交通图层
    layers(AMap) {
      this.layer = new AMap.createDefaultLayer({
        // 提示：参数值并不是API默认使用的值
        zooms: [3, 20], //可见级别
        visible: true, //是否可见
        opacity: 1, //透明度
        zIndex: 1, //叠加层级
      })
      // 交通图层
      this.traffic = new AMap.TileLayer.Traffic({
        autoRefresh: true, //是否自动刷新，默认为false
        interval: 180, //刷新间隔，默认180s
      })
    },
    // 浏览器定位
    Geolocation(AMap) {
      let that = this
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, // 是否使用高精度定位，默认：true
          timeout: 100, // 设置定位超时时间，默认：无穷大
          offset: [10, 20], // 定位按钮的停靠位置的偏移量
          zoomToAccuracy: false, //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          position: 'RB', //  定位按钮的排放位置,  RB表示右下
          panToLocation: true,
        })
        that.map.addControl(geolocation)
        geolocation.getCurrentPosition(function (status, result) {
          // console.log(this)
          if (status == 'complete') {
            onComplete(result)
          } else {
            onError(result)
          }
        })
        function onComplete(data) {
          // data是具体的定位信息
          console.log(data)
          // that.getLngLatLocation(AMap)
        }
        function onError(data) {
          // 定位出错
          console.log(data)
        }
      })
    },
    // 定位城市
    getLngLatLocation(AMap) {
      let that = this
      AMap.plugin('AMap.CitySearch', function () {
        var citySearch = new AMap.CitySearch()
        citySearch.getLocalCity(function (status, result) {
          if (status === 'complete' && result.info === 'OK') {
            // 查询成功，result即为当前所在城市信息
            //逆向地理编码
            AMap.plugin('AMap.Geocoder', function () {
              console.log('通过ip获取当前城市：', result)
              var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                city: result.adcode,
              })

              var lnglat = result.rectangle.split(';')[0].split(',')
              geocoder.getAddress(lnglat, function (status, data) {
                if (status === 'complete' && data.info === 'OK') {
                  // result为对应的地理位置详细信息
                  console.log(data)
                  that.results = data.regeocode.formattedAddress
                }
              })
            })
          }
        })
      })
    },
    // 搜索
    AutoComplete(AMap) {
      let that = this
      AMap.plugin(['AMap.PlaceSearch', 'AMap.AutoComplete'], function () {
        // 实例化AutoComplete
        let autoOptions = {
          //city 限定城市，默认全国
          input: 'tipinput',
        }
        that.autoComplete = new AMap.AutoComplete(autoOptions)
        that.placeSearch = new AMap.PlaceSearch({ map: that.map }) //构造PlaceSearch类
        that.autoComplete.on('select', that.select) //注册监听，当选中某条记录时会触发
      })
    },
    select(e) {
      console.log(e)
      this.placeSearch.setCity(e.poi.adcode)
      this.placeSearch.search(e.poi.name) //关键字查询查询
    },
  },
  created() {},
  mounted() {
    // this.initMap()
  },
  beforeDestroy() {},
}
</script>

<style lang="less" scoped>
#containes {
  padding: 0px;
  margin: 0px;
  width: 50%;
  height: 500px;
}
#editor—wrapper {
  border: 1px solid #ccc;
  z-index: 100; /* 按需定义 */
}
#toolbar-container {
  touch-action: none;
  border-bottom: 1px solid #ccc;
  width: 100%;
}
#editor-container {
  height: 500px;
}
h1 {
  text-align: center;
  font-size: 2rem;
  margin: 0 auto;
  backdrop-filter: blur(1px);
  color: rgb(214, 228, 233);
}

.bgm {
  width: 100%;
  height: 100%;
  position: relative;
  text-align: center;
  line-height: 500px;
}
.bgm::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://images.pexels.com/photos/13831531/pexels-photo-13831531.jpeg?cs=srgb&dl=pexels-yusuf-%C3%A7elik-13831531.jpg&fm=jpg&w=6240&h=4160&_gl=1*k7w5d5*_ga*NTc2MzE1NjE1LjE3MDY5NzMxMTY.*_ga_8JE65Q40S6*MTcwOTE3ODkwNi4xLjEuMTcwOTE3ODkzNS4wLjAuMA..')
    center center no-repeat;
  filter: blur(5px);
  z-index: 0;
  background-size: cover;
}
</style>
