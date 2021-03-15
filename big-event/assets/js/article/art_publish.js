$(function () {
  initEditor()
  let form = layui.form
  // 获取文章类别
  axios.get('/my/article/cates').then((res) => {
    // console.log(res);
    res.data.data.forEach((item) => {
      $(`<option value="${item.Id}">${item.name}</option>`).appendTo(
        $('[name=cate_id]')
      )
    })
    // 需要手动渲染表单
    form.render()
  })

  // 裁剪
  let $image = $('#image')

  let options = {
    // 纵横比
    aspectRatio: 400 / 280,
    // 指定预览区域
    preview: '.img-preview',
  }
  $image.cropper(options)

  $('#btnChooseCoverImage').click(function () {
    $('#fileCover').click()
  })

  // 替换裁切照片
  $('#fileCover').change(function () {
    // 1. 获取到用户选择的文件
    let file = this.files[0]

    // 将文件转成对应的url地址
    let newImgURL = URL.createObjectURL(file)

    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  // 给发布和存为草稿按钮都注册上点击事件，来决定文章的状态
  let state // 存文章的状态

  $('#btnPublish').click(() => (state = '已发布'))
  $('#btnSave').click(() => (state = '草稿'))

  $('#form').submit(function (e) {
    e.preventDefault();

    // 将裁切的图片处理成二进制文件
    $image.cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 400,
      height: 280,
    })
    .toBlob(function(blob){
       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到blob文件对象后，进行后续的操作 ==> 通过 FormData来收集数据， ajax提交数据

        let fd = new FormData($('#form')[0])

         // append() 方法
        // 追加封面 cover_img
        fd.append("cover_img", blob);

        // 追加状态 state
        fd.append("state", state);

        // 发送ajax请求，提交文章数据
        axios.post("/my/article/add", fd).then((res) => {
          console.log(res);

          if (res.data.status !== 0) {
            return layer.msg("发布文章失败！");
          }

          // 跳转页面到文章列表页面
          location.href = "/article/art_list.html";
        });
    })
  })
})
