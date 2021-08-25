
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show : true,
    loginStatus:false,      //登录状态
    shopPoint:'--',    //店铺信誉分
    user:{
      nickName:'账号未登录',     //昵称
      avatarUrl:'',   //头像
    }     
  },

    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //避免重复登录，读缓存，若有数据，则跳过登录
    const user = wx.getStorageSync("user") 
    if(!user || user==""){
      this.setData({
        loginStatus:false,
      })
    }else{
      this.setData({
        user:{
          avatarUrl:user.avatarUrl, //头像
          nickName:user.nickName,
        },
        loginStatus:true
      })
    }
  },

  getUserProfile(e) {
    wx.getUserProfile({
      desc: '获取你的昵称、头像、地区及性别', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          user:{
            nickName:res.userInfo.nickName,
            gender:res.userInfo.gender,
            province:res.userInfo.province,
            city:res.userInfo.city,
            avatarUrl:res.userInfo.avatarUrl,
            loginCode:this.data.loginCode,
          },
          loginStatus:true
        })
        wx.setStorageSync("user",this.data.user);
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