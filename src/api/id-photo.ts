import request from '@/utils/request'
import { AxiosResponse } from 'axios'

/**
 * 上传并处理证件照
 * @param file 需要上传的图片文件
 * @param backgroundColor 背景颜色(HEX格式，例如: #FF0000)
 * @param options 其他可选参数(可包含如大小、美化选项等)
 * @returns 返回JSON数据，包含Base64编码的图片
 */
export const uploadIdPhoto = (
  file: File,
  backgroundColor: string,
  options?: Record<string, any>
): Promise<AxiosResponse> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('colorHEX', backgroundColor)

  // 添加其他选项参数
  if (options) {
    Object.keys(options).forEach(key => {
      if (options[key] !== undefined && options[key] !== null) {
        formData.append(key, options[key].toString())
      }
    })
  }

  return request({
    url: '/ai/photo',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}
