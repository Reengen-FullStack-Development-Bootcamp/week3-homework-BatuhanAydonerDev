<template>
  <div>
    <v-treeview :items="items" open-all item-text="to" v-if="isAdmin"></v-treeview>
    <v-snackbar v-model="showAlert" :color="isAdmin ? 'white' : 'red'"
      >You cannot see logs because you are not an admin.
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="showAlert = false">
          Close
        </v-btn>
      </template></v-snackbar
    >
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [],
    showAlert: false,
    isAdmin: true,
  }),
  created() {
    const routingHistory = JSON.parse(localStorage.getItem("routingHistory"));
    console.log(routingHistory);
    if (routingHistory) {
      this.items = [...routingHistory];
    }
  },
  mounted() {
    console.log(this.$store.getters.getIsAdmin);
    if (!this.$store.getters.getIsAdmin) {
      this.showAlert = true;
      this.isAdmin = false;
    }
  },
  watch: {
    "$store.getters.getIsAdmin"(val) {
      this.showAlert = !val;
      this.isAdmin = val;
    },
  },
};
</script>
