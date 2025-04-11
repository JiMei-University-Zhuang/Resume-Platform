import request from '@/utils/request'

/**
 * 获取用户通知列表
 * @returns 通知列表
 */
export function getNoticeList(token: string) {
  return request<NoticeResponse>({
    url: '/notice/getNoticeList',
    method: 'get',
    params: { token }
  })
}

/**
 * 标记通知为已读
 * @param noticeId 通知ID
 * @returns 操作结果
 */
export function markNoticeAsRead(noticeId: string) {
  return request<{ code: number; msg: string }>({
    url: '/notice/setRead',
    method: 'get',
    params: { noticeId }
  })
}

/**
 * 标记所有通知为已读
 * @returns 操作结果
 */
export function markAllNoticesAsRead() {
  return request<{ code: number; msg: string }>({
    url: '/notice/setReadAll',
    method: 'get'
  })
}

/**
 * 删除通知
 * @param noticeId 通知ID
 * @returns 操作结果
 */
export function deleteNotice(noticeId: string) {
  return request<{ code: number; msg: string }>({
    url: '/notice/delete',
    method: 'get',
    params: { noticeId }
  })
}

// 通知类型定义
export interface Notice {
  noticeId: string
  userId?: string
  icon?: string
  publishTime?: number
  isRead: number
  title?: string
  content: string
  type?: 'info' | 'warning' | 'success' | 'task'
}

// 通知响应结构
export interface NoticeResponse {
  code: number
  msg: string
  data: Notice[]
}
