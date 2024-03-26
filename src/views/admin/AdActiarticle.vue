<template>
  <div class="AdActiarticle">
    <!--头部 -->
    <div class="same-head">
      <el-button
        @click="
          dialogFormVisible = true
          value1 = false
          value2 = true
        "
        >新增</el-button
      >
      <el-button @click="ActdeleteSelectItem">删除</el-button>
    </div>
    <!-- 模态框 -->
    <el-dialog title="文章信息" :visible.sync="dialogFormVisible" class="">
      <div>
        <!-- 表单 -->
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm frame"
        >
          <el-form-item label="活动标题" prop="actiname">
            <el-select
              v-model="ruleForm.actiname"
              placeholder="请选择活动标题"
              class="inputStyle"
              ><template slot="prefix">
                {{ ruleForm.actiname }}
              </template>
              <el-option
                v-for="item in options"
                :key="item.id"
                :value="item.actiname"
              >
              </el-option> </el-select
          ></el-form-item>
          <el-form-item label="文章标题" prop="articletitle">
            <el-input v-model="ruleForm.articletitle" class="inputStyle"
              ><template slot="prefix">
                {{ ruleForm.articletitle }}
              </template></el-input
            > </el-form-item
          ><el-form-item label="文章简介" prop="articleintro">
            <el-input
              v-model="ruleForm.articleintro"
              type="textarea"
              autosize
            ></el-input>
          </el-form-item>
          <el-form-item
            label="文章内容"
            prop="ArtContentHtml"
            label-width="108px"
          >
            <div style="border: 1px solid #ccc" id="toolbar-container">
              <Toolbar
                style="border-bottom: 1px solid #ccc"
                :editor="editor"
                :defaultConfig="toolbarConfig"
                :mode="mode"
              />
              <Editor
                style="height: 400px; overflow-y: hidden"
                v-model="ruleForm.ArtContentHtml"
                :defaultConfig="editorConfig"
                :mode="mode"
                @onCreated="onCreated"
                @onBlur="onBlur"
              /></div
          ></el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              :disabled="value1"
              >立即创建</el-button
            ><el-button
              type="primary"
              :disabled="value2"
              @click="submitForm('ruleForm')"
              >编辑</el-button
            >
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <div class="same-tabl">
      <el-table
        class="tableClass"
        max-height="620"
        :height="tableHeight"
        :data="
          alldata.filter(
            (data) =>
              !search ||
              data.articletitle.toLowerCase().includes(search.toLowerCase()) ||
              data.actiname.toLowerCase().includes(search.toLowerCase())
          )
        "
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选框 -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <!-- 表头 -->
        <el-table-column label="文章id" width="80" fixed>
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.articleid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动标题" width="300">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actiname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="活动类型" width="160">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.actitype }}</span>
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
        <!-- <el-table-column label="文章发布时间" width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.artcticaltime }}</span>
          </template>
        </el-table-column> -->

        <!-- 操作 -->
        <el-table-column fixed="right" width="280">
          <template slot="header" slot-scope="{}">
            <el-input v-model="search" size="" placeholder="输入文章名搜索" />
          </template>
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="Activitypost(scope.row)"
              :disabled="scope.row.Artstate == true"
              >发布</el-button
            >
            <el-button
              size="mini"
              @click="
                dialogFormVisible = true
                value2 = false
                value1 = true
                ActEdit(scope.row.articleid)
              "
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="ActhandleDelete(scope.row.articleid)"
              @size-change="handleSizeChange"
              >删除</el-button
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
import { mapState } from 'vuex'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { DomEditor } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
export default {
  components: { Editor, Toolbar },
  data() {
    // 表单
    return {
      // 数据id
      artid: 1,
      // 新增编辑
      value1: true,
      value2: true,
      // 高度
      tableHeight: '620',
      // 数据
      tableData: [],
      // 选择器数据
      options: [],
      actinfo: '',
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
      // 表单
      ruleForm: {
        articletitle: '',
        articleintro: '',
        actiname: '',
        artcontent: '',
        ArtContentHtml: '',
        readCount: 0,
        Artstate: false,
      },
      rules: {
        actiname: [
          { required: true, message: '请输入活动类型', trigger: 'change' },
        ],
        articletitle: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          {
            min: 3,
            max: 50,
            message: '长度在 3 到 50 个字符',
            trigger: 'blur',
          },
        ],
        articleintro: [
          { required: true, message: '请输入文章简介', trigger: 'blur' },
        ],
      },
      // 富文本
      editor: null,
      toolbar: null,
      html: '',
      // 工具栏配置
      toolbarConfig: {
        modalAppendToBody: false,
        excludeKeys: ['group-video'],
      },
      // 编辑器配置
      editorConfig: {
        placeholder: '请输入内容...',
        MENU_CONF: {
          // 上传图片的配置
          uploadImage: {
            server: '/api/upload',
            // 单个文件的最大体积限制，默认为 2M
            maxFileSize: 10 * 1024 * 1024, // 10M
            // 小于该值就插入 base64 格式（而不上传），默认为 0
            base64LimitSize: 5 * 1024 * 1024 * 1024, // 5Gb
            // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
            allowedFileTypes: [],
          },
        },
      },
      mode: 'default', // or 'simple'
    }
  },
  methods: {
    // 发布
    async Activitypost(row) {
      // 发布给对应用户？？？？？？
      if (row.Artstate == false || confirm('确认发布该文章吗？')) {
        await this.axios({
          method: 'patch',
          url: `/foo/actiarticle/patchart`,
          data: { Artstate: true, articleid: row.articleid },
        }).then(({ data }) => {
          if (data.state == 0) {
            this.$nextTick(() => {
              this.axios({
                method: 'post',
                url: `/foo/actiarticle/uctiarticles`,
                data: {
                  ...row,
                  articleid: row.articleid,
                  Artstate: true,
                  artcticaltime: this.moment(+new Date()).format(
                    'YYYY年MM月DD日 HH:mm'
                  ),
                },
              }).then((res) => {
                console.log(res.data)
                if (res.data.state == 0) {
                  this.getActiarticle()
                  alert('发布成功')
                }
              })
            })
          }
        })
      }
    },
    // 富文本
    onCreated(editor) {
      this.editor = Object.seal(editor) // 一定要用 Object.seal() ，否则会报错
    },
    Onchange(editor) {
      this.toolbar = DomEditor.getToolbar(editor)
    },
    onBlur(editor) {
      // 文本，html，json
      this.ruleForm.artcontent = editor.getText()
    },

    // 获取编辑id存储在表单中
    ActEdit(id) {
      this.artid = id
      this.axios({
        method: 'get',
        url: `/foo/actiarticle/artsid/${id}`,
      }).then(({ data }) => {
        this.ruleForm = data.data
      })
    },
    // 编辑
    ActhandleEdit(id) {
      this.axios({
        method: 'patch',
        url: `/foo/actiarticle/patchart`,
        data: { ...this.ruleForm, articleid: id },
      }).then(({ data }) => {
        if (data.state == 0) {
          this.resetForm('ruleForm')
          // 数据编辑后刷新页面
          this.$nextTick(() => {
            this.getActiarticle()
          })
        }
      })
    },
    // 全选功能键
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 单个删除
    ActhandleDelete(id) {
      if (confirm('确认删除该条数据吗？')) {
        this.axios({
          method: 'delete',
          url: `/foo/actiarticle/delearticleid`,
          data: { articleid: id },
        })
        // 数据更新后刷新页面
        this.$nextTick(() => {
          this.getActiarticle()
        })
        alert('已删除')
      }
    },
    // 选择删除
    ActAllDelete(id) {
      this.axios({
        method: 'delete',
        url: `/foo/actiarticle/delearticleid`,
        data: { articleid: id },
      }).then(() => {
        this.getActiarticle()
      })

      // 数据更新后刷新页面
    },
    ActdeleteSelectItem() {
      if (confirm('确认删除数据吗？')) {
        this.multipleSelection.forEach((value) => {
          //遍历多选框获取的数据
          this.alldata.forEach((v) => {
            //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
            if (value.articleid == v.articleid) {
              this.ActAllDelete(v.articleid)
            }
          })
        })
        alert('已删除')
      }
    },
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
    // 表单
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.value1) {
            this.setupActiarticle()
            this.IfActitype(this.ruleForm.actiname, this.options)
            this.dialogFormVisible = false
          } else {
            this.ActhandleEdit(this.artid)
            this.IfActitype(this.ruleForm.actiname, this.options)
            this.dialogFormVisible = false
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 初始数据获取当前管理员的活动信息数据
    getActivity() {
      this.axios({
        method: 'get',
        url: `/foo/active/actives/${this.admin.actid}`,
      }).then(({ data }) => {
        this.options = data.data
      })
    }, // 判断活动标题
    IfActitype(actiname, userInfoList) {
      for (const key in userInfoList) {
        if (Object.hasOwnProperty.call(userInfoList, key)) {
          const userInfo = userInfoList[key]
          if (userInfo.actiname === actiname) {
            this.actinfo = {
              actitype: userInfo.actitype,
              activityid: userInfo.activityid,
            }
            break
          }
        }
      }
    },
    // 初始数据获取当前管理员的文章信息数据
    getActiarticle() {
      this.axios({
        method: 'get',
        url: `/foo/actiarticle/artid/${this.admin.actid}`,
      }).then(({ data }) => {
        console.log(data.data)
        this.tableData = data.data
        this.getTabelData()
      })
    },
    // 添加到文章信息库中
    AddActiarticle() {
      this.axios({
        method: `post`,
        url: `/foo/actiarticle/actiarticles`,
        data: {
          ...this.ruleForm,
          actid: this.admin.actid,
          ...this.actinfo,
        },
      }).then(() => {
        this.getActiarticle()
      })
    },
    // 判断标题
    IfActiarticle(articletitle, ActiarticleList) {
      let flag = false
      for (const key in ActiarticleList) {
        if (Object.hasOwnProperty.call(ActiarticleList, key)) {
          const ActiarticleInfo = ActiarticleList[key]
          if (ActiarticleInfo.articletitle === articletitle) {
            flag = true
            break
          }
        }
      }
      return flag
    },
    // 获取当前管理员数据后添加文章信息
    async setupActiarticle() {
      await this.axios({
        method: 'get',
        url: `/foo/active/actives/${this.admin.actid}`,
      }).then(({ data }) => {
        let flag = this.IfActiarticle(this.ruleForm.articletitle, data.data)
        if (flag) {
          alert('文章标题已存在，请重新输入')
        } else {
          alert('添加成功！')
          this.AddActiarticle(this.ruleForm)
          this.getActiarticle()
          this.resetForm('ruleForm')
        }
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
  computed: {
    ...mapState('admin', ['admin']),
  },
  created() {},
  mounted() {
    console.log(this.moment(+new Date()).format('YYYY年MM月DD日 HH:mm'))
    this.getActivity()
    this.getActiarticle()
  },
  updated() {},
  beforeDestroy() {
    const editor = this.editor
    if (editor == null) return
    editor.destroy() // 组件销毁时，及时销毁编辑器
  },
}
</script>
<style lang="less" scoped>
/deep/.el-table .el-table__cell {
  text-align: center;
}
// 布局
.AdActiarticle {
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
  /* 文本框宽度自适应 */
  /deep/.inputStyle {
    // margin-top: 30px;
    text-align: start; // 这里一样要设置，否则不是对齐的居中状态
    min-width: 400px; //这里给一个最小宽度

    .el-input__prefix {
      display: inline-block;
      position: relative;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      color: #606266;
      font-size: inherit;
      height: 40px;
      line-height: 40px;
      padding: 0 30px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      padding-left: 30px;
      left: 0;
      visibility: hidden;
    }
    .el-input__inner {
      position: absolute;
    }
  }
  /deep/.el-switch__input {
    width: 100%;
  }
  // 日期
  /deep/.el-col-11 {
    width: 50%;
  }
  // 文本域
  /deep/.el-textarea__inner {
    width: 200%;
  }

  /deep/ .el-form-item__content {
    float: left;
    margin-left: 0px !important;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 394px;
  }
}
/deep/.el-input--mini .el-input__inner {
  width: 100px;
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
  height: 310px;
  position: relative;
}
/deep/.el-dialog {
  width: 72%;
  margin-top: 2% !important;
}
</style>
