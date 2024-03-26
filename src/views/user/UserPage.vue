<template>
  <div id="main">
    <div class="column-view">
      <div class="main-area article-area">
        <br />
        <el-page-header @back="goBack" content="详情页面"> </el-page-header>
        <article>
          <div class="article-title">{{ artical.articletitle }}</div>
          <div class="author-info-block">
            <a href="" class="avatar-link">
              <img :src="admin.imageUrl" alt="" class="lazy avatar avatar" />
            </a>
            <div class="author-info-box">
              <div class="author-name">
                <a href="javascript:;" class="username username ellipsis">
                  <span class="name"> {{ admin.username }}</span>
                </a>
              </div>
              <div class="meta-box">
                <time class="time"> {{ artical.artcticaltime }} </time>
                <span class="views-count" style="">
                  ·&nbsp;&nbsp;阅读{{ artical.readCount }}
                </span>
              </div>
            </div>
          </div>
          <div class="article-content">
            <div
              class="markdown-body cache html"
              v-html="artical.ArtContentHtml"
            ></div>
          </div>
        </article>
        <br />
        <template>
          <el-button-group>
            <el-button
              type="primary"
              @click="prev"
              icon="el-icon-arrow-left"
              size="mini"
              >上一页</el-button
            >
            <el-button type="primary" @click="next" size="mini"
              >下一页<i class="el-icon-arrow-right el-icon--right"></i
            ></el-button> </el-button-group
        ></template>
      </div>

      <div class="aside">
        <div class="sidebar-block related-entry-sidebar-block shadow">
          <div class="block-title">相关文章</div>
          <div class="block-body">
            <div class="entry-list">
              <a
                class="item"
                v-for="item in alldata.slice(0, 6)"
                :key="item.articleid"
              >
                <div class="entry-title" @click="news(item.articleid)">
                  {{ item.articletitle }}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 详情页内容
      artical: [],
      // 发布者信息
      admin: [],
      // 所有文章信息
      alldata: [],
      // 前五个文章
      firstdata: [],
      // 文章ids
      ids: [],
    }
  },
  props: ['id', 'actid'],
  methods: {
    // 获取文章数据
    async initalldata() {
      await this.axios({
        method: `get`,
        url: `/foo/actiarticle/uctiarticle`,
      }).then(({ data }) => {
        console.log(data.data);
        this.alldata = data.data
        for (let key in this.alldata) {
          if (Object.hasOwnProperty.call(this.alldata, key)) {
            const userInfo = this.alldata[key]
            this.ids.push(userInfo.articleid)
          }
        }
      })
    },
    // 获取详情页
    async init(id) {
      await this.axios({
        method: `get`,
        url: `/foo/actiarticle/unartilcs/${id}`,
      }).then(({ data }) => {
        this.artical = data.data
      })
    },
    // 获取文章发布者信息
    async initadmin(id) {
      await this.axios({
        method: `get`,
        url: `/foo/admin/admins/${id}`,
      }).then(({ data }) => {
        this.admin = data.data
      })
    },
    // 跳转页面
    initartical(id, actid) {
      this.$router.push({
        name: 'UserPage',
        params: { id: id, actid: actid },
      })
    },
    // 跳转后刷新页面
    async news(id) {
      await this.axios({
        method: `get`,
        url: `/foo/actiarticle/unartilcs/${id}`,
      }).then(({ data }) => {
        const actid = data.data.actid
        this.initartical(id, actid)
        this.$nextTick(() => {
          this.readcount(this.id)
        })
      })
    },
    // 上一页
    async prev() {
      let index = this.id
      let id = --index
      let maxid = this.alldata.sort((a, b) => {
        return a - b
      })
      let aid = this.ids.some((item) => {
        return item == id
      })
      if (aid && id > 0) {
        if (id >= maxid[0].articleid) {
          this.news(id)
        }
      } else {
        if (id >= maxid[0].articleid) {
          this.news(--id)
        }
      }
    },
    // 下一页
    async next() {
      let index = this.id
      let id = ++index
      let maxid = this.alldata.sort((a, b) => {
        return a - b
      })
      let aid = [...new Set(this.ids)].some((item) => {
        return item == id
      })
      if (aid && id > 0) {
        if (id <= maxid[maxid.length - 1].articleid) {
          this.news(id)
        }
      } else {
        // 这里有bug：如果数据中间少了之后会报错
        if (id <= maxid[maxid.length - 1].articleid) {
          this.news(++id)
        }
      }
    },
    //属性页面浏览量+1
    async readcount(id) {
      await this.axios({
        method: 'get',
        url: `/foo/actiarticle/unartilcs/${id}`,
      }).then(({ data }) => {
        this.axios({
          method: 'patch',
          url: `/foo/actiarticle/patchuctiarticle`,
          data: { readCount: data.data.readCount + 1, articleid: id },
        }).then(() => {
          this.$nextTick(() => {
            this.init(this.id)
          })
        })
      })
    },
    goBack() {
      this.$router.push('/UserHome/UserActiarticle')
    },
  },
  created() {
    this.init(this.id)
    this.initalldata()
    this.readcount(this.id)
    this.initadmin(this.actid)
  },
  mounted() {},
  updated() {},
}
</script>

