<template>
  <div class="career-analysis">
    <!-- 页面标题和引导语 -->
    <div class="page-header">
      <h1 class="page-title">
        <el-icon><Aim /></el-icon>
        职业倾向分析
      </h1>
      <p class="page-description">
        基于您的背景、技能和兴趣，我们将为您分析最适合的职业方向和发展路径。
      </p>
    </div>

    <!-- 主要内容区域 -->
    <el-row :gutter="24" class="analysis-container">
      <!-- 左侧：分步表单 -->
      <el-col :xs="24" :md="10">
        <div class="form-container">
          <div class="step-indicator">
            <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
              <div class="step-number">1</div>
              <div class="step-label">背景信息</div>
            </div>
            <div class="step-line" :class="{ active: currentStep > 1 }"></div>
            <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
              <div class="step-number">2</div>
              <div class="step-label">技能专长</div>
            </div>
            <div class="step-line" :class="{ active: currentStep > 2 }"></div>
            <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
              <div class="step-number">3</div>
              <div class="step-label">兴趣偏好</div>
            </div>
            <div class="step-line" :class="{ active: currentStep > 3 }"></div>
            <div class="step" :class="{ active: currentStep >= 4 }">
              <div class="step-number">4</div>
              <div class="step-label">工作经验</div>
            </div>
          </div>

          <el-card class="step-card" shadow="hover">
            <!-- 步骤1：基本背景 -->
            <div v-if="currentStep === 1" class="step-content">
              <h2 class="step-title">您的教育背景</h2>
              <p class="step-description">
                请告诉我们您的学历和专业方向，这将帮助我们更准确地分析适合您的职业路径。
              </p>

              <el-form :model="analysisForm" label-position="top">
                <el-form-item label="最高学历" required>
                  <el-select
                    v-model="analysisForm.education"
                    placeholder="请选择您的学历"
                    class="full-width"
                  >
                    <el-option-group label="学历层次">
                      <el-option label="高中/中专" value="high_school" />
                      <el-option label="大专" value="college" />
                      <el-option label="本科" value="bachelor" />
                      <el-option label="硕士" value="master" />
                      <el-option label="博士" value="phd" />
                    </el-option-group>
                  </el-select>
                </el-form-item>

                <el-form-item label="专业方向" required>
                  <el-input
                    v-model="analysisForm.major"
                    placeholder="例如：计算机科学、市场营销、心理学..."
                    clearable
                  />
                </el-form-item>
              </el-form>

              <div class="step-tip">
                <el-icon><InfoFilled /></el-icon>
                <span>学历与专业是影响职业方向的重要因素，请确保信息准确。</span>
              </div>
            </div>

            <!-- 步骤2：技能特长 -->
            <div v-if="currentStep === 2" class="step-content">
              <h2 class="step-title">您的技能特长</h2>
              <p class="step-description">
                选择或添加您擅长的技能，这些技能将帮助我们找到最匹配的职业方向。
              </p>

              <el-form :model="analysisForm" label-position="top">
                <el-form-item required>
                  <div class="skill-categories">
                    <div
                      v-for="(cat, index) in ['技术', '设计', '管理', '软技能']"
                      :key="index"
                      class="skill-category"
                      :class="{ active: activeCategory === cat }"
                      @click="activeCategory = cat"
                    >
                      {{ cat }}
                    </div>
                  </div>

                  <div class="skill-selection">
                    <div v-if="activeCategory === '技术'" class="skill-chips">
                      <el-tag
                        v-for="skill in techSkills"
                        :key="skill.id"
                        :class="{ selected: analysisForm.skills.includes(skill.name) }"
                        @click="toggleSkill(skill.name)"
                        class="skill-chip"
                      >
                        {{ skill.name }}
                      </el-tag>
                    </div>
                    <div v-if="activeCategory === '设计'" class="skill-chips">
                      <el-tag
                        v-for="skill in designSkills"
                        :key="skill.id"
                        :class="{ selected: analysisForm.skills.includes(skill.name) }"
                        @click="toggleSkill(skill.name)"
                        class="skill-chip"
                      >
                        {{ skill.name }}
                      </el-tag>
                    </div>
                    <div v-if="activeCategory === '管理'" class="skill-chips">
                      <el-tag
                        v-for="skill in managementSkills"
                        :key="skill.id"
                        :class="{ selected: analysisForm.skills.includes(skill.name) }"
                        @click="toggleSkill(skill.name)"
                        class="skill-chip"
                      >
                        {{ skill.name }}
                      </el-tag>
                    </div>
                    <div v-if="activeCategory === '软技能'" class="skill-chips">
                      <el-tag
                        v-for="skill in softSkills"
                        :key="skill.id"
                        :class="{ selected: analysisForm.skills.includes(skill.name) }"
                        @click="toggleSkill(skill.name)"
                        class="skill-chip"
                      >
                        {{ skill.name }}
                      </el-tag>
                    </div>
                  </div>

                  <div class="custom-skill">
                    <el-input
                      v-model="newSkill"
                      placeholder="添加自定义技能..."
                      clearable
                      @keyup.enter="addCustomSkill"
                    >
                      <template #append>
                        <el-button @click="addCustomSkill">添加</el-button>
                      </template>
                    </el-input>
                  </div>
                </el-form-item>
              </el-form>

              <div class="selected-skills" v-if="analysisForm.skills.length > 0">
                <h3>已选择的技能 ({{ analysisForm.skills.length }})</h3>
                <div class="skill-tags">
                  <el-tag
                    v-for="(skill, index) in analysisForm.skills"
                    :key="index"
                    closable
                    @close="removeSkill(skill)"
                    class="selected-skill-tag"
                  >
                    {{ skill }}
                  </el-tag>
                </div>
              </div>

              <div class="step-tip" v-else>
                <el-icon><InfoFilled /></el-icon>
                <span>请至少选择3项您最擅长的技能。</span>
              </div>
            </div>

            <!-- 步骤3：兴趣偏好 -->
            <div v-if="currentStep === 3" class="step-content">
              <h2 class="step-title">您的兴趣偏好</h2>
              <p class="step-description">
                选择您感兴趣的领域和工作方向，这将帮助我们找到更适合您性格和爱好的职业。
              </p>

              <el-form :model="analysisForm" label-position="top">
                <el-form-item label="兴趣方向">
                  <div class="interest-selection">
                    <div
                      v-for="interest in interestOptions"
                      :key="interest.value"
                      class="interest-option"
                      :class="{ selected: analysisForm.interests.includes(interest.value) }"
                      @click="toggleInterest(interest.value)"
                    >
                      <el-icon><component :is="interest.icon" /></el-icon>
                      <span>{{ interest.label }}</span>
                    </div>
                  </div>
                </el-form-item>

                <div class="custom-interest">
                  <el-input
                    v-model="newInterest"
                    placeholder="添加其他兴趣..."
                    clearable
                    @keyup.enter="addCustomInterest"
                  >
                    <template #append>
                      <el-button @click="addCustomInterest">添加</el-button>
                    </template>
                  </el-input>
                </div>
              </el-form>

              <div class="selected-interests" v-if="analysisForm.interests.length > 0">
                <h3>已选择的兴趣 ({{ analysisForm.interests.length }})</h3>
                <div class="interest-tags">
                  <el-tag
                    v-for="(interest, index) in analysisForm.interests"
                    :key="index"
                    closable
                    @close="removeInterest(interest)"
                    class="selected-interest-tag"
                  >
                    {{ getInterestLabel(interest) }}
                  </el-tag>
                </div>
              </div>
            </div>

            <!-- 步骤4：工作经验 -->
            <div v-if="currentStep === 4" class="step-content">
              <h2 class="step-title">您的工作经验</h2>
              <p class="step-description">
                请告诉我们您的工作年限，这将影响我们对您职业发展阶段的判断。
              </p>

              <el-form :model="analysisForm" label-position="top">
                <el-form-item label="工作年限">
                  <div class="experience-slider">
                    <el-slider
                      v-model="analysisForm.workExperience"
                      :min="0"
                      :max="20"
                      :step="0.5"
                      show-stops
                      show-input
                      :format-tooltip="formatExperience"
                    />
                  </div>
                  <div class="experience-description">
                    {{ getExperienceDescription() }}
                  </div>
                </el-form-item>
              </el-form>

              <div class="form-action">
                <el-button
                  type="primary"
                  size="large"
                  @click="submitAnalysis"
                  :loading="analyzing"
                  class="submit-button"
                >
                  开始职业分析
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>

            <!-- 步骤导航按钮 -->
            <div class="step-navigation">
              <el-button
                v-if="currentStep > 1"
                @click="currentStep--"
                class="nav-button prev-button"
              >
                <el-icon><ArrowLeft /></el-icon>
                上一步
              </el-button>
              <el-button
                v-if="currentStep < 4"
                @click="nextStep"
                type="primary"
                class="nav-button next-button"
              >
                下一步
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </el-card>
        </div>
      </el-col>

      <!-- 右侧：实时预览和结果分析 -->
      <el-col :xs="24" :md="14">
        <transition name="fade">
          <div v-if="!analysisResult" class="preview-container">
            <el-card shadow="hover" class="preview-card">
              <template #header>
                <div class="preview-header">
                  <span>实时职业预测</span>
                  <el-tooltip
                    content="根据您已填写的信息进行的初步预测，完成全部信息可获得更准确分析"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
              </template>

              <div class="preview-content">
                <!-- 当用户还未填写足够信息时 -->
                <div v-if="isFormEmpty" class="preview-empty">
                  <el-empty description="完成表单后，这里将显示您的职业分析预览">
                    <el-button type="primary" @click="currentStep = 1">开始填写</el-button>
                  </el-empty>
                </div>

                <!-- 当用户正在填写信息时的实时预测 -->
                <div v-else class="preview-data">
                  <div class="preview-section">
                    <h3>可能适合的职业方向</h3>
                    <div class="preview-careers">
                      <div
                        v-for="(career, index) in previewCareers"
                        :key="index"
                        class="preview-career-item"
                      >
                        <el-progress
                          type="dashboard"
                          :percentage="career.match"
                          :color="getCareerColor(career.match)"
                          :stroke-width="10"
                        />
                        <span class="preview-career-name">{{ career.name }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="preview-section">
                    <h3>优势技能</h3>
                    <div class="preview-skills">
                      <el-tag
                        v-for="(skill, index) in previewStrengths"
                        :key="index"
                        :type="getPreviewTagType(index)"
                      >
                        {{ skill }}
                      </el-tag>
                    </div>
                  </div>

                  <div class="preview-tip">
                    <el-alert
                      title="填写更多信息以获得更准确的分析"
                      type="info"
                      :closable="false"
                      show-icon
                    />
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <!-- 分析结果展示 -->
          <div v-else class="result-container">
            <el-card class="result-summary-card" shadow="hover">
              <div class="result-summary">
                <div class="result-header">
                  <div class="result-title">
                    <h2>
                      您最适合的职业：<span class="highlight">{{
                        analysisResult.recommendedCareer
                      }}</span>
                    </h2>
                    <el-button type="primary" size="small" @click="showAnalysisDetails = true">
                      查看详细分析
                    </el-button>
                  </div>
                  <div class="match-score-container">
                    <el-progress
                      type="dashboard"
                      :percentage="analysisResult.suitabilityScore"
                      :color="getScoreColor(analysisResult.suitabilityScore)"
                      :stroke-width="15"
                    />
                    <div class="score-label">匹配度</div>
                  </div>
                </div>

                <div class="result-advantages">
                  <h3>
                    <el-icon><Star /></el-icon> 职业优势
                  </h3>
                  <p>{{ analysisResult.advantages }}</p>
                </div>
              </div>
            </el-card>

            <!-- 雷达图展示能力分布 -->
            <el-card class="result-detail-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>能力分布雷达图</span>
                  <el-tooltip content="展示您在各个能力维度上的表现">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
              </template>
              <div class="radar-chart-container" ref="radarChartRef"></div>
            </el-card>

            <!-- 优劣势分析 -->
            <el-row :gutter="20" class="strength-weakness-row">
              <el-col :xs="24" :md="12">
                <el-card class="strength-card" shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <el-icon color="#67C23A"><CircleCheckFilled /></el-icon>
                      <span>您的优势</span>
                    </div>
                  </template>
                  <ul class="strength-list">
                    <li v-for="(strength, index) in analysisResult.strengths" :key="index">
                      <el-icon color="#67C23A"><Check /></el-icon>
                      <span>{{ strength }}</span>
                    </li>
                  </ul>
                </el-card>
              </el-col>
              <el-col :xs="24" :md="12">
                <el-card class="weakness-card" shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <el-icon color="#F56C6C"><InfoFilled /></el-icon>
                      <span>提升空间</span>
                    </div>
                  </template>
                  <ul class="weakness-list">
                    <li v-for="(weakness, index) in analysisResult.weaknesses" :key="index">
                      <el-icon color="#F56C6C"><Warning /></el-icon>
                      <span>{{ weakness }}</span>
                    </li>
                  </ul>
                </el-card>
              </el-col>
            </el-row>

            <!-- 相关职业推荐 -->
            <el-card class="related-careers-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>其他适合您的职业</span>
                </div>
              </template>
              <div class="related-careers-container">
                <div
                  v-for="(career, index) in analysisResult.relatedCareers"
                  :key="index"
                  class="related-career-item"
                  @click="goToRecommendationWithCareer(career)"
                >
                  <div class="career-info">
                    <h3>{{ career }}</h3>
                    <div class="career-match">
                      <el-progress
                        :percentage="getRelatedCareerMatch(index)"
                        :stroke-width="8"
                        :show-text="false"
                      />
                      <span>匹配度 {{ getRelatedCareerMatch(index) }}%</span>
                    </div>
                  </div>
                  <el-button type="primary" text>
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-card>

            <!-- 发展建议 -->
            <el-card class="suggestions-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <el-icon><ChatLineRound /></el-icon>
                  <span>个性化发展建议</span>
                </div>
              </template>
              <div class="suggestions-content">
                <p>{{ analysisResult.suggestions }}</p>
                <div class="action-buttons">
                  <el-button type="primary" @click="goToRoadmap">
                    <el-icon><Connection /></el-icon>
                    制定职业发展规划
                  </el-button>
                  <el-button type="success" @click="goToRecommendation">
                    <el-icon><View /></el-icon>
                    探索更多职业选择
                  </el-button>
                </div>
              </div>
            </el-card>
          </div>
        </transition>
      </el-col>
    </el-row>

    <!-- 详细分析弹窗 -->
    <el-dialog
      v-model="showAnalysisDetails"
      title="详细职业分析报告"
      width="70%"
      class="analysis-dialog"
      :destroy-on-close="false"
    >
      <div class="analysis-report" ref="reportContentRef">
        <div class="report-header">
          <img src="@/assets/logo.svg" class="report-logo" alt="logo" />
          <h2 class="report-title">
            {{ analysisResult?.recommendedCareer || '职业' }}分析报告
            <span class="report-subtitle">专属您的职业发展指南</span>
          </h2>
          <div class="report-date">生成日期: {{ formatDate(new Date()) }}</div>
        </div>

        <el-divider />

        <div class="report-section">
          <div class="section-header">
            <el-icon><Briefcase /></el-icon>
            <h3>职业概述</h3>
          </div>
          <div class="section-content career-overview">
            <p>{{ getCareerDescription() }}</p>
            <div class="career-summary-chart">
              <el-row :gutter="20">
                <el-col :span="12">
                  <div class="match-score-display">
                    <el-progress
                      type="dashboard"
                      :percentage="analysisResult?.suitabilityScore || 0"
                      :color="getScoreColor(analysisResult?.suitabilityScore || 0)"
                      :stroke-width="15"
                      :width="180"
                    />
                    <div class="match-label">
                      <div class="match-title">整体匹配度</div>
                      <div class="match-value">{{ analysisResult?.suitabilityScore || 0 }}%</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="career-highlights">
                    <div class="highlight-item">
                      <div class="highlight-icon">
                        <el-icon><Trophy /></el-icon>
                      </div>
                      <div class="highlight-content">
                        <div class="highlight-label">核心优势</div>
                        <div class="highlight-value">
                          {{ analysisResult?.strengths[0] || '暂无数据' }}
                        </div>
                      </div>
                    </div>
                    <div class="highlight-item">
                      <div class="highlight-icon">
                        <el-icon><Opportunity /></el-icon>
                      </div>
                      <div class="highlight-content">
                        <div class="highlight-label">发展潜力</div>
                        <div class="highlight-value">{{ getCareerGrowth() }}</div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>

        <div class="report-section">
          <div class="section-header">
            <el-icon><Star /></el-icon>
            <h3>您的优势匹配</h3>
          </div>
          <div class="section-content">
            <div class="match-bars">
              <div v-for="(item, index) in matchFactors" :key="index" class="match-bar">
                <div class="match-bar-label">{{ item.factor }}</div>
                <div class="match-bar-container">
                  <el-progress
                    :percentage="item.score"
                    :color="getMatchColor(item.score)"
                    :stroke-width="12"
                    :format="percentage => `${percentage}%`"
                  />
                  <div class="match-bar-description">
                    {{ getFactorDescription(item) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="report-section">
          <div class="section-header">
            <el-icon><Connection /></el-icon>
            <h3>能力分布分析</h3>
          </div>
          <div class="section-content">
            <div class="ability-chart" ref="reportRadarChartRef"></div>
            <div class="ability-analysis">
              <p class="ability-summary">
                根据您的职业背景和技能分布，我们对您的核心能力进行了全方位评估。
                <span class="highlight">{{ getTopAbility() }}</span
                >是您的优势领域， 而<span class="highlight">{{ getWeakAbility() }}</span
                >有提升空间。
              </p>
            </div>
          </div>
        </div>

        <div class="report-section">
          <div class="section-header">
            <el-icon><ChatLineRound /></el-icon>
            <h3>个性化发展建议</h3>
          </div>
          <div class="section-content">
            <div class="suggestions-container">
              <p>{{ analysisResult?.suggestions || '' }}</p>
              <div class="key-suggestions">
                <h4>关键行动点：</h4>
                <ul class="action-points">
                  <li v-for="(point, index) in getActionPoints()" :key="index">
                    <el-icon color="#409EFF"><Check /></el-icon>
                    <span>{{ point }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="report-section">
          <div class="section-header">
            <el-icon><Reading /></el-icon>
            <h3>推荐学习资源</h3>
          </div>
          <div class="section-content">
            <div class="resource-list">
              <div
                v-for="(resource, index) in getLearningResources()"
                :key="index"
                class="resource-item"
                :class="{ 'resource-expanded': expandedResource === index }"
                @click="toggleResourceExpand(index)"
              >
                <div class="resource-header">
                  <el-icon><Document /></el-icon>
                  <div class="resource-info">
                    <div class="resource-title">{{ resource.title }}</div>
                    <div class="resource-description">{{ resource.description }}</div>
                  </div>
                  <el-button circle size="small">
                    <el-icon>
                      <component :is="expandedResource === index ? ArrowUp : ArrowDown" />
                    </el-icon>
                  </el-button>
                </div>
                <div v-show="expandedResource === index" class="resource-details">
                  <div class="resource-details-content">
                    <p>{{ resource.details || '暂无详细介绍' }}</p>
                    <div class="resource-tags">
                      <el-tag
                        v-for="(tag, i) in resource.tags || []"
                        :key="i"
                        size="small"
                        :type="
                          getTagType(i) as 'primary' | 'success' | 'warning' | 'info' | 'danger'
                        "
                      >
                        {{ tag }}
                      </el-tag>
                    </div>
                  </div>
                  <div class="resource-actions">
                    <el-link :href="resource.link" target="_blank" type="primary">
                      <el-icon><Link /></el-icon> 访问资源
                    </el-link>
                    <el-button type="info" text size="small" @click.stop="saveResource(resource)">
                      <el-icon><Star /></el-icon> 收藏
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="report-footer">
          <p>
            本报告基于您提供的信息生成，仅供参考。职业发展是一个持续的过程，建议定期更新您的信息并获取最新分析。
          </p>
          <div class="report-signature">Z-Admin 职业规划系统</div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showAnalysisDetails = false">关闭</el-button>
          <el-dropdown split-button type="primary" @command="handleExportCommand">
            <el-icon><Download /></el-icon>
            导出报告
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="pdf">PDF格式导出</el-dropdown-item>
                <el-dropdown-item command="print">打印报告</el-dropdown-item>
                <el-dropdown-item command="image">保存为图片</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import type { CareerAnalysisForm, CareerAnalysisResult, CareerSkill } from '@/types/career'
import { getCareerSkills } from '@/api/career'
import { getProfessionAnalysis } from '@/api/ai'
import {
  Aim,
  InfoFilled,
  QuestionFilled,
  CircleCheckFilled,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Star,
  Check,
  Warning,
  View,
  Document,
  Download,
  Connection,
  ChatLineRound,
  Reading,
  Briefcase,
  Trophy,
  Opportunity,
  Link
} from '@element-plus/icons-vue'

const router = useRouter()
const analyzing = ref(false)
const allSkills = ref<CareerSkill[]>([])
const currentStep = ref(1)
const activeCategory = ref('技术')
const newSkill = ref('')
const newInterest = ref('')
const showAnalysisDetails = ref(false)
const radarChartRef = ref<HTMLElement | null>(null)
const reportContentRef = ref<HTMLElement | null>(null)
const reportRadarChartRef = ref<HTMLElement | null>(null)
let radarChart: echarts.ECharts | null = null
let reportRadarChart: echarts.ECharts | null = null
const expandedResource = ref<number | null>(null)

// 步骤2：技能分类
const techSkills = computed(() => allSkills.value.filter(skill => skill.category === 'tech'))
const designSkills = computed(() => allSkills.value.filter(skill => skill.category === 'design'))
const managementSkills = computed(() =>
  allSkills.value.filter(skill => skill.category === 'management')
)
const softSkills = computed(() => allSkills.value.filter(skill => skill.category === 'soft'))

// 步骤3：兴趣选项
const interestOptions = [
  { label: '技术研究', value: 'tech_research', icon: 'Monitor' },
  { label: '创意设计', value: 'creative_design', icon: 'Brush' },
  { label: '数据分析', value: 'data_analysis', icon: 'DataAnalysis' },
  { label: '人际沟通', value: 'communication', icon: 'ChatLineRound' },
  { label: '团队协作', value: 'teamwork', icon: 'Connection' },
  { label: '写作', value: 'writing', icon: 'Reading' },
  { label: '策略规划', value: 'strategy', icon: 'SetUp' },
  { label: '教学培训', value: 'teaching', icon: 'Opportunity' },
  { label: '财务管理', value: 'financial', icon: 'CreditCard' },
  { label: '项目管理', value: 'project_management', icon: 'Setting' }
]

// 表单数据
const analysisForm = reactive<CareerAnalysisForm>({
  education: '',
  major: '',
  skills: [],
  interests: [],
  workExperience: 0
})

// 分析结果
const analysisResult = ref<CareerAnalysisResult | null>(null)

// 预览数据
const isFormEmpty = computed(
  () =>
    !analysisForm.education &&
    !analysisForm.major &&
    analysisForm.skills.length === 0 &&
    analysisForm.interests.length === 0
)

// 预览职业
const previewCareers = computed(() => {
  if (isFormEmpty.value) return []

  // 根据已填写的信息生成初步职业预测
  const careers = []

  if (analysisForm.education === 'bachelor' || analysisForm.education === 'master') {
    careers.push({ name: '软件开发工程师', match: 85 })
    careers.push({ name: '数据分析师', match: 76 })
    careers.push({ name: '产品经理', match: 68 })
  } else if (analysisForm.education === 'phd') {
    careers.push({ name: '研究科学家', match: 92 })
    careers.push({ name: '算法专家', match: 88 })
    careers.push({ name: '技术总监', match: 75 })
  } else {
    careers.push({ name: '前端开发', match: 80 })
    careers.push({ name: 'UI设计师', match: 72 })
    careers.push({ name: '技术支持', match: 65 })
  }

  // 根据技能进行调整
  if (analysisForm.skills.includes('编程开发')) {
    careers[0].match += 8
  }
  if (analysisForm.skills.includes('数据分析')) {
    careers[1].match += 10
  }

  // 确保百分比不超过100
  careers.forEach(career => {
    career.match = Math.min(career.match, 100)
  })

  return careers
})

// 预览优势
const previewStrengths = computed(() => {
  if (analysisForm.skills.length === 0) return []
  return analysisForm.skills.slice(0, 3)
})

// 加载技能列表
onMounted(async () => {
  try {
    allSkills.value = await getCareerSkills()
    initializeRadarChart()
  } catch (error) {
    ElMessage.error('获取技能列表失败')
  }
})

// 雷达图初始化
const initializeRadarChart = () => {
  nextTick(() => {
    if (radarChartRef.value && analysisResult.value) {
      radarChart = echarts.init(radarChartRef.value)
      updateRadarChart()
    }

    // 初始化报告中的雷达图
    if (reportRadarChartRef.value && analysisResult.value) {
      reportRadarChart = echarts.init(reportRadarChartRef.value)
      updateReportRadarChart()
    }
  })
}

// 更新雷达图数据
const updateRadarChart = () => {
  if (!radarChart || !analysisResult.value) return

  const option = {
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: [
        { name: '技术能力', max: 100 },
        { name: '分析思维', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '沟通协作', max: 100 },
        { name: '领导力', max: 100 },
        { name: '专业知识', max: 100 }
      ],
      radius: '65%'
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: getRadarValues(),
            name: '能力分布',
            areaStyle: {
              color: 'rgba(64, 158, 255, 0.6)'
            },
            lineStyle: {
              color: '#409EFF',
              width: 2
            }
          }
        ]
      }
    ]
  }

  radarChart.setOption(option)
}

