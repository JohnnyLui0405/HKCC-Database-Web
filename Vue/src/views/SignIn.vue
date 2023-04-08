<template>
  <div class="container">
    <n-card id="loginCard">
      <n-tabs class="card-tabs" default-value="logInCode" size="large" animated style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;">
        <n-tab-pane name="logInCode" tab="Login with Code">
          <n-form ref="logInCodeRef" :model="logInCodeValue" :rules="logInCodeRules">
            <n-form-item-row path="user.accessCode" label="Access Code">
              <n-input @keydown.enter.prevent="handleCodeLogin" v-model:value="logInCodeValue.user.accessCode"
                placeholder="Enter your Access Code" />
            </n-form-item-row>
          </n-form>
          <n-button @click="handleCodeLogin" type="primary" block secondary strong>
            Login
          </n-button>
        </n-tab-pane>
        <n-tab-pane name="logInpw" tab="Login with Password">
          <n-form ref="logInPWRef" :model="logInPWValue" :rules="logInPWRules">
            <n-form-item-row path="user.userName" label="User Name">
              <n-input @keydown.enter.prevent="handlePasswordLogin" v-model:value="logInPWValue.user.userName"
                placeholder="Enter your User Name" />
            </n-form-item-row>
            <n-form-item-row path="user.password" label="Password">
              <n-input @keydown.enter.prevent="handlePasswordLogin" type="password"
                v-model:value="logInPWValue.user.password" placeholder="Enter your Password" />
            </n-form-item-row>
          </n-form>
          <n-button @click="handlePasswordLogin" type="primary" block secondary strong>
            Login
          </n-button>
        </n-tab-pane>
        <n-tab-pane name="signup" tab="Register">
          <n-form ref="registerRef" :model="registerValue" :rules="registerRules">
            <n-form-item-row path="user.userName" label="User Name">
              <n-input @keydown.enter.prevent="handleRegisterClick" v-model:value="registerValue.user.userName"
                placeholder="Enter your user name" />
            </n-form-item-row>
            <n-form-item-row path="user.password" label="Password">
              <n-input @keydown.enter.prevent="handleRegisterClick" type="password"
                v-model:value="registerValue.user.password" placeholder="Enter your password" />
            </n-form-item-row>
            <n-form-item-row first ref="rPasswordFormItemRef" path="user.rePassword" label="Re-Password">
              <n-input @keydown.enter.prevent="handleRegisterClick" type="password"
                :disabled="!registerValue.user.password" v-model:value="registerValue.user.rePassword"
                placeholder="Enter your password again" />
            </n-form-item-row>
          </n-form>
          <n-button @click="handleRegisterClick" type="primary" block secondary strong>
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
import {
  useMessage,
  useLoadingBar,
  NTabs,
  NCard,
  NTabPane,
  NButton,
  NForm,
  NFormItemRow,
  NInput,
} from "naive-ui";
import { useRouter } from "vue-router";
import axios from "axios";
axios.defaults.baseURL = "https://dbprojectapi.courtcloud.me";
// axios.defaults.baseURL = 'http://localhost:3310';
const router = useRouter();
const registerRef = ref(null);
const logInCodeRef = ref(null);
const logInPWRef = ref(null);
const rPasswordFormItemRef = ref(null);
const message = useMessage();
const size = ref("medium");

function validatePasswordStartWith(rule, value) {
  return (
    !!registerValue.value.user.password &&
    registerValue.value.user.password.startsWith(value) &&
    registerValue.value.user.password.length >= value.length
  );
}
function validatePasswordSame(rule, value) {
  console.log(registerValue.value.user.password);
  return value === registerValue.value.user.password;
}

const logInCodeValue = ref({
  user: {
    accessCode: "",
  },
});
const logInPWValue = ref({
  user: {
    userName: "",
    password: "",
  },
});
const registerValue = ref({
  user: {
    userName: "",
    password: "",
    rePassword: "",
  },
});
const logInCodeRules = ref({
  user: {
    accessCode: {
      required: true,
      trigger: "blur"
    }
  }
});
const logInPWRules = ref({
  user: {
    userName: {
      required: true,
      message: "User Name is required",
      trigger: "blur",
    },
    password: {
      required: true,
      message: "Password is required",
      trigger: ["input", "blur"],
    },
  }
});
const registerRules = ref({
  user: {
    userName: {
      required: true,
      message: "Password is required",
      trigger: "blur",
    },
    password: {
      required: true,
      message: "Please enter you password include at least 8 characters",
      trigger: ["input", "blur"],
      min: 8,
    },
    rePassword: [
      {
        required: true,
        message: "Re-entered password is required",
        trigger: ["input", "blur"],
      },
      {
        validator: validatePasswordSame,
        message: "Password is not same as re-entered password!",
        trigger: "blur",
      },
      {
        validator: validatePasswordStartWith,
        message: "Password is not same as re-entered password!",
        trigger: "input",
      },
    ],
  },
});

const loadingBar = useLoadingBar();
const handleCodeLogin = (e) => {
  e.preventDefault();
  logInCodeRef.value?.validate(async (errors) => {
    if (!errors) {
      loadingBar.start();
      const res = await axios({
        method: "post",
        url: "/api/user/login",
        data: {
          accessCode: logInCodeValue.value.user.accessCode
        },
      });
      if (res.data.success) {
        message.success("Login Success");
        localStorage.setItem("token", res.data.token);
        router.push("/profile/home");
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
};
const handlePasswordLogin = (e) => {
  e.preventDefault();
  logInPWRef.value?.validate(async (errors) => {
    if (!errors) {
      loadingBar.start();
      const res = await axios({
        method: "post",
        url: "/api/user/login",
        data: {
          userName: logInPWValue.value.user.userName,
          password: logInPWValue.value.user.password,
        },
      });
      if (res.data.success) {
        message.success("Login Success");
        localStorage.setItem("token", res.data.token);
        router.push("/profile/home");
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
};
const handleRegisterClick = (e) => {
  e.preventDefault();
  registerRef.value?.validate(async (errors) => {
    if (!errors) {
      loadingBar.start();
      const res = await axios({
        method: "post",
        url: "/api/user/register",
        data: {
          userName: registerValue.value.user.userName,
          password: registerValue.value.user.password,
        },
      });
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
};
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
