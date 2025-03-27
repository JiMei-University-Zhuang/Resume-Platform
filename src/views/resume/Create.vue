<template>
    <div class="resume-create">
        <el-row :gutter="20">
            <el-col :span="11">
                <el-card class="edit-area">
                    <template #header>
                        <div class="card-header">
                            <span>简历信息</span>
                            <el-button type="primary" @click="analyzeResume"
                                >AI 分析优化</el-button
                            >
                            <el-button
                                type="danger"
                                @click="confirmClearResumeForm"
                                >清空简历</el-button
                            >
                        </div>
                    </template>

                    <el-form :model="resumeForm" label-width="100px">
                        <el-divider>个人信息</el-divider>
                        <el-form-item label="姓名">
                            <el-input
                                v-model="resumeForm.name"
                                placeholder="请输入姓名"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-radio-group v-model="resumeForm.gender">
                                <el-radio label="男">男</el-radio>
                                <el-radio label="女">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="求职意向">
                            <el-input
                                v-model="resumeForm.jobTitle"
                                placeholder="请输入求职意向"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="生日">
                            <el-date-picker
                                v-model="resumeForm.birthday"
                                type="date"
                                placeholder="请选择生日"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="籍贯">
                            <el-input
                                v-model="resumeForm.origin"
                                placeholder="请输入籍贯"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="现居">
                            <el-input
                                v-model="resumeForm.currentResidence"
                                placeholder="请输入现居地"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="政治面貌">
                            <el-select
                                v-model="resumeForm.politicalStatus"
                                placeholder="请选择政治面貌"
                            >
                                <el-option
                                    label="群众"
                                    value="群众"
                                ></el-option>
                                <el-option
                                    label="团员"
                                    value="团员"
                                ></el-option>
                                <el-option
                                    label="党员"
                                    value="党员"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="电话">
                            <el-input
                                v-model="resumeForm.contact"
                                placeholder="请输入手机号"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <el-input
                                v-model="resumeForm.email"
                                placeholder="请输入邮箱"
                            ></el-input>
                        </el-form-item>

                        <el-divider>荣誉奖励</el-divider>
                        <el-form-item label="荣誉奖励">
                            <el-input
                                type="textarea"
                                v-model="resumeForm.honors"
                                rows="4"
                                placeholder="请输入荣誉奖励信息"
                            ></el-input>
                        </el-form-item>

                        <el-divider>技能证书</el-divider>
                        <el-form-item label="技能证书">
                            <el-input
                                type="textarea"
                                v-model="resumeForm.certifications"
                                rows="4"
                                placeholder="请输入技能证书信息"
                            ></el-input>
                        </el-form-item>

                        <el-divider>教育背景</el-divider>
                        <div
                            v-for="(edu, index) in resumeForm.education"
                            :key="index"
                            class="education-item"
                        >
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <el-form-item :label="'学校名称'">
                                        <el-input
                                            v-model="edu.school"
                                            placeholder="请输入学校名称"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="'专业'">
                                        <el-input
                                            v-model="edu.major"
                                            placeholder="请输入专业"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <el-form-item :label="'学历'">
                                        <el-select
                                            v-model="edu.degree"
                                            placeholder="请选择学历"
                                        >
                                            <el-option
                                                label="专科"
                                                value="专科"
                                            ></el-option>
                                            <el-option
                                                label="本科"
                                                value="本科"
                                            ></el-option>
                                            <el-option
                                                label="硕士"
                                                value="硕士"
                                            ></el-option>
                                            <el-option
                                                label="博士"
                                                value="博士"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="'时间段'">
                                        <el-date-picker
                                            v-model="edu.time"
                                            type="daterange"
                                            range-separator="至"
                                            start-placeholder="开始时间"
                                            end-placeholder="结束时间"
                                        >
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-button
                                type="danger"
                                @click="removeEducation(index)"
                                v-if="index > 0"
                                >删除</el-button
                            >
                        </div>
                        <el-button type="primary" @click="addEducation"
                            >添加教育经历</el-button
                        >

                        <el-divider>工作经验</el-divider>
                        <div
                            v-for="(exp, index) in resumeForm.experience"
                            :key="index"
                            class="experience-item"
                        >
                            <el-row :gutter="10">
                                <el-col :span="12">
                                    <el-form-item :label="'公司名称'">
                                        <el-input
                                            v-model="exp.company"
                                            placeholder="请输入公司名称"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item :label="'职位'">
                                        <el-input
                                            v-model="exp.position"
                                            placeholder="请输入职位"
                                        ></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-form-item label="时间段">
                                <el-date-picker
                                    v-model="exp.time"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                >
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="工作描述">
                                <el-input
                                    type="textarea"
                                    v-model="exp.description"
                                    rows="4"
                                    placeholder="请输入工作内容"
                                ></el-input>
                            </el-form-item>
                            <el-button
                                type="danger"
                                @click="removeExperience(index)"
                                v-if="index > 0"
                                >删除</el-button
                            >
                        </div>
                        <el-button type="primary" @click="addExperience"
                            >添加工作经验</el-button
                        >

                        <el-divider>在校经历</el-divider>
                        <el-form-item label="在校经历">
                            <el-input
                                type="textarea"
                                v-model="resumeForm.campusExperience"
                                rows="4"
                                placeholder="请输入在校经历"
                            ></el-input>
                        </el-form-item>

                        <el-divider>专业技能</el-divider>
                        <el-form-item label="技能标签">
                            <el-tag
                                v-for="tag in resumeForm.skills"
                                :key="tag"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag)"
                                class="skill-tag"
                            >
                                {{ tag }}
                            </el-tag>
                            <el-input
                                v-if="inputVisible"
                                ref="InputRef"
                                v-model="inputValue"
                                class="input-new-tag"
                                @keyup.enter="handleInputConfirm"
                                @blur="handleInputConfirm"
                            />
                            <el-button
                                v-else
                                class="button-new-tag"
                                @click="showInput"
                                >+ 添加技能</el-button
                            >
                        </el-form-item>

                        <el-divider>自我评价</el-divider>
                        <el-form-item label="自我评价">
                            <el-input
                                type="textarea"
                                v-model="resumeForm.selfAssessment"
                                rows="4"
                                placeholder="请输入自我评价"
                            ></el-input>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>

            <el-col :span="13">
                <el-card class="preview-area">
                    <template #header>
                        <div class="card-header">
                            <span>预览</span>
                            <div>
                                <el-button type="success" @click="exportPDF"
                                    >导出 PDF</el-button
                                >
                                <el-button @click="changeTemplate"
                                    >切换模板</el-button
                                >

                                <el-dialog
                                    v-model="templateDialogVisible"
                                    title="选择简历模板"
                                    width="70%"
                                >
                                    <el-row :gutter="20">
                                        <el-col
                                            :span="6"
                                            v-for="template in Object.keys(
                                                templateComponents
                                            )"
                                            :key="template"
                                        >
                                            <el-card
                                                :body-style="{ padding: '0px' }"
                                                class="template-card"
                                            >
                                                <div class="template-info">
                                                    <h3>{{ template }}</h3>
                                                    <div
                                                        class="template-actions"
                                                    >
                                                        <el-button
                                                            type="primary"
                                                            @click="
                                                                selectTemplate(
                                                                    template
                                                                )
                                                            "
                                                            >选择模板</el-button
                                                        >
                                                    </div>
                                                </div>
                                            </el-card>
                                        </el-col>
                                    </el-row>
                                </el-dialog>
                            </div>
                        </div>
                    </template>
                    <div class="resume-preview" ref="resumePreview">
                        <component
                            :is="currentTemplate"
                            :resumeForm="resumeForm"
                        />
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-dialog
            v-model="analysisDialogVisible"
            title="AI 简历分析"
            width="50%"
        >
            <div v-loading="analyzing">
                <div v-if="!analyzing && aiSuggestions">
                    <el-alert
                        :title="aiSuggestions.summary"
                        type="success"
                        :closable="false"
                        class="mb-20"
                    ></el-alert>

                    <el-collapse v-model="activeCollapse">
                        <el-collapse-item title="整体评分" name="1">
                            <el-rate
                                v-model="aiSuggestions.score"
                                disabled
                                show-score
                                text-color="#ff9900"
                            ></el-rate>
                        </el-collapse-item>

                        <el-collapse-item title="优化建议" name="2">
                            <ul>
                                <li
                                    v-for="(
                                        suggestion, index
                                    ) in aiSuggestions.suggestions"
                                    :key="index"
                                >
                                    {{ suggestion }}
                                </li>
                            </ul>
                        </el-collapse-item>
                        <el-collapse-item title="修改建议" name="3">
                            <ul>
                                <li
                                    v-for="(
                                        revisions, index
                                    ) in aiSuggestions.revisions"
                                    :key="index"
                                >
                                    {{ revisions.section }}:
                                    {{ revisions.suggestion }}
                                </li>
                            </ul>
                        </el-collapse-item>

                        <el-collapse-item title="行业匹配度" name="4">
                            <el-progress
                                v-for="(
                                    match, index
                                ) in aiSuggestions.industryMatch"
                                :key="index"
                                :percentage="match.score"
                                :text="match.industry"
                                :color="
                                    match.score > 80
                                        ? '#67C23A'
                                        : match.score > 60
                                          ? '#E6A23C'
                                          : '#F56C6C'
                                "
                            ></el-progress>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="analysisDialogVisible = false"
                        >关闭</el-button
                    >
                    <el-button type="primary" @click="applyAISuggestions">
                        应用 AI 建议
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { templateConfig } from '@/components/Template/templateConfig'

