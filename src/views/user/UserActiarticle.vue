<template>
  <div class="UserActiarticle">
    <!--头部 -->
    <div class="same-head"></div>
    <!-- 模态框 -->
    
    <!-- 表格 -->
    <div class="same-tabl">
      <el-table
        class="tableClass"
        :height="tableHeight"
        :data="
          alldata.filter(
            (data) =>
              !search ||
              data.name.toLowerCase().includes(search.toLowerCase()) ||
              data.username.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
      >
        <!-- 表头 -->
        <el-table-column label="活动文章id" width="160" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.articleid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动标题" width="300" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actiname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动类型" width="160" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.actitype
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章标题" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.articletitle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章简介" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.articleintro }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章内容" width="300">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{
              scope.row.artcontent.slice(0, 60) + '.....'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文章发布时间" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.artcticaltime }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column align="right">
          <template slot="header" slot-scope="">
            <!-- <el-input v-model="search" size="mini" placeholder="输入姓名搜索" /> -->
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="initpage(scope.row.articleid, scope.row.actid)"
              >详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部 -->
    <div class="pag_title">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentpage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // 表单
    return {
      // 高度
      tableHeight: '620',
      // 数据
      tableData: [],
      search: '',
      multipleSelection: [{}],
      // 分页数据
      total: 0, //总条数
      currentpage: 1, //当前所在页默认是第一页
      pagesize: 10, //每页显示多少行数据 默认设置为10
      alldata: [], //分页后的当前页数据
      // 模态框
      dialogTableVisible: false,
      dialogFormVisible: false,
      labelPosition: 'right',
    }
  },
  methods: {
    // 分页
    //获取当前页的数据
    getTabelData() {
      // 方法1
      let data = JSON.parse(JSON.stringify(this.tableData))
      this.alldata = data
        .reverse()
        .splice((this.currentpage - 1) * this.pagesize, this.pagesize)
      this.total = this.tableData.length
    },
    // currentPage  页数改变时会触发
    handleCurrentChange(vals) {
      this.currentpage = vals
      this.getTabelData()
    },
    // pageSize 每页条数改变时会触发
    handleSizeChange(val) {
      this.pagesize = val
      this.currentpage = 1
      this.getTabelData()
    },
    // 初始化
    async getarticle() {
      await this.axios({
        method: `get`,
        url: `/foo/actiarticle/uctiarticle`,
      }).then(({ data }) => {
        // this.tableData = data.sort(this.compare('id'))
        let ids = Array()
        const idsss = Array()
        data.data.filter((item) => {
          ids.push(item.articleid)
        })
        // 调用希尔排序
        this.xier(ids)
        ids.filter((ids) => {
          let auid = data.data.filter((item) => {
            if (item.articleid == ids) {
              return item
            }
          })
          idsss.push(...auid)
        })
        this.tableData = idsss
        this.getTabelData()
      })
    },
    // 对象排序
    compare(property) {
      return function (a, b) {
        var value1 = a[property]
        var value2 = b[property]
        return value1 - value2 //升序,降序为value2 - value1
      }
    },
    // 希尔排序
    xier(arr) {
      var interval = parseInt(arr.length / 2) //分组间隔设置
      while (interval > 0) {
        for (var i = 0; i < arr.length; i++) {
          var n = i
          while (arr[n] < arr[n - interval] && n > 0) {
            var temp = arr[n]
            arr[n] = arr[n - interval]
            arr[n - interval] = temp
            n = n - interval
          }
        }
        interval = parseInt(interval / 2)
      }
      return arr
    },
    // 获取对应详情页id,并且跳转
    initpage(id, actid) {
      this.$router.push({
        name: 'UserPage',
        params: { id: id, actid: actid },
      })
    },
  },
  watch: {
    total() {
      //注意这个函数的名字必须和你监听data中的属性的名字一样，这样才能当你data中的属性发生变化时，触发这个函数
      if (
        this.total == (this.currentPage - 1) * this.pageSize &&
        this.total != 0
      ) {
        //这一行是关键代码，倍数关系
        this.currentPage -= 1
        this.getTabelData() //获取表格数据的方法
      }
    },
  },
  created() {},
  mounted() {
    this.getarticle()
  },
  updated() {},
}
</script>
<style lang="less" scoped>
/deep/.el-table .el-table__cell {
  text-align: center;
}
// 布局
.UserActiarticle {
  height: auto;
  display: flex;
  display: -webkit-flex;
  justify-content: space-between;
  flex-direction: column;
  position: relative;
  .same-table {
    height: calc(100% - 55px);
    position: relative;
  }
  .pag_title {
    // position: fixed;
    bottom: 0px;
    width: 100%;
    text-align: left;
  }
  // 增加按钮布局
  .same-head {
    text-align: left;
  }
  // 分页
  .el-pagination {
    padding: 0 0;
  }
}
// 模态框
.motaikuan {
  width: 50% !important;
}
// 表单

.el-form-item {
  /deep/.el-input {
    width: 200%;
  }
  /deep/.el-switch__input {
    width: 100%;
  }
  // 日期
  /deep/.el-col-11 {
    width: 30%;
  }
  // 文本域
  /deep/.el-textarea__inner {
    width: 300%;
  }

  /deep/ .el-form-item__content {
    float: left;
    margin-left: 0px !important;
  }
  .el-date-editor.el-input__inner {
    width: 300px;
  }
}
/deep/.el-input--mini .el-input__inner {
  width: 100px;
}
</style>
