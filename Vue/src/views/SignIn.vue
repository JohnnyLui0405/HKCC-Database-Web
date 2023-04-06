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
            <n-input :disabled="!formValue.user.userName == '' || !formValue.user.password == ''" v-model:value="formValue.user.accessCode" placeholder="Please Input"/>
          </n-form-item-row>
          <!-- create a horizontal line with OR in middle -->
          <n-form-item-row path="user.userName" label="User Name">
            <n-input :disabled="!formValue.user.accessCode == ''" v-model:value="formValue.user.userName" placeholder="Please Input"/>
          </n-form-item-row>
          <n-form-item-row path="user.password" label="Password">
            <n-input type="password" :disabled="!formValue.user.accessCode  == ''" v-model:value="formValue.user.password" placeholder="Please Input"/>
          </n-form-item-row>
        </n-form>
        <n-button @click=handleValidateClick type="primary" block secondary strong>
          Login
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="Register">
        <n-form ref="registerRef" :model="registerValue" :rules="registerRules">
          <n-form-item-row path="user.userName" label="User Name">
            <n-input v-model:value="registerValue.user.userName" placeholder="Enter your user name"/>
          </n-form-item-row>
          <n-form-item-row path="user.password" label="Password">
            <n-input type="password" v-model:value="registerValue.user.password" placeholder="Enter your password"/>
          </n-form-item-row>
          <n-form-item-row first ref="rPasswordFormItemRef" path="user.rePassword" label="Re-Password">
            <n-input type="password" :disabled="!registerValue.user.password" v-model:value="registerValue.user.rePassword" placeholder="Enter your password again"/>
          </n-form-item-row>
        </n-form>
        <n-button @click=handleRegisterClick type="primary" block secondary strong>
          Register
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
  </div>
  <!-- <pre>{{ JSON.stringify(registerValue, null, 2) }}
</pre> -->
</template>

<script setup>
import { defineComponent, ref } from "vue";
import { useMessage, useLoadingBar, NTabs, NCard, NTabPane, NButton, NForm, NFormItemRow, NInput } from "naive-ui";
import { useRouter } from "vue-router";
import axios from "axios";
// axios.defaults.baseURL = 'https://dbprojectapi.courtcloud.me';
axios.defaults.baseURL = 'http://localhost:3310';
const router = useRouter();
const formRef = ref(null);
const registerRef = ref(null);
const rPasswordFormItemRef = ref(null);
const message = useMessage();
const size = ref("medium");

function validatePasswordStartWith(rule, value) {
      return !!registerValue.value.user.password && registerValue.value.user.password.startsWith(value) && registerValue.value.user.password.length >= value.length;
    }
function validatePasswordSame(rule, value) {
  console.log(registerValue.value.user.password)
  return value === registerValue.value.user.password;
}
function validateAccessCodeLogin(rule, value) {
  if (formValue.value.user.userName == '' && formValue.value.user.password == '') {
    if (!value) {
    return new Error("Either Access Code or User Name and Password is required");
    }
  }
}
function validateUserPasswordLogin(rule, value) {
  if (formValue.value.user.accessCode == '') {
    if (!value) {
    return new Error("Either Access Code or User Name and Password is required");
    }
  }
}


const formValue = ref({
        user: {
          accessCode: "",
          userName: "",
          password: ""
        }
      })
const registerValue = ref({
        user: {
          userName: "",
          password: "",
          rePassword: ""
        }
      })
const rules = ref({
        user: {
          accessCode: {
            required: false,
            validator: validateAccessCodeLogin,
            trigger: "blur"
          },
          userName: {
            required: false,
            validator: validateUserPasswordLogin,
            trigger: "blur"
          },
          password: {
            required: false,
            validator: validateUserPasswordLogin,
            trigger: "blur"
          }
        },
        
      })
const registerRules = ref({
        user: {
          userName: {
            required: true,
            message: "Password is required",
            trigger: "blur"
          },
          password: {
            required: true,
            message: "Please enter you password",
            trigger: ["input", "blur"]
          },
          rePassword: [
            {
            required: true,
            message: "Re-entered password is required",
            trigger: ["input", "blur"]
            },
            {
              validator: validatePasswordSame,
              message: "Password is not same as re-entered password!",
              trigger: ["blur","input"]
            },
            {
            validator: validatePasswordStartWith,
            message: "Password is not same as re-entered password!",
            trigger: "input"
            }
        ]
          
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
        url: "/api/user/login",
        data: {
          accessCode: formValue.value.user.accessCode,
          userName: formValue.value.user.userName,
          password: formValue.value.user.password
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
const handleRegisterClick = (e) => {
  e.preventDefault();
  registerRef.value?.validate(async(errors) => {
    if (!errors) {
      loadingBar.start();
      const res = await axios({
        method: "post",
        url: "/api/user/register",
        data: {
          userName: registerValue.value.user.userName,
          password: registerValue.value.user.password
        }
      })
      if (res.data.success) {
        message.success("Register Success");
        loadingBar.finish();
      } else {
        message.error("Register Failed");
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