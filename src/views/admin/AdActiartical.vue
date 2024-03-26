<template>
  <div>
    <div style="margin-left: 28%">
      <el-button type="success" round @click="bar">柱状图</el-button>
      <el-button type="success" round @click="pie">圆饼图</el-button>
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
      type: 'pie',
      data: [],
    }
  },
  methods: {
    async initecharts(option) {
      await this.axios({
        method: 'get',
        url: `/foo/actiarticle/unartilcsa/${this.admin.actid}`,
      }).then(({ data }) => {
        this.datas = data.data
        this.datas.filter((item) => {
          this.dataname.push(item.articletitle)
          this.datacount.push(item.readCount)
          this.data.push({ name: item.articletitle, value: item.readCount })
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
          text: '文章浏览量统计',
          left: 'center',
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
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '浏览量',
            type: 'bar',
            barWidth: '60%',
            data: this.datacount,
          },
        ],
      }
      this.init(option)
    },
    pie() {
      this.type = 'pie'
      let option = {
        title: {
          text: '文章浏览量统计',
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
          formatter: '{a} <br/>{b} : {c} 次({d}%)',
        },
        series: [
          {
            type: this.type,
            name: '文章名',
            data: this.data,
            emphasis: {
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
        text: '文章浏览量统计',
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
        formatter: '{a} <br/>{b} : {c} 次({d}%)',
      },
      series: [
        {
          type: this.type,
          name: '文章名',
          data: this.data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
    this.initecharts(option)
  },
  beforeDestroy() {},
}
</script>

<style lang="less" scoped></style>
