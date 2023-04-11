<template>
  <div class="container">
    <n-card id="options" title="Player Options">
      <n-scrollbar style="max-height: 500px;">
        <n-form v-if="!loading" ref="formRef" :model="model" :rules="rules" label-placement="top"
          require-mark-placement="right-hanging" :size="size" :style="{
            maxWidth: '640px'
          }">
          <n-form-item label="Abort" path="about">
            <n-select v-model:value="model.abort" :options="abortOptions" default-value="" />
          </n-form-item>
          <n-form-item label="Color Field" path="inputValue">
            <n-select v-model:value="model.colorField" :options="colorFieldOptions" />
          </n-form-item>
          <n-form-item label="Color Lane" path="inputValue">
            <n-select v-model:value="model.colorLane" :options="colorLaneOptions" />
          </n-form-item>
          <n-form-item label="Color Wall" path="inputValue">
            <n-select v-model:value="model.colorWall" :options="colorWallOptions" />
          </n-form-item>
          <n-form-item label="Display Battle Point" path="inputValue">
            <n-switch v-model:value="model.displayBattlePoint" />
          </n-form-item>
          <n-form-item label="Display Player Level" path="inputValue">
            <n-switch v-model:value="model.displayPlayerLevel" />
          </n-form-item>
          <n-form-item label="HeadPhone AMP" path="inputValue">
            <n-slider v-model:value="model.headphoneAMP" :step="1" :min="1" :max="9" />
          </n-form-item>
          <n-form-item label="Display judge type" path="inputValue">
            <n-select v-model:value="model.displayJudgeType" :options="judgeOptions"></n-select>
          </n-form-item>
          <n-form-item label="Tap Sound" path="inputValue">
            <n-select v-model:value="model.tapSound" :options="soundTypeOptions" />
          </n-form-item>
          <n-form-item label="Break Sound" path="inputValue">
            <n-select v-model:value="model.breakSound" :options="soundTypeOptions" />
          </n-form-item>
          <n-form-item label="Mirror" path="inputValue">
            <n-switch v-model:value="model.isMirror" />
          </n-form-item>
          <n-form-item label="Tap AMP" path="inputValue">
            <n-slider v-model:value="model.tapAMP" :step="1" :min="1" :max="9" />
          </n-form-item>
          <n-form-item label="Bell AMP" path="inputValue">
            <n-slider v-model:value="model.bellAMP" :step="1" :min="1" :max="9" />
          </n-form-item>
          <n-form-item label="CBreak AMP" path="inputValue">
            <n-slider v-model:value="model.CBreakAMP" :step="1" :min="1" :max="9" />
          </n-form-item>
          <n-form-item label="Hold AMP" path="inputValue">
            <n-slider v-model:value="model.holdAMP" :step="1" :min="1" :max="9" />
          </n-form-item>
        </n-form>
        <n-skeleton v-else text :repeat="10" />

      </n-scrollbar>
      <div style="display: flex; justify-content: flex-end">
        <n-button round type="primary" @click="handleValidateButtonClick">
          Save
        </n-button>
      </div>
    </n-card>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { NCard, NForm, NFormItem, NFormItemGridItem, NGrid, NButton, NTransfer, NRadioGroup, NCheckbox, NCheckboxGroup, NTimePicker, NRadioButton, NInput, NSelect, NSwitch, useLoadingBar, useMessage } from "naive-ui";
const message = useMessage();
const loadingBar = useLoadingBar();
const formRef = ref(null);
let selectedOptions;
const loading = ref(true);
const model = ref({
  abort: "",
  colorField: "",
  colorLane: "",
  colorWall: "",
  displayBattlePoint: "",
  displayPlayerLevel: "",
  displayJudgeType: "",
  headphoneAMP: "",
  input: "",
  tapSound: "",
  breakSound: "",
  mirror: "",
  tapAMP: "",
  bellAMP: "",
  cbreakAMP: "",
  holdAMP: ""
});
axios.defaults.baseURL = 'https://dbprojectapi.courtcloud.me';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
axios.post("/api/user/getUserOptions").then((res) => {
  console.log(res.data);
  selectedOptions = res.data.data[0];
  selectedOptions.displayBattlePoint = selectedOptions.displayBattlePoint == 1 ? true : false;
  selectedOptions.displayPlayerLevel = selectedOptions.displayPlayerLevel == 1 ? true : false;
  selectedOptions.isMirror = selectedOptions.isMirror == 1 ? true : false;
  model.value = selectedOptions
  loading.value = false;
});

// model = ref(selectedOptions);
const rules = ref({
  about: [
    {
      type: "string",
      required: false,
      message: "Input is required",
      trigger: ["blur", "change"]
    }
  ]
});
const abortOptions = [
  {
    "value": 1,
    "label": "Track skip off"
  },
  {
    "value": 2,
    "label": "SSS+ Track skip"
  },
  {
    "value": 3,
    "label": "SSS Track skip"
  },
  {
    "value": 4,
    "label": "SS Track skip"
  },
  {
    "value": 5,
    "label": "S Track skip"
  },
  {
    "value": 6,
    "label": "My best record track skip"
  }
];
const colorFieldOptions = [
  {
    "value": 1,
    "label": "Default"
  },
  {
    "value": 2,
    "label": "Red Blue interchange"
  },
  {
    "value": 3,
    "label": "Red Green interchange"
  },
  {
    "value": 4,
    "label": "Blue Green interchange"
  }
];
const colorLaneOptions = [
  {
    "value": 1,
    "label": "Default"
  },
  {
    "value": 2,
    "label": "Red Blue interchange"
  },
  {
    "value": 3,
    "label": "Red Green interchange"
  },
  {
    "value": 4,
    "label": "Blue Green interchange"
  }
];
const colorWallOptions = [
  {
    "value": 1,
    "label": "Default"
  },
  {
    "value": 2,
    "label": "Brighten"
  },
  {
    "value": 3,
    "label": "Darken"
  }
];
const soundTypeOptions = [
  {
    "value": 1,
    "label": "miamia"
  },
  {
    "value": 2,
    "label": "airythm"
  },
  {
    "value": 3,
    "label": "ongeki"
  },
  {
    "value": 4,
    "label": "milk"
  },
  {
    "value": 5,
    "label": "shama"
  },
  {
    "value": 6,
    "label": "ras"
  },
  {
    "value": 7,
    "label": "chiffon"
  },
  {
    "value": 8,
    "label": "yuzu"
  },
  {
    "value": 9,
    "label": "akari"
  }
];
const judgeOptions = [
  {
    label: "A1",
    value: "A1"
  },
  {
    label: "A2",
    value: "A2"
  },
  {
    label: "A3",
    value: "A3"
  },
  {
    label: "B1",
    value: "B1"
  },
  {
    label: "B2",
    value: "B2"
  },
  {
    label: "B3",
    value: "B3"
  },
  {
    label: "C1",
    value: "C1"
  },
  {
    label: "C2",
    value: "C2"
  },
  {
    label: "C3",
    value: "C3"
  }
]


const size = ref("medium");
const handleValidateButtonClick = () => {
  formRef.value.validate().then(async (errors) => {
    if (!errors) {
      loadingBar.start();
      const res = await axios.post("/api/user/updateUserOptions", { data: model.value });
      if (res.data.success) {
        message.success("Update Success");
        loadingBar.finish();
      } else {
        message.error("Update Failed");
        loadingBar.error();
      }
    } else {
      console.log(errors);
      message.error("Invalid");
    }
  });
};



</script>

<style scoped>
#options {
  max-width: 500px;
  min-width: 100px;
}
</style>