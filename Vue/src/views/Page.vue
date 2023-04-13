<template>
  <n-space vertical>

    <n-layout has-sider position="absolute">
      <n-layout-sider bordered collapse-mode="width" :collapsed-width="64" :width="240" :collapsed="collapsed"
        show-trigger @collapse="collapsed = true" @expand="collapsed = false">
        <n-menu default-value="home" :collapsed="collapsed" :collapsed-width="64" :collapsed-icon-size="22"
          :options="menuOptions" />
      </n-layout-sider>
      <n-layout>
        <router-view></router-view>
      </n-layout>
    </n-layout>

  </n-space>
</template>

<script setup>
import { h, ref, defineComponent, render } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { NIcon, NLayout, NLayoutSider, NSpace, NMenu } from "naive-ui";
import { LogOutOutline as LogOutIcon, HomeOutline as HomeIcon, GameControllerOutline as PlayDataIcon, CalendarOutline as EventIcon, OptionsOutline as OptionsIcon, LibraryOutline as CollectionIcon, IdCardOutline, PersonOutline, CardOutline, MusicalNotesOutline, ReceiptOutline, BulbOutline, GiftOutline, PeopleOutline } from "@vicons/ionicons5";
import axios from "axios";
axios.defaults.baseURL = 'https://dbprojectapi.courtcloud.me';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
const router = useRouter();

const renderIcon = (icon) => () => h(NIcon, null, { default: () => h(icon) });

let menuOptions = [
  {
    label: () => h(
      RouterLink,
      { to: "/profile/home" },
      { default: () => "Home" }
    ),
    key: "home",
    icon: renderIcon(HomeIcon)
  },
  {
    key: "divider-1",
    type: "divider",
    props: {
      style: {
        marginLeft: "32px"
      }
    }
  },
  {
    label: () => h(
      RouterLink,
      { to: "/profile/playData" },
      { default: () => "Play Data" }
    ),
    key: "playData",
    icon: renderIcon(PlayDataIcon)
  },
  {
    label: () => h(
      RouterLink,
      { to: "/profile/event" },
      { default: () => "Event" }
    ),
    key: "event",
    icon: renderIcon(EventIcon)
  },
  {
    label: () => h(
      RouterLink,
      { to: "/profile/collection" },
      { default: () => "Collection" }
    ),
    key: "collection",
    icon: renderIcon(CollectionIcon)
  }, {
    label: () => h(
      RouterLink,
      { to: "/profile/options" },
      { default: () => "Options" }
    ),
    key: "options",
    icon: renderIcon(OptionsIcon)
  }

];

if (localStorage.getItem('isAdmin') == 1) {
  console.log("adding admin")
  menuOptions.push({
    label: "Admin",
    key: "admin",
    icon: renderIcon(IdCardOutline),
    children: [
      {
        label: () => h(
          RouterLink,
          { to: "/admin/webuser" },
          { default: () => "Web User Manage" }
        ),
        key: "webUserManage",
        icon: renderIcon(PersonOutline)
      },
      {
        label: () => h(
          RouterLink,
          { to: "/admin/gameCardSkill" },
          { default: () => "Game Card Skill" }
        ),
        key: "gameCardSkill",
        icon: renderIcon(BulbOutline)
      },
      {
        label: () => h(
          RouterLink,
          { to: "/admin/gameCharacter" },
          { default: () => "Game Character" }
        ),
        key: "gameCharacter",
        icon: renderIcon(PeopleOutline)
      },
      {
        label: () => h(
          RouterLink,
          { to: "/admin/gameReward" },
          { default: () => "Game Reward" }
        ),
        key: "gameReward",
        icon: renderIcon(GiftOutline)
      },
      {
        label: () => h(
          RouterLink,
          { to: "/admin/gameCard" },
          { default: () => "Game Card(Old)" }
        ),
        key: "gameCard",
        icon: renderIcon(CardOutline)
      },
      {
        label: () => h(
          RouterLink,
          { to: "/admin/gameMusic" },
          { default: () => "Game Music(Old)" }
        ),
        key: "gameMusic",
        icon: renderIcon(MusicalNotesOutline)
      },
      {
        label: () => h(
          RouterLink,
          { to: "/admin/gameMission" },
          { default: () => "Game Mission(Old)" }
        ),
        key: "gameMission",
        icon: renderIcon(ReceiptOutline)
      },
    ]
  })
}

menuOptions.push({
  label: () => h(
    RouterLink,
    { to: "/profile/logout" },
    { default: () => "Logout" }
  ),
  key: "logout",
  icon: renderIcon(LogOutIcon)
},)

const collapse = ref(true)
</script>