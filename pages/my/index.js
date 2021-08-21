// pages/my/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show : true,
    logintype:0,      //登录状态
    hasUserInfo: false,  //是否有用户信息
    canIUseGetUserProfile: false,  //能否获取用户信息
    avatarUrl:'',   //头像
    nickName:'',     //昵称
    shopPoint:'--'    //店铺信誉分
  },

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //避免重复登录，读缓存，若有数据，则跳过登录
    const userinfo = wx.getStorageSync("userinfo") 
    if(userinfo)
    this.setData({
      avatarUrl:userinfo.avatarUrl, //头像
      nickName:userinfo.nickName
    })
  },

  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          logintype:1,
          hasUserInfo: true,
          avatarUrl:res.userInfo.avatarUrl,
          nickName:res.userInfo.nickName,
          show:false
        })
        wx.setStorageSync('userinfo', {
          avatarUrl:res.userInfo.avatarUrl,
          city:res.userInfo.city,
          gender:res.userInfo.gender,
          country:res.userInfo.country,
          avatarUrl:res.userInfo.avatarUrl,
          nickname:res.userInfo.nickName,
          province:res.userInfo.province,
        })
      },
      fail: (res) => {
        console.log("用户未授权")
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

  },

})