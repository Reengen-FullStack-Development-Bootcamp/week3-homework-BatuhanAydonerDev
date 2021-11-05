<template>
  <div>
    <div v-if="isAdmin">
      <div v-if="items.length === 0" class="no-log-container">
        <p>There is no any log</p>
      </div>
      <v-btn v-if="items.length > 0" @click="removeAllLogs">Remove All Logs</v-btn>
      <!-- Logs Treeview -->
      <v-treeview :items="items" v-if="isAdmin">
        <template #label="data" style="">
          <div
            :style="{
              color: data.item.isAdmin ? 'black' : 'red',
              'font-weight': data.item.isAdmin ? 'normal' : 'bold',
            }"
          >
            {{ data.item.name }}
          </div>
        </template>
      </v-treeview>
    </div>
    <div v-else class="not-admin">You are not authorized to view this page</div>
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
      this.items = [
        ...routingHistory.map((item, index) => ({
          id: index,
          name: `${new Date(item.date).toLocaleString()} ${
            !item.isAdmin ? " - Failed" : ""
          }`,
          isAdmin: item.isAdmin,
          children: [
            { name: `From: ${item.from}`, isAdmin: item.isAdmin },
            { name: `To: ${item.to}`, isAdmin: item.isAdmin },
          ],
        })),
      ];
      console.log(this.items);
    }
  },
  mounted() {
    if (!this.$store.getters.getIsAdmin) {
      this.showAlert = true;
      this.isAdmin = false;
    }
  },
  methods: {
    removeAllLogs() {
      localStorage.removeItem("routingHistory");
      this.items = [];
    },
  },
  watch: {
    "$store.getters.getIsAdmin"(val) {
      this.showAlert = !val;
      this.isAdmin = val;
    },
  },
};
</script>

<style lang="scss" scoped>
.no-log-container {
  width: 100%;
  height: 100vh;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

.not-admin {
  width: 100%;
  height: 100vh;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