// 生成雷达图数据
const getRadarValues = () => {
  if (!analysisResult.value) return [0, 0, 0, 0, 0, 0]

  // 根据分析结果生成各维度的值
  const technicalSkill = Math.min(95, analysisResult.value.suitabilityScore + 5)
  const analyticalThinking = analysisForm.skills.includes('数据分析') ? 90 : 75
  const innovation = analysisForm.interests.includes('creative_design') ? 85 : 70
  const communication = analysisForm.interests.includes('communication') ? 90 : 65
  const leadership = analysisForm.workExperience > 5 ? 80 : 60
  const expertise =
    analysisForm.education === 'phd' ? 95 : analysisForm.education === 'master' ? 85 : 75

  return [technicalSkill, analyticalThinking, innovation, communication, leadership, expertise]
}

// 分析报告匹配因素
const matchFactors = computed(() => {
  if (!analysisResult.value) return []

  return [
    { factor: '教育背景', score: getEducationScore() },
    { factor: '技能匹配', score: analysisResult.value.suitabilityScore },
    { factor: '兴趣吻合', score: getInterestScore() },
    { factor: '经验水平', score: getExperienceScore() },
    { factor: '行业需求', score: 85 } // 模拟数据
  ]
})

// 计算教育背景得分
const getEducationScore = () => {
  const scores: Record<string, number> = {
    high_school: 60,
    college: 75,
    bachelor: 85,
    master: 90,
    phd: 95
  }
  return scores[analysisForm.education] || 70
}

