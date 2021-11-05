<template>
  <div>
    <v-select
      :items="stockTimes"
      v-model="selectedStockTime"
      label="Time"
      item-text="state"
      item-value="abbr"
      outlined
    ></v-select>
    <candlestick-chart :stockDetails="stockDetails"></candlestick-chart>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
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
      companySymbol: null,
      stockTimes: [
        { state: "Daily Details", abbr: this.getApiFunctions().daily.function },
        { state: "Weekly Details", abbr: this.getApiFunctions().weekly.function },
        { state: "Monthly Details", abbr: this.getApiFunctions().monthly.function },
      ],
      selectedStockTime: null,
    };
  },
  created() {
    const symbol = this.$route.params.symbol;
    this.companySymbol = symbol;
    this.getCompanyDailyDetails({
      symbol: symbol,
      function: this.getApiFunctions().daily.function,
    });
  },
  methods: {
    ...mapActions(["getCompanyDailyDetails"]),
    ...mapGetters(["getApiFunctions"]),
    ...mapMutations(["deleteMatchedCompanies", "deleteCompanyData"]),
  },
  watch: {
    "$store.state.companyData": function (val) {
      this.stockDetails = [...val];
    },
    selectedStockTime(val) {
      this.stockDetails = [];
      this.getCompanyDailyDetails({
        symbol: this.companySymbol,
        function: val,
      });
    },
  },
};
</script>
