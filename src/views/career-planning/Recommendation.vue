<template>
  <div class="career-recommendation">
    <!-- 页面标题和引导语 -->
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><StarFilled /></el-icon>
        职业机会探索
        <span class="beta-tag">Beta</span>
      </h1>
      <p class="page-description">发掘适合你专业背景的热门职位，为你的职业之旅开启新可能。</p>
    </div>

    <!-- 搜索和筛选区域 -->
    <el-card class="search-card">
      <template #header>
        <div class="card-header">
          <span>
            <el-icon><Search /></el-icon> 职位搜索
          </span>
          <el-tooltip content="根据你的条件，探索适合的职位机会，发现潜在的实习与就业可能">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-form :model="searchForm" label-width="120px" label-position="top">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="专业方向" required>
              <el-select
                v-model="searchForm.major"
                filterable
                placeholder="请选择或输入你的专业"
                style="width: 100%"
                @change="handleMajorChange"
              >
                <el-option label="计算机/软件工程" value="cs" />
                <el-option label="电子信息工程" value="ee" />
                <el-option label="数学/统计学" value="math" />
                <el-option label="物理/化学" value="physics" />
                <el-option label="经济/金融" value="economics" />
                <el-option label="管理学" value="management" />
                <el-option label="文学/传媒" value="literature" />
                <el-option label="艺术设计" value="design" />
                <el-option label="医学/生物" value="medicine" />
                <el-option label="其他" value="other" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="意向城市">
              <el-select
                v-model="searchForm.location"
                placeholder="请选择意向城市"
                style="width: 100%"
                @change="handleFilterChange"
              >
                <el-option label="不限" value="" />
                <el-option label="北京" value="北京" />
                <el-option label="上海" value="上海" />
                <el-option label="广州" value="广州" />
                <el-option label="深圳" value="深圳" />
                <el-option label="杭州" value="杭州" />
                <el-option label="成都" value="成都" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="期望类型">
              <el-select
                v-model="searchForm.jobType"
                placeholder="请选择职位类型"
                style="width: 100%"
                @change="handleFilterChange"
              >
                <el-option label="不限" value="" />
                <el-option label="实习" value="internship" />
                <el-option label="校招" value="campus" />
                <el-option label="社招" value="social" />
                <el-option label="兼职" value="parttime" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="searchJobs" :loading="loading" class="glow-btn">
                <el-icon><Search /></el-icon> 搜索职位
              </el-button>
              <el-button @click="resetForm">
                <el-icon><RefreshRight /></el-icon> 重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 职位推荐区域 -->
    <div v-if="recommendationResult" class="recommendation-section">
      <h2 class="section-title">
        <el-icon><Medal /></el-icon> 为你推荐的职位
        <span class="sub-title">基于你的专业背景，为你精选以下职位</span>
      </h2>

      <div class="job-list">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="8" v-for="job in recommendedJobs" :key="job.title">
            <el-card class="job-card" shadow="hover">
              <div class="job-header">
                <h3 class="job-title">{{ job.title }}</h3>
                <div
                  class="match-badge"
                  :style="{ backgroundColor: getMatchColor(job.matchScore) }"
                >
                  {{ job.matchScore }}% 匹配
                </div>
              </div>

              <p class="job-description">{{ job.description }}</p>

              <div class="job-details">
                <div class="job-detail">
                  <el-icon><Money /></el-icon> {{ job.averageSalary }}
                </div>
                <div class="job-detail">
                  <el-icon><TrendCharts /></el-icon> 职业前景: {{ job.growthProspect }}
                </div>
                <div class="job-detail">
                  <el-icon><MagicStick /></el-icon> 工作生活平衡: {{ job.workLifeBalance }}
                </div>
              </div>

              <div class="job-skills">
                <h4>所需技能</h4>
                <div class="skill-tags">
                  <el-tag
                    v-for="(skill, idx) in job.requiredSkills"
                    :key="idx"
                    :type="getTagType(idx)"
                    size="small"
                    class="skill-tag"
                  >
                    {{ skill }}
                  </el-tag>
                </div>
              </div>

              <div class="job-links">
                <h4>查看招聘信息</h4>
                <div class="platform-links">
                  <a
                    v-for="link in job.jobLinks"
                    :key="link.platform"
                    :href="link.url"
                    target="_blank"
                    class="platform-link"
                  >
                    <img :src="link.logo" :alt="link.platform" class="platform-logo" />
                    <span>{{ link.platform }}</span>
                  </a>
                </div>
              </div>

              <div class="job-actions">
                <el-button type="primary" size="small" @click="handleJobAction(job, 'apply')">
                  <el-icon><Document /></el-icon> 投递简历
                </el-button>
                <el-button size="small" @click="handleJobAction(job, 'view')">
                  <el-icon><Star /></el-icon> 收藏
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 热门职位区域 -->
    <div class="hot-jobs-section">
      <h2 class="section-title">
        <el-icon><StarFilled /></el-icon> 热门实习与校招
        <span class="sub-title">精选知名企业最新职位</span>
      </h2>

      <!-- 筛选与排序区域 -->
      <div class="filter-container">
        <el-tabs v-model="activeTab" class="job-tabs">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="技术" name="tech"></el-tab-pane>
          <el-tab-pane label="产品" name="product"></el-tab-pane>
          <el-tab-pane label="设计" name="design"></el-tab-pane>
          <el-tab-pane label="运营" name="operation"></el-tab-pane>
          <el-tab-pane label="市场" name="marketing"></el-tab-pane>
        </el-tabs>

        <div class="filter-options">
          <el-select v-model="sortOption" placeholder="排序方式" size="small">
            <el-option label="最新发布" value="latest"></el-option>
            <el-option label="薪资最高" value="salary"></el-option>
            <el-option label="热度优先" value="hot"></el-option>
          </el-select>

          <el-select v-model="experienceFilter" placeholder="经验要求" size="small">
            <el-option label="不限" value=""></el-option>
            <el-option label="应届生" value="fresh"></el-option>
            <el-option label="1-3年" value="junior"></el-option>
            <el-option label="3-5年" value="mid"></el-option>
            <el-option label="5年以上" value="senior"></el-option>
          </el-select>

          <el-select v-model="companyTypeFilter" placeholder="公司类型" size="small">
            <el-option label="不限" value=""></el-option>
            <el-option label="互联网" value="internet"></el-option>
            <el-option label="国企" value="state"></el-option>
            <el-option label="外企" value="foreign"></el-option>
            <el-option label="创业公司" value="startup"></el-option>
          </el-select>
        </div>
      </div>

      <div class="job-lists">
        <el-row :gutter="20" v-if="enhanceHotJobs.length > 0">
          <el-col :xs="24" :sm="24" :md="12" v-for="job in enhanceHotJobs" :key="job.id">
            <el-card class="hot-job-card" shadow="hover">
              <div class="job-card-header">
                <div class="job-title-container">
                  <h3 class="job-name">{{ job.title }}</h3>
                  <span class="job-salary">{{ job.salary }}</span>
                </div>
                <div class="company-info">
                  <img :src="job.companyLogo" :alt="job.company" class="company-logo" />
                  <div class="company-details">
                    <p class="company-name">{{ job.company }}</p>
                    <div class="company-tags">
                      <el-tag size="small" effect="plain">{{ job.companySize }}</el-tag>
                      <el-tag size="small" effect="plain">{{ job.companyType }}</el-tag>
                    </div>
                  </div>
                </div>
              </div>

              <div class="job-requirements">
                <div class="req-item">
                  <el-icon><Location /></el-icon>
                  <span>{{ job.location }}</span>
                </div>
                <div class="req-item">
                  <el-icon><Reading /></el-icon>
                  <span>{{ job.education }}</span>
                </div>
                <div class="req-item">
                  <el-icon><Stopwatch /></el-icon>
                  <span>{{ job.experience }}</span>
                </div>
              </div>

              <div class="job-tags">
                <el-tag
                  v-for="(tag, index) in job.tags"
                  :key="index"
                  :type="getTagType(index)"
                  size="small"
                  class="job-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>

              <div class="job-description" v-if="job.description">
                <p>{{ job.description }}</p>
              </div>

              <div class="hr-line"></div>

              <div class="recruiter-info">
                <div class="recruiter-avatar">
                  <img :src="job.recruiterAvatar" alt="recruiter" />
                </div>
                <div class="recruiter-details">
                  <div class="recruiter-name">
                    {{ job.recruiterName }}
                    <span class="recruiter-title">{{ job.recruiterTitle }}</span>
                  </div>
                  <div class="last-active">最近活跃: {{ job.lastActive }}</div>
                </div>
                <div class="chat-btn">
                  <el-button type="success" size="small" plain>立即沟通</el-button>
                </div>
              </div>

              <div class="job-actions">
                <el-button type="primary" size="small" @click="handleJobAction(job, 'apply')">
                  <el-icon><Document /></el-icon> 投递简历
                </el-button>
                <el-button size="small" @click="handleJobAction(job, 'view')">
                  <el-icon><Star /></el-icon> 收藏
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <div v-else class="empty-jobs">
          <img src="@/assets/empty-search.svg" alt="暂无数据" class="empty-image" />
          <p>暂无相关职位，请调整筛选条件</p>
        </div>
      </div>

      <div class="more-jobs">
        <el-button type="info" plain
          >查看更多职位 <el-icon><ArrowRight /></el-icon
        ></el-button>
      </div>
    </div>

    <!-- 招聘日历 -->
    <div class="recruitment-calendar">
      <h2 class="section-title">
        <el-icon><Calendar /></el-icon> 招聘日历
        <span class="sub-title">近期校园招聘会和宣讲会信息</span>
      </h2>

      <div class="calendar-filter">
        <el-radio-group v-model="calendarType" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="campus">校园宣讲会</el-radio-button>
          <el-radio-button label="deadline">投递截止</el-radio-button>
          <el-radio-button label="interview">面试日</el-radio-button>
        </el-radio-group>

        <div class="calendar-search">
          <el-input
            v-model="calendarSearch"
            placeholder="搜索公司或院校"
            prefix-icon="Search"
            size="small"
            clearable
          />
        </div>
      </div>

      <el-card shadow="hover" class="calendar-card">
        <el-calendar v-model="calendarValue">
          <template #dateCell="{ data }">
            <div class="calendar-cell" :class="{ 'has-events': hasEvent(data.day) }">
              <p>{{ data.day.split('-').slice(2).join('-') }}</p>
              <div v-if="hasEvent(data.day)" class="calendar-events">
                <el-popover placement="bottom" :width="300" trigger="hover">
                  <template #reference>
                    <div class="event-indicator">
                      <div
                        v-for="(event, index) in getEvents(data.day)"
                        :key="index"
                        class="calendar-event-dot"
                        :style="{ backgroundColor: event.color }"
                      ></div>
                    </div>
                  </template>
                  <div class="popover-events">
                    <div
                      v-for="(event, index) in getEvents(data.day)"
                      :key="index"
                      class="popover-event"
                    >
                      <div class="event-type-tag" :style="{ backgroundColor: event.color }">
                        {{ event.type }}
                      </div>
                      <div class="event-company">{{ event.company }}</div>
                      <div class="event-title">{{ event.title }}</div>
                      <div class="event-time">
                        <el-icon><Clock /></el-icon> {{ event.time }}
                      </div>
                      <div class="event-location">
                        <el-icon><Location /></el-icon> {{ event.location }}
                      </div>
                    </div>
                  </div>
                </el-popover>
              </div>
            </div>
          </template>
        </el-calendar>

        <div class="upcoming-events-container">
          <div class="upcoming-events-header">
            <h3 class="events-title">近期招聘活动</h3>
            <el-button type="primary" link size="small"
              >查看全部 <el-icon><ArrowRight /></el-icon
            ></el-button>
          </div>

          <div class="events-list">
            <div v-for="(event, index) in upcomingEvents" :key="index" class="event-item">
              <div class="event-date">
                <div class="event-month">{{ event.month }}</div>
                <div class="event-day">{{ event.day }}</div>
              </div>
              <div class="event-content">
                <el-tag
                  size="small"
                  :type="event.type === '校招' ? 'primary' : 'success'"
                  effect="dark"
                  class="event-type"
                >
                  {{ event.type }}
                </el-tag>
                <h4 class="event-title">{{ event.title }}</h4>
                <div class="event-company">
                  <img
                    :src="
                      event.companyLogo ||
                      'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                    "
                    class="event-company-logo"
                  />
                  {{ event.company }}
                </div>
                <p class="event-info">
                  <el-icon><Location /></el-icon> {{ event.location }}
                </p>
                <p class="event-info">
                  <el-icon><Clock /></el-icon> {{ event.time }}
                </p>
                <div class="event-actions">
                  <el-button size="small" type="primary">预约参加</el-button>
                  <el-button size="small" plain>加入日历</el-button>
                </div>
              </div>
            </div>
          </div>

          <div class="calendar-companies">
            <h4>热门企业招聘中</h4>
            <div class="company-logos">
              <div
                v-for="(company, index) in popularCompanies"
                :key="index"
                class="company-logo-item"
              >
                <el-tooltip :content="company.name" placement="top">
                  <img :src="company.logo" :alt="company.name" />
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import {
  StarFilled,
  QuestionFilled,
  Medal,
  Search,
  RefreshRight,
  Money,
  TrendCharts,
  MagicStick,
  Location,
  Reading,
  Stopwatch,
  Calendar,
  Clock,
  Document,
  Star,
  ArrowRight
} from '@element-plus/icons-vue'
import type {
  CareerRecommendationForm,
  CareerRecommendationResult,
  CareerRecommendation,
  HotJob
} from '@/types/career'
import { getCommonPositions } from '@/api/career'
import { getProfessionRecommendation } from '@/api/ai'

