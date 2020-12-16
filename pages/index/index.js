const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasAuthToCreate:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:"getUserOpenID",
      success:function(succ){
        console.log("succ",succ)
        if(succ.result.db.data.length != 1){
          // 数据空或多于1 抛弃
          return
        }else{
          var user_db = succ.result.db.data[0]
          app.globalData.user_db = user_db
          console.log(user_db)
        }
      }
    })
  },
  newDorUpload:function(e){
    wx.showModal({
      title: '提示',
      content: '是否新建宿舍上报事件？(注:每天创建一个就可以喔~创建完毕后请在群里上报)',
      success: function (res) {
        if (res.confirm) {
          //这里是点击了确定以后
          wx.showToast({
            title: '创建中...',
            icon:'loading',
            duration:10000
          })
          if(!app.globalData.user_db.cid){
            wx.showToast({
              title: '创建失败：未授权',
              icon:'none',
              duration:1500
            })
            return 0
          }
          wx.cloud.callFunction({
            name:"getStudentPermission",
            data:{
              name:"createDomitory",
              cid:app.globalData.user_db.cid
            },
            success:res =>{
              console.log(res)
              if(res.result.pass){
                // 权限通过
                app.globalData.user_perm.createDormitory = true
                wx.navigateTo({
                  url: '../efficiency/newDormitoryUpload/newDormitoryUpload',
                })
              }else{
                // 权限不通过
                wx.showToast({
                  title: '创建失败：无权限(仅宿舍长可创建)',
                  icon:'none',
                  duration:1500
                })
              }
              
            },
            fail:err=>{
              wx.showToast({
                title: '创建失败：错误',
                icon:'none',
                duration:1500
              })
            }
          })
          
        } else {//这里是点击了取消以后
          wx.showToast({
            title: '已取消',
            icon:'none',
            duration:700
          })
        }
      }
    })
  },
  jumpToReportPage: function(e){
    wx.navigateTo({
      url: '../reportMain/reportMain',
    })
  },
  jumpToUpdatePage: function(e){
    wx.navigateTo({
      url: '../updateLog/updateLog',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: (result) => {console.log(result)},
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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
  onShareAppMessage: function () {
    
  }
})