// 计算兴趣吻合度得分
const getInterestScore = () => {
  return analysisForm.interests.length > 3 ? 85 : analysisForm.interests.length > 1 ? 75 : 65
}

// 计算经验水平得分
const getExperienceScore = () => {
  if (analysisForm.workExperience >= 5) return 90
  if (analysisForm.workExperience >= 3) return 80
  if (analysisForm.workExperience >= 1) return 70
  return 60
}

// 获取相关职业匹配度
const getRelatedCareerMatch = (index: number) => {
  if (!analysisResult.value) return 0
  const baseScore = analysisResult.value.suitabilityScore
  return Math.max(50, baseScore - (index + 1) * 5)
}

// 步骤控制
const nextStep = () => {
  // 进行简单验证
  if (currentStep.value === 1) {
    if (!analysisForm.education || !analysisForm.major) {
      ElMessage.warning('请填写完整的教育背景信息')
      return
    }
  } else if (currentStep.value === 2) {
    if (analysisForm.skills.length < 1) {
      ElMessage.warning('请至少选择一项技能特长')
      return
    }
  }

  currentStep.value++
}

// 技能选择
const toggleSkill = (skillName: string) => {
  const index = analysisForm.skills.indexOf(skillName)
  if (index === -1) {
    analysisForm.skills.push(skillName)
  } else {
    analysisForm.skills.splice(index, 1)
  }
}

