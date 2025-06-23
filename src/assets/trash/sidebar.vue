<style scoped>
a:hover .icon {
  transform: scale(1.2);
  transition: transform 0.3s ease;
}

a:hover .icon-right {
  transform: translateX(10px);
  transition: transform 0.3s ease;
}

button:hover .icon {
}

.icon-right {
  transition: transform 0.3s ease;
}

.rotate-icon {
  transition: transform 0.3s ease;
}

.rotate-icon.rotate  {
  transform: rotate(90deg);
}

</style>
<template>
  <aside id="default-sidebar"
         aria-label="Sidebar"
         class="fixed top-0 left-0 z-40 w-20 h-screen transition-transform -translate-x-full sm:translate-x-0">
    <div class="h-full px-3 py-3 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <ul class="space-y-2 font-medium">
        <li>
          <div class="text-center align-middle">
            <button
                aria-controls="drawer-navigation"
                class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                data-drawer-show="drawer-navigation" data-drawer-target="drawer-navigation"
                type="button">
              <Icon height="24" icon="bi:list" width="24"/>
            </button>
          </div>
        </li>
        <li class="mt-2">
          <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'dashboard',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'dashboard',
              }"
                       aria-current="page"
                       to="/manageDrug/dashboard"
                       @click="handlePage('dashboard')"
          >
            <Icon class="icon" height="24" icon="tabler:home" width="24"/>
            <span style="font-size: 10px">หน้าหลัก</span></router-link>
        </li>

        <!--   test     -->
        <li>
          <a
              @click="rotate(activesIcon)"
              :class="{
                'flex flex-col items-center cursor-pointer w-full p-2 text-base text-blue-700 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700':
                  pageName === 'addDrug' || pageName === 'manageDrug',
                'flex flex-col  items-center w-full p-2 cursor-pointer text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700':
                  pageName !== 'addDrug' && pageName !== 'manageDrug',
              }"
              aria-controls="dropdownStock"
              data-collapse-toggle="dropdownStock"
              type="button"
          >
            <Icon class="icon" height="24" icon="fluent-mdl2:product-variant" width="24"/>
            <span class="flex-1 text-xs text-center whitespace-nowrap">คลังยา</span>
            <Icon  height="16" icon="mingcute:down-fill" :class="{
              'rotate-0':activesIcon === 'down',
              'rotate-180':activesIcon === 'up'
            }" width="16"/>
