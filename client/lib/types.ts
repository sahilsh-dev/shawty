export interface UrlData {
  id: string
  originalUrl: string
  shortUrl: string
  totalClicks: number
  createdAt: string
  isExpired: boolean
}

export interface ClickData {
  date: string
  clicks: number
  urlId: string
}
