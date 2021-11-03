<template>
  <div>Company</div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Company",
  props: {
    company: {
      type: Object,
    },
  },
  created() {
    const symbol = this.$route.params.symbol;
    this.$store.dispatch("getCompanyDailyDetails", { symbol: symbol });
  },
};
</script>
