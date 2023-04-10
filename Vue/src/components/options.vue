<template>
  <div class="container">
    <n-card id="options" title="Player Options">
      <n-scrollbar style="max-height: 500px;">
        <n-form ref="formRef" :model="model" :rules="rules" label-placement="top" require-mark-placement="right-hanging"
          :size="size" :style="{
            maxWidth: '640px'
          }">
          <n-form-item label="About" path="inputValue">
            <n-space vertical>
              <n-input-number v-model:value="model.about" size="small" max="5" min="-1" />
            </n-space>
          </n-form-item>
          <n-form-item label="Color Field" path="inputValue">
            <n-input-number v-model:value="model.colorField" size="small" max="3" min="0" />
          </n-form-item>
          <n-form-item label="Color Lane" path="inputValue">
            <n-input-number v-model:value="model.colorLane" size="small" max="3" min="0" />
          </n-form-item>
          <n-form-item label="Color Wall" path="inputValue">
            <n-input-number v-model:value="model.colorWall" size="small" max="2" min="0" />
          </n-form-item>
          <n-form-item label="Display Battle Point" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Display Player Level" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="HeadPhone AMP" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Input" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Tap Sound" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Break Sound" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Mirror" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Tap AMP" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Bell AMP" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="CBreak AMP" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <n-form-item label="Hold AMP" path="inputValue">
            <n-input v-model:value="model.inputValue" placeholder="Input" />
          </n-form-item>
          <div style="display: flex; justify-content: flex-end">
            <n-button round type="primary" @click="handleValidateButtonClick">
              Save
            </n-button>
          </div>
        </n-form>
      </n-scrollbar>
    </n-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { NCard, NForm, NFormItem, NFormItemGridItem, NGrid, NButton, NTransfer, NRadioGroup, NCheckbox, NCheckboxGroup, NTimePicker, NRadioButton, NInput, NSelect, NSwitch } from "naive-ui";
const formRef = ref(null);
const model = ref({
  about: ref(-1),
  colorField: ref(0),
  colorLane: ref(0),
  colorWall: "",
  displayBattlePoint: "",
  displayPlayerLevel: "",
  headPhoneAMP: "",
  input: "",
  tapSound: "",
  breakSound: "",
  mirror: "",
  tapAMP: "",
  bellAMP: "",
  cbreakAMP: "",
  holdAMP: ""
});
const rules = ref({
  about: [
    {
      required: true,
      message: "Input is required",
      trigger: "blur"
    }
  ]
});
const size = ref("medium");
const handleValidateButtonClick = () => {
  formRef.value.validate().then((valid) => {
    if (valid) {
      alert("success");
    } else {
      alert("error");
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