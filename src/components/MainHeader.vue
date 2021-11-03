<template>
  <div>
    <v-app-bar elevation="4" dense dark class="main-header">
      <v-toolbar-title>stocker.com</v-toolbar-title>
      <v-spacer></v-spacer>
      <div>
        <v-switch v-model="isAdmin" hide-details="" label="Admin"></v-switch>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isAdmin: this.$store.getters["getIsAdmin"],
    };
  },
  watch: {
    // Change isAdmin in store when this.isAdmin is changed.
    isAdmin() {
      this.$store.commit["changeStateOfAdmin"];
    },
  },
};
</script>

<style lang="scss" scoped>
.main-header {
  width: 100% !important;
  align-items: center !important;
}
</style>
