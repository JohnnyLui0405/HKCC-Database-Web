<template>
  
  <n-space vertical>
    
    <n-layout has-sider position="absolute">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :render-label="renderMenuLabel"
          :render-icon="renderMenuIcon"
          :expand-icon="expandIcon"
        />
      </n-layout-sider>
      <n-layout>
        <router-view></router-view>
      </n-layout>
    </n-layout>
  </n-space>
</template>

<script setup>
import { h, ref, defineComponent } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { NIcon, NLayout, NLayoutSider, NSpace, NMenu } from "naive-ui";
import { BookmarkOutline, CaretDownOutline } from "@vicons/ionicons5";

const router = useRouter();

const menuOptions = [
  {
    label: h(
      RouterLink,
      { to: "./test" },
      { default: () => "Test" }
    ),
    key: "home"
  },
];

const collapse = ref(true)
const renderMenuLabel = (option) => {
  if ("href" in option) {
    return h("a", { href: option.href, target: "_blank" }, [
      option.label
    ]);
  }
  return option.label;
}
const renderMenuIcon = (option) => {
  if ("href" in option) {
    return h(NIcon, null, {
      default: () => h(BookmarkOutline)
    });
  }
  return null;
}

const expandIcon = () => {
  return h(NIcon, null, {
    default: () => h(CaretDownOutline)
  });
}
</script>