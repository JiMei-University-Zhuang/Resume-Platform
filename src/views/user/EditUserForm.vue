<template>
  <el-dialog :model-value="visible" title="编辑用户信息" @update:model-value="updateVisible">
    <template #content>
      <el-form :model="localFormData" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="localFormData.username" />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="localFormData.name" />
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="localFormData.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="localFormData.email" />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="localFormData.telephone" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="localFormData.role">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="USER" />
          </el-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateVisible(false)">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import type { IUser } from '@/types/user'; 

const props = defineProps<{
  visible: boolean;
  formData: IUser;
}>();

const emits = defineEmits(['update:visible', 'submit']);

const localFormData = ref<IUser>({ ...props.formData });

watch(
  () => props.formData,
  (newVal) => {
    localFormData.value = { ...newVal };
  },
  { deep: true }
);
const updateVisible = (value: boolean) => {
  emits('update:visible', value);
};

const submitForm = () => {
  emits('submit',  localFormData.value);
  updateVisible(false);
};
</script>