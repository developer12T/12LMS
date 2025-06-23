<template>

    <thead
      class="text-xs text-gray-700 uppercase bg-gray-50"
    >
      <tr>
        <th
          v-for="col in columns"
          :key="col.id"
          scope="col"
          class="sticky top-0 px-6 cursor-default py-3 bg-gray-50 text-center"
          style="z-index: 10;"
        >
          {{ col.title }}
        </th>
      </tr>
    </thead>
    <tbody >
      <tr v-if="data === null || data === undefined || data.length === 0"
        class="bg-white cursor-default border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <td  class="px-6 py-4 text-center " colspan="8">
          ไม่พบข้อมูล
        </td>
      </tr>
      <tr v-else
          v-for="row in data"
          :key="row"
          class="bg-white cursor-default border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
      >
        <td v-for="col in columns" :key="col.id" class="px-6 py-2">
          <!--        <td v-for="col in columns" :key="col.id" class="py-2 px-6">-->
          <div class="text-center">
            <slot :name="col.id" :row="row">{{ row[col.id] }}</slot>
          </div>
        </td>
      </tr>
    </tbody>

</template>

<script>
import {data} from "autoprefixer";

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
  },
};
</script>
