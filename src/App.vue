<template>
  <div>
    <v-app>
      <main-header />
      <v-container>
        <search />

        <router-view />
      </v-container>
    </v-app>
  </div>
</template>

<script>
import MainHeader from "./components/MainHeader.vue";
import Search from "./views/Search.vue";

export default {
  components: {
    MainHeader,
    Search,
  },
};
</script>
MainHeader

<style lang="scss"></style>
