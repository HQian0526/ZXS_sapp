// app.js
App({
data:{      
},

  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        let token = {
          loginCode:res.code,
          openId:'',
          session_key:""
        };
        wx.request({
          url: 'http://localhost:8888/ZXS/Login/getToken',
          data:{reqMsg:res.code},
          method:"POST",
          success:result=>{
            if(result.data.code==0){
              console.log("登录成功",result)
              const tokens = JSON.parse(result.data.msg);
              token.session_key = tokens.session_key;
              token.openId = tokens.openid;
              wx.setStorageSync("token",token);
            }
          }
        })

        //声明回调函数
        const tokenRes = wx.getStorageSync("token")
        let tokenId = tokenRes.openid;
        if(this.tokenIdCallBack){
          this.tokenIdCallBack(tokenId)
        }
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    tokenRes: null
  }
})
