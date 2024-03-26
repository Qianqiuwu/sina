<template>
  <div>
    <div style="margin-left: 28%">
      <!-- <el-button type="success" round @click="bar">柱状图</el-button> -->
      <!-- <el-button type="success" round @click="pie">圆饼图</el-button> -->
    </div>
    <div id="echar" style="width: 90%; height: 700%"></div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import * as echarts from 'echarts'
export default {
  data() {
    return {
      datas: [],
      chart: null,
      dataname: [],
      datacount: [],
      datapplys: [],
      type: 'pie',
      data: [],
      datascoun: [],
    }
  },
  methods: {
    async initecharts(option) {
      await this.axios({
        method: 'get',
        url: `/foo/uctivity/uctives/${this.admin.actid}`,
      }).then(({ data }) => {
        console.log(data)
        this.datas = data.data
        this.datas.filter((item) => {
          this.dataname.push(item.actiname)
          this.datacount.push(item.readCount)
          this.datapplys.push(item.activeapplys)
          this.data.push({ name: item.actiname, value: item.activeapplys })
          this.datascoun.push({ name: item.actiname, value: item.readCount })
        })
        this.init(option)
      })
    },
    // echars
    init(option) {
      // 实例
      this.chart = echarts.init(document.getElementById('echar'))
      // 绘制图表
      this.chart.clear()
      this.chart.setOption(option, true)
    },
    // 切换
    bar() {
      this.type = 'bar'

      let option = {
        title: {
          left: 'center',
        },
        legend: {
          data: ['活动浏览量', '活动报名人数'],
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.dataname,
            axisTick: {
              alignWithLabel: false,
            },
          },
        ],
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '活动浏览量',
            type: 'bar',
            barWidth: '40%',
            label: '活动浏览量',
            emphasis: {
              focus: 'series',
            },
            data: this.datacount,
          },
          {
            name: '活动报名人数',
            type: 'bar',
            barWidth: '40%',
            label: '活动报名人数',
            emphasis: {
              focus: 'series',
            },
            data: this.datapplys,
          },
        ],
      }
      this.init(option)
    },
    pie() {
      this.type = 'pie'
      let option = {
        title: {
          text: '活动统计',
          left: 'center',
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: this.data.legendData,
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} 人({d}%)',
        },
        yAxis: { gridIndex: 0 },
        series: [
          {
            type: this.type,
            name: '活动报名人数',
            data: this.data,
            emphasis: {
              focus: 'self',
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
          {
            type: this.type,
            name: '活动报名人数',
            data: this.datascoun,
            emphasis: {
              focus: 'self',
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
      this.init(option)
    },
  },
  computed: {
    ...mapState('admin', ['admin']),
  },
  created() {},
  mounted() {
    let option = {
        title: {
          left: 'center',
        },
        legend: {
          data: ['活动浏览量', '活动报名人数'],
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: this.dataname,
            axisTick: {
              alignWithLabel: false,
            },
          },
        ],
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '活动浏览量',
            type: 'bar',
            barWidth: '40%',
            label: '活动浏览量',
            emphasis: {
              focus: 'series',
            },
            data: this.datacount,
          },
          {
            name: '活动报名人数',
            type: 'bar',
            barWidth: '40%',
            label: '活动报名人数',
            emphasis: {
              focus: 'series',
            },
            data: this.datapplys,
          },
        ],
      }
    this.initecharts(option)
  },
  beforeDestroy() {},
}
</script>

<style lang="less" scoped></style>