// 新增的类型定义
interface RecruitmentEvent {
  date: string
  title: string
  location: string
  time: string
  company: string
  type: string
  color: string
  companyLogo?: string
  month?: string
  day?: number
}

interface Company {
  name: string
  logo: string
}

// 扩展HotJob类型，添加UI展示所需的额外属性
interface EnhancedHotJob extends HotJob {
  // 额外UI字段
  recruiterName: string
  recruiterTitle: string
  recruiterAvatar: string
  lastActive: string
  description: string
  companySize: string
  companyType: string
}

// 原有状态
const loading = ref(false)
const activeTab = ref('all')
const commonPositions = ref<string[]>([])
const recommendationResult = ref<CareerRecommendationResult | null>(null)
const calendarValue = ref(new Date())

// 新增状态
const sortOption = ref('latest')
const experienceFilter = ref('')
const companyTypeFilter = ref('')
const calendarType = ref('all')
const calendarSearch = ref('')

// 热门企业列表
const popularCompanies = ref<Company[]>([
  {
    name: '腾讯',
    logo: 'data:image/png;base64,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'
  },
  {
    name: '阿里巴巴',
    logo: 'data:image/png;base64,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'
  },
  {
    name: '字节跳动',
    logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAA/FBMVEX///8xVqaDysb///1If8AutsL///t+y8eX0c1/w78fS6Gqu8gdTJ66xtsbSJ///v+tu8wqucGN09XH0eQ1c7obR6HR2eGxwNZ8n8z1+/l5jrjl6u3Y8fAWsboqUaKntNLN2OaYpsUURJTe4+hBXp3Ezdjn7eqsuNAAO5ZNa6QjTp5rhrERQpifrM6QoMcAOJVgeqoANIgAOJ0vU5wzV5yBlrgpUKZJaKjw9e5CYadPbqgAJ4wgSpNuhbeRpsCFlrkAPIYAOJ99j7y9x+EFOYuNnLit2NdScKK5xtJkfLPl+Pi+5eM9WZMiTZRTv8OHmsNch7qTsc5/ocU1c6zNHMepAAALbUlEQVR4nO2aD3ubthaHRbUqGcWYNQVPpsUGG4MJi51g48SznS03WcjW3txt3/+73CMBDk6dlKRJ1j3PeZ+0BiGEfjr6c46AEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBkG8AJv+njK5TKK1cbuZJpJr2r4LS5nA2m40N1rxJq8ihx3B53s6a/1qFhPLkZDrthx22tt3ALwwH5+w4mk2v4rBvl5dp3gRFXkrlIaXfbgsw7uzDzzwRcvKaBj/buQ4Gp3xxDRcC84TLfkyZ6NBwSKUuJgqAXIx9swopKFzCb1vnhgFVZ35gtLVVj9LstG0cU8IXbaHEjRuEWatTgxrWYGUFcAD3ijycsp7bdnv/tJI7AYVju5d5bXp91AObTOJfFs4vb8j+YdIP+wNaKLRHU7KK40k4DH/qhao3Ge0TPj/v9yG94cXDOG59q5MRJYk2GoVqi9pxm1L/14y0QpsEYUCIpY6lDUX/DfftcM4Jv9J+6pljRi6O7IMY8vi86Y3BnuPY/qd7qnx887NkxpUr329chg2yjDkbJ5wEI5tcJXuNxt5VzAuFPDwLYguGmz3q9EYNRq2wO5uJGYc2wk6j0XBNg7GX1rQJf/97Pu1tJhczDY/GZC8OBuEKZhqw4Sw5HB0eeoe9QqEfBm48EBlBYfgfwrqhP1nKsjpafHh4eH5+8ezz6ZfK39159dv732+nFjMN18aU9eduyImwIV0q4iKHy9FUHAxj2wh9OLLiUmH3MpHP9I8smfc59fV6TMzs92mEq7s7O692dnZ/o9WuCnNpcmVZ/jiEydGIImGwILSYf962uTVpw0yztDI3gWHJF5PuwPqoi15KmTXqGuHpMb+w6KRvcbu9sJ9RoRH224Yt1qr7Fb4SfL+ZzrgehzDVuDDGeBT3qDDKyCCdUbg4mliUx2Y4Opz7UIKljBajcehaP8PK0f15j5yOYu/olPWScBGfu89pwzeqk2pe0r5nTSoV7txSKCou4HL9TsZyDbc6UJJtdIQsDhd78ipMU1bWoxbY1hbpA0p6QdATvcfvGINnXSzeqArgwKL8RYW3bbhBNtr7h6fDu8gVKtrXKpxNqstJHV+zyPPsbukTKWxm36zr9VQ2JF9rCnrH8VfzRAq3OQQ5TXJLPb05FQEJE0AssvZqyjgkf3R+XeYpe/UDW+CpbEj91Wqw9YKxMqpDlK9WWSGGErtXwgvP1HADaq9cq9w+2KyHvKkzPeU1lJXcr7BZRKg1eunKPNpct8spZKb3q8nHnt5en1yEni4xkx6TwXGiz0k3DgNK8wB5NRuuWclC6UxL5G+T1pqlvmBDlneq7Qoz94bVWHFOK+cW3GZfiKMTJ1lVMzrOpTwHR4gcpIomcJJ0X1SW8YlzRbqa1qF5G7Fr1YHFTPw5+nW+dZBAlqJ29zkq9RT+/sfbXdGS2xWeQt0i+AO01FESR0ujnETzfMLsUIMUKD3S8lyAkypKEsEZRFeMHETpqgO4jjIkU+/c5gq4ukIh+bj4KBReTPolkwvoKYvok6JMPn1aQFmTVp2g6y6FzSao+++HDx/ekjsVXjuKp2s5nuZ58K841FNoZ2ofmbrugQG8he6VqJPEgZxafEmFQi8fUn1nSAJVt3gC4UpXBRtO0ivyOSsNmihR0tRxoEnD3uMVUvr+w4fXr3/44fVbMRjvUqhbA3sbluxJXB7P0pNqJstxlvJ8wJrkwPHywdtPhyRTzcyOnLZUaGvp6ZbqGpfjmeJcjgVOYhpfFripsDpw34NAkPj6Lb1HoXdXUNAXNpRFknk6I5XhAlY6KxqRChsWCsGGlqYGIGwKCqPANqGnfg6U6Tpafs+eqj1QYZNV9r1oDYWn8eguhZF3WcggM/WkuloMInW5ru6NDUGh7TkHtppeiHEY+KrW2l700vHyePLhCgn/yx8Uj66jsMn58R1DnfHj42JFI+P+GBSu8w2Gwykp7XugxTcKueYsbd1xRS8NWprW/bxccduJsyCPVEj5u3fv/vdnl4tOVceG4ontc+82k6zs7eWKJZe2kuJG6ZocRKbcMoVqDwk7UWe2rnaEDVuuGYJ2nm0ipqXYmRcK9Ycr/Ps7wbs/69lQVvRadzaBpcsrXQ6aNbYjqwp3u1oUNFqtVpaAQhq4brdQGGQrF/IMYrWCJkTbMcxFj1b4Tir87kdSX2Gwv8FyP0kScx1neKpYPtY1LFH1xM4VRgpc1VRNETYEO/u6GkiFcLUp5OgmtJmq5p7POdzVNbViS+DhCskjFEqHuAKxE0Udr2cWXReVS8WaD4d6UVFdU6JT2V2vY3AFhATd7MNzGPF1vSUVMuFNQVDm+20F5p3c8hmU21L17LE2fIxC0dDNErCCFSnReL11xnzJQaoZfpUVrHpyaPbEWTtVA/hhfOVmvqm3qJxLZS8Vbdau9HpoA1czLfpyCm/rtbwkWn7mKzZUqNRGSpxK7ztP7Kh5t7bPzYOGrjfkXHohZxqRZaZMbm5kZD+N7fwJL6+wSTJd0ae3FxAKHcu0NlPFbCHqO2i3DfJTobAHYxD6oC8VBpout1IJV5R5pTA2TJ0i0np+hbKfEbpeCojhKZpLiteEbP2acJtCaUPKBqF5AArVPfDi6B54bUIhFQozVd+TWW0tOqs8E4KPOXkxG+4FnQrBha4os3XS+mXLvQrNVCiEiSjqQ2dWu8L7lgots/BpunrkVhTaGrjmTzIO6/ilZ151sVKdBLz+SK4Kqhpa5XCsozBNoxPS0bSeHJNCoW1GuV/aUqtRAbNMcHqeZLWopTDWK2iqMknL9UAfPUShsz+drqQb7qa6XcQWUR5buDAgK98GNFSxVj6BQlpHYa9bxTJU5+DmdLD24b+sUO9JBzCJ+WmuMOpACJI76MsylMgLcCPNf3KFd0bAt8hdkTUPUAg9Ey5fKR6ZRqpUGBARAYttopkzyZdD+2ppENoWTfAkCpvN97sQ4v9wX4x/v8IbpTUVniQTcuZEuQ3JLJ2JW5qL0tG2zQWMwLmT3CiMvmYcSr+Lg8pH2/BBCsUnGofxEPpkxPOChjGEgQx0lY42jEwX4ufkpCzka2eavHaM8ObzKxTjkJPBgNOlk0iFHcYHA7HG7qnqKr/VFssG99YbbQ9TqIZbFYq3YnX3S2sqlOEi8TYVqg1jf2GLLYarXGHUEVGjMGxHM7N8u1sqtLR0Wm5614yAAzXSvPnK4myt8N2Pm35XVeF9e1tdtYbCfPO+sCHUOnUHbQdW0VS4oYyAQpLPNMWjr9N8kFIyMKMDkqlqh+Qbw2RPq6XQGLo+LyoOCiHI/yuzb/nOpcKd77d8kHGDVauXTofz+TwpbGjpEC9D9JRq2seBeKl8kvbzpqIybKH0KlXf5PH9vgM2XKlaJu7kQE0bllUWFeB//9Xq0c/e6OXv8Xde7f7x/o6XL3lMZNRSuFQTiAhzz3vqwQhJVa8/zUT0vugnSnoiursy6fcnl2JLO1GUImx2EphLzyJV7JHyhRZFmlJLYbUqjG98SVmp4y6o43e9QGPHXu62JWodhVECyM8ayJkaeYu2Yecjyw6dNNVPhSsKblya9hlh/LDYG4Af/ZNNZuZIbHHxRGRIa+2XbtTlZqfoVh3Fmgu9ZrtEdryQjRxp8XaFgRla682p8iZx3r4KpDeTTyWDk9lstoL6d2dzwRjy8KwSOMNc4fuZuJO3800T/2U+paLcaBVsexEMU8L+uLftFcqtzxLlm0ZW6/UgywMoSu+bF56S9S7NnXXb/onlZp+Rez5SYeWF6B3FUbFp0nypL1Of6TEvVHsEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQWrxf3atgVwq/FAdAAAAAElFTkSuQmCC'
  },
  {
    name: '华为',
    logo: 'https://www.huawei.com/-/media/corporate/images/home/logo/huawei_logo.png'
  },
  { name: '百度', logo: 'https://www.baidu.com/img/flexible/logo/pc/result.png' },
  {
    name: '美团',
    logo: 'data:image/png;base64,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'
  }
])

