<template>
  <div class="container">
    <n-space vertical>
      <n-button @Click="showModalCreate = true">Create New User</n-button>
      <n-modal v-model:show="showModalCreate">
        <n-card style="width: 600px" title="Create New Card" :bordered="false" size="huge" role="dialog"
          aria-modal="true">
          <template #header-extra>
          </template>
          <n-form ref="formRef" :model="modelCreate" :rules="rulesCreate" label-placement="top"
            require-mark-placement="right-hanging" :size="size" :style="{
              maxWidth: '640px'
            }">
            <n-form-item-row path="user.userName" label="User Name">
              <n-input v-model:value="modelCreate.userName" placeholder="Enter your user name" />
            </n-form-item-row>
            <n-form-item-row path="user.password" label="Password">
              <n-input type="password" v-model:value="modelCreate.password" placeholder="Enter your password" />
            </n-form-item-row>
            <n-form-item-row first ref="rPasswordFormItemRef" path="user.rePassword" label="Re-Password">
              <n-input type="password" :disabled="!modelCreate.password" v-model:value="modelCreate.rePassword"
                placeholder="Enter your password again" />
            </n-form-item-row>
          </n-form>
          <template #footer>
            <n-button @Click="handleSaveClick">Save</n-button>
          </template>
        </n-card>
      </n-modal>
      <n-data-table remote ref="table" :columns="columns" :data="data" :loading="loading" :pagination="pagination"
        :row-key="rowKey" @update:sorter="handleSorterChange" @update:filters="handleFiltersChange"
        @update:page="handlePageChange" />
      <n-modal v-model:show="showModal">
        <n-card id="options" title="User Manage" style="max-width: 300px;">
          <n-scrollbar style="max-height: 500px;">
            <n-form v-if="!loading" ref="formRef" :model="model" label-placement="top"
              require-mark-placement="right-hanging" :size="size" :style="{
                maxWidth: '640px'
              }">
              <n-form-item label="User Name" path="userName">
                <n-input v-model:value="model.userName"></n-input>
              </n-form-item>
              <n-form-item label="Password" path="password">
                <n-input type="password" v-model:value="model.password"></n-input>
              </n-form-item>
              <n-form-item label="Felica Code" path="userName">
                <n-input v-model:value="model.felicaCode"></n-input>
              </n-form-item>
              <n-form-item label="Is Admin" path="userName">
                <n-switch v-model:value="model.isAdmin"></n-switch>
              </n-form-item>
            </n-form>
            <n-skeleton v-else text :repeat="10" />

          </n-scrollbar>
          <div style="display: flex; justify-content: flex-end">
            <n-space>
              <n-button round type="primary" @click="handleValidateButtonClick">
                Save
              </n-button>
              <n-button round type="error" @click="handleValidateDeleteButtonClick">
                Delete
              </n-button>
            </n-space>
          </div>
        </n-card>
      </n-modal>
    </n-space>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, h } from 'vue'
import { NButton, useDialog, NForm, useLoadingBar, useMessage } from 'naive-ui'
import axios from 'axios'
axios.defaults.baseURL = 'https://dbprojectapi.courtcloud.me';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');


const uuid = {
  title: 'uuid',
  key: 'uuid',
  sorter: true,
  sortOrder: false
}

const userName = {
  title: 'User Name',
  key: 'userName'
}

const felicaCode = {
  title: 'Felica Code',
  key: 'felicaCode'
}

const isAdmin = {
  title: "isAdmin",
  key: "isAdmin"
}

const createColumns = ({
  edit
}) => {
  return [
    uuid,
    userName,
    felicaCode,
    isAdmin,
    {
      title: "Action",
      key: "actions",
      render(row) {
        return h(
          NButton,
          {
            strong: true,
            tertiary: true,
            size: "small",
            onClick: () => edit(row)
          },
          { default: () => "Manage" }
        );
      }
    }
  ];
};

async function query(page, pageSize = 5, order = 'ascend', filterValues = []) {
  // return new Promise((resolve) => {
  //   const copiedData = data.map((v) => v)
  //   const orderedData = order === 'descend' ? copiedData.reverse() : copiedData
  //   const filteredData = filterValues.length
  //     ? orderedData.filter((row) => filterValues.includes(row.userName))
  //     : orderedData
  //   const pagedData = filteredData.slice((page - 1) * pageSize, page * pageSize)
  //   const total = filteredData.length
  //   const pageCount = Math.ceil(filteredData.length / pageSize)
  //   setTimeout(
  //     () =>
  //       resolve({
  //         pageCount,
  //         data: pagedData,
  //         total
  //       }),
  //     1500
  //   )
  // })
  order = order === 'descend' ? 'desc' : 'asc'
  const res = await axios({
    method: "post",
    url: "/api/admin/getWebUsers",
    data: {
      page: page,
      pageSize: pageSize,
      order: order,
    }
  });
  console.log(res.data)
  return { data: res.data.data, total: parseInt(res.data.totalRecords), pageCount: parseInt(res.data.totalRecords) / pageSize }

}

