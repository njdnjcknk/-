<template>
  <!-- 雷达图  图表必须给高和宽度-->
  <div ref="myDiv" class="radar-echart" />
</template>

<script>
// // 完成加载过程
// // var echarts = require('echarts')
// var echarts = require('echarts/lib/echarts') // 引入echarts主模块
// require('echarts/lib/chart/radar') // 引入雷达图
// // 引入提示框和标题组件
// require('echarts/lib/component/tooltip')
// require('echarts/lib/component/title')

// require('echarts/lib/component/legend')
import * as Eachers from 'echarts'//全部导入
import radar from './radar'//引入配置对象
export default {
  // 页面渲染完毕事件
  mounted() {
    this.echarts = Eachers.init(this.$refs.myDiv) // 得到图表实例
    this.echarts.setOption(radar)
  },
  data() {
      return {
          echarts:null
      }
  },
  beforeDestroy(){
      this.echarts=null
  },
  created(){
     this.load()
  },
  methods: {
    load(){
          setTimeout(()=>{
        let value1=[50, 50, 50, 50, 50, 10]
        radar.series[0].data[0].value=value1
        let value2=[50, 50, 50, 50, 50, 10]
        radar.series[0].data[1].value=value2
        this.echarts.setOption(radar)
      },3000)
    }
  },
}
</script>

<style>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>
