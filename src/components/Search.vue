<template>
  <div class="relative">
    <div
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
    >
      <Icon icon="line-md:search" height="16" width="16" />
    </div>
    <input
        type="text"
        id="table-search"
        v-model="searchInput"
        @input="handleSearch"
        class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="ค้นหา . . . "
    />
  </div>
</template>

<script>
import { Icon } from '@iconify/vue';
export default {
  components:{
    Icon
  },
  props: {
    searchBar: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      searchInput: this.searchBar,
    };
  },
  methods: {
    handleSearch() {
      this.$emit("search", this.searchInput);
    },

  },
};
</script>