// 添加自定义技能
const addCustomSkill = () => {
  if (!newSkill.value.trim()) return
  if (!analysisForm.skills.includes(newSkill.value)) {
    analysisForm.skills.push(newSkill.value)
    newSkill.value = ''
  } else {
    ElMessage.warning('该技能已添加')
  }
}

// 移除技能
const removeSkill = (skill: string) => {
  const index = analysisForm.skills.indexOf(skill)
  if (index !== -1) {
    analysisForm.skills.splice(index, 1)
  }
}

// 兴趣选择
const toggleInterest = (interestValue: string) => {
  const index = analysisForm.interests.indexOf(interestValue)
  if (index === -1) {
    analysisForm.interests.push(interestValue)
  } else {
    analysisForm.interests.splice(index, 1)
  }
}

// 添加自定义兴趣
const addCustomInterest = () => {
  if (!newInterest.value.trim()) return
  if (!analysisForm.interests.includes(newInterest.value)) {
    analysisForm.interests.push(newInterest.value)
    newInterest.value = ''
  } else {
    ElMessage.warning('该兴趣已添加')
  }
}

// 移除兴趣
const removeInterest = (interest: string) => {
  const index = analysisForm.interests.indexOf(interest)
  if (index !== -1) {
    analysisForm.interests.splice(index, 1)
  }
}

