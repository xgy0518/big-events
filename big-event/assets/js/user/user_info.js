$(function () {
  let form = layui.form

  function renderForm() {
    axios.get('/my/userinfo').then((res) => {
      console.log(res)
      form.val('user', res.data.data)
    })
  }
  renderForm()
  
  // 表单校验
  form.verify({
    nickname:function(value){
      if (value.length > 6) {
        return "昵称长度需要在1-6个字符";
    }
    }
  }); 

  $('#form').on('submit',function(e){
    e.preventDefault();

    let data = $(this).serialize()

    axios.post('/my/userinfo',data).then((res) => {
      console.log(res);
      if(res.data.status !== 0){
        return layer.msg('修改用户信息失败')
      }
      layer.msg('修改成功');
      window.parent.getUserInfo();
    })
  })

  $('#btnReset').click(function(e){
    e.preventDefault();
    renderForm()
  })
})
