<template>
  <div class="container">
    <n-data-table remote ref="table" :columns="columns" :data="data" :loading="loading" :pagination="pagination"
      :row-key="rowKey" @update:sorter="handleSorterChange" @update:filters="handleFiltersChange"
      @update:page="handlePageChange" />
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3310';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

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
    url: "http://localhost:3310/api/user/getEvents",
    data: {
      page: page,
      pageSize: pageSize,
      order: order,
    }
  });
  console.log(res.data)
  return { data: res.data.data, total: parseInt(res.data.totalRecords), pageCount: 15 / pageSize }

}

export default defineComponent({
  setup() {
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