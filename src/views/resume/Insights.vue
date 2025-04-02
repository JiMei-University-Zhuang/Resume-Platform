<template>
  <div class="ai-industry-insights">
    <!-- 保留页面标题和引导语 -->
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><DataAnalysis /></el-icon>
        AI行业趋势洞察
      </h1>
      <p class="page-description">探索AI领域最新趋势和研究动态，了解行业发展方向与机遇。</p>
    </div>

    <!-- 文章类型选择区域 -->
    <div class="article-type-selector">
      <div class="selector-label">选择文章类型：</div>
      <el-radio-group v-model="selectedArticleType" @change="handleArticleTypeChange">
        <el-radio-button label="trend">行业趋势</el-radio-button>
        <el-radio-button label="technology">技术深度</el-radio-button>
        <el-radio-button label="career">职业发展</el-radio-button>
        <el-radio-button label="case">案例研究</el-radio-button>
      </el-radio-group>

      <div class="article-search">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索文章..."
          clearable
          :prefix-icon="Search"
          @clear="handleSearchClear"
          @input="handleSearch"
        >
        </el-input>
      </div>
    </div>

    <!-- 标签筛选区域 -->
    <div class="article-tags">
      <span class="tag-label">热门标签：</span>
      <el-tag
        v-for="tag in articleTags"
        :key="tag.value"
        class="article-tag"
        :class="{ active: selectedTags.includes(tag.value) }"
        :effect="selectedTags.includes(tag.value) ? 'dark' : 'plain'"
        @click="toggleTag(tag.value)"
      >
        {{ tag.label }}
      </el-tag>
    </div>

    <!-- 文章列表和详情区域 -->
    <el-row :gutter="24" class="content-container">
      <!-- 左侧：文章列表 -->
      <el-col :xs="24" :md="8">
        <div class="article-list-container">
          <h2 class="section-title">
            {{ getArticleTypeLabel(selectedArticleType) }}
            <span class="article-count">({{ filteredArticles.length }})</span>
          </h2>

          <div v-if="isLoading" class="loading-container">
            <el-skeleton :rows="5" animated />
          </div>

          <el-empty
            v-else-if="filteredArticles.length === 0"
            description="没有找到符合条件的文章"
          />

          <div v-else class="article-list">
            <div
              v-for="article in filteredArticles"
              :key="article.id"
              class="article-item"
              :class="{ active: selectedArticleId === article.id }"
              @click="selectArticle(article.id)"
            >
              <div class="article-meta">
                <span class="article-date">{{ article.date }}</span>
                <el-tag size="small" type="info">{{ article.readTime }}</el-tag>
              </div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-summary">{{ article.summary }}</p>
              <div class="article-tags">
                <el-tag v-for="tag in article.tags" :key="tag" size="small" class="tag-item">
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧：文章详情 -->
      <el-col :xs="24" :md="16">
        <transition name="fade">
          <div v-if="!selectedArticleId && !isLoading" class="empty-article">
            <el-empty description="请从左侧选择一篇文章阅读">
              <el-button type="primary" @click="selectRandomArticle"> 推荐阅读 </el-button>
            </el-empty>
          </div>

          <div v-else-if="isLoading" class="loading-container">
            <el-skeleton :rows="10" animated />
          </div>

          <div v-else-if="currentArticle" class="article-detail">
            <div class="article-header">
              <h1 class="detail-title">{{ currentArticle.title }}</h1>
              <div class="detail-meta">
                <div class="meta-item">
                  <el-icon><Calendar /></el-icon>
                  <span>{{ currentArticle.date }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><Reading /></el-icon>
                  <span>{{ currentArticle.readTime }}</span>
                </div>
                <div class="meta-item">
                  <el-icon><View /></el-icon>
                  <span>{{ currentArticle.views }} 阅读</span>
                </div>
              </div>
              <div class="detail-tags">
                <el-tag v-for="tag in currentArticle.tags" :key="tag" class="detail-tag">
                  {{ tag }}
                </el-tag>
              </div>
            </div>

            <el-divider />

            <div class="article-content" v-html="currentArticle.content"></div>

            <div class="article-footer">
              <div class="article-author">
                <el-avatar :size="50" :src="currentArticle.authorAvatar"></el-avatar>
                <div class="author-info">
                  <div class="author-name">{{ currentArticle.author }}</div>
                  <div class="author-bio">{{ currentArticle.authorBio }}</div>
                </div>
              </div>

              <div class="article-actions">
                <el-button type="primary" @click="shareArticle">
                  <el-icon><Share /></el-icon>
                  分享
                </el-button>
                <el-button @click="saveArticle">
                  <el-icon>
                    <template v-if="currentArticle.isFavorite">
                      <StarFilled />
                    </template>
                    <template v-else>
                      <Star />
                    </template>
                  </el-icon>
                  {{ currentArticle.isFavorite ? '已收藏' : '收藏' }}
                </el-button>
                <el-button @click="downloadArticle">
                  <el-icon><Download /></el-icon>
                  下载
                </el-button>
              </div>
            </div>

            <el-divider />

            <div class="related-articles">
              <h3 class="related-title">相关文章</h3>
              <div class="related-list">
                <div
                  v-for="article in relatedArticles"
                  :key="article.id"
                  class="related-item"
                  @click="selectArticle(article.id)"
                >
                  <div class="related-title">{{ article.title }}</div>
                  <div class="related-date">{{ article.date }}</div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.ai-industry-insights {
  padding: 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 84px);
}

