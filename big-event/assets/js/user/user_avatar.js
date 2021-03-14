$(function () {
  let $image = $('#image')

  let options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview',
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  $('#btnChooseImage').click(function () {
    $('#file').click()
  })

  $('#file').on('change', function () {
    let file = this.files[0]

    if (!file) {
      return
    }

    let newImgURL = URL.createObjectURL(file)

    $image
      .cropper('destroy') // 销毁旧的裁剪区域
      .attr('src', newImgURL) // 重新设置图片路径
      .cropper(options) // 重新初始化裁剪区域
  })

  $('#btnCreateAvatar').click(function () {
    let base64Str = $image.cropper('getCroppedCanvas', {
      // 创建一个 Canvas 画布
      width: 100,
      height: 100,
    })
    let dataURL = base64Str.toDataURL('image/png')

    axios.post('/my/update/avatar',"avatar=" + encodeURIComponent(dataURL)).then((res) => {
      console.log(res);
      if(res.data.status !== 0){
        return layer.msg("更新头像失败");
      }
      layer.msg("更新成功");
      window.parent.getUserInfo();
    })
  })
})
