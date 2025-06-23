<template>
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th class="bg-gray-50 px-6 py-3 top-0 sticky">
          <input type="checkbox" :checked="selectAll" @change="setSelectAll($event.target.checked)"
            class=" w-4 h-4 text-blue-600 bg-gray-50 top-0 sticky border-gray-300 rounded" />
        </th>
        <th v-for="col in columns" :key="col.id" scope="col" class="bg-gray-50 top-0 sticky px-6 py-3 text-center">
          {{ col.title }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in data" :key="row"
        class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td class="px-6 py-5">
          <input type="checkbox" v-model="selected" :value="row.id"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
        </td>
        <td v-for="col in columns" :key="col.id" class="px-1 py-1">
          <div class="text-center">
            <slot :name="col.id" :row="row">{{ row[col.id] }}</slot>
          </div>
        </td>
      </tr>
    </tbody>
</template>

<script>
import { useUtilityStore } from "../stores";
import { computed, watch } from "vue";
export default {
  props: {
    columns: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    selected: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    // checkbox start
    const checkboxStore = useUtilityStore();
    const selected = computed({
      get: () => checkboxStore.selectedCheckboxes,
      set: (value) => checkboxStore.updateSelectedCheckboxes(value),
    });

    const selectAll = computed(() => {
      return props.data
        ? selected.length === props.data.length
        : false;
    });

    const setSelectAll = (value) => {
      const selectedId = value ? props.data.map(item => item.id) : [];
      selected.value = selectedId;
    };

    watch(selected, (newValue) => {
      emit("update:selected", newValue);
    });
    // checkbox end

    return {
      selected,
      selectAll,
      setSelectAll,
    }
  },
};
</script>