.page-header {
  margin-bottom: 32px;
  background: linear-gradient(135deg, #409eff 0%, #007bff 100%);
  padding: 28px;
  border-radius: 12px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
}

.page-title {
  font-size: 30px;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
}

.page-title .el-icon {
  margin-right: 16px;
  font-size: 36px;
}

.page-description {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
  max-width: 800px;
  line-height: 1.6;
}

.insights-container {
  margin-top: 32px;
  display: flex;
  gap: 24px;
}

.interaction-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 28px;
  height: 100%;
}

.insight-tabs .el-tabs__nav {
  width: 100%;
}

.insight-tabs .el-tabs__item {
  font-size: 16px;
  padding: 0 24px;
  height: 52px;
  line-height: 52px;
}

.trends-content {
  margin-top: 24px;
}

.trend-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 28px;
}

.trend-category-item {
  cursor: pointer;
  transition: all 0.3s;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.trend-category-item.active {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
  font-weight: 500;
}

.trend-category-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.trend-chart-container {
  height: 320px;
  margin: 32px 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.trend-table .el-table {
  margin-top: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  overflow: hidden;
}

.news-list {
  margin-top: 24px;
}

.news-item {
  padding: 20px;
  border-radius: 12px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
  transition: all 0.3s;
  border-left: 4px solid #409eff;
}

.news-item:hover {
  transform: translateX(5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.news-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #333;
}

.news-meta {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #909399;
  margin-top: 12px;
}

.news-source {
  display: flex;
  align-items: center;
}

.news-date {
  display: flex;
  align-items: center;
}

.user-analysis-form {
  margin-top: 24px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.form-section-title .el-icon {
  margin-right: 12px;
  color: #409eff;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
}

.skill-tags .el-tag {
  margin: 0;
  padding: 8px 12px;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
}

.analysis-result-container {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 28px;
  height: 100%;
}

.result-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #409eff;
  display: flex;
  align-items: center;
}

.result-title .el-icon {
  margin-right: 14px;
}

.match-scores-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 32px;
}

.match-score-item {
  flex: 1;
  min-width: 140px;
  padding: 20px;
  border-radius: 12px;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s;
}

.match-score-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.match-score-value {
  font-size: 28px;
  font-weight: 700;
  margin: 12px 0;
}

.match-score-label {
  font-size: 15px;
  color: #606266;
  text-align: center;
}

.skill-radar-container {
  height: 380px;
  margin: 32px 0;
}

.strengths-weakness {
  margin-bottom: 32px;
}

.strength-item,
.weakness-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.strength-item .el-icon,
.weakness-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

.strength-item .el-icon {
  color: #67c23a;
}

.weakness-item .el-icon {
  color: #e6a23c;
}

.learning-paths {
  margin-top: 32px;
}

.learning-path-item {
  padding: 20px;
  background-color: #f5f7fa;
  border-radius: 12px;
  margin-bottom: 20px;
  border-left: 4px solid #67c23a;
}

.learning-path-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.recommended-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
}

.recommended-skill {
  background-color: #ecf5ff;
  color: #409eff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
}

.recommendations-container {
  margin-top: 32px;
}

.career-paths {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 32px;
}

.career-path-card {
  flex: 1;
  min-width: 280px;
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  border-top: 4px solid #409eff;
}

.career-path-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.career-path-header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.career-path-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.career-path-match {
  background-color: #f0f9eb;
  color: #67c23a;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
}

.career-path-match .el-icon {
  margin-right: 6px;
}

.career-path-body {
  padding: 20px;
}

.career-path-description {
  color: #606266;
  margin-bottom: 20px;
  line-height: 1.6;
}

.insight-card {
  background-color: #f5f7fa;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border-left: 4px solid #e6a23c;
}

.insight-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.insight-title .el-icon {
  margin-right: 12px;
  color: #e6a23c;
}

.insight-content {
  color: #606266;
  line-height: 1.6;
}

.action-plan {
  margin-top: 32px;
}

.action-plan-item {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
}

.action-plan-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #409eff;
}

.action-plan-description {
  margin-bottom: 20px;
  color: #606266;
}

.resource-list {
  margin-top: 20px;
}

