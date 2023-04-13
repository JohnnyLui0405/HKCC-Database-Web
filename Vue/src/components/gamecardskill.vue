<template>
  <div class="container">
    <n-space vertical>
      <n-button @Click="showModalCreate = true">Create New Skill</n-button>
      <n-modal v-model:show="showModalCreate">
        <n-card style="width: 600px" title="Create New Skill" :bordered="false" size="huge" role="dialog"
          aria-modal="true">
          <template #header-extra>
          </template>
          <n-form ref="formCreateRef" :model="modelCreate" :rules="rulesCreate" label-placement="top"
            require-mark-placement="right-hanging" :size="size" :style="{
              maxWidth: '640px'
            }">
            <n-form-item label="Category" path="category">
              <n-select v-model:value="modelCreate.category" :options="categoryOptions"></n-select>
            </n-form-item>
            <n-form-item-row path="desc" label="Skill Description">
              <n-input v-model:value="modelCreate.desc" placeholder="Enter SkillDescription" />
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
        <n-card id="options" title="Skill Manage" style="max-width: 600px;">
          <n-scrollbar style="max-height: 500px;">
            <n-form v-if="!loading" ref="formRef" :model="model" label-placement="top"
              require-mark-placement="right-hanging" :size="size" :style="{
                maxWidth: '640px'
              }">
              <n-form-item label="Category" path="userName">
                <n-select v-model:value="model.category" :options="categoryOptions"></n-select>
              </n-form-item>
              <n-form-item label="Skill Description" path="userName">
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

const category = {
  title: 'Category',
  key: 'skillCategory'
}

const desc = {
  title: 'Skill Description',
  key: 'skillDesc'
}
const createColumns = ({
  edit
}) => {
  return [
    id,
    category,
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
    url: "/api/admin/getGameCardSkill",
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
    const categoryOptions = [
      {
        label: 'Attack',
        value: 'Attack'
      },
      {
        label: 'Guard',
        value: 'Guard'
      },
      {
        label: 'Support',
        value: 'Support'
      },
      {
        label: 'Boost',
        value: 'Boost'
      },
      {
        label: 'DangerAttack',
        value: 'DangerAttack'
      },
      {
        label: 'DangerGuard',
        value: 'DangerGuard'
      },
      {
        label: 'DangerBoost',
        value: 'DangerBoost'
      },
    ]
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
        model.value.desc = row.skillDesc
        model.value.category = row.skillCategory
        model.value.id = row.id
      }
    },
    )
    const columnsRef = ref(columns)
    const idReactive = reactive(id)
    const descReactive = reactive(desc)
    const categoryReactive = reactive(category)
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
        url: "/api/admin/updateGameCardSkill",
        data: {
          id: model.value.id,
          desc: model.value.desc,
          category: model.value.category
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
        url: "/api/admin/deleteGameCardSkill",
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
            url: "/api/admin/createGameCardSkill",
            data: {
              desc: modelCreate.value.desc,
              category: modelCreate.value.category,
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
          message: "Please input Skill Description",
          trigger: "blur",
        },
      ],
      category: [
        {
          required: true,
          message: "Please input cv",
          trigger: ["change", "blur"],
        },
      ],
    });
    return {
      categoryOptions,
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
      category: categoryReactive,
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