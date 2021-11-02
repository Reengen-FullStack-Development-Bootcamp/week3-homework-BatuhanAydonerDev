<template>
  <div>
    <search-input />
  </div>
</template>

<script>
import SearchInput from "./components/SearchInput.vue";

export default {
  components: {
    SearchInput,
  },
  created() {
    this.$store.dispatch("searchCompany", { keywords: "Microsoft" });
  },
  computed: {
    matchedCompanies() {
      return [];
    },
  },
};
</script>

<style lang="scss"></style>