.resource-item {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 10px;
  margin-bottom: 12px;
}

.resource-title {
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
}

.resource-description {
  font-size: 14px;
  color: #606266;
  margin-bottom: 12px;
}

.resource-link {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.resource-link .el-icon {
  margin-right: 6px;
}

.result-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 32px;
  gap: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 32px;
  color: #909399;
}

.empty-state-icon {
  font-size: 72px;
  margin-bottom: 20px;
  color: #dcdfe6;
}

.empty-state-text {
  font-size: 18px;
  margin-bottom: 28px;
}

/* 选择分类组件样式 */
.category-selector {
  margin-bottom: 24px;
}

.category-selector .el-radio-button {
  margin-right: 8px;
}

/* 自定义表单元素样式 */
.custom-form-item {
  margin-bottom: 24px;
}

.custom-form-item .el-input,
.custom-form-item .el-select {
  width: 100%;
}

.custom-form-item .el-checkbox {
  margin-right: 24px;
  margin-bottom: 12px;
}

.custom-form-item .form-label {
  font-weight: 500;
  margin-bottom: 12px;
  display: block;
}

.recommendation-action {
  margin-top: 32px;
  text-align: center;
}

.recommendation-action .el-button {
  padding: 12px 24px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .insights-container {
    flex-direction: column;
  }

  .career-paths {
    flex-direction: column;
  }

  .match-scores-container {
    flex-direction: column;
  }

  .page-header {
    padding: 20px;
  }

  .page-title {
    font-size: 24px;
  }

  .interaction-container,
  .analysis-result-container {
    margin-bottom: 24px;
    padding: 20px;
  }

  .trend-categories {
    gap: 10px;
  }

  .trend-category-item {
    padding: 8px 12px;
    font-size: 14px;
  }
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Calendar,
  DataAnalysis,
  Download,
  Star,
  StarFilled,
  Reading,
  Share,
  View,
  Search
} from '@element-plus/icons-vue'

// 文章类型和标签数据
interface Article {
  id: string
  type: 'trend' | 'technology' | 'career' | 'case'
  title: string
  summary: string
  content: string
  date: string
  readTime: string
  views: number
  tags: string[]
  author: string
  authorBio: string
  authorAvatar: string
  isFavorite: boolean
}

// 状态变量
const isLoading = ref(false)
const selectedArticleType = ref<'trend' | 'technology' | 'career' | 'case'>('trend')
const selectedArticleId = ref<string | null>(null)
const searchKeyword = ref('')
const selectedTags = ref<string[]>([])
const articles = ref<Article[]>([])

// 文章类型标签
const articleTypeLabels = {
  trend: 'AI行业趋势',
  technology: 'AI技术深度解析',
  career: 'AI职业发展指南',
  case: 'AI案例研究'
}

// 可用标签
const articleTags = [
  { label: '大语言模型', value: 'llm' },
  { label: '计算机视觉', value: 'cv' },
  { label: '生成式AI', value: 'generative' },
  { label: '强化学习', value: 'rl' },
  { label: '多模态', value: 'multimodal' },
  { label: '边缘计算', value: 'edge' },
  { label: '自动驾驶', value: 'selfdriving' },
  { label: '医疗AI', value: 'healthcare' },
  { label: '金融科技', value: 'fintech' },
  { label: '元宇宙', value: 'metaverse' }
]

// 根据选择和过滤条件筛选文章
const filteredArticles = computed(() => {
  let result = articles.value.filter(article => {
    // 根据文章类型筛选
    if (selectedArticleType.value && article.type !== selectedArticleType.value) {
      return false
    }

    // 根据搜索关键词筛选
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      const matchesTitle = article.title.toLowerCase().includes(keyword)
      const matchesSummary = article.summary.toLowerCase().includes(keyword)
      const matchesContent = article.content.toLowerCase().includes(keyword)

      if (!matchesTitle && !matchesSummary && !matchesContent) {
        return false
      }
    }

    // 根据选定标签筛选
    if (selectedTags.value.length > 0) {
      const hasMatchingTag = article.tags.some(tag =>
        selectedTags.value.some(selectedTag =>
          tag.toLowerCase().includes(selectedTag.toLowerCase())
        )
      )

      if (!hasMatchingTag) {
        return false
      }
    }

    return true
  })

  // 按日期排序（最新的排在前面）
  return result.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
})

// 获取当前选中的文章
const currentArticle = computed(() => {
  if (!selectedArticleId.value) return null
  return articles.value.find(article => article.id === selectedArticleId.value) || null
})

// 相关文章推荐（同类型和相同标签的其他文章）
const relatedArticles = computed(() => {
  if (!currentArticle.value) return []

  return articles.value
    .filter(
      article =>
        article.id !== currentArticle.value?.id &&
        (article.type === currentArticle.value?.type ||
          article.tags.some(tag => currentArticle.value?.tags.includes(tag)))
    )
    .slice(0, 3) // 最多显示3篇相关文章
})