import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRoute } from 'vue-router'
import { watch } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import dayjs from 'dayjs'

const templateComponents = templateConfig

interface ResumeForm {
    name: string
    gender: string
    jobTitle: string
    birthday: Date | null
    origin: string
    currentResidence: string
    politicalStatus: string
    contact: string
    email: string
    honors: string
    certifications: string
    education: {
        school: string
        major: string
        degree: string
        time: [Date, Date]
    }[]
    experience: {
        company: string
        position: string
        description: string
        time: [Date, Date]
    }[]
    campusExperience: string
    skills: string[]
    selfAssessment: string
}

interface AISuggestions {
    summary: string
    score: number
    suggestions: string[]
    industryMatch: {
        industry: string
        score: number
    }[]
}

const route = useRoute()
const currentTemplate = ref(templateComponents.Muban1)
const inputVisible = ref(false)
const inputValue = ref('')
const resumeForm = ref<ResumeForm>({
    name: '张三',
    gender: '男',
    jobTitle: '前端开发工程师',
    birthday: new Date('1995-05-15'),
    origin: '北京',
    currentResidence: '上海',
    politicalStatus: '团员',
    contact: '13800138000',
    email: 'zhangsan@example.com',
    honors: '2022年获得公司优秀员工奖',
    certifications: 'PMP认证，前端开发高级工程师',
    education: [
        {
            school: '北京大学',
            major: '计算机科学与技术',
            degree: '本科',
            time: [new Date('2013-09-01'), new Date('2017-06-30')]
        }
    ],
    experience: [
        {
            company: '腾讯科技',
            position: '前端开发工程师',
            description: '负责公司核心产品的前端开发工作，使用Vue.js框架',
            time: [new Date('2018-07-01'), new Date('2021-12-31')]
        },
        {
            company: '阿里巴巴',
            position: '高级前端开发工程师',
            description: '负责电商平台的前端架构设计和开发',
            time: [new Date('2022-01-01'), new Date()]
        }
    ],
    campusExperience: '在校期间担任学生会技术部部长，组织多次技术分享会',
    skills: ['Vue.js', 'React', 'TypeScript', 'Node.js'],
    selfAssessment:
        '5年前端开发经验，熟练掌握主流前端技术栈，具有良好的团队协作能力和沟通能力'
})

