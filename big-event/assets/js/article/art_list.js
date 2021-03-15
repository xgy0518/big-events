$(function () {
  let laypage = layui.laypage
  let form = layui.form
  let layer = layui.layer
  let query = {
    pagenum: 1, // 是	int	页码值
    pagesize: 2, // 是	int	每页显示多少条数据
    cate_id: '', // "" 所有的文章分类 否	string	文章分类的 Id
    state: '', // "" 所有状态 文章状态  可选值有：已发布、草稿
  }
  getList()
  function getList() {
    axios
      .get('/my/article/list', {
        params: query,
      })
      .then((res) => {
        if (res.data.status !== 0) {
          // 获取失败
          return layer.msg(res.data.message)
        }
        $('#list').empty()
        res.data.data.forEach((item) => {
          $(` <tr>
      <td>${item.title}</td>
      <td>${item.cate_name}</td>
      <td>${formatTime(item.pub_date)}</td>
      <td>${item.state}</td>
      <td>
        <button data-id="${item.Id}" type="button" class="layui-btn layui-btn-xs btn_edit">
          编辑
        </button>
        <button data-id="${item.Id}"
          type="button"
          class="layui-btn layui-btn-danger layui-btn-xs btn_delete"
        >
          删除
        </button>
      </td>
    </tr>`).appendTo($('#list'))
        })
        renderLayPage(res)
      })
  }

  function paddZero(n) {
    return n < 10 ? '0' + n : n
  }

  // 格式化时间
  function formatTime(time) {
    // 1. 将time 转成对应的日期对象
    let d = new Date(time)

    // 2. 有了日期对象，可以去使用对应的方法来得到需要的年 月 日 ...
    let y = d.getFullYear()
    let month = paddZero(d.getMonth() + 1)
    let day = paddZero(d.getDate())
    let h = paddZero(d.getHours())
    let m = paddZero(d.getMinutes())
    let s = paddZero(d.getSeconds())

    // 需要将需要的时间格式给返回出去
    return `${y}/${month}/${day} ${h}:${m}:${s}`
  }
  // 分页器
  function renderLayPage(res) {
    laypage.render({
      elem: 'page-box', // 注意，这里的 page-box 是 ID，不用加 # 号
      count: res.data.total, // 数据总数，从服务端得到
      curr: query.pagenum, // 起始页，从query对象中可以获取到
      limit: query.pagesize, // 每页条数，从query对象中可以获取到
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [1, 2, 3, 5, 8, 10],

      jump: function(obj, first){
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        query.pagenum = obj.curr
        // console.log(obj.limit); //得到每页显示的条数
        query.pagesize = obj.limit
        
        //首次不执行
        if(!first){
          getList()
        }
      }
    })
  }

  // 创建下拉框的分类数据

  axios.get('/my/article/cates').then((res) => {
    // console.log(res);
    res.data.data.forEach((item) => {
      $(`<option value="${item.Id}">${item.name}</option>`).appendTo($('#cateSelect'))
    })
    form.render();
  })


  // 筛选
  $('#form').on('submit',function(e){
    e.preventDefault();

    query.cate_id = $('#cateSelect').val()
    query.state = $('#stateSelect').val()
    query.pagenum = 1
    getList()
  })


  // 删除

  $('#list').on('click','.btn_delete',function(){
    let id = $(this).attr('data-id')
    layer.confirm('确定删除吗?', { icon: 3, title: '提示' },function(index){

      if($('.btn_delete').length === 1){
        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum - 1
      }

      axios.get('/my/article/delete/'+ id).then((res) => {
        // console.log(res);
        if(res.data.status !== 0){
          return layer.msg('res.data.message')
        }
        layer.msg('删除成功')
        layer.close(index)
        getList()
      })
      
    })
  })
  
})
