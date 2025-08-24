<template>
  <div class="data-table-container">
    <h2>{{ title }}</h2>
    <div class="search-bar">
      <InputText
        v-model="globalFilter"
        placeholder="Search..."
        class="w-full"
        @input="applyFilter"
      />
    </div>
    <DataTable
      v-model:value="data"
      v-model:filters="filters"
      :global-filter="globalFilter"
      :rows="rows"
      :paginator="true"
      :rows-per-page-options="[5, 10, 20]"
      :sortField="sortField"
      :sortOrder="sortOrder"
      @sort-change="onSortChange"
      responsive
    >
      <Column v-for="column in columns" :key="column.field"
        :field="column.field"
        :header="column.header"
        :sortable="true"
        :filterable="true"
        :filterPlaceholder="`Search ${column.header}...`"
      >
        <template #filter="slotProps">
          <InputText
            v-model="slotProps.filterModel.value"
            placeholder="{{ `Search ${column.header}...` }}"
            @input="() => applyColumnFilter(column.field, slotProps.filterModel.value)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  rows: {
    type: Number,
    default: 10
  }
});

// Data for the table
const data = ref([...props.items]);
const originalData = ref([...props.items]);

// Filtering
const globalFilter = ref('');
const filters = ref({});

globalFilter.value = '';

// Sorting
const sortField = ref('');
const sortOrder = ref(1);

// Apply global filter
function applyFilter() {
  let filteredData = [...originalData.value];

  // Apply global filter
  if (globalFilter.value) {
    const filterValue = globalFilter.value.toLowerCase();
    filteredData = filteredData.filter(item => {
      return Object.values(item).some(value => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(filterValue);
      });
    });
  }

  // Apply column filters
  Object.keys(filters.value).forEach(field => {
    const filterValue = filters.value[field]?.value?.toLowerCase();
    if (filterValue) {
      filteredData = filteredData.filter(item => {
        const value = item[field];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(filterValue);
      });
    }
  });

  // Apply sorting
  if (sortField.value) {
    filteredData.sort((a, b) => {
      let value1 = a[sortField.value];
      let value2 = b[sortField.value];

      // Handle null/undefined values
      if (value1 === null || value1 === undefined) return -1;
      if (value2 === null || value2 === undefined) return 1;

      // Convert to strings for comparison
      if (typeof value1 !== 'string') value1 = String(value1);
      if (typeof value2 !== 'string') value2 = String(value2);

      return value1.localeCompare(value2) * sortOrder.value;
    });
  }

  data.value = filteredData;
}

// Apply column filter
function applyColumnFilter(field, value) {
  if (!filters.value[field]) {
    filters.value[field] = {};
  }
  filters.value[field].value = value;
  applyFilter();
}

// Handle sort change
function onSortChange(event) {
  sortField.value = event.sortField;
  sortOrder.value = event.sortOrder;
  applyFilter();
}

// Watch for changes in original items
watch(
  () => props.items,
  (newItems) => {
    originalData.value = [...newItems];
    applyFilter();
  },
  { deep: true }
);

// Initial filter application
applyFilter();
</script>

<style scoped>
.data-table-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-bar {
  margin-bottom: 1rem;
}
</style>