// 处理函数
const getArticleTypeLabel = (type: string): string => {
  return articleTypeLabels[type as keyof typeof articleTypeLabels] || '文章'
}

const handleArticleTypeChange = () => {
  // 切换文章类型时，清空选中的文章
  selectedArticleId.value = null
}

const selectArticle = (id: string) => {
  selectedArticleId.value = id
  // 增加文章浏览量
  const article = articles.value.find(a => a.id === id)
  if (article) {
    article.views += 1
  }
}

const selectRandomArticle = () => {
  if (filteredArticles.value.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredArticles.value.length)
    selectArticle(filteredArticles.value[randomIndex].id)
  }
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

const handleSearch = () => {
  // 可以实现搜索防抖
}

const handleSearchClear = () => {
  searchKeyword.value = ''
}

const shareArticle = () => {
  ElMessage.success('分享功能开发中')
  // 实际项目中可以实现分享到社交媒体等功能
}

const saveArticle = () => {
  if (currentArticle.value) {
    currentArticle.value.isFavorite = !currentArticle.value.isFavorite
    ElMessage.success(currentArticle.value.isFavorite ? '文章已收藏' : '已取消收藏')
  }
}

const downloadArticle = () => {
  ElMessage.success('文章已开始下载')
  // 实际项目中可以实现PDF导出等功能
}

