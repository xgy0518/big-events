$(function () {

  let layer = layui.layer;
  getUserInfo()
  function getUserInfo() {
    axios
      .get('/my/userinfo', {
        // headers: {
        //   Authorization: localStorage.getItem('token'),
        // },
      })
      .then((res) => {
        console.log(res)

        let info = res.data.data
        let name = info.nickname || info.username

        $('#welcome').text('欢迎' + name)

        if (info.user_pic) {
          $('.layui-nav-img').attr('src', info.user_pic).show()

          $('.text-avatar-box').hide()
        } else {
          $('.text-avatar-box').show().children().text(name[0].toUpperCase())

          $('.layui-nav-img').hide()
        }
      })
  }

  // 点击退出
  $('#btnLogout').click(function(){
    layer.confirm('你确定要删除吗', {icon: 3, title:'提示'}, function(index){
      
      localStorage.removeItem('token');
      layer.close(index);
      location.href = 'login.html'
    });
  })
})
