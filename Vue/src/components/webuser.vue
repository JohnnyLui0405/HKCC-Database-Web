<template>
  <div class="container">
    <n-data-table remote ref="table" :columns="columns" :data="data" :loading="loading" :pagination="pagination"
      :row-key="rowKey" @update:sorter="handleSorterChange" @update:filters="handleFiltersChange"
      @update:page="handlePageChange" />
    <n-modal v-model:show="showModal">
      <n-card style="width: 600px" title="模态框" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <template #header-extra>
          噢！
        </template>
        内容
        <template #footer>
          尾部
        </template>
      </n-card>
    </n-modal>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted, h } from 'vue'
import { NButton, useDialog, NForm } from 'naive-ui'
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

const action = {
  title: "Action",
  key: "actions",
  render(row) {
    return h(
      NButton, {
      size: "small", onClick: () => {
        showModal()
      }
    }, { default: () => "Edit" }
    )
  }
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
          { default: () => "Edit" }
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
    const dialog = useDialog()
    const dataRef = ref([])
    const showModal = ref(false)
    const loadingRef = ref(true)
    const columnsRef = ref()
    const showModalReactive = reactive(showModal)
    const eventNameReactive = reactive(uuid)
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
        eventNameReactive.sortOrder,
        userNameReactive.filterOptionValues
      ).then((data) => {
        dataRef.value = data.data
        paginationReactive.pageCount = data.pageCount
        paginationReactive.itemCount = data.total
        loadingRef.value = false
      })
    })

    return {
      showModal: showModal,
      data: dataRef,
      columns: createColumns({
        edit(row) {
          showModalReactive = true
        }
      },
      ),
      eventName: eventNameReactive,
      userName: userNameReactive,
      felicaCode: felicaCodeReactive,
      pagination: paginationReactive,
      loading: loadingRef,
      rowKey(rowData) {
        return rowData.eventName
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
          const filterValues = filters.userName || []
          query(
            paginationReactive.page,
            paginationReactive.pageSize,
            eventNameReactive.sortOrder,
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
            eventNameReactive.sortOrder,
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