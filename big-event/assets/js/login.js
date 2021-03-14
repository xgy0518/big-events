$(function(){
  $('#showReg').on('click',function(){

    // 注册页面显示
    $('.reg-form').show()
    // 登录页面隐藏
    $('.login-form').hide()
  })

  $('#showLogin').on('click',function(){
    // 登录页面显示
    $('.reg-form').hide()
    // 注册页面隐藏
    $('.login-form').show()
  })


  // 验证
  let form = layui.form;
  form.verify({
    username: function(value, item){ //value：表单的值、item：表单的DOM对象
      if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
        return '用户名不能有特殊字符';
      }
      if(/(^\_)|(\__)|(\_+$)/.test(value)){
        return '用户名首尾不能出现下划线\'_\'';
      }
      if(/^\d+\d+\d$/.test(value)){
        return '用户名不能全为数字';
      }
      
      //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
      if(value === 'xxx'){
        alert('用户名不能为敏感词');
        return true;
      }
    }
    
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    ,pass: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ] ,
    repwd:function(value){
      let pwb = $('#haha').val()

      if(value !== pwb){
        return '两次密码不一致'
      }
    }
  }); 

  let layer = layui.layer;
  
  // 注册功能
  $('.reg-form').on('submit',function(e){
    e.preventDefault()

    let data = $(this).serialize()

    axios.post('/api/reguser',data).then((res) =>{
      // console.log(res);

      if(res.data.status !== 0){
        return layer.msg('注册失败')
      }

      layer.msg('注册成功')
      $("#showLogin").click();
    })
  })

  // 登录功能
  $('.login-form').on('submit',function(e){
    e.preventDefault()

    let data = $(this).serialize()
    axios.post('/api/login',data).then((res) => {
      // console.log(res);

      if(res.data.status !== 0){
        return layer.msg('登录失败')
      }
      localStorage.setItem('token',res.data.token)

      layer.msg('登录成功')
      location.href = 'index.html'
    })
  })
  
})