export default defineComponent({
  setup() {
    const loadingBar = useLoadingBar()
    const message = useMessage()
    const model = ref({
      uuid: "",
      userName: "",
      felicaCode: "",
      isAdmin: "",
      password: ""
    })
    const modelCreate = ref({
      userName: "",
      password: "",
      rePassword: "",
    })
    const size = ref('medium')
    const rowKey = ref('uuid')
    const loading = ref(false)
    const showModalCreate = ref(false)
    const dataRef = ref([])
    const showModal = ref(false)
    const loadingRef = ref(true)
    const columnsRef = ref()
    const uuidReactive = reactive(uuid)
    const userNameReactive = reactive(userName)
    const felicaCodeReactive = reactive(felicaCode)
    const isAdminReactive = reactive(isAdmin)
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 5,
      prefix({ itemCount }) {
        return `Total is ${itemCount}.`
      }
    })

    onMounted(() => {
      query(
        paginationReactive.page,
        paginationReactive.pageSize,
        uuidReactive.sortOrder,
        userNameReactive.filterOptionValues
      ).then((data) => {
        dataRef.value = data.data
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      })
    })

    const handleValidateButtonClick = async () => {
      console.log(model.value)
      loadingBar.start()
      const res = await axios({
        method: "post",
        url: "/api/admin/updateWebUser",
        data: {
          uuid: model.value.uuid,
          userName: model.value.userName,
          felicaCode: model.value.felicaCode,
          isAdmin: model.value.isAdmin,
          password: model.value.password
        }
      })
      if (res.data.success) {
        message.success("Update Success")
        loadingBar.finish()
      } else {
        message.error("Update Failed")
        loadingBar.error()
      }
      showModal.value = false
      query(
        paginationReactive.page,
        paginationReactive.pageSize,
        uuidReactive.sortOrder,
        userNameReactive.filterOptionValues
      ).then((data) => {
        dataRef.value = data.data
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      })
    }

    const handleValidateDeleteButtonClick = async () => {
      console.log(model.value)
      loadingBar.start()
      const res = await axios({
        method: "post",
        url: "/api/admin/deleteWebUser",
        data: {
          uuid: model.value.uuid,
        }
      })
      if (res.data.success) {
        message.success("Delete Success")
        loadingBar.finish()
      } else {
        message.error("Delete Failed")
        loadingBar.error()
      }
      showModal.value = false
      query(
        paginationReactive.page,
        paginationReactive.pageSize,
        uuidReactive.sortOrder,
        userNameReactive.filterOptionValues
      ).then((data) => {
        dataRef.value = data.data
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      })
    }
    const rulesCreate = ref({
      user: {
        userName: {
          required: true,
          message: "User Name is required",
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
    function validatePasswordStartWith(rule, value) {
      return (
        !!modelCreate.value.user.password &&
        modelCreate.value.user.password.startsWith(value) &&
        modelCreate.value.user.password.length >= value.length
      );
    }
    function validatePasswordSame(rule, value) {
      console.log(modelCreate.value.user.password);
      return value === modelCreate.value.user.password;
    }
    return {
      formRef: ref(null),
      rulesCreate: rulesCreate,
      size: size,
      rowKey: rowKey,
      showModal: showModal,
      showModalCreate: showModalCreate,
      data: dataRef,
      model: model,
      modelCreate: modelCreate,
      columns: createColumns({
        edit(row) {
          console.log(row)
          showModal.value = true
          model.value.uuid = row.uuid
          model.value.userName = row.userName
          model.value.felicaCode = row.felicaCode
          model.value.isAdmin = row.isAdmin ? true : false
        }
      },
      ),
      uuid: uuidReactive,
      userName: userNameReactive,
      felicaCode: felicaCodeReactive,
      pagination: paginationReactive,
      loading: loadingRef,
      handleValidateButtonClick: handleValidateButtonClick,
      handleValidateDeleteButtonClick: handleValidateDeleteButtonClick,
      rowKey(rowData) {
        return rowData.uuid
      },
      handleSorterChange(sorter) {
        if (!sorter || sorter.columnKey === 'uuid') {
          if (!loadingRef.value) {
            loadingRef.value = true
            query(
              paginationReactive.page,
              paginationReactive.pageSize,
              !sorter ? false : sorter.order,
              userNameReactive.filterOptionValues
            ).then((data) => {
              uuidReactive.sortOrder = !sorter ? false : sorter.order
              dataRef.value = data.data
              paginationReactive.pageCount = data.pageCount
              paginationReactive.itemCount = data.total
              loadingRef.value = false
            })
          }
        }
      },
      handleFiltersChange(filters) {
        if (!loadingRef.value) {
          loadingRef.value = true
          const filterValues = filters.userName || []
          query(
            paginationReactive.page,
            paginationReactive.pageSize,
            uuidReactive.sortOrder,
            filterValues
          ).then((data) => {
            userNameReactive.filterOptionValues = filterValues
            dataRef.value = data.data
            paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
            loadingRef.value = false
          })
        }
      },
      handlePageChange(currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          query(
            currentPage,
            paginationReactive.pageSize,
            uuidReactive.sortOrder,
            userNameReactive.filterOptionValues
          ).then((data) => {
            dataRef.value = data.data
            paginationReactive.page = currentPage
            paginationReactive.pageCount = data.pageCount
            paginationReactive.itemCount = data.total
            loadingRef.value = false
          })
        }
      }
    }
  }
})
</script>