const analyzing = ref(false)
const analysisDialogVisible = ref(false)
const activeCollapse = ref(['1', '2', '3'])
const aiSuggestions = ref<AISuggestions | null>(null)
const resumePreview = ref(null)

// 根据路由参数加载对应的模板
const selectTemplate = async (template: string) => {
    await loadTemplate(template)
    templateDialogVisible.value = false
}

const loadTemplate = async (templateName?: string) => {
    const template = (templateName || 'Muban1').toLowerCase() // 确保模板名称小写
    try {
        const component = await templateConfig[template]()
        currentTemplate.value = component.default
    } catch (error) {
        console.error('加载模板失败:', error)
        currentTemplate.value = (await templateConfig['muban1']()).default
    }
}

// 修改watch监听
watch(
    () => route.params.template || 'Muban1',
    async (newTemplate: string) => {
        await loadTemplate(newTemplate)
    },
    { immediate: true }
)

const handleClose = (tag: string) => {
    resumeForm.value.skills = resumeForm.value.skills.filter((t) => t !== tag)
}

const showInput = () => {
    inputVisible.value = true
}

const handleInputConfirm = () => {
    if (inputValue.value) {
        resumeForm.value.skills.push(inputValue.value)
    }
    inputVisible.value = false
    inputValue.value = ''
}

