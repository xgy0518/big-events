$(function () {
  let layer = layui.layer
  let form = layui.form
  getCates()
  function getCates() {
    axios.get('/my/article/cates').then((res) => {
      if (res.data.status !== 0) {
        return layer.msg(res.data.message)
      }

      // 获取成功
      layer.msg(res.data.message)

      // 把数据显示到页面中
      $('tbody').empty()
      res.data.data.forEach((item) => {
        $(`<tr>
            <td>${item.name}</td>
            <td>${item.alias}</td>
            <td>
              <button data-id="${item.Id}" type="button" class="layui-btn layui-btn-xs btn_edit">编辑</button>
              <button data-id="${item.Id}" type="button" class="layui-btn layui-btn-xs layui-btn-danger btn_delete">删除</button>
            </td>
          </tr>`).appendTo($('tbody'))
      })
    })
  }
  let index
  $('#btnAddCate').on('click', function () {
    index = layer.open({
      type: 1, // 层的类型，1表示页面层
      title: '添加文章类别', // 标题
      area: ['500px', '250px'], // 宽度高度
      content: addFormStr, // 内容
    })
  })
  let addFormStr = `<form id="addForm" class="layui-form" action="" style="margin-top: 15px; margin-right: 50px;">
      <!-- 第一行 分类名称 -->
      <div class="layui-form-item">
          <label class="layui-form-label">分类名称</label>
          <div class="layui-input-block">
            <input type="text" name="name" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
  </div>
  </div>
      <!-- 第二行 分类别名  -->
      <div class="layui-form-item">
          <label class="layui-form-label">分类别名</label>
          <div class="layui-input-block">
            <input type="text" name="alias" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
  </div>
  </div>
      <!-- 第三行 按钮 -->
      <div class="layui-form-item">
          <div class="layui-input-block">
            <button class="layui-btn" lay-submit lay-filter="formDemo">确认添加</button>
            <button type="reset" class="layui-btn layui-btn-primary">重置</button>
  </div>
  </div>
  </form>`
  // 提交
  $('body').on('submit', '#addForm', function (e) {
    e.preventDefault()
    let data = $(this).serialize()

    axios.post('/my/article/addcates', data).then((res) => {
      // console.log(res)
      if (res.data.status !== 0) {
        return layer.msg('新增文章分类失败')
      }
      layer.msg('新增文章分类成功')
      layer.close(index)
      getCates()
    })
  })

  // 删除

  $('body').on('click', '.btn_delete', function () {
    let id = $(this).attr('data-id')
    layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
      axios.get('/my/article/deletecate/' + id).then((res) => {
        // console.log(res)
        if (res.data.status !== 0) {
          return layer.msg('res.data.status')
        }
        layer.msg('删除成功')
        layer.close(index)
        getCates()
      })
    })
  })

  // 编辑
  let editIndex
  $('body').on('click', '.btn_edit', function () {
    let id = $(this).attr('data-id')
    editIndex = layer.open({
      type: 1, // 层的类型，1表示页面层
      title: '修改文章类别', // 标题
      area: ['500px', '250px'], // 宽度高度
      content: editFormStr, // 内容
    })

    axios.get('/my/article/cates/' + id).then((res) => {
      // console.log(res)
      form.val('editForm', res.data.data)
    })
  })
  let editFormStr = `<form id="editForm" class="layui-form" lay-filter='editForm' action="" style="margin-top: 15px; margin-right: 50px;">

  <div class="layui-form-item layui-hide">
    <label class="layui-form-label">Id</label>
	<div class="layui-input-block">
    	<input type="text" name="Id" required  lay-verify="required" placeholder="Id" autocomplete="off" class="layui-input">
    </div>
</div>
    <!-- 第一行 分类名称 -->
    <div class="layui-form-item">
        <label class="layui-form-label">分类名称</label>
        <div class="layui-input-block">
          <input type="text" name="name" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
</div>
</div>
    <!-- 第二行 分类别名  -->
    <div class="layui-form-item">
        <label class="layui-form-label">分类别名</label>
        <div class="layui-input-block">
          <input type="text" name="alias" required  lay-verify="required" placeholder="请输入标题" autocomplete="off" class="layui-input">
</div>
</div>
    <!-- 第三行 按钮 -->
    <div class="layui-form-item">
        <div class="layui-input-block">
          <button class="layui-btn" lay-submit lay-filter="formDemo">确认修改</button>
</div>
</div>
</form>`

  $('body').on('submit', '#editForm', function (e) {
    e.preventDefault()
    let data = $(this).serialize()
    console.log(data)

    axios.post('/my/article/updatecate', data).then((res) => {
      console.log(res)
      if(res.data.status !== 0){
        return layer.msg("更新失败");
      }
      layer.msg("更新成功");
      layer.close(editIndex);
      getCates()
    })
  })
})
