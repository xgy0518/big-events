$(function () {
  let form = layui.form
  form.verify({
    pass: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

    diff: function (value) {
      let oldPwd = $('[name=oldPwd]').val()

      if (value === oldPwd) {
        return '新密码不能和原密码相同'
      }
    },
    same: function (value) {
      let newPwd = $('[name=newPwd]').val()

      if (newPwd !== value) {
        return '两次密码不一致'
      }
    },
  })

  $('#form').on('submit',function(e){
    e.preventDefault();
    let data = $(this).serialize()

    axios.post('/my/updatepwd',data).then((res) => {
      console.log(res);

      if(res.data.status !== 0){
        return layer.msg("重置密码失败");
      }
      layer.msg("重置成功");
      // 表单重置功能
      $("#form")[0].reset();
    })
  })
})
