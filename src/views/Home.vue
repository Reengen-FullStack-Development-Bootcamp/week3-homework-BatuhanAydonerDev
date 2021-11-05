<template>
  <div>
    <search />
    <router-view></router-view>
    <v-dialog v-model="warningDialog" width="500">
      <v-card>
        <v-card-title class="text-h5 grey lighten-2"> Warning </v-card-title>

        <v-card-text>
          Do not send too request to API. Because, we have exceeded the rate limit per
          minute for our plan, BASIC, by the API provider. Have fun.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="closeDialog"> I accept </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Search from "../components/Search.vue";
export default {
  components: {
    Search,
  },
  data() {
    return {
      warningDialog: true,
    };
  },
  created() {
    this.warningDialog = this.$store.state.isWarningDialogOpen;
  },
  methods: {
    closeDialog() {
      this.warningDialog = false;
      this.$store.commit("changeWarningDialogState");
    },
  },
};
</script>