<style lang="less" scoped>
#main {
  position: relative;
  width: 100%;
  max-width: 1250px;
  line-height: 2;
  margin: 0 auto;
}
.column-view {
  padding: 0 0 8rem;
}
img {
  max-width: 100%;
}
.main-area {
  position: relative;
  width: 820px;
  max-width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  padding-left: 2.67rem;
  padding-right: 2.67rem;
  box-sizing: border-box;
}
.article-area {
  margin-bottom: 5.5rem;
  border-radius: 4px 4px 0 0;
}
// 文章右侧
article {
  position: relative;
  padding-top: 2.667rem;
  z-index: 1;
  overflow: hidden;
  background-color: #ffff;
}
// 标题
.article-title {
  margin: 0 0 1.667rem;
  font-size: 1.667rem;
  font-weight: 600;
  line-height: 1.31;
  color: #252933;
}
// 发布者
.author-info-block {
  display: flex;
  align-items: center;
  margin-bottom: 1.667rem;
  .avatar-link {
    font-size: 0;
  }
  .avatar {
    flex: 0 0 auto;
    margin-right: 0.5rem;
    width: 2.333rem;
    height: 2.333rem;
    border-radius: 50%;
  }
  .author-info-box {
    min-width: 0;
    flex-grow: 1;
    flex: 1;
    min-height: 43px;
  }
  .author-name {
    height: 2rem;
    display: flex;
    align-items: center;
    .username {
      font-size: 1rem;
      font-weight: 500;
      color: #515767;
      line-height: 2rem;
    }
  }
}
.username {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--juejin-font-1);
  display: flex;
  align-items: center;
  .name {
    display: inline-block;
    vertical-align: top;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.avatar {
  display: inline-block;
  position: relative;
  background-position: 50%;
  background-size: cover;
  background-repeat: no-repeat;
}
// 时间
.meta-box {
  text-align: left;
  font-size: 0.569rem;
  color: #8a919f;
  margin-top: 2px;
  line-height: 22px;
  .time {
    letter-spacing: 1px;
  }
}
// 文章内容
.markdown-body {
  word-break: break-word;
  line-height: 1.75;
  font-weight: 400;
  font-size: 16px;
  overflow-x: hidden;
  color: #252933;
}
.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  line-height: 1.5;
  margin-top: 35px;
  margin-bottom: 10px;
  padding-bottom: 5px;
}
.markdown-body h1 {
  font-size: 24px;
  line-height: 38px;
  margin-bottom: 5px;
}
.markdown-body h2 {
  font-size: 22px;
  line-height: 34px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ececec;
}
.markdown-body h3 {
  font-size: 20px;
  line-height: 28px;
}
.markdown-body h4 {
  font-size: 18px;
  line-height: 26px;
}
.markdown-body h5 {
  font-size: 17px;
  line-height: 24px;
}
.markdown-body h6 {
  font-size: 16px;
  line-height: 24px;
}
.markdown-body p {
  line-height: inherit;
  margin-top: 22px;
  margin-bottom: 22px;
}
.markdown-body img {
  max-width: 100%;
}
.markdown-body hr {
  border: none;
  border-top: 1px solid #ddd;
  margin-top: 32px;
  margin-bottom: 32px;
}
.markdown-body code {
  word-break: break-word;
  border-radius: 2px;
  overflow-x: auto;
  background-color: #fff5f5;
  color: #ff502c;
  font-size: 0.87em;
  padding: 0.065em 0.4em;
}
.markdown-body code,
.markdown-body pre {
  font-family: Menlo, Monaco, Consolas, Courier New, monospace;
}
.markdown-body pre {
  overflow: auto;
  position: relative;
  line-height: 1.75;
}
.markdown-body pre > code {
  font-size: 12px;
  padding: 15px 12px;
  margin: 0;
  word-break: normal;
  display: block;
  overflow-x: auto;
  color: #333;
  background: #f8f8f8;
}
.markdown-body a {
  text-decoration: none;
  color: #0269c8;
  border-bottom: 1px solid #d1e9ff;
}
.markdown-body a:active,
.markdown-body a:hover {
  color: #275b8c;
}
.markdown-body table {
  display: inline-block !important;
  font-size: 12px;
  width: auto;
  max-width: 100%;
  overflow: auto;
  border: 1px solid #f6f6f6;
}
.markdown-body thead {
  background: #f6f6f6;
  color: #000;
  text-align: left;
}
.markdown-body tr:nth-child(2n) {
  background-color: #fcfcfc;
}
.markdown-body td,
.markdown-body th {
  padding: 12px 7px;
  line-height: 24px;
}
.markdown-body td {
  min-width: 120px;
}
.markdown-body blockquote {
  color: #666;
  padding: 1px 23px;
  margin: 22px 0;
  border-left: 4px solid #cbcbcb;
  background-color: #f8f8f8;
}
.markdown-body blockquote:after {
  display: block;
  content: '';
}
.markdown-body blockquote > p {
  margin: 10px 0;
}
.markdown-body ol,
.markdown-body ul {
  padding-left: 28px;
}
.markdown-body ol li,
.markdown-body ul li {
  margin-bottom: 0;
  list-style: inherit;
}
.markdown-body ol li .task-list-item,
.markdown-body ul li .task-list-item {
  list-style: none;
}
.markdown-body ol li .task-list-item ol,
.markdown-body ol li .task-list-item ul,
.markdown-body ul li .task-list-item ol,
.markdown-body ul li .task-list-item ul {
  margin-top: 0;
}
.markdown-body ol ol,
.markdown-body ol ul,
.markdown-body ul ol,
.markdown-body ul ul {
  margin-top: 3px;
}
.markdown-body ol li {
  padding-left: 6px;
}
.markdown-body .contains-task-list {
  padding-left: 0;
}
.markdown-body .task-list-item {
  list-style: none;
}
@media (max-width: 720px) {
  .markdown-body h1 {
    font-size: 24px;
  }
  .markdown-body h2 {
    font-size: 20px;
  }
  .markdown-body h3 {
    font-size: 18px;
  }
}
.markdown-body pre,
.markdown-body pre > code.hljs {
  color: #333;
  background: #f8f8f8;
}
.hljs-comment,
.hljs-quote {
  color: #998;
  font-style: italic;
}
.hljs-keyword,
.hljs-selector-tag,
.hljs-subst {
  color: #333;
  font-weight: 700;
}
.hljs-literal,
.hljs-number,
.hljs-tag .hljs-attr,
.hljs-template-variable,
.hljs-variable {
  color: teal;
}
.hljs-doctag,
.hljs-string {
  color: #d14;
}
.hljs-section,
.hljs-selector-id,
.hljs-title {
  color: #900;
  font-weight: 700;
}
.hljs-subst {
  font-weight: 400;
}
.hljs-class .hljs-title,
.hljs-type {
  color: #458;
  font-weight: 700;
}
.hljs-attribute,
.hljs-name,
.hljs-tag {
  color: navy;
  font-weight: 400;
}
.hljs-link,
.hljs-regexp {
  color: #009926;
}
.hljs-bullet,
.hljs-symbol {
  color: #990073;
}
.hljs-built_in,
.hljs-builtin-name {
  color: #0086b3;
}
.hljs-meta {
  color: #999;
  font-weight: 700;
}
.hljs-deletion {
  background: #fdd;
}
.hljs-addition {
  background: #dfd;
}
.hljs-emphasis {
  font-style: italic;
}
.hljs-strong {
  font-weight: 700;
}
// 文章左侧
.aside {
  background-color: #fff;
  position: absolute;
  top: 0;
  right: 0;
  width: 25rem;
}
.sidebar-block {
  position: relative;
  margin-bottom: 1.5rem;
  border-radius: 2px;
  box-shadow: none;
  background-color: #fff;
  margin-bottom: 20px;
  .block-title {
    padding: 1rem 0;
    margin: 0 1.3rem;
    font-size: 16px;
    line-height: 2rem;
    color: #1d2129;
    font-weight: 500;
    border-bottom: 1px solid #e4e6eb;
    text-align: left;
  }
  .entry-list {
    padding: 0.667rem 0 1.333rem;
  }
  .item {
    display: block;
    cursor: pointer;
    padding: 0.667rem 1.667rem;
  }
  .entry-title {
    margin: 0 1.3rem;
    border-bottom: 1px solid #e4e6eb;
    line-height: 22px;
    font-size: 0.9rem;
    font-weight: 400;
    color: #252933;
    text-align: left;
  }
}
a {
  text-decoration: none;
}
/deep/.el-button-group {
  padding-bottom: 11px;
  margin-left: -77%;
}
</style>