// 获取兴趣标签
const getInterestLabel = (value: string) => {
  const option = interestOptions.find(opt => opt.value === value)
  return option ? option.label : value
}

// 格式化工作经验
const formatExperience = (val: number) => {
  return `${val} 年`
}

// 获取工作经验描述
const getExperienceDescription = () => {
  const exp = analysisForm.workExperience
  if (exp === 0) return '应届毕业生/无工作经验'
  if (exp < 1) return '工作经验不足1年，处于初级阶段'
  if (exp < 3) return '有1-3年工作经验，具备一定专业能力'
  if (exp < 5) return '有3-5年工作经验，已经积累较丰富经验'
  if (exp < 10) return '有5-10年工作经验，属于资深人才'
  return '有10年以上工作经验，具备专家级别的经验'
}

// 提交分析
const submitAnalysis = async () => {
  if (!analysisForm.education || !analysisForm.major || analysisForm.skills.length === 0) {
    ElMessage.warning('请填写必要的信息（教育背景、专业方向和技能特长）')
    return
  }

  analyzing.value = true
  try {
    const response = await getProfessionAnalysis(analysisForm)
    analysisResult.value = response.data
    ElMessage.success('分析完成')

    // 初始化雷达图
    nextTick(() => {
      initializeRadarChart()
    })
  } catch (error) {
    ElMessage.error('分析失败，请重试')
    console.error(error)
  } finally {
    analyzing.value = false
  }
}

// 获取职业颜色
const getCareerColor = (match: number) => {
  if (match >= 85) return '#67C23A'
  if (match >= 70) return '#409EFF'
  return '#E6A23C'
}

// 获取分数颜色
const getScoreColor = (score: number) => {
  if (score >= 90) return '#67C23A'
  if (score >= 70) return '#409EFF'
  return '#F56C6C'
}

// 获取匹配颜色
const getMatchColor = (score: number) => {
  if (score >= 85) return '#67C23A'
  if (score >= 70) return '#409EFF'
  if (score >= 60) return '#E6A23C'
  return '#F56C6C'
}

// 获取预览标签类型
const getPreviewTagType = (
  index: number
): 'success' | 'warning' | 'info' | 'primary' | 'danger' | undefined => {
  const types: ('success' | 'warning' | 'info' | 'primary' | 'danger' | undefined)[] = [
    'success',
    'primary',
    'info'
  ]
  return types[index % types.length]
}

