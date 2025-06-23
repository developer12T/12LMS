<template>
    <Header></Header>
    <SidebarOnline></SidebarOnline>
    <routerView />
</template>

<script>
import { useAuthStore } from '../../stores';
// import { useRouter } from 'vue-router'
import router from "../../router";
import Header from '../../components/headerPOco.vue';
import SidebarOnline from './sidebar.vue';
import {computed, onMounted} from "vue";

export default {
  components: {
    Header,
    SidebarOnline,
  },
  setup() {
    const authStore = useAuthStore();

    const resStatus = computed(() => {
      return authStore.statusToken;
    });
    onMounted(() => {
      authStore.Authen();
    });

    console.log('statusToken :' + resStatus.value)
    // if (resStatus.value === 200) {
    //
    // }else {
    //   router.push('/');
    // }


    // const authStore = useAuthStore();
    // const router = useRouter()
    // const login = (username, password) => {
    //   authStore.login(username, password);
    // };
    // const logout = () => {
    //   authStore.logout();
    //   router.push('/');
    // };
    // return {
    //   login,
    //   logout,
    // };
  },
};
</script>
