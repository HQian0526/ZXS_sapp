const app = getApp();
Page({
  data: {
    userInfo: {},
    user:{},    //用户信息，存入缓存
    loginCode:'',  //登录随机号
    loginStatus:false,
    a:1
  },
  
  onLoad() {
    if(!app.globalData.loginCode || app.globalData.loginCode==""){
      app.loginCodeCallBack=loginCode=>{
        if(loginCode!=""){
          const user = wx.getStorageSync("user");
          if(!user || user==""){  //无缓存，未登录
            this.setData({ loginStatus:false})
          }else{
            this.setData({
              loginStatus:'true',
            })
          }
        }
      }
    }else{
      const user = wx.getStorageSync("user");
          if(!user || user==""){  //无缓存，未登录
            this.setData({ loginStatus:false})
          }else{
            this.setData({
              loginStatus:'true',
            })
          }
    }
  },

  onShow(){
    const user = wx.getStorageSync("user");
          if(!user || user==""){  //无缓存，未登录
            this.setData({ loginStatus:false})
          }else{
            this.setData({
              loginStatus:'true',
            })
          }
  },

  /**
   * 获取用户登录信息
   */
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    let that = this;
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

})
