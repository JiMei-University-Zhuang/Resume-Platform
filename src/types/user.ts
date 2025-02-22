// 用户信息接口
export interface IUser {
  id?: string
  username: string
  password?: string
  name: string
  sex: number
  email: string
  telephone: string
  enabled: number
  role: string
  createTime?: string
}

// 分页响应接口
export interface IPageResponse<T> {
  records: T[]
  total: number
  size: number
  current: number
  pages: number
}

// 用户分页查询参数
export interface IUserQueryParams {
  pageNum?: number
  pageSize?: number
  username?: string
  name?: string
  role?: string
}

// 用户列表响应
export type IUserPageResponse = IPageResponse<IUser>