// 加载文章数据
const loadArticles = async () => {
  isLoading.value = true
  try {
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    // 实际项目中这里应该是从API获取数据
    articles.value = generateMockArticles()
  } catch (error) {
    console.error('加载文章失败:', error)
    ElMessage.error('加载文章数据失败，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 生成模拟文章数据
const generateMockArticles = (): Article[] => {
  return [
    // 行业趋势类文章
    {
      id: 'trend-001',
      type: 'trend',
      title: '2023年人工智能发展趋势报告：大模型引领新时代',
      summary: '本文深入分析了2023年AI行业的主要发展趋势，重点关注大语言模型对产业的革命性影响。',
      content: `<p>自ChatGPT推出以来，大型语言模型(LLM)彻底改变了人工智能领域的发展方向。2023年，我们看到AI领域主要呈现以下趋势：</p>
      
      <h3>1. 大模型通用化与专业化并行发展</h3>
      <p>一方面，GPT-4等通用大模型继续扩大参数规模和训练数据范围，通用能力显著提升；另一方面，针对医疗、法律、金融等垂直领域的专业化大模型也在快速发展，这些模型虽然参数规模较小，但在特定领域表现出更高的精确度和实用性。</p>
      
      <h3>2. 多模态成为标配</h3>
      <p>从纯文本理解到图像、音频、视频的融合理解，多模态已成为新一代AI系统的标准配置。GPT-4V、Claude 2、Gemini等模型都已具备多模态能力，这使得AI系统可以更全面地理解和解释世界。</p>
      
      <h3>3. 私有化部署需求增长</h3>
      <p>出于数据安全、隐私保护和自主可控的考虑，企业对于私有化部署AI模型的需求大幅增长。这推动了模型压缩、量化和优化技术的进步，使大模型可以在更有限的硬件资源上高效运行。</p>
      
      <h3>4. AI原生应用爆发</h3>
      <p>基于大模型API构建的AI原生应用呈爆发式增长，从内容创作、编程辅助到决策支持，这些应用正在改变人们的工作方式和生活方式。</p>
      
      <h3>5. 监管框架逐步完善</h3>
      <p>随着AI技术的影响力扩大，全球范围内的AI监管框架正在逐步建立和完善。欧盟AI法案、中国的生成式AI管理条例等都反映了对AI安全和伦理的重视。</p>
      
      <p>展望未来，随着模型架构创新、训练方法改进和计算资源的进一步发展，我们有理由相信大模型技术将继续快速演进，为各行各业带来更深远的变革。</p>`,
      date: '2023-12-15',
      readTime: '8分钟',
      views: 3587,
      tags: ['大语言模型', '产业趋势', '多模态', 'AI监管'],
      author: '李明远',
      authorBio: 'AI研究员，专注于大模型应用与产业分析',
      authorAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      isFavorite: false
    },
    {
      id: 'trend-002',
      type: 'trend',
      title: '多模态AI：打破感知边界的下一代智能系统',
      summary: '多模态AI正成为行业焦点，本文探讨了这一技术的最新进展及其在各领域的应用前景。',
      content: `<p>多模态AI系统正在成为人工智能领域的新焦点，这类系统能够同时处理和理解文本、图像、音频和视频等多种模态的信息，大大拓展了AI的应用边界。</p>
      
      <h3>多模态AI的技术突破</h3>
      <p>最新的多模态系统采用了统一的架构来处理不同类型的数据，这使得模型能够在不同模态之间建立深层次的语义联系。例如，GPT-4V能够分析图像并提供详细的文字描述，甚至能够理解图表和手写内容；Gemini则展示了处理视频和音频的强大能力。</p>
      
      <h3>关键应用领域</h3>
      <ul>
        <li><strong>医疗诊断</strong>：结合医学影像、患者病史和临床笔记进行综合分析</li>
        <li><strong>智能客服</strong>：理解用户的语音、文字和图片请求，提供更准确的服务</li>
        <li><strong>自动驾驶</strong>：融合视觉、激光雷达和GPS等多源信息进行决策</li>
        <li><strong>内容审核</strong>：同时分析视频、音频和文本内容，更全面地识别不良信息</li>
      </ul>
      
      <h3>挑战与机遇</h3>
      <p>多模态AI虽然前景广阔，但仍面临数据对齐、计算资源需求高和解释性差等挑战。然而，这些挑战也带来了新的研究机会和创业空间。</p>
      
      <p>随着技术的不断进步，我们可以预见多模态AI将成为下一代AI系统的标准配置，为各行各业带来更智能、更自然的人机交互体验。</p>`,
      date: '2023-11-28',
      readTime: '6分钟',
      views: 2432,
      tags: ['多模态', '人机交互', '技术趋势', 'GPT-4V'],
      author: '张智',
      authorBio: '多模态AI研究专家，曾参与多个大型AI项目开发',
      authorAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      isFavorite: false
    },
    // 技术深度类文章
    {
      id: 'technology-001',
      type: 'technology',
      title: '大语言模型微调技术详解：从LoRA到QLoRA',
      summary:
        '本文深入解析了大语言模型微调的关键技术，特别是低秩适应（LoRA）及其量化版本QLoRA的原理与实践。',
      content: `<p>随着大语言模型（LLMs）参数规模的不断增长，全参数微调变得越来越不切实际。为了解决这一挑战，研究人员开发了一系列参数高效的微调方法，其中低秩适应（LoRA）及其改进版本QLoRA备受关注。</p>
      
      <h3>LoRA的核心原理</h3>
      <p>LoRA的核心思想是基于这样一个假设：模型适应过程中的参数更新矩阵通常具有低秩特性。具体而言，LoRA通过分解权重更新矩阵为两个低秩矩阵的乘积，极大地减少了需要训练的参数数量。</p>
      
      <p>对于原始权重矩阵 W ∈ ℝ^{d×k}，LoRA不直接更新W，而是训练一个低秩分解：</p>
      
      <pre>ΔW = A × B，其中 A ∈ ℝ^{d×r}, B ∈ ℝ^{r×k}，且 r ≪ min(d,k)</pre>
      
      <p>这样，训练参数量从d×k减少到r×(d+k)，当r远小于d和k时，参数量大幅减少。</p>
      
      <h3>QLoRA：量化与低秩适应的结合</h3>
      <p>QLoRA进一步结合了4-bit量化技术，将原始预训练模型量化为4-bit精度，在反向传播时解量化为bfloat16进行梯度计算，并使用一种名为NormalFloat (NF4)的新数据类型优化量化过程。</p>
      
      <p>QLoRA还引入了分页优化器、双重量化等技术，进一步降低了内存占用，使得在单个消费级GPU上也能微调大型语言模型。</p>
      
      <h3>实际效果对比</h3>
      <table border="1">
        <tr>
          <th>微调方法</th>
          <th>参数效率</th>
          <th>内存占用</th>
          <th>性能保持率</th>
        </tr>
        <tr>
          <td>全参数微调</td>
          <td>低</td>
          <td>非常高</td>
          <td>100%</td>
        </tr>
        <tr>
          <td>LoRA</td>
          <td>高</td>
          <td>中等</td>
          <td>95-99%</td>
        </tr>
        <tr>
          <td>QLoRA</td>
          <td>非常高</td>
          <td>低</td>
          <td>93-97%</td>
        </tr>
      </table>
      
      <h3>实践指南</h3>
      <p>在实际应用中，LoRA/QLoRA的关键超参数包括秩r、缩放因子α、学习率等。根据经验，r通常选择8-64之间的值，较大的模型可能需要较高的秩；α/r比值控制了更新的幅度，通常设置为16-32。</p>
      
      <p>微调时，建议只对Attention模块应用LoRA，这样可以在保持性能的同时进一步减少参数量。对于特定领域的适应，还可以考虑冻结部分层，只对高层进行微调。</p>
      
      <p>总之，LoRA和QLoRA技术极大地民主化了大语言模型的微调过程，使开发者能够以合理的计算资源成本打造适合特定场景的AI应用。</p>`,
      date: '2023-10-15',
      readTime: '12分钟',
      views: 5642,
      tags: ['深度学习', '模型微调', 'LoRA', '大语言模型'],
      author: '王博士',
      authorBio: '深度学习专家，专注于大规模模型训练与优化技术研究',
      authorAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      isFavorite: false
    },
    {
      id: 'technology-002',
      type: 'technology',
      title: 'Transformer架构详解：注意力机制的工作原理与实现',
      summary:
        '本文深入剖析了支撑当代大语言模型的核心架构—Transformer，详细解释了自注意力机制的数学原理和代码实现。',
      content: `<p>Transformer架构自2017年被提出以来，已经彻底改变了自然语言处理领域，并逐渐扩展到计算机视觉、音频处理等多个领域。本文将深入解析Transformer的核心组件和工作原理。</p>
      
      <h3>自注意力机制：Transformer的核心</h3>
      <p>自注意力机制允许模型在处理序列数据时，动态地关注序列中的不同部分。其计算过程可以分为以下步骤：</p>
      
      <ol>
        <li>将输入向量转换为查询(Q)、键(K)和值(V)三种表示</li>
        <li>计算查询和键之间的点积，衡量它们的相似度</li>
        <li>对点积结果进行缩放和Softmax归一化，得到注意力权重</li>
        <li>用这些权重对值向量进行加权求和</li>
      </ol>
      
      <p>用数学表达式表示为：</p>
      <pre>Attention(Q, K, V) = softmax(QK^T / √d_k)V</pre>
      
      <h3>多头注意力机制</h3>
      <p>为了增强模型的表达能力，Transformer使用了多头注意力机制，即并行计算多组不同的注意力，然后将结果拼接起来：</p>
      
      <pre>
MultiHead(Q, K, V) = Concat(head_1, head_2, ..., head_h)W^O
where head_i = Attention(QW_i^Q, KW_i^K, VW_i^V)
      </pre>
      
      <p>多头注意力使模型能够同时关注不同位置和不同表示子空间的信息。</p>
      
      <h3>位置编码</h3>
      <p>与RNN不同，Transformer处理序列时没有固有的顺序信息，因此需要额外的位置编码。原始论文中使用了正弦和余弦函数的组合：</p>
      
      <pre>
PE(pos, 2i) = sin(pos/10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos/10000^(2i/d_model))
      </pre>
      
      <p>这种编码方式使得模型可以理解输入序列中元素的相对位置和绝对位置。</p>
      
      <h3>PyTorch实现示例</h3>
      <p>下面是一个简化的自注意力机制的PyTorch实现：</p>
      
      <pre>
import torch
import torch.nn as nn
import torch.nn.functional as F

class SelfAttention(nn.Module):
    def __init__(self, embed_size, heads):
        super(SelfAttention, self).__init__()
        self.embed_size = embed_size
        self.heads = heads
        self.head_dim = embed_size // heads
        
        assert (self.head_dim * heads == embed_size), "Embed size needs to be divisible by heads"
        
        self.values = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.keys = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.queries = nn.Linear(self.head_dim, self.head_dim, bias=False)
        self.fc_out = nn.Linear(heads * self.head_dim, embed_size)
    
    def forward(self, values, keys, query, mask):
        N = query.shape[0]
        value_len, key_len, query_len = values.shape[1], keys.shape[1], query.shape[1]
        
        # Split the embedding into self.heads different pieces
        values = values.reshape(N, value_len, self.heads, self.head_dim)
        keys = keys.reshape(N, key_len, self.heads, self.head_dim)
        queries = query.reshape(N, query_len, self.heads, self.head_dim)
        
        values = self.values(values)
        keys = self.keys(keys)
        queries = self.queries(queries)
        
        # Scaled dot-product attention
        energy = torch.einsum("nqhd,nkhd->nhqk", [queries, keys])
        
        if mask is not None:
            energy = energy.masked_fill(mask == 0, float("-1e20"))
        
        attention = torch.softmax(energy / (self.embed_size ** (1/2)), dim=3)
        
        out = torch.einsum("nhql,nlhd->nqhd", [attention, values]).reshape(
            N, query_len, self.heads * self.head_dim
        )
        
        out = self.fc_out(out)
        return out
      </pre>
      
      <h3>Transformer的影响与发展</h3>
      <p>Transformer架构的提出催生了BERT、GPT系列、T5等一系列成功的模型，这些模型通过预训练-微调范式在各种NLP任务上取得了突破性进展。随着参数规模的不断扩大，出现了所谓的"涌现能力"，即模型表现出了非预期的能力。</p>
      
      <p>针对Transformer的优化方向主要包括：提高长序列处理能力、降低计算复杂度、增强模型可解释性等。最新的改进如Flash Attention、Sparse Transformer和Reformer等都在不同方面推动了架构的演进。</p>
      
      <p>虽然Transformer在各领域取得了巨大成功，但它仍然存在计算复杂度高、长序列处理效率低等问题。未来的研究方向可能会集中在如何设计更高效的注意力机制、如何更好地融合不同模态的信息，以及如何在保持性能的同时降低模型的规模和计算成本。</p>`,
      date: '2023-09-20',
      readTime: '15分钟',
      views: 7823,
      tags: ['Transformer', '深度学习', '注意力机制', 'PyTorch'],
      author: '陈思远',
      authorBio: 'NLP算法专家，专注于Transformer架构研究与优化',
      authorAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      isFavorite: false
    },
    // 职业发展类文章
    {
      id: 'career-001',
      type: 'career',
      title: 'AI时代的技术人才发展路线图',
      summary: '本文为技术人员提供了AI时代的职业发展指南，包括核心技能、学习路径和职业方向建议。',
      content: `<p>随着AI技术的快速发展，技术人才的职业路径正在发生深刻变化。本文将帮助你理清在AI时代应该如何规划自己的职业发展。</p>
      
      <h3>AI领域的核心职业路径</h3>
      <ol>
        <li><strong>研究路线</strong>：侧重基础研究与算法创新，通常需要硕博学历</li>
        <li><strong>工程路线</strong>：专注于模型落地与系统开发，需要扎实的工程能力</li>
        <li><strong>产品路线</strong>：关注AI产品设计与用户体验，需要兼具技术理解力和产品思维</li>
        <li><strong>创业路线</strong>：发现特定领域的应用机会，需要综合能力与行业洞察</li>
      </ol>
      
      <h3>必备技能清单</h3>
      <p>无论选择哪条路径，以下核心技能都是必不可少的：</p>
      <ul>
        <li>深度学习基础（神经网络、反向传播、常见模型架构）</li>
        <li>Python编程与数据处理能力</li>
        <li>至少熟悉一种主流深度学习框架（PyTorch/TensorFlow）</li>
        <li>理解大语言模型的原理与应用方式</li>
        <li>数学基础（线性代数、概率统计、微积分）</li>
      </ul>
      
      <h3>2024年最有前景的AI细分领域</h3>
      <ul>
        <li><strong>大模型应用开发</strong>：将通用大模型能力与特定场景结合</li>
        <li><strong>AI系统优化</strong>：提高模型推理效率、降低资源消耗</li>
        <li><strong>多模态交互</strong>：构建能理解文本、图像、语音的智能系统</li>
        <li><strong>隐私计算与AI安全</strong>：解决AI应用中的数据隐私与安全问题</li>
        <li><strong>领域专家+AI能力</strong>：在医疗、金融、法律等特定领域结合AI技术</li>
      </ul>
      
      <h3>学习路径建议</h3>
      <p><strong>入门阶段</strong>：建立基础知识体系</p>
      <ul>
        <li>完成Andrew Ng的机器学习和深度学习课程</li>
        <li>学习Python及数据科学核心库（NumPy, Pandas, Matplotlib）</li>
        <li>参与基础项目，如图像分类、文本情感分析等</li>
      </ul>
      
      <p><strong>进阶阶段</strong>：深入专业领域</p>
      <ul>
        <li>学习Transformer架构与大语言模型原理</li>
        <li>掌握微调、提示工程等应用技术</li>
        <li>参与实际项目，积累项目经验</li>
        <li>关注顶会（如NIPS、ICML、ACL）的最新研究</li>
      </ul>
      
      <p><strong>专家阶段</strong>：形成个人专长</p>
      <ul>
        <li>在特定细分领域深耕（如多模态学习、强化学习、AI系统优化等）</li>
        <li>参与开源项目或发表研究论文</li>
        <li>建立个人品牌和行业影响力</li>
      </ul>
      
      <h3>职业发展建议</h3>
      <p>在AI快速发展的时代，保持持续学习至关重要。建议：</p>
      <ul>
        <li>每周固定时间学习最新技术和论文</li>
        <li>参与技术社区，与同行交流</li>
        <li>构建个人知识管理系统，积累经验</li>
        <li>关注产业应用，了解技术如何创造价值</li>
        <li>定期反思和调整职业规划</li>
      </ul>
      
      <p>记住，AI领域的职业发展不是线性的，而是一个不断探索和调整的过程。最重要的是找到自己的兴趣所在，并在这个方向上不断精进。</p>`,
      date: '2023-12-05',
      readTime: '10分钟',
      views: 6254,
      tags: ['职业规划', 'AI人才', '技能提升', '学习路径'],
      author: '林教授',
      authorBio: 'AI教育专家，拥有10年人工智能人才培养经验',
      authorAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      isFavorite: false
    },
    // 案例研究类文章
    {
      id: 'case-001',
      type: 'case',
      title: '医疗影像诊断中的AI应用：从研发到临床落地',
      summary:
        '本案例分析了一款医疗影像AI诊断系统的研发过程、技术挑战及临床应用效果，为医疗AI领域提供了宝贵经验。',
      content: `<p>医疗影像是AI在医疗领域应用最广泛、最成熟的方向之一。本案例讲述了一个从实验室研究到临床应用的完整故事，揭示了医疗AI落地的真实挑战与解决方案。</p>
      
      <h3>项目背景</h3>
      <p>项目团队由AI研究者和放射科医生组成，目标是开发一款能协助诊断肺部CT影像的AI系统，重点是提高肺结节的检出率和良恶性判断准确率。</p>
      
      <h3>技术路线</h3>
      <p>系统采用了两阶段架构：</p>
      <ol>
        <li><strong>检测阶段</strong>：使用改进的3D-UNet进行肺结节候选区域检测</li>
        <li><strong>分类阶段</strong>：结合CNN和Transformer的混合模型对候选区域进行良恶性判断</li>
      </ol>
      
      <p>值得注意的是，团队针对医疗场景的特点，在模型设计中特别强调了以下几点：</p>
      <ul>
        <li>引入了注意力机制，使模型能关注临床医生会关注的关键区域</li>
        <li>设计了多尺度特征融合模块，提高对不同大小结节的敏感度</li>
        <li>采用了不确定性估计方法，对模型不确定的病例会提醒需要医生进一步审核</li>
      </ul>
      
      <h3>数据与训练策略</h3>
      <p>团队收集了超过10,000例标注CT影像，包括：</p>
      <ul>
        <li>8,000例来自合作医院的临床数据（有病理确诊）</li>
        <li>2,000例来自公开数据集LIDC-IDRI和LUNA16</li>
      </ul>
      
      <p>为解决医疗数据中常见的标签不平衡问题，团队采用了：</p>
      <ul>
        <li>分层采样策略确保不同类别样本的平衡</li>
        <li>Focal Loss减轻易分样本的权重</li>
        <li>混合精度训练加速模型训练过程</li>
      </ul>
      
      <h3>技术挑战与解决方案</h3>
      <table border="1">
        <tr>
          <th>挑战</th>
          <th>解决方案</th>
          <th>效果</th>
        </tr>
        <tr>
          <td>数据标注不一致</td>
          <td>引入多专家共识机制，采用Kappa系数评估标注一致性</td>
          <td>标注质量提升30%</td>
        </tr>
        <tr>
          <td>模型过拟合</td>
          <td>设计特定的数据增强策略，如仿射变换、HU值扰动等</td>
          <td>验证集准确率提升5%</td>
        </tr>
        <tr>
          <td>假阳性率高</td>
          <td>引入解剖结构先验信息，改进后处理算法</td>
          <td>假阳性率降低40%</td>
        </tr>
        <tr>
          <td>部署复杂性</td>
          <td>模型量化与剪枝，开发适配医院PACS系统的插件</td>
          <td>推理速度提升3倍</td>
        </tr>
      </table>
      
      <h3>临床验证结果</h3>
      <p>系统在5家三甲医院进行了前瞻性临床试验，结果表明：</p>
      <ul>
        <li>结节检出敏感度达到94.6%，优于平均放射科医师的89.2%</li>
        <li>良恶性判断准确率达到87.3%，接近高级职称医师水平</li>
        <li>医生使用AI辅助后，诊断效率提升36%，漏诊率降低42%</li>
        <li>90%以上的医生表示系统提供的建议有实际参考价值</li>
      </ul>
      
      <h3>落地经验总结</h3>
      <ol>
        <li><strong>临床需求优先</strong>：技术研发必须以临床真实需求为导向</li>
        <li><strong>医工融合至关重要</strong>：从项目初期就需要紧密的医工结合</li>
        <li><strong>数据质量胜于数量</strong>：精心标注的高质量数据比大量粗略标注的数据更有价值</li>
        <li><strong>模型可解释性必不可少</strong>：医生需要理解AI为何做出特定判断</li>
        <li><strong>无缝工作流整合</strong>：AI系统必须融入医生现有工作流，而非增加额外负担</li>
        <li><strong>持续更新与反馈</strong>：建立持续学习机制，根据临床使用反馈不断改进</li>
      </ol>
      
      <p>这个案例表明，医疗AI的成功落地不仅需要先进的算法，更需要深入理解临床场景、严格的验证流程和适应医疗体系的产品设计。未来，随着更多临床数据的积累和算法的进步，AI在医疗影像领域的应用将更加广泛和深入。</p>`,
      date: '2023-11-10',
      readTime: '14分钟',
      views: 4378,
      tags: ['医疗AI', '案例研究', '计算机视觉', '临床应用'],
      author: '黄医生',
      authorBio: '放射科医生，同时是医疗AI研究者，专注于AI辅助诊断系统开发',
      authorAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      isFavorite: false
    }
  ]
}

// 在组件挂载时加载文章
onMounted(() => {
  loadArticles()
})
</script>
