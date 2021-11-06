<template>
  <div>
    <div v-if="authorized">
      <!-- No log Container -->
      <div v-if="items.length === 0" class="no-log-container">
        <p>There is no any log</p>
      </div>
      <!-- Remove Button -->
      <v-btn v-if="items.length > 0" @click="removeAllLogs">Remove All Logs</v-btn>
      <!-- Logs Treeview -->
      <v-treeview :items="items" v-if="authorized">
        <template #label="data" style="">
          <div
            :style="{
              color: data.item.authorized ? 'black' : 'red',
              'font-weight': data.item.authorized ? 'normal' : 'bold',
            }"
          >
            {{ data.item.name }}
          </div>
        </template>
      </v-treeview>
    </div>
    <div v-else class="not-admin">You are not authorized to view this page</div>
    <!-- Snackbar -->
    <v-snackbar v-model="showAlert" :color="authorized ? 'white' : 'red'"
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
    items: [], // Logs array coming from localstorage.
    showAlert: false, // Show or hide alert.
    authorized: true, // Control that user is admin.
  }),
  created() {
    // Get logs from localstorage.
    const logs = JSON.parse(localStorage.getItem("routingHistory"));

    if (logs) {
      this.items = [
        ...logs.map((item, index) => ({
          id: index,
          name: `${new Date(item.date).toLocaleString()} ${
            !item.authorized ? " - Failed" : ""
          }`,
          authorized: item.authorized,
          children: [
            { name: `From: ${item.from}`, authorized: item.authorized },
            { name: `To: ${item.to}`, authorized: item.authorized },
          ],
        })),
      ];
    }
  },
  mounted() {
    if (!this.$store.getters.getIsAdmin) {
      this.showAlert = true;
      this.authorized = false;
    }
  },
  methods: {
    // Remove all logs in localstorage.
    removeAllLogs() {
      localStorage.removeItem("routingHistory");
      this.items = [];
    },
  },
  watch: {
    "$store.getters.getIsAdmin"(val) {
      this.showAlert = !val;
      this.authorized = val;
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