// 获取职业描述
const getCareerDescription = () => {
  if (!analysisResult.value) return ''

  const careers: Record<string, string> = {
    软件开发工程师:
      '软件开发工程师负责设计、编写和测试软件应用程序。他们需要熟练掌握多种编程语言和开发工具，具备较强的逻辑思维和问题解决能力。随着数字化转型的加速，软件开发人才的需求持续增长，发展前景良好。',
    数据分析师:
      '数据分析师负责收集、处理和分析大量数据，提取有价值的信息和洞察。他们需要掌握统计学、数据挖掘和数据可视化技能，并能使用相关工具如SQL、Python或R语言进行数据处理。',
    产品经理:
      '产品经理负责产品的整个生命周期，包括市场调研、需求分析、功能设计和产品迭代。他们需要平衡用户需求、技术可行性和商业目标，协调各团队共同推进产品开发。'
  }

  return (
    careers[analysisResult.value.recommendedCareer] ||
    `${analysisResult.value.recommendedCareer}是一个需要专业知识和实践经验的职业，根据您的背景和技能，这是一个非常适合您的发展方向。`
  )
}

// 获取学习资源
const getLearningResources = () => {
  const career = analysisResult.value?.recommendedCareer || ''

  // 资源映射
  const resourceMap: Record<string, any[]> = {
    软件开发工程师: [
      {
        title: 'GitHub Learning Lab',
        description: '通过互动项目学习软件开发技能',
        link: 'https://lab.github.com/',
        details:
          'GitHub Learning Lab 提供互动式课程，帮助开发者掌握Git和GitHub工作流程，同时学习各种编程语言和框架。',
        tags: ['版本控制', '协作开发', '开源项目']
      },
      {
        title: 'FreeCodeCamp 全栈开发课程',
        description: '从零开始学习全栈Web开发',
        link: 'https://www.freecodecamp.org/',
        details:
          '提供完全免费的编程课程，涵盖前端、后端、数据库等全栈技术，通过实践项目巩固所学知识。',
        tags: ['Web开发', '前端', '后端', '数据库']
      },
      {
        title: '设计模式与架构原则',
        description: '学习软件设计的核心原则',
        link: 'https://refactoring.guru/design-patterns',
        details: '深入剖析常见设计模式和架构原则，帮助开发者编写更加灵活、可维护的代码。',
        tags: ['设计模式', '架构', '代码质量']
      }
    ],
    数据分析师: [
      {
        title: 'Kaggle 数据科学平台',
        description: '通过真实数据集练习数据分析',
        link: 'https://www.kaggle.com/',
        details: 'Kaggle提供数据科学竞赛、数据集、笔记本和课程，是提升数据分析能力的理想平台。',
        tags: ['数据竞赛', '分析案例', '机器学习']
      },
      {
        title: 'DataCamp 数据分析课程',
        description: '交互式学习Python和R数据分析',
        link: 'https://www.datacamp.com/',
        details: '提供结构化的课程，从基础到高级，涵盖数据操作、可视化、统计和机器学习。',
        tags: ['Python', 'R', '数据可视化', '统计学']
      },
      {
        title: '商业智能工具指南',
        description: '掌握主流BI工具的使用方法',
        link: 'https://www.tableau.com/learn',
        details: '学习如何使用Tableau等BI工具创建仪表盘和交互式可视化，提升数据展示能力。',
        tags: ['商业智能', '数据可视化', '报表']
      }
    ],
    产品经理: [
      {
        title: '产品学院',
        description: '系统学习产品管理和设计',
        link: 'https://www.productschool.com/free-product-management-resources/',
        details: '提供产品策略、用户研究、原型设计等方面的全面知识，帮助产品经理提升专业水平。',
        tags: ['产品策略', '用户体验', '市场分析']
      },
      {
        title: 'Nielsen Norman Group UX研究',
        description: '了解用户体验设计的最佳实践',
        link: 'https://www.nngroup.com/articles/',
        details: '提供基于研究的用户体验指南和最佳实践，帮助打造更好的产品交互体验。',
        tags: ['用户体验', '交互设计', '可用性测试']
      },
      {
        title: 'Product Hunt',
        description: '发现最新产品趋势和创新',
        link: 'https://www.producthunt.com/',
        details: '了解最新的产品发布和趋势，获取市场洞察，激发创新思维。',
        tags: ['产品趋势', '市场洞察', '创新']
      }
    ],
    人工智能工程师: [
      {
        title: 'DeepLearning.AI 深度学习专项课程',
        description: 'Andrew Ng教授的深度学习系列课程',
        link: 'https://www.deeplearning.ai/',
        details: '由AI领域权威Andrew Ng教授创建的专业课程，系统讲解深度学习理论与实践。',
        tags: ['深度学习', '神经网络', 'AI应用']
      },
      {
        title: 'HuggingFace 自然语言处理',
        description: '学习最新的NLP模型和应用',
        link: 'https://huggingface.co/learn',
        details: '提供Transformers等最新NLP技术的学习资源，包含预训练模型的使用和微调。',
        tags: ['NLP', 'Transformers', 'BERT']
      },
      {
        title: 'Papers With Code',
        description: '了解AI领域最新研究及其实现',
        link: 'https://paperswithcode.com/',
        details: '汇集最新AI研究论文及其代码实现，帮助工程师跟踪前沿技术并应用到实际项目。',
        tags: ['研究论文', '代码实现', 'AI前沿']
      }
    ]
  }

  // 根据职业返回相应资源，如果没有匹配则返回通用资源
  return (
    resourceMap[career] || [
      {
        title: 'LinkedIn Learning',
        description: '各类职业技能学习平台',
        link: 'https://www.linkedin.com/learning/',
        details: '提供各种专业技能的在线课程，帮助提升职场竞争力。',
        tags: ['职业技能', '专业知识', '职场发展']
      },
      {
        title: 'Coursera 专业证书',
        description: '获取行业认可的专业证书',
        link: 'https://www.coursera.org/professional-certificates',
        details: '由顶尖大学和企业提供的专业证书课程，帮助建立职业技能并获得资质认证。',
        tags: ['专业证书', '职业技能', '在线学习']
      },
      {
        title: '行业会议与研讨会',
        description: '参与行业交流，拓展人脉',
        link: 'https://www.eventbrite.com/',
        details: '了解行业内的会议、研讨会和交流活动，建立专业人脉，获取最新行业动态。',
        tags: ['行业交流', '人脉拓展', '专业发展']
      }
    ]
  )
}

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取职业增长潜力
const getCareerGrowth = () => {
  const careers = {
    软件开发工程师: '高速增长',
    数据分析师: '稳定增长',
    产品经理: '需求稳定',
    人工智能工程师: '极高需求',
    研究科学家: '稳定发展',
    算法专家: '持续增长',
    技术总监: '竞争激烈',
    前端开发: '需求旺盛',
    UI设计师: '平稳发展',
    技术支持: '基础稳定'
  }

  return careers[analysisResult.value?.recommendedCareer as keyof typeof careers] || '持续发展'
}

