// 根路径
axios.defaults.baseURL = 'http://ajax.frontend.itheima.net'

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (config.url.indexOf('/my') !== -1) {
      config.headers.Authorization = localStorage.getItem('token')
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    if (
      response.data.status === 1 &&
      response.data.message === "身份认证失败！"
    ) {
      // 把token信息删除
      localStorage.removeItem('token')
      location.href = './login.html'
    }
    return response
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