<!--            <Icon height="16" icon="mingcute:down-fill" width="16"/>-->
          </a>
          <ul id="dropdownStock"
              class="py-2 space-y-2">
            <li>
              <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'manageDrug',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'manageDrug',
              }"
                           aria-current="page"
                           to="/manageDrug/manageDrug"
                           @click="handlePage('manageDrug')"
              >
                <Icon class="icon" height="24" icon="mdi:drugs" width="24"/>
                <span style="font-size: 10px">จัดการยา</span></router-link>
            </li>
            <li class="border-b-2">
              <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'addDrug',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'addDrug',
              }"
                           aria-current="page"
                           to="/manageDrug/addDrug"
                           @click="handlePage('addDrug')"
              >
                <Icon class="icon" height="24" icon="gridicons:add-outline" width="24"/>
                <span style="font-size: 10px">เพิ่มยา</span></router-link>
            </li>
          </ul>

          <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'pickupDrug',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'pickupDrug',
              }"
                       aria-current="page"
                       to="/manageDrug/pickupDrug"
                       @click="handlePage('pickupDrug')"
          >
            <Icon class="icon" height="24" icon="icon-park-outline:transaction-order" width="24"/>
            <span style="font-size: 10px">เบิกยา</span></router-link>
          <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'recieptDrug',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'recieptDrug',
              }"
                       aria-current="page"
                       to="/manageDrug/recieptDrug"
                       @click="handlePage('recieptDrug')"
          >
            <Icon class="icon" height="24" icon="fluent:receipt-add-20-regular" width="24"/>
            <span style="font-size: 10px">รับยา</span></router-link>
          <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'hisReq',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'hisReq',
              }"
                       aria-current="page"
                       to="/manageDrug/hisReq"
                       @click="handlePage('hisReq')"
          >
            <Icon class="icon" height="24" icon="material-symbols:history-edu" width="24"/>
            <span style="font-size: 10px">ประวัติ</span></router-link>

          <router-link :class="{
                'flex justify-center rounded-lg flex-col items-center p-2 active:text-blue-500 group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'exportdrughistory',
                'flex items-center p-2 flex-col justify-center active:text-blue-500 rounded-lg group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'exportdrughistory',
              }"
                       aria-current="page"
                       to="/manageDrug/exportdrughistory"
                       @click="handlePage('exportdrughistory')"
          >
            <Icon class="icon" height="24" icon="ph:file-pdf-duotone" width="24"/>
            <span style="font-size: 10px">ประวัติยา</span></router-link>
        </li>
      </ul>
    </div>
  </aside>

  <!--  full sidebar-->
  <div id="drawer-navigation"
       aria-labelledby="drawer-navigation-label"
       class="fixed top-0 left-0 pt-2 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform -translate-x-full bg-white dark:bg-gray-800"
       tabindex="-1">
    <div class="flex flex-row pt-0">
      <button aria-controls="drawer-navigation"
              class="text-gray-400 bg-transparent pr-4 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-drawer-hide="drawer-navigation"
              type="button">
        <Icon height="24" icon="bi:list" width="24"/>
      </button>
      <a class="flex items-center" >
        <span
            class="self-center mr-3 text-m font-medium whitespace-nowrap dark:text-white"
        >ระบบจัดการคลังยา</span
        >
      </a>
    </div>
    <div class="py-4 overflow-y-auto flex flex-col ">
      <ul class="space-y-2 font-medium">
        <li>
          <router-link   :class="{
                'flex items-center p-2  group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'dashboard',
                'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'dashboard',
              }"
                       aria-current="page"
                       to="/manageDrug/dashboard"
                       @click="handlePage('dashboard')"
          >
            <Icon class="icon-right" height="24" icon="tabler:home" width="24"/>
            <span class="ml-3 icon-right">หน้าหลัก</span></router-link>
        </li>
        <!--        test -->
        <li>
          <a
              :class="{
                'flex cursor-pointer items-center w-full p-2  text-base text-blue-600 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700':
                  pageName === 'addDrug' || pageName === 'manageDrug',
                'flex cursor-pointer items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700':
                  pageName !== 'addDrug' && pageName !== 'manageDrug',
              }"
            @click="rotate(activesIcon)"
              aria-controls="dropdownStock2"
              data-collapse-toggle="dropdownStock2"
              type="button"
          >
            <Icon class="icon-right" height="24" icon="fluent-mdl2:product-variant" width="24"/>
            <span class="ml-3  icon-right">คลังยา</span>
            <Icon  height="24" icon="mingcute:down-fill" :class="{
              'ml-12 ':activesIcon === 'down',
              'ml-12 rotate-90':activesIcon === 'up'
            }" width="24"/>
          </a>
          <ul id="dropdownStock2"
              class="py-2 space-y-2 hidden">
            <li>
              <router-link :class="{
                'flex items-center w-full p-2 text-blue-600 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700':
                  pageName === 'manageDrug',
                'flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700':
                  pageName !== 'manageDrug',
              }"
                           aria-current="page"
                           to="/manageDrug/manageDrug"
                           @click="handlePage('manageDrug')"
              >
                <Icon class="icon  mr-2" height="24" icon="mdi:drugs" width="24"/>
                จัดการยา
              </router-link>
            </li>
            <li>
              <router-link :class="{
                'flex items-center w-full p-2 text-blue-600 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700':
                  pageName === 'addDrug',
                'flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700':
                  pageName !== 'addDrug',
              }"
                           aria-current="page"
                           to="/manageDrug/addDrug"
                           @click="handlePage('addDrug')"
              >
                <Icon class="icon mr-2" height="24" icon="gridicons:add-outline" width="24"/>
                เพิ่มยา
              </router-link>
            </li>
          </ul>

          <router-link :class="{
                'flex items-center p-2  group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'pickupDrug',
                'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'pickupDrug',
              }"
                       aria-current="page"
                       to="/manageDrug/pickupDrug"
                       @click="handlePage('pickupDrug')"
          >
            <Icon class="icon-right" height="24" icon="icon-park-outline:transaction-order" width="24"/>
            <span class="ml-3 icon-right">เบิกยา</span></router-link>
          <router-link :class="{
                'flex items-center p-2  group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'recieptDrug',
                'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'recieptDrug',
              }"
                       aria-current="page"
                       to="/manageDrug/recieptDrug"
                       @click="handlePage('recieptDrug')"
          >
            <Icon class="icon-right" height="24" icon="fluent:receipt-add-20-regular" width="24"/>
            <span class="ml-3 icon-right">รับยา</span></router-link>
          <router-link :class="{
                'flex items-center p-2  group text-blue-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName === 'hisReq',
                'flex items-center p-2  group text-gray-800-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 w-100':
                  pageName !== 'hisReq',
              }"
                       aria-current="page"
                       to="/manageDrug/hisReq"
                       @click="handlePage('hisReq')"
          >
            <Icon class="icon-right" height="24" icon="material-symbols:history-edu" width="24"/>
            <span class="ml-3 icon-right">ประวัติการเบิก-รับยา</span></router-link>

        </li>

      </ul>
    </div>
  </div>
</template>

<script>
import {onMounted, ref,computed} from "vue";
import {initCollapses, initDrawers} from "flowbite";
import {Icon} from '@iconify/vue';
import {usePageStore} from '../../stores'

export default {
  components: {
    Icon
  },
  setup() {
    const pageStore = usePageStore();
    const pageName = ref("dashboard");

    const activesIcon = ref('up')

    // const pageName2 = JSON.parse(localStorage.getItem("pocoPage"))

    onMounted(() => {
      initCollapses();
      initDrawers();
    });

   const pageName2 = localStorage.getItem("pocoPage" || '')
    if(pageName2 === null){

    }else{
      pageName.value = pageName2
    }
    const handlePage = async (pageNames) => {
      pageName.value = pageNames;
      pageStore.setPage(pageNames);
      // console.log('store page : '+pageStore.currentPage)
      // console.log("tabs value after click:", pageName.value);
    };

    const rotate = (act) => {
      if(act === 'down'){
        activesIcon.value = 'up'
      }else if(act === 'up'){
        activesIcon.value = 'down'
      }
    }


    return {
      activesIcon,
      pageName,
      handlePage,
      rotate
    }
  },
};
</script>
