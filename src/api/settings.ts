import request from '@/utils/request'

export interface PersonalSettings {
  id: string | number
  username: string
  name: string
  sex: number
  email: string
  telephone: string
  role: string
}

export interface EditSettingsData {
  id: number
  name: string
  sex: number
  email: string
  telephone: string
}

export const getPersonalSettings = () => {
  return request({
    url: '/settings/personal',
    method: 'get'
  })
}

export const updatePersonalSettings = (data: EditSettingsData) => {
  return request({
    url: '/settings/personal',
    method: 'put',
    data
  })
}