const addEducation = () => {
    resumeForm.value.education.push({
        school: '',
        major: '',
        degree: '',
        time: [new Date(), new Date()]
    })
}

const removeEducation = (index: number) => {
    resumeForm.value.education.splice(index, 1)
}

const addExperience = () => {
    resumeForm.value.experience.push({
        company: '',
        position: '',
        description: ''
    })
}

const removeExperience = (index: number) => {
    resumeForm.value.experience.splice(index, 1)
}

const formatDate = (date: Date) => {
    return dayjs(date).format('YYYY.MM')
}

const exportPDF = async () => {
    if (!resumePreview.value) return

    try {
        const scale = window.devicePixelRatio || 1
        const canvas = await html2canvas(resumePreview.value, {
            scale: scale, // 使用设备像素比来提高分辨率
            useCORS: true // 允许跨域资源
        })
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const imgHeight = (canvas.height * pdfWidth) / canvas.width

        let position = 0

        while (position < imgHeight) {
            pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, imgHeight)
            position += pageHeight
            if (position < imgHeight) {
                pdf.addPage()
            }
        }

        pdf.save('我的简历.pdf')

        ElMessage.success('PDF导出成功！')
    } catch (error) {
        ElMessage.error('PDF导出失败，请重试')
    }
}

const analyzeResume = async () => {
    analysisDialogVisible.value = true
    analyzing.value = true

    try {
        await new Promise((resolve) => setTimeout(resolve, 2000))

        aiSuggestions.value = {
            summary: '您的简历整体结构清晰，但在某些方面还可以进一步优化。', //AI对简历的总体评价
            score: 85, //AI对简历的评分
            suggestions: [
                //AI对简历的优化建议
                '建议在工作经验部分添加更多具体的数据和成果',
                '可以突出展示您的核心技能和专业认证',
                '教育背景部分可以补充相关的课程和学术成果'
            ],
            revisions: [
                //AI对简历的修改建议
                {
                    section: '工作描述', //建议修改的部分
                    suggestion:
                        '在腾讯科技担任前端开发工程师期间，我主导负责公司核心产品的前端开发工作，深度运用 Vue.js 框架构建高性能、高可用性的用户界面。与产品、设计、后端团队紧密合作，确保产品的功能实现和用户体验达到最佳状态。同时，我持续关注前端技术的发展趋势，不断优化和改进现有技术方案，提升产品的性能和稳定性。'
                }, //修改的内容
                {
                    section: '在校经历',
                    suggestion:
                        '在校期间担任学生会技术部部长，成功策划并组织了多场技术分享会。在此过程中，我负责了活动的整体策划，包括主题选定、嘉宾邀请以及流程设计等多个环节。同时，我还带领团队完成了活动的宣传推广以及现场执行工作，确保了每一场分享会的顺利进行，吸引了众多同学参与，有效提升了团队的影响力。'
                }
            ],
            industryMatch: [
                //AI对简历的行业匹配
                { industry: '互联网技术', score: 90 },
                { industry: '人工智能', score: 75 },
                { industry: '金融科技', score: 70 }
            ]
        }
    } catch (error) {
        ElMessage.error('分析失败，请重试')
    } finally {
        analyzing.value = false
    }
}

