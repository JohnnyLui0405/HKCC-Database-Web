<template>
  <n-config-provider :theme="darkTheme">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <router-view />
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
  </template>
  
<script setup>
  import { defineComponent } from "vue";
  import { darkTheme, NConfigProvider, NLoadingBarProvider, NMessageProvider, NNotificationProvider, NDialogProvider } from "naive-ui";
</script>

<style>
</style>