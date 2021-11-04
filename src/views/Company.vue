<template>
  <div>
    <candlestick-chart :stockDetails="stockDetails"></candlestick-chart>
  </div>
</template>

<script>
import CandlestickChart from "../components/CandlestickChart.vue";
export default {
  name: "Company",
  components: {
    CandlestickChart,
  },
  props: {
    company: {
      type: Object,
    },
  },
  data() {
    return {
      stockDetails: [],
    };
  },
  mounted() {
    const symbol = this.$route.params.symbol;
    this.$store.dispatch("getCompanyDailyDetails", { symbol: symbol });
  },
  watch: {
    "$store.state.companyData": function (val) {
      this.stockDetails = [...val];
    },
  },
};
</script>
