<template>
  <div class="container">
    <n-space vertical>
      <n-button @Click="showModalCreate = true">Create New Character</n-button>
      <n-modal v-model:show="showModalCreate">
        <n-card style="width: 600px" title="Create New Character" :bordered="false" size="huge" role="dialog"
          aria-modal="true">
          <template #header-extra>
          </template>
          <n-form ref="formCreateRef" :model="modelCreate" :rules="rulesCreate" label-placement="top"
            require-mark-placement="right-hanging" :size="size" :style="{
              maxWidth: '640px'
            }">
            <n-form-item-row path="characterName" label="Character Name">
              <n-input v-model:value="modelCreate.characterName" placeholder="Enter Character Name" />
            </n-form-item-row>
            <n-form-item-row path="cv" label="CV">
              <n-input v-model:value="modelCreate.cv" placeholder="Enter CV" />
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
        <n-card id="options" title="Character Manage" style="max-width: 300px;">
          <n-scrollbar style="max-height: 500px;">
            <n-form v-if="!loading" ref="formRef" :model="model" label-placement="top"
              require-mark-placement="right-hanging" :size="size" :style="{
                maxWidth: '640px'
              }">
              <n-form-item label="Character Name" path="userName">
                <n-input v-model:value="model.characterName"></n-input>
              </n-form-item>
              <n-form-item label="CV" path="password">
                <n-input v-model:value="model.cv"></n-input>
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
  sortOrder: true
}

const characterName = {
  title: 'Character Name',
  key: 'name'
}

const cv = {
  title: 'CV',
  key: 'cv'
}

const createColumns = ({
  edit
}) => {
  return [
    id,
    characterName,
    cv,
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
    url: "/api/admin/getGameCharacter",
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

    })
    const size = ref('medium')
    const rowKey = ref('uuid')
    const loading = ref(false)
    const showModalCreate = ref(false)
    const dataRef = ref([])
    const showModal = ref(false)
    const loadingRef = ref(true)
    const columnsRef = ref()
    const idReactive = reactive(id)
    const characterNameReactive = reactive(characterName)
    const cvReactive = reactive(cv)
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
        characterNameReactive.filterOptionValues
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
        url: "/api/admin/updateGameCharacter",
        data: {
          id: model.value.id,
          name: model.value.characterName,
          cv: model.value.cv
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
        characterNameReactive.filterOptionValues
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
        url: "/api/admin/deleteGameCharacter",
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
        characterNameReactive.filterOptionValues
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
            url: "/api/admin/createGameCharacter",
            data: {
              name: modelCreate.value.characterName,
              cv: modelCreate.value.cv
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
      characterName: [
        {
          required: true,
          message: "Please input character name",
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
    function validatePasswordStartWith(rule, value) {
      return (
        !!modelCreate.value.password &&
        modelCreate.value.password.startsWith(value) &&
        modelCreate.value.password.length >= value.length
      );
    }
    function validatePasswordSame(rule, value) {
      return value === modelCreate.value.password;
    }
    return {
      formRef: ref(null),
      formCreateRef,
      rulesCreate,
      handleSaveClick,
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
          model.value.id = row.id
          model.value.characterName = row.name
          model.value.cv = row.cv
        }
      },
      ),
      id: idReactive,
      characterName: characterNameReactive,
      cv: cvReactive,
      pagination: paginationReactive,
      loading: loadingRef,
      handleValidateButtonClick: handleValidateButtonClick,
      handleValidateDeleteButtonClick: handleValidateDeleteButtonClick,
      rowKey(rowData) {
        return rowData.uuid
      },
      handleSorterChange(sorter) {
        if (!sorter || sorter.columnKey === 'id') {
          if (!loadingRef.value) {
            loadingRef.value = true
            query(
              paginationReactive.page,
              paginationReactive.pageSize,
              !sorter ? false : sorter.order,
              characterNameReactive.filterOptionValues
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
            characterNameReactive.filterOptionValues = filterValues
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
            characterNameReactive.filterOptionValues
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