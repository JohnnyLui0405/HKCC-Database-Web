<template>
    <!-- <n-form
      ref="formRef"
      :label-width="80"
      :model="formValue"
      :rules="rules"
      :size="size"
    >
      <n-form-item label="AccessCode" path="user.name">
        <n-input v-model:value="formValue.user.name" placeholder="Enter your Access Code" />
      </n-form-item>
      <n-form-item label="TEST" path="user.password">
        <n-input v-model:value="formValue.user.age" placeholder="输入年龄" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="handleValidateClick">
          Login
        </n-button>
      </n-form-item>
    </n-form> -->
    <n-p>Login Success</n-p>
    <!-- <pre>{{ JSON.stringify(formValue, null, 2) }}
  </pre> -->
  </template>
  
  <script setup>
  import { defineComponent, ref } from "vue";
  import { useMessage } from "naive-ui";
  const formRef = ref(null);
  const message = useMessage();
  const size = ref("medium");
  const formValue = ref({
          user: {
            name: "",
            password: ""
          }
        })
  const rules = ref({
          user: {
            name: {
              required: true,
              message: "Please input your access code",
              trigger: "blur"
            },
            password: {
              required: true,
              message: "Please enter you password",
              trigger: ["input", "blur"]
            }
          },
        })
  
  const phone = ref("");
  
  const handleValidateClick = (e) => {
    e.preventDefault();
    formRef.value?.validate((errors) => {
      if (!errors) {
        message.success("Valid");
      } else {
        console.log(errors);
        message.error("Invalid");
      }
    });
  }
  </script>