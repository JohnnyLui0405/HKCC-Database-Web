<template>
  <div class="container">
    <n-space vertical>
      <n-button @Click="showModalCreate = true">Create New Reward</n-button>
      <n-modal v-model:show="showModalCreate">
        <n-card style="width: 600px" title="Create New Reward" :bordered="false" size="huge" role="dialog"
          aria-modal="true">
          <template #header-extra>
          </template>
          <n-form ref="formCreateRef" :model="modelCreate" :rules="rulesCreate" label-placement="top"
            require-mark-placement="right-hanging" :size="size" :style="{
              maxWidth: '640px'
            }">
            <n-form-item-row path="desc" label="Reward Description">
              <n-input v-model:value="modelCreate.desc" placeholder="Enter Reward Description" />
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
        <n-card id="options" title="Reward Manage" style="max-width: 300px;">
          <n-scrollbar style="max-height: 500px;">
            <n-form v-if="!loading" ref="formRef" :model="model" label-placement="top"
              require-mark-placement="right-hanging" :size="size" :style="{
                maxWidth: '640px'
              }">
              <n-form-item label="Reward Description" path="userName">
                <n-input v-model:value="model.desc"></n-input>
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


const id = {
  title: 'id',
  key: 'id',
  sorter: true,
  sortOrder: false
}

const desc = {
  title: 'Reward Description',
  key: 'itemDesc'
}

const createColumns = ({
  edit
}) => {
  return [
    id,
    desc,
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
    url: "/api/admin/getGameReward",
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

    })
    const modelCreate = ref({
      desc: ref(null)
    })
    const size = ref('medium')
    const rowKey = ref('uuid')
    const loading = ref(false)
    const showModalCreate = ref(false)
    const dataRef = ref([])
    const showModal = ref(false)
    const loadingRef = ref(true)
    const columns = createColumns({
      edit(row) {
        console.log(row)
        showModal.value = true
        model.value.desc = row.itemDesc
        model.value.id = row.id
      }
    },
    )
    const columnsRef = ref(columns)
    const idReactive = reactive(id)
    const descReactive = reactive(desc)
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
        idReactive.sortOrder,
        descReactive.filterOptionValues
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
        url: "/api/admin/updateGameReward",
        data: {
          id: model.value.id,
          desc: model.value.desc,
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
        idReactive.sortOrder,
        descReactive.filterOptionValues
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
        url: "/api/admin/deleteGameReward",
        data: {
          id: model.value.id,
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
        idReactive.sortOrder,
        descReactive.filterOptionValues
      ).then((data) => {
        dataRef.value = data.data
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      })
    }

    const formCreateRef = ref(null)
    const handleSaveClick = (e) => {
      e.preventDefault();
      formCreateRef.value?.validate(async (errors) => {
        if (!errors) {
          loadingBar.start();
          const res = await axios({
            method: "post",
            url: "/api/admin/createGameReward",
            data: {
              desc: modelCreate.value.desc,
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
    const rulesCreate = ref({
      id: [
        {
          required: true,
          message: "Please input id",
          trigger: "blur",
        },
      ],
      desc: [
        {
          required: true,
          message: "Please input Reward Description",
          trigger: "blur",
        },
      ],
      cv: [
        {
          required: true,
          message: "Please input cv",
          trigger: "blur",
        },
      ],
    });
    return {
      formRef: ref(null),
      formCreateRef,
      rulesCreate,
      handleSaveClick,
      size: size,
      rowKey: rowKey,
      columns: columnsRef,
      showModal: showModal,
      showModalCreate: showModalCreate,
      data: dataRef,
      model: model,
      modelCreate: modelCreate,
      id: idReactive,
      desc: descReactive,
      pagination: paginationReactive,
      loading: loadingRef,
      handleValidateButtonClick: handleValidateButtonClick,
      handleValidateDeleteButtonClick: handleValidateDeleteButtonClick,
      rowKey(rowData) {
        return rowData.uuid
      },
      handleSorterChange(sorter) {
        console.log(sorter)
        if (!sorter || sorter.columnKey === 'id') {
          if (!loadingRef.value) {
            loadingRef.value = true
            query(
              paginationReactive.page,
              paginationReactive.pageSize,
              !sorter ? false : sorter.order,
              descReactive.filterOptionValues
            ).then((data) => {
              idReactive.sortOrder = !sorter ? false : sorter.order
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
            idReactive.sortOrder,
            filterValues
          ).then((data) => {
            descReactive.filterOptionValues = filterValues
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
            idReactive.sortOrder,
            descReactive.filterOptionValues
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