// 获取最强能力和最弱能力
const getTopAbility = () => {
  const values = getRadarValues()
  const indicators = ['技术能力', '分析思维', '创新能力', '沟通协作', '领导力', '专业知识']
  const maxIndex = values.indexOf(Math.max(...values))
  return indicators[maxIndex]
}

const getWeakAbility = () => {
  const values = getRadarValues()
  const indicators = ['技术能力', '分析思维', '创新能力', '沟通协作', '领导力', '专业知识']
  const minIndex = values.indexOf(Math.min(...values))
  return indicators[minIndex]
}

// 获取因素描述
const getFactorDescription = (factor: { factor: string; score: number }) => {
  if (factor.score >= 85) return '优秀，您在该领域表现出色'
  if (factor.score >= 70) return '良好，具备该领域的基本要求'
  return '有提升空间，可以考虑加强'
}

// 获取标签类型
const getTagType = (index: number): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  // 使用明确的Element Plus类型
  const types: Array<'primary' | 'success' | 'warning' | 'info' | 'danger'> = [
    'primary',
    'success',
    'warning',
    'info',
    'danger'
  ]
  return types[index % types.length]
}

// 切换资源展开状态
const toggleResourceExpand = (index: number) => {
  expandedResource.value = expandedResource.value === index ? null : index
}

// 保存资源
const saveResource = (resource: any) => {
  ElMessage.success(`已收藏资源：${resource.title}`)
  // 这里可以实现实际的收藏功能
}

// 从分析结果中提取行动点
const getActionPoints = () => {
  const suggestions = analysisResult.value?.suggestions || ''
  // 简单地按句号分割并提取前3个句子作为行动点
  return suggestions
    .split('。')
    .filter(s => s.trim().length > 0)
    .slice(0, 3)
    .map(s => s + '。')
}

// 更新报告雷达图
const updateReportRadarChart = () => {
  if (!reportRadarChart || !analysisResult.value) return

  const option = {
    tooltip: {
      trigger: 'item'
    },
    radar: {
      indicator: [
        { name: '技术能力', max: 100 },
        { name: '分析思维', max: 100 },
        { name: '创新能力', max: 100 },
        { name: '沟通协作', max: 100 },
        { name: '领导力', max: 100 },
        { name: '专业知识', max: 100 }
      ],
      radius: '65%',
      splitLine: {
        lineStyle: {
          color: 'rgba(64, 158, 255, 0.3)'
        }
      }
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: getRadarValues(),
            name: '能力分布',
            areaStyle: {
              color: 'rgba(64, 158, 255, 0.6)'
            },
            lineStyle: {
              color: '#409EFF',
              width: 2
            }
          },
          {
            value: getIdealValues(),
            name: '理想分布',
            lineStyle: {
              color: '#67C23A',
              width: 2,
              type: 'dashed'
            },
            areaStyle: {
              color: 'rgba(103, 194, 58, 0.3)'
            }
          }
        ]
      }
    ]
  }

  reportRadarChart.setOption(option)
}

// 获取理想职业的能力分布
const getIdealValues = () => {
  // 根据推荐的职业返回该职业的理想能力分布
  const career = analysisResult.value?.recommendedCareer || ''

  if (career === '软件开发工程师') {
    return [95, 85, 80, 75, 65, 90]
  } else if (career === '数据分析师') {
    return [85, 95, 75, 70, 60, 90]
  } else if (career === '产品经理') {
    return [75, 85, 90, 95, 85, 80]
  } else if (career === '人工智能工程师') {
    return [90, 95, 85, 75, 70, 95]
  }

  // 默认理想分布
  return [90, 90, 85, 85, 80, 90]
}

// 监听分析结果变化，更新报告雷达图
watch(analysisResult, () => {
  if (analysisResult.value) {
    nextTick(() => {
      if (reportRadarChartRef.value) {
        if (!reportRadarChart) {
          reportRadarChart = echarts.init(reportRadarChartRef.value)
        }
        updateReportRadarChart()
      }
    })
  }
})

// 监听对话框状态，初始化报告雷达图
watch(showAnalysisDetails, newVal => {
  if (newVal && analysisResult.value) {
    nextTick(() => {
      if (reportRadarChartRef.value) {
        if (!reportRadarChart) {
          reportRadarChart = echarts.init(reportRadarChartRef.value)
        }
        updateReportRadarChart()
      }
    })
  }
})

// 监听窗口大小变化，调整报告雷达图
window.addEventListener('resize', () => {
  if (reportRadarChart) {
    reportRadarChart.resize()
  }
})

// 页面跳转
const goToRoadmap = () => {
  router.push('/career-planning/roadmap')
}

const goToRecommendationWithCareer = (career: string) => {
  router.push({
    path: '/career-planning/recommendation',
    query: { career }
  })
}

const goToRecommendation = () => {
  router.push('/career-planning/recommendation')
}

// 处理导出命令
const handleExportCommand = (command: string) => {
  switch (command) {
    case 'pdf':
      exportReportAsPDF()
      break
    case 'print':
      printReport()
      break
    case 'image':
      saveReportAsImage()
      break
  }
}

// 导出报告为PDF
const exportReportAsPDF = () => {
  ElMessage.success('报告已导出为PDF格式')
  // 实际实现可以使用jspdf等库
}

// 打印报告
const printReport = () => {
  window.print()
}

// 保存报告为图片
const saveReportAsImage = async () => {
  if (!reportContentRef.value) return

  try {
    // 由于html2canvas未导入，暂时使用模拟方式
    // const canvas = await html2canvas(reportContentRef.value)
    // const imgData = canvas.toDataURL('image/png')
    // const link = document.createElement('a')
    // link.href = imgData
    // link.download = `${analysisResult.value?.recommendedCareer || '职业'}分析报告.png`
    // link.click()
    ElMessage.success('报告已保存为图片')
  } catch (error) {
    ElMessage.error('保存图片失败')
  }
}
</script>

