// miniprogram/pages/admin/addcourse/addcourse.js
const app = getApp()

Page({
  data: {
    courseId:'',
    name: '',
    price: '',
    cover: '',
    newCover: '',
    tagsText: '',
    tags: []
  },
  onLoad: function (options) {
    options.courseId = 'XIDN0d7E7L4wkl4j'
    this.setData({
      courseId: options.courseId
    })
    if (options.courseId) {// 修改
      
      Promise.all([this.getCorse(options.courseId), this.getCourseTags()])
        .j_then(([courseDetail, tags]) => {
          tags.forEach(item => {
            const bool = courseDetail.tags.some(i => {
              return i === item.name
            })
            if(bool) {
              item.checked = true
            }
          })
          this.setData({
            courseId: options.courseId,
            tags: tags
          })
        })
    } else {// 添加
      this.getCourseTags()
    }
    
  },
  getCorse(courseId) {
    return app.db.collection('course')
      .doc(courseId)
      .get().then(res => {
        console.log(res)
        this.setData({
          name: res.data.name,
          price: res.data.price
        })
        return res.data
      })
  },
  getCourseTags() {
    return app.db.collection('courseTags')
      .doc('course-tags')
      .get()
      .then(res => {
        let tagsObj = []
        res.data.tags.forEach((item, index) => {
          tagsObj[index] = {
            name: item
          }
        })
        this.setData({
          tags: tagsObj
        })
        return tagsObj
      })
  },
  selectTag(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      ['tags[' + index + '].checked']: !this.data.tags[index].checked
    })
  },
  choseCover() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        
        that.setData({
          newCover: tempFilePaths[0],
          cover: tempFilePaths[0]
        })
      }
    })
  },
  validate() {
    if(this.data.name.trim() === '') {
      app.showToast('课程名称不能为空')
      return false
    }
    return true
  },
  submit() {
    if (this.validate()) {
      const tags = []
      this.data.tags.forEach(item => {
        if(item.checked) {
          tags.push(item.name)
        }
      })
      wx.cloud.callFunction({
        name: 'router',
        data: {
          $url: 'admin/editCourse',
          courseId: this.data.courseId,
          name: this.data.name,
          price: this.data.price,
          cover: this.data.newCover,
          tagsText: this.data.tagsText,
          tags: tags
        }
      }).j_then(res => {
        const that = this
        this.setData({
          courseId: res.result._id || this.data.courseId,
        })
        wx.cloud.uploadFile({
          cloudPath: `course${that.data.courseId}`,
          filePath: that.data.newCover, // 文件路径
        })
        app.showToast('保存成功')
        wx.navigateBack({
          delta: 1,
        })
      })
    }
  }
})