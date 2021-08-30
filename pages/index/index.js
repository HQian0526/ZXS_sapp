import Toast from '@vant/weapp/toast/toast';
const app = getApp();
Page({
  data: {
    array:[
      '请选择校区',
      '广二师——海珠(敬请期待)',
      '广二师——花都',
      '华工广州学院'
    ],
    position:'请选择校区',    //地区
    show:false,
    userInfo: {},
    user:{},    //用户信息，存入缓存
    loginCode:'',  //登录随机号
    loginStatus:false,
    a:1,
    goodList:['热卖','护肤','数码','生活','餐厨','衣服','学习','游戏','虚拟','零食','创意','其他'],

    // 导航及商品
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true,

    //轮播图
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg'
    }, {
      id: 1,
        type: 'image',
        url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84001.jpg',
    }, {
      id: 2,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg'
    }, {
      id: 3,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg'
    }, {
      id: 4,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big25011.jpg'
    }, {
      id: 5,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big21016.jpg'
    }, {
      id: 6,
      type: 'image',
      url: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big99008.jpg'
    }],
  },
  
  onLoad() {
    if(!app.globalData.loginCode || app.globalData.loginCode==""){  //回调函数确保app.js执行完才执行这个onload
      app.loginCodeCallBack=loginCode=>{
        if(loginCode!=""){
          const user = wx.getStorageSync("user");
          const school = wx.getStorageSync("school");
          if(!school || ""==school){
            //用户选择校区
            this.setData({ show:true })
          }else{
            this.setData({position:school})
          }
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

    // 商品及导航
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    let list = [{}];
    for (let i = 0; i < this.data.goodList.length; i++) {
      list[i] = {};
      list[i].name = this.data.goodList[i];
      list[i].id = i;
    }
    this.setData({
      list: list,
      listCur: list[0]
    })

    // 轮播
    this.towerSwiper('swiperList'); // 初始化towerSwiper 传已有的数组名即可
  },

  onReady(){
    wx.hideLoading()
  },

  /**
   * 【我的小店】登录后跳回首页，隐藏登录按钮
   */
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

  //弹出弹出框
  showPopup(){
    this.setData({ show:true })
  },

  //弹出框关闭
  onClose(){
    this.setData({ show:false })
  },

  //关闭选择器
  onCancel(event){
    const { picker, value, index } = event.detail;
    if(index==0){
      wx.showToast({
        title: '因未选择校区，首页所展示的数据为模拟数据，望悉知',
        icon:'none'
      })
    }
    this.setData({ show:false})
  },

  //选择器确认
  onConfirm(event){
    const { picker, value, index } = event.detail;
    wx.setStorageSync("school",value);
    this.setData({
      position:value,
      show:false
    })
    if(index==0){
      wx.showToast({
        title: '因未选择校区，首页所展示的数据为模拟数据，望悉知',
        icon:'none'
      })
    }
  },

  // 商品导航栏--
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },

  //商品导航栏--
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  },

  //轮播
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // cardSwiper
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  }

})
