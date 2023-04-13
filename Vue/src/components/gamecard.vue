<template>
  <div class="container">
    <n-space vertical>
      <n-button v-if="isAdmin == 1" @Click="showModal = true">Create New Card</n-button>
      <n-modal v-model:show="showModal">
        <n-card style="width: 600px" title="Create New Card" :bordered="false" size="huge" role="dialog"
          aria-modal="true">
          <template #header-extra>
          </template>
          <n-form ref="formRef" :model="model" :rules="rules" label-placement="top" require-mark-placement="right-hanging"
            :size="size" :style="{
              maxWidth: '640px'
            }">
            <n-form-item label="Event Name" path="eventName">
              <n-input v-model:value="model.eventName" placeholder="Input" />
            </n-form-item>
            <n-form-item label="Start Time" path="startEndTime">
              <n-date-picker v-model:value="model.startEndTime" type="datetimerange" clearable update-value-on-close
                :is-date-disabled="disablePreviousDate" />
            </n-form-item>
          </n-form>
          <template #footer>
            <n-button @Click="handleSaveClick">Save</n-button>
          </template>
        </n-card>
      </n-modal>
      <n-data-table remote ref="table" :columns="columns" :data="data" :loading="loading" :pagination="pagination"
        :row-key="rowKey" @update:sorter="handleSorterChange" @update:filters="handleFiltersChange"
        @update:page="handlePageChange" />
    </n-space>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useLoadingBar, useMessage } from 'naive-ui'
axios.defaults.baseURL = 'https://dbprojectapi.courtcloud.me';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const formRef = ref()

const eventName = {
  title: 'Event Name',
  key: 'eventName',
  sorter: true,
  sortOrder: false
}

const startTime = {
  title: 'Start Time',
  key: 'startTime'
}

const endTime = {
  title: 'End Time',
  key: 'endTime'
}

const columns = [
  eventName,
  startTime,
  endTime
]

async function query(page, pageSize = 5, order = 'ascend', filterValues = []) {
  // return new Promise((resolve) => {
  //   const copiedData = data.map((v) => v)
  //   const orderedData = order === 'descend' ? copiedData.reverse() : copiedData
  //   const filteredData = filterValues.length
  //     ? orderedData.filter((row) => filterValues.includes(row.startTime))
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
    url: "/api/user/getEvents",
    data: {
      page: page,
      pageSize: pageSize,
      order: order,
    }
  });
  console.log(res.data)
  return {
    data: res.data.data, total: parseInt(res.data.totalRecords), pageCount: parseInt(res.data.totalRecords) / pageSize
  }

}

export default defineComponent({
  setup() {
    const loadingBar = useLoadingBar()
    const message = useMessage()
    const model = ref({
      eventName: null,
      startEndTime: null,
    })
    const rules = ref({
      eventName: [
        {
          required: true,
          message: 'Please input event name',
          trigger: 'blur'
        }
      ],
      startEndTime: [
        {
          type: 'array',
          required: true,
          message: 'Please input start time',
          trigger: 'blur'
        }
      ]
    })
    const handleSaveClick = (e) => {
      e.preventDefault();
      formRef.value?.validate(async (errors) => {
        if (!errors) {
          loadingBar.start();
          const res = await axios({
            method: "post",
            url: "/api/admin/createEvent",
            data: {
              eventName: model.value.eventName,
              startTime: model.value.startEndTime[0],
              endTime: model.value.startEndTime[1],
            },
          });
          if (res.data.success) {
            message.success("Create New Event Success");
            loadingBar.finish();
          } else {
            message.error("Create New Event Failed");
            loadingBar.error();
          }
        } else {
          console.log(errors);
          message.error("Invalid");
        }
      });
    };
    const dataRef = ref([])
    const loadingRef = ref(true)
    const columnsRef = ref(columns)
    const eventNameReactive = reactive(eventName)
    const startTimeReactive = reactive(startTime)
    const endTimeReactive = reactive(endTime)
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
        eventNameReactive.sortOrder,
        startTimeReactive.filterOptionValues
      ).then((data) => {
        dataRef.value = data.data
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      })
    })

    return {
      formRef,
      rules,
      handleSaveClick,
      disablePreviousDate(ts) {
        return ts <= new Date(Date.now()) - 24 * 60 * 60 * 1000
      },
      model: model,
      showModal: ref(false),
      isAdmin: localStorage.getItem('isAdmin'),
      data: dataRef,
      columns: columnsRef,
      eventName: eventNameReactive,
      startTime: startTimeReactive,
      endTime: endTimeReactive,
      pagination: paginationReactive,
      loading: loadingRef,
      rowKey(rowData) {
        return rowData.eventName
      },
      handleSorterChange(sorter) {
        if (!sorter || sorter.columnKey === 'eventName') {
          if (!loadingRef.value) {
            loadingRef.value = true
            query(
              paginationReactive.page,
              paginationReactive.pageSize,
              !sorter ? false : sorter.order,
              startTimeReactive.filterOptionValues
            ).then((data) => {
              eventNameReactive.sortOrder = !sorter ? false : sorter.order
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
          const filterValues = filters.startTime || []
          query(
            paginationReactive.page,
            paginationReactive.pageSize,
            eventNameReactive.sortOrder,
            filterValues
          ).then((data) => {
            startTimeReactive.filterOptionValues = filterValues
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
            eventNameReactive.sortOrder,
            startTimeReactive.filterOptionValues
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