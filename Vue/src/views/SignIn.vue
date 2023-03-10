<template>
  <div class="container">
    <n-card id="loginCard">
    <n-tabs
      class="card-tabs"
      default-value="signin"
      size="large"
      animated
      style="margin: 0 -4px"
      pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
    >
      <n-tab-pane name="signin" tab="Login">
        <n-form ref="formRef" :model="formValue" :rules="rules">
          <n-form-item-row path="user.accessCode" label="Access Code">
            <n-input v-model:value="formValue.user.accessCode" placeholder="Your Access Code Here"/>
          </n-form-item-row>
        </n-form>
        <n-button @click=handleValidateClick type="primary" block secondary strong>
          Login
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="Register">
        <n-form>
          <n-form-item-row label="User Name">
            <n-input />
          </n-form-item-row>
          <n-form-item-row label="Password">
            <n-input />
          </n-form-item-row>
          <n-form-item-row label="Re-Password">
            <n-input />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong>
          Register
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
  </div>
  <pre>{{ JSON.stringify(formValue, null, 2) }}
</pre>
</template>

<script setup>
import { defineComponent, ref } from "vue";
import { useMessage, useLoadingBar } from "naive-ui";
import { useRouter } from "vue-router";
import axios from "axios";
const router = useRouter();
const formRef = ref(null);
const message = useMessage();
const size = ref("medium");
const formValue = ref({
        user: {
          accessCode: "",
          password: ""
        }
      })
const rules = ref({
        user: {
          accessCode: {
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


      
const loadingBar = useLoadingBar();
const handleValidateClick = (e) => {
  e.preventDefault();
  formRef.value?.validate(async(errors) => {
    if (!errors) {
      loadingBar.start();
      const res = await axios({
        method: "post",
        url: "http://localhost:3310/api/user/login",
        data: {
          accessCode: formValue.value.user.accessCode
        }
      })
      if (res.data.success) {
        message.success("Login Success");
        localStorage.setItem("token", res.data.token);
        router.push('/profile')
        loadingBar.finish();
      } else {
        message.error("Login Failed");
        loadingBar.error();
      }
    } else {
      console.log(errors);
      message.error("Invalid");
    }
  });
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

#loginCard {
  max-width: 500px;
  min-width: 100px;
}
</style>