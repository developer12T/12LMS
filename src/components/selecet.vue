<template>
  <!--  <select id="underline_select" v-model="searchInput" @change="handleSearch"-->

  <select class="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer">
    <option selected>เลือกผู้จ่าย</option>
    <option value="US">นางสาว เทส ระบบ</option>
    <option value="CA">นางสาว เทส ระบบ</option>
    <option value="FR">นางสาว เทส ระบบ</option>
    <option value="DE">นางสาว เทส ระบบ</option>
  </select>

</template>

<script>
export default {
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
