<template>
  <div class="AdVolunteer">
    <!--头部 -->
    <div class="same-head">
      <!-- <el-button @click="dialogFormVisible = true">新增</el-button> -->
      <el-button @click="deleteSelectItem">删除</el-button>
    </div>
    <!-- 模态框 -->
    <div class="same-tabl" ref="tableContainer">
      <el-table
        class="tableClass"
        :height="tableHeight"
        :data="
          alldata.filter(
            (data) =>
              !search ||
              data.Wusername.toLowerCase().includes(search.toLowerCase()) 
          )
        "
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选框 -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- 表头 -->
        <el-table-column label="用户名" width="160" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.Wusername }}</span>
          </template>
        </el-table-column>
        <el-table-column label="密码" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.Wpassword }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.Wname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.Wsex }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.Wcell }}</span>
          </template>
        </el-table-column>
        <el-table-column label="头像" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">
              <el-image
                style="width: 100px; height: 100px;border-radius: 20px;"
                :src="scope.row.WimageUrl"
                fit="contain"
                slot="error"
                class="image-slot"
              >
              </el-image
            ></span>
          </template>
        </el-table-column>
        <!-- 操作 -->
      <!--   <el-table-column align="center">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" size="mini" placeholder="输入姓名搜索" />
          </template>
          <template slot-scope="scope">
            <el-button size="mini" @click="dialogFormVisible = true"
              >编辑</el-button
            > 
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.uid)"
              @size-change="handleSizeChange"
              >删除</el-button
            >
          </template>
        </el-table-column>-->
      </el-table>
    </div>
    <!-- 底部 -->
    <div class="pag_title">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentpage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
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
      tableHeight: 730, // Null或者先给个默认的大小
      timer: 0,
      // 数据
      tableData: [],
      search: '',
      multipleSelection: [{}],
      // 分页数据
      total: 0, //总条数
      currentpage: 1, //当前所在页默认是第一页
      pagesize: 5, //每页显示多少行数据 默认设置为10
      alldata: [], //分页后的当前页数据
      // 模态框
      dialogTableVisible: false,
      dialogFormVisible: false,
      labelPosition: 'right',
    }
  },
  methods: {
    // 表格固定表内容自适应

    // 单个删除数据库的数据
    handleDelete(id) {
      console.log(id)
      this.axios({
        method: 'delete',
        url: `/foo/userinfo/userinfos`,
        data: { uid: id },
      })
      // 数据更新后刷新页面
      this.$nextTick(() => {
        this.gettable()
      })
    },
    // 选择删除功能
    deleteSelectItem() {
      this.multipleSelection.forEach((value) => {
        //遍历多选框获取的数据
        this.alldata.forEach((v) => {
          //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
          if (value.uid == v.uid) {
            this.handleDelete(v.uid)
          }
        })
      })
    },
    // 全选键
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    // 分页功能
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
      this.$nextTick(() => {
        this.gettable()
      })
    },
    // pageSize 每页条数改变时会触发
    handleSizeChange(val) {
      this.pagesize = val
      this.currentpage = 1
      this.getTabelData()
      this.$nextTick(() => {
        this.gettable()
      })
    },
    // 初始数据获取
    async gettable() {
      await this.axios({
        method: 'get',
        url: `/foo/userinfo/userinfo`,
      }).then((res) => {
        this.tableData = res.data.data
        this.getTabelData()
      })
    },
    // 根据父元素高度改变表格高度
    calHeight() {
      this.$nextTick(() => {
        // Element.getBoundingClientRect() 方法返回元素的大小及其相对于视口的位置
        const rect = this.$refs.tableContainer.getBoundingClientRect()
        // this.tableHeight = rect.height - 24  // 若有分页，减去分页高度
        this.tableHeight = rect.height
      })
    },
    // 监听界面resize调calHeight更新表格高度
    onResize() {
      this.timer && clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.calHeight()
      }, 100)
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
    this.gettable()
    this.calHeight()
    window.addEventListener('resize', this.onResize)
  },
  updated() {},
  beforeDestroy() {
    this.timer && clearTimeout(this.timer)
    window.removeEventListener('resize', this.onResize)
  },
}
</script>
<style lang="less" scoped>
.el-table .el-table__cell {
  text-align: center !important;
}
/deep/ .el-table th.el-table__cell > .cell {
  width: 45%;
}
// 布局
.AdVolunteer {
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

  /deep/.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  /deep/.avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
    
  }
}
</style>
