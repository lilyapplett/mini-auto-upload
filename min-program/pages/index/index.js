var helloData = {
    name: 'Weixin'
  }
  
  // Register a Page.
  Page({
    data: helloData,
    changeName: function(e) {
      // sent data change to view
      this.setData({
        name: 'MINA'
      })
    },
    onLoad(options){
        console.log('query:',options)
    }
  })