// 搜索表单
const searchForm = reactive({
  major: '',
  location: '',
  jobType: ''
})

// 配置引导步骤
const driverObj = driver({
  showProgress: true,
  steps: [
    {
      element: '.page-header',
      popover: {
        title: '欢迎使用职业推荐',
        description: '这里为您提供专业的职业机会探索和推荐服务',
        side: 'bottom',
        align: 'start'
      }
    },
    {
      element: '.search-card',
      popover: {
        title: '职位搜索',
        description: '根据您的专业背景、意向城市和职位类型，为您匹配最适合的职位',
        side: 'bottom',
        align: 'start'
      }
    },
    {
      element: '.recommendation-section',
      popover: {
        title: '个性化推荐',
        description: '基于您的专业背景，系统会智能推荐最匹配的职位，并显示匹配度',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '.hot-jobs-section',
      popover: {
        title: '热门职位',
        description: '浏览最新的实习和校招职位信息，可以按照不同类别筛选',
        side: 'left',
        align: 'start'
      }
    },
    {
      element: '.recruitment-calendar',
      popover: {
        title: '招聘日历',
        description: '查看近期的校园招聘会和宣讲会信息，不要错过重要的招聘活动',
        side: 'left',
        align: 'start'
      }
    },
    {
      popover: {
        title: '开始探索',
        description: '现在，让我们开始寻找适合您的理想职位吧！'
      }
    }
  ]
})

// 获取常见职位列表并启动引导
onMounted(async () => {
  try {
    commonPositions.value = await getCommonPositions()

    // 检查是否首次访问
    const hasSeenRecommendationGuide = localStorage.getItem('hasSeenRecommendationGuide')
    if (!hasSeenRecommendationGuide) {
      nextTick(() => {
        setTimeout(() => {
          driverObj.drive()
          localStorage.setItem('hasSeenRecommendationGuide', 'true')
        }, 500)
      })
    }
  } catch (error) {
    ElMessage.error('获取职位列表失败')
  }
})

// 根据当前职位自动获取推荐
const handleMajorChange = async () => {
  if (searchForm.major) {
    await searchJobs()
  }
}

// 筛选变化时重新搜索
const handleFilterChange = async () => {
  if (searchForm.major) {
    await searchJobs()
  }
}

// 搜索职位
const searchJobs = async () => {
  if (!searchForm.major) {
    ElMessage.warning('请选择专业方向')
    return
  }

  loading.value = true
  try {
    const form: CareerRecommendationForm = {
      skills: [],
      interests: [],
      education: '',
      experience: 0,
      currentPosition: searchForm.major,
      preferredLocation: searchForm.location || undefined,
      // 薪资范围通过搜索条件传递，后端可根据此调整推荐结果
      preferredIndustry: searchForm.jobType ? 'jobType:' + searchForm.jobType : undefined
    }

    const response = await getProfessionRecommendation(form)
    recommendationResult.value = response.data
    ElMessage.success('推荐获取成功')
  } catch (error) {
    ElMessage.error('获取推荐失败，请重试')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 重置表单
const resetForm = () => {
  searchForm.major = ''
  searchForm.location = ''
  searchForm.jobType = ''
  recommendationResult.value = null
}

// 获取推荐职位列表
const recommendedJobs = computed<CareerRecommendation[]>(() => {
  if (!recommendationResult.value) return []
  return recommendationResult.value.topRecommendations
})

// 根据标签类型过滤热门职位
const filteredHotJobs = computed<HotJob[]>(() => {
  if (!recommendationResult.value?.hotJobs) return []

  const hotJobs = recommendationResult.value.hotJobs

  // 根据标签过滤
  if (activeTab.value === 'all') {
    return hotJobs
  }

  // 这里使用简单的标题匹配来筛选职位类别
  // 实际项目中应该在后端添加职位类别字段或使用更精确的匹配
  const jobTypeMap: Record<string, string[]> = {
    tech: ['开发', '工程师', '算法', '技术', 'Java', '前端', '后端', '全栈', '数据'],
    product: ['产品', '经理'],
    design: ['设计', 'UI', 'UX'],
    operation: ['运营', '市场', '营销'],
    marketing: ['市场', '营销']
  }

  const keywords = jobTypeMap[activeTab.value] || []
  return hotJobs.filter(job => keywords.some(keyword => job.title.includes(keyword)))
})

// 获取技能标签类型
const getTagType = (
  index: number
): 'success' | 'warning' | 'info' | 'primary' | 'danger' | undefined => {
  const types: ('success' | 'warning' | 'info' | 'primary' | 'danger' | undefined)[] = [
    'success',
    'warning',
    'info',
    'primary',
    'danger'
  ]
  return types[index % types.length]
}

// 获取匹配颜色
const getMatchColor = (matchScore: number): string => {
  if (matchScore >= 80) return '#67c23a'
  if (matchScore >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 处理职位相关操作
const handleJobAction = (job: EnhancedHotJob | CareerRecommendation, action: 'view' | 'apply') => {
  if (action === 'view') {
    console.log('查看职位详情:', job)
    // 实现查看职位详情的逻辑
  } else if (action === 'apply') {
    console.log('申请职位:', job)
    // 实现申请职位的逻辑
  }
}

// 获取近期招聘活动列表
const upcomingEvents = computed(() => {
  const now = new Date()
  const events = recruitmentEvents.value
    .filter(event => {
      const eventDate = new Date(event.date)
      return eventDate >= now
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)
    .map(event => {
      const date = new Date(event.date)
      const months = [
        '一月',
        '二月',
        '三月',
        '四月',
        '五月',
        '六月',
        '七月',
        '八月',
        '九月',
        '十月',
        '十一月',
        '十二月'
      ]
      return {
        ...event,
        month: months[date.getMonth()],
        day: date.getDate()
      }
    })

  return events
})

// 日历事件数据 - 扩展类型
const recruitmentEvents = ref<RecruitmentEvent[]>([
  {
    date: '2023-12-05',
    title: '腾讯2024校园招聘宣讲会',
    location: '计算机科学与技术学院报告厅',
    time: '14:30-16:30',
    company: '腾讯',
    type: '校招',
    color: '#1677ff',
    companyLogo: 'https://img.alicdn.com/tfs/TB1_rYHpbr1gK0jSZR0XXbP8XXa-1024-1024.png'
  },
  {
    date: '2023-12-08',
    title: '字节跳动实习生招聘',
    location: '就业指导中心1号厅',
    time: '10:00-12:00',
    company: '字节跳动',
    type: '实习',
    color: '#52c41a',
    companyLogo:
      'https://sf3-dycdn-tos.pstatp.com/obj/eden-cn/upqphbyvl/nyz0gkhc/logo-1024-1024.png'
  },
  {
    date: '2023-12-12',
    title: '阿里巴巴技术岗位专场',
    location: '线上直播',
    time: '19:00-21:00',
    company: '阿里巴巴',
    type: '校招',
    color: '#1677ff',
    companyLogo: 'https://img.alicdn.com/tfs/TB1DYHzl7L0gK0jSZFtXXXQCXXa-360-360.png'
  },
  {
    date: '2023-12-15',
    title: '华为产品经理招聘',
    location: '经管学院报告厅',
    time: '15:00-17:00',
    company: '华为',
    type: '校招',
    color: '#1677ff',
    companyLogo: 'https://www.huawei.com/-/media/corporate/images/home/logo/huawei_logo.png'
  },
  {
    date: '2023-12-20',
    title: '百度AI开发实习生招聘',
    location: '就业指导中心2号厅',
    time: '14:00-16:00',
    company: '百度',
    type: '实习',
    color: '#52c41a',
    companyLogo: 'https://www.baidu.com/img/flexible/logo/pc/result.png'
  }
])

// 日历相关函数
const hasEvent = (day: string): boolean => {
  return recruitmentEvents.value.some(event => event.date === day)
}

const getEvents = (day: string) => {
  return recruitmentEvents.value.filter(event => event.date === day)
}

// 获取扩展后的热门职位
const enhanceHotJobs = computed<EnhancedHotJob[]>(() => {
  if (!filteredHotJobs.value) return []

  return filteredHotJobs.value.map(job => {
    // 创建一个包含额外UI属性的新对象
    const enhancedJob = {
      ...job,
      recruiterName: `${job.company}HR`,
      recruiterTitle: '招聘经理',
      recruiterAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      lastActive: '今天',
      description: `${job.title}岗位需要${job.tags?.join('、')}等技能，有意向者请尽快投递简历。`,
      companySize: '500-2000人',
      companyType: '互联网'
    } as EnhancedHotJob

    return enhancedJob
  })
})
</script>

<style scoped>
.career-recommendation {
  padding: 20px;
}

.search-card {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 30px 0 20px;
  color: #303133;
  border-left: 4px solid #409eff;
  padding-left: 10px;
  font-size: 1.5rem;
  position: relative;
}

.section-title .el-icon {
  color: #409eff;
}

.sub-title {
  font-size: 0.9rem;
  color: #909399;
  font-weight: normal;
  margin-left: 10px;
}

/* 新增/修改的筛选项样式 */
.filter-container {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filter-options {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.job-tabs {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

/* 职位卡片样式优化 */
.hot-job-card {
  margin-bottom: 20px;
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
}

.hot-job-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.job-card-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.job-title-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.job-name {
  font-size: 1.1rem;
  color: #333;
  font-weight: 600;
  margin: 0;
}

.job-salary {
  color: #ff4d4f;
  font-weight: 600;
  font-size: 1rem;
}

.company-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.company-logo {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: contain;
  border: 1px solid #f0f0f0;
}

.company-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.company-name {
  font-size: 0.9rem;
  color: #333;
  margin: 0;
}

.company-tags {
  display: flex;
  gap: 5px;
}

.job-requirements {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
  color: #666;
  font-size: 0.85rem;
}

.req-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.req-item .el-icon {
  color: #909399;
}

.job-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
}

.job-description {
  font-size: 0.85rem;
  color: #666;
  line-height: 1.5;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.hr-line {
  height: 1px;
  background-color: #f0f0f0;
  margin: 15px 0;
}

/* 招聘者信息样式 */
.recruiter-info {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.recruiter-avatar {
  width: 36px;
  height: 36px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 10px;
}

.recruiter-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recruiter-details {
  flex: 1;
}

.recruiter-name {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 3px;
}

.recruiter-title {
  font-size: 0.8rem;
  color: #999;
  font-weight: normal;
  margin-left: 5px;
}

.last-active {
  font-size: 0.8rem;
  color: #999;
}

.chat-btn {
  margin-left: auto;
}

/* 职位操作按钮 */
.job-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 查看更多按钮 */
.more-jobs {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

/* 日历区域样式优化 */
.calendar-filter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.calendar-search {
  width: 200px;
}

.calendar-card {
  border-radius: 8px;
  overflow: hidden;
}

.calendar-cell {
  position: relative;
  min-height: 60px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px;
}

.calendar-cell.has-events {
  background-color: rgba(64, 158, 255, 0.05);
}

.calendar-events {
  margin-top: 5px;
  display: flex;
  justify-content: center;
}

.event-indicator {
  display: flex;
  gap: 3px;
}

.calendar-event-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.popover-events {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.popover-event {
  border-left: 3px solid;
  padding: 5px 8px;
  background-color: #f9f9f9;
  border-radius: 4px;
}

.event-type-tag {
  display: inline-block;
  font-size: 12px;
  padding: 0 5px;
  border-radius: 3px;
  color: white;
  margin-bottom: 5px;
}

.event-company {
  font-weight: bold;
  font-size: 0.9rem;
}

.event-title {
  font-size: 0.85rem;
  color: #666;
}

.event-time,
.event-location {
  font-size: 0.8rem;
  color: #999;
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 活动列表样式 */
.upcoming-events-container {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.upcoming-events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.events-title {
  font-size: 1.1rem;
  color: #333;
  margin: 0;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  transition: all 0.3s;
}

.event-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  background-color: white;
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.event-month {
  font-size: 0.8rem;
  color: #999;
}

.event-day {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.event-content {
  flex: 1;
}

.event-type {
  margin-bottom: 8px;
  font-size: 0.8rem;
}

.event-title {
  font-size: 1rem;
  color: #333;
  margin: 0 0 8px 0;
}

.event-company {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.event-company-logo {
  width: 18px;
  height: 18px;
  border-radius: 3px;
}

.event-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #999;
  margin: 5px 0;
}

.event-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

/* 热门企业样式 */
.calendar-companies {
  margin-top: 30px;
}

.calendar-companies h4 {
  font-size: 1rem;
  color: #333;
  margin-bottom: 15px;
}

.company-logos {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.company-logo-item {
  width: calc(16.666% - 12.5px);
  aspect-ratio: 1/1;
  border-radius: 8px;
  overflow: hidden;
  background-color: white;
  border: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  transition: all 0.3s;
}

.company-logo-item img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.company-logo-item:hover {
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 响应式样式 */
@media (max-width: 768px) {
  .job-title-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .job-salary {
    margin-top: 5px;
  }

  .filter-options {
    flex-direction: column;
    gap: 10px;
  }

  .filter-options .el-select {
    width: 100%;
  }

  .calendar-filter {
    flex-direction: column;
    align-items: stretch;
  }

  .calendar-search {
    width: 100%;
  }

  .company-logo-item {
    width: calc(33.333% - 10px);
  }

  .event-actions {
    flex-direction: column;
  }

  .event-actions .el-button {
    width: 100%;
  }
}

/* 空数据状态 */
.empty-jobs {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.empty-image {
  width: 180px;
  height: 180px;
  object-fit: contain;
  margin-bottom: 20px;
}
</style>