const applyAISuggestions = () => {
    ElMessage.success('已应用 AI 建议')

    // 查找section为'在校经历'的建议
    const campusExperienceSuggestion = aiSuggestions.value?.revisions.find(
        (rev) => rev.section === '在校经历'
    )

    // 如果找到了对应的建议，则更新resumeForm中的campusExperience
    if (campusExperienceSuggestion) {
        resumeForm.value.campusExperience =
            campusExperienceSuggestion.suggestion
    } else {
        ElMessage.warning('未找到在校经历的修改建议')
    }

    analysisDialogVisible.value = false
}

const templateDialogVisible = ref(false)

const changeTemplate = () => {
    templateDialogVisible.value = true
}

const confirmClearResumeForm = () => {
    ElMessageBox.confirm('确定要清空简历信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(() => {
            clearResumeForm()
            ElMessage.success('简历信息已清空')
        })
        .catch(() => {
            ElMessage.info('已取消清空操作')
        })
}

const clearResumeForm = () => {
    resumeForm.value = {
        name: '',
        gender: '',
        jobTitle: '',
        birthday: null,
        origin: '',
        currentResidence: '',
        politicalStatus: '',
        contact: '',
        email: '',
        honors: '',
        certifications: '',
        education: [
            {
                school: '',
                major: '',
                degree: '',
                time: [new Date(), new Date()]
            }
        ],
        experience: [
            {
                company: '',
                position: '',
                description: '',
                time: [new Date(), new Date()]
            }
        ],
        campusExperience: '',
        skills: [],
        selfAssessment: ''
    }
}
</script>

<style scoped>
.resume-create {
    padding: 20px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.edit-area,
.preview-area {
    height: calc(100vh - 120px);
    overflow-y: auto;
}

.education-item,
.experience-item {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px solid #eee;
    border-radius: 4px;
}

.skill-tag {
    margin-right: 10px;
    margin-bottom: 10px;
}

.input-new-tag {
    width: 90px;
    margin-right: 10px;
    vertical-align: bottom;
}

.resume-preview {
    padding: 20px;
    min-height: 800px;
}

.mb-20 {
    margin-bottom: 20px;
}

.resume-preview h1 {
    font-size: 24px;
    margin-bottom: 10px;
}

.resume-preview h2 {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
}

.resume-preview h3 {
    font-size: 16px;
    margin: 20px 0 10px;
    padding-bottom: 5px;
    border-bottom: 2px solid #1849ea;
}

.resume-preview p {
    margin: 5px 0;
    line-height: 1.6;
}
.template-card {
    margin-bottom: 20px;
    transition: all 0.3s;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    overflow: hidden;
}

.template-card:hover {
    box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.1);
    transform: translateY(-3px);
}

.template-preview {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f9fa;
    border-bottom: 1px solid #e4e7ed;
}

.template-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.template-info {
    padding: 15px;
    text-align: center;
}

.template-info h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #303133;
    font-weight: 600;
}

.template-actions {
    display: flex;
    justify-content: center;
    gap: 8px;
}

/* 调整栅格间距 */
.el-row--gutter-20 {
    margin-top: 10px;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .el-col {
        margin-bottom: 15px;
    }

    .template-card {
        margin-bottom: 15px;
    }
}
</style>
