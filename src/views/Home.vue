<template>
  <div>
    <search />
    <router-view></router-view>
  </div>
</template>

<script>
import Search from "../components/Search.vue";
export default {
  components: {
    Search,
  },
};
</script>