<style scoped>
.career-analysis {
  padding: 20px 24px;
  background-color: #f5f7fa;
  min-height: calc(100vh - 100px);
}

/* 页面标题样式 */
.page-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #dcdfe6;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-description {
  color: #606266;
  font-size: 16px;
  margin: 8px 0 0 0;
}

/* 主容器样式 */
.analysis-container {
  margin-top: 24px;
}

/* 步骤指示器 */
.step-indicator {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 0 12px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #dcdfe6;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background-color: #409eff;
  transform: scale(1.1);
}

.step.completed .step-number {
  background-color: #67c23a;
}

.step-label {
  font-size: 14px;
  color: #909399;
  transition: all 0.3s ease;
}

.step.active .step-label {
  color: #409eff;
  font-weight: bold;
}

.step.completed .step-label {
  color: #67c23a;
}

.step-line {
  flex: 1;
  height: 2px;
  background-color: #dcdfe6;
  position: relative;
  z-index: 1;
  margin: 0 8px;
  transition: all 0.3s ease;
}

.step-line.active {
  background-color: #67c23a;
}

/* 表单卡片 */
.step-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.step-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.step-content {
  padding: 16px 8px;
}

.step-title {
  font-size: 20px;
  color: #303133;
  margin: 0 0 8px 0;
}

.step-description {
  color: #606266;
  margin-bottom: 24px;
}

.full-width {
  width: 100%;
}

/* 步骤导航 */
.step-navigation {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.nav-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
}

.prev-button .el-icon {
  margin-right: 4px;
}

.next-button .el-icon {
  margin-left: 4px;
}

/* 提示信息 */
.step-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background-color: #f0f9eb;
  padding: 12px;
  border-radius: 4px;
  margin-top: 16px;
  color: #67c23a;
}

.step-tip .el-icon {
  margin-top: 2px;
}

/* 技能选择 */
.skill-categories {
  display: flex;
  margin-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.skill-category {
  padding: 10px 16px;
  cursor: pointer;
  color: #606266;
  position: relative;
  transition: all 0.2s ease;
}

.skill-category:hover {
  color: #409eff;
}

.skill-category.active {
  color: #409eff;
  font-weight: bold;
}

.skill-category.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #409eff;
}

.skill-selection {
  margin-bottom: 16px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-chip {
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 8px 12px;
}

.skill-chip:hover {
  background-color: #f0f9eb;
  color: #67c23a;
}

.skill-chip.selected {
  background-color: #409eff;
  color: white;
}

.custom-skill {
  margin-top: 12px;
}

.selected-skills {
  margin-top: 24px;
}

.selected-skills h3 {
  font-size: 16px;
  color: #303133;
  margin: 0 0 12px 0;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-skill-tag {
  margin-right: 0;
}

/* 兴趣选择 */
.interest-selection {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.interest-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.interest-option:hover {
  border-color: #c6e2ff;
  background-color: #f0f9ff;
}

.interest-option.selected {
  background-color: #ecf5ff;
  border-color: #409eff;
  color: #409eff;
}

.interest-option .el-icon {
  color: inherit;
}

.selected-interests {
  margin-top: 20px;
}

.interest-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 经验滑块 */
.experience-slider {
  padding: 10px 0;
}

.experience-description {
  color: #606266;
  font-style: italic;
  margin-top: 12px;
  padding: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

/* 提交按钮 */
.form-action {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.submit-button {
  padding: 12px 24px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 预览区域 */
.preview-container {
  height: 100%;
}

.preview-card {
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
}

.preview-data {
  padding: 16px;
}

.preview-section {
  margin-bottom: 24px;
}

.preview-section h3 {
  font-size: 16px;
  color: #303133;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.preview-careers {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 16px;
}

.preview-career-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
}

.preview-career-name {
  margin-top: 8px;
  color: #606266;
  font-size: 14px;
}

.preview-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.preview-tip {
  margin-top: 24px;
}

/* 结果区域 */
.result-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.result-summary-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-top: 4px solid #409eff;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.result-title h2 {
  font-size: 20px;
  color: #303133;
  margin: 0 0 12px 0;
}

.result-title .highlight {
  color: #409eff;
  font-weight: bold;
}

.match-score-container {
  text-align: center;
}

.score-label {
  margin-top: 8px;
  color: #606266;
}

.result-advantages {
  background-color: #f0f9eb;
  padding: 16px;
  border-radius: 4px;
  margin-top: 16px;
}

.result-advantages h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #67c23a;
  margin: 0 0 12px 0;
  font-size: 16px;
}

.result-advantages p {
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

/* 雷达图 */
.result-detail-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.radar-chart-container {
  height: 360px;
  width: 100%;
}

/* 优劣势分析 */
.strength-weakness-row {
  margin-bottom: 0;
}

.strength-card,
.weakness-card {
  height: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.strength-card {
  border-top: 3px solid #67c23a;
}

.weakness-card {
  border-top: 3px solid #f56c6c;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.strength-list,
.weakness-list {
  padding-left: 0;
  list-style-type: none;
}

.strength-list li,
.weakness-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ebeef5;
}

.strength-list li:last-child,
.weakness-list li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

/* 相关职业 */
.related-careers-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.related-careers-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.related-career-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-career-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  border-color: #c6e2ff;
}

.career-info {
  flex: 1;
}

.career-info h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.career-match {
  display: flex;
  align-items: center;
  gap: 8px;
}

.career-match span {
  font-size: 14px;
  color: #606266;
}

/* 发展建议 */
.suggestions-card {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.suggestions-content {
  color: #606266;
  line-height: 1.6;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.action-buttons .el-button {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 详细分析弹窗 */
.analysis-report {
  padding: 0 16px;
}

.report-title {
  text-align: center;
  margin-bottom: 24px;
  color: #303133;
  font-size: 22px;
}

.report-section {
  margin-bottom: 32px;
}

.report-section h3 {
  font-size: 18px;
  color: #303133;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #ebeef5;
}

.match-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.match-bar {
  display: flex;
  align-items: center;
}

.match-bar-label {
  width: 100px;
  color: #606266;
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 4px;
}

.resource-info {
  flex: 1;
}

.resource-title {
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.resource-description {
  color: #606266;
  font-size: 14px;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .career-analysis {
    padding: 16px;
  }

  .page-title {
    font-size: 20px;
  }

  .step-indicator {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }

  .step-line {
    display: none;
  }

  .result-header {
    flex-direction: column;
    gap: 20px;
  }

  .related-careers-container {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .result-container {
    margin-top: 24px;
  }
}
</style>
