// miniprogram/pages/efficiency/newDormitoryUpload/newDormitoryUpload.js
const app = getApp()
const util = require("../../../utils/utils.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sorryItem:"抱歉，您无权限创建新的晚寝上报事件！",
    createDate:"",
    hasAuthToCreate:app.globalData.user_perm.createDormitory,
    waitingItem:"正在请求新建中...",
    hasCreated:false,
    retID:"",
    crtStudentID:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 不自主加载任何项目
    // this.setData({hasCreated:true}) //debug
    let thispage = this
    wx.cloud.init()
    var now_time = new Date()
    this.setData({createDate:util.formatDate(now_time)})
    var until_time = new Date()
    until_time.setDate(until_time.getDate()+2)
    until_time.setHours(0)
    until_time.setMinutes(0)
    until_time.setSeconds(0)
    wx.cloud.database().collection("cls_domitory_upl").add({
      data:{
        date: util.formatTime(now_time),
        until:until_time,
        cid:app.globalData.user_db.cid,
        name:app.globalData.user_db.name,
        class:app.globalData.user_db.class,
        rep:[]
      },
      success:succ=>{
        wx.showToast({
          title: '创建成功',
          duration:500,
          icon:"success"
        })
        thispage.setData({hasCreated:true})
        console.log(succ)
        thispage.setData({retID:succ._id})
        thispage.setData({crtStudentID:app.globalData.user_db.cid})
      },
      fail:err=>{
        wx.showToast({
          title: '未知错误，请返回并重新创建！',
          duration:2000,
          icon:"none"
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({hasAuthToCreate:app.globalData.user_perm.createDormitory})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if(this.data.retID != ''&app.globalData.user_db.cid != 0){
      return {
        title:"请同学们完成本日晚寝上报",
        path:"/pages/efficiency/dormitoryUpload/dormitoryUpload?mid="+this.data.retID+"&cid="+app.globalData.user_db.cid,
        imageUrl:""
      }
    }else{
      return {
        title:"请勿分享本页面喔",
        path:"/pages/index/index",
        imageUrl:""
      }
    }
  }
})