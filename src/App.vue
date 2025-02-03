<template>
  <RouterView />
</template>

<script>

import { RouterLink, RouterView } from 'vue-router';
import Login from './components/Login.vue';
import Dashboard from './components/dashboard/Dashboard.vue';
import Item from './components/dashboard/Item.vue';


export default {
  components: {
    Login,
    Dashboard,
    Item
  },
}

</script>
<style>
@import 'font-awesome/css/font-awesome.min.css';
</style>