export function down(response: any, name: string = '') {
  const file = response.headers['content-disposition']
  const fileName = file ? decodeURI(file) : name
  const blob = new Blob([response.data], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  })
  const downloadElement = document.createElement('a')
  const href = URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = fileName // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}
