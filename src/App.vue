<template>
  <div>
    <v-app>
      <main-header />
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-app>
  </div>
</template>

<script>
import MainHeader from "./components/MainHeader.vue";

export default {
  components: {
    MainHeader,
  },
};
</script>
MainHeader

<style lang="scss"></style>
