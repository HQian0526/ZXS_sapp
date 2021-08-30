const app = getApp();
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
    }   ,
    
    
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    iconList: [{
      icon: 'shop',
      color: 'orange',
      badge: 18,
      name: '全部'
    }, {
      icon: 'repair',
      color: 'orange',
      badge: 1,
      name: '待处理'
    }, {
      icon: 'medal',
      color: 'orange',
      badge: 0,
      name: '已处理'
    },{
      icon: 'favorfill',
      color: 'orange',
      badge: 0,
      name: '我的收藏'
    }],
  functionList:[{
      icon: 'text',
      color: 'orange',
      badge: 0,
      name: '完善资料'
    },{
      icon: 'friendadd',
      color: 'orange',
      badge: 0,
      name: '邀请好友'
    },{
      icon: 'vip',
      color: 'orange',
      badge: 0,
      name: '等级特权'
    },{
      icon: 'info',
      color: 'orange',
      badge: 0,
      name: '常见问题'
    },{
      icon: 'service',
      color: 'orange',
      badge: 0,
      name: '联系客服'
    },],
    gridCol:4,
    skin: false,

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

  nofunction(){
    wx.showToast({
      title: '功能未开放！',
      icon:'none'
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