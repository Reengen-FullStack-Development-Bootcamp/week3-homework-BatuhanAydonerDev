<template>
  <v-row>
    <v-col sm="12" md="12" lg="8">
      <div class="chart-container">
        <v-select
          :items="stockTimes"
          v-model="selectedStockTime"
          label="Time Series"
          item-text="state"
          item-value="abbr"
          outlined
        ></v-select>
        <candlestick-chart :stockDetails="stockDetails"></candlestick-chart>
      </div>
    </v-col>
    <v-col sm="12" md="12" lg="4">
      <v-card v-if="companyMetaData">
        <div class="meta-data">
          <h4>Information</h4>
          <p>{{ companyMetaData["1. Information"] }}</p>
          <h4>Symbol</h4>
          <p>{{ companyMetaData["2. Symbol"] }}</p>
          <h4>Last Freshed</h4>
          <p>{{ companyMetaData["3. Last Freshed"] }}</p>
          <h4>Time Zone</h4>
          <p>{{ companyMetaData["5. Time Zone"] }}</p>
        </div>
      </v-card>
    </v-col>
  </v-row>
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
      companyMetaData: null,
      companySymbol: null,
      stockTimes: [
        { state: "Daily Details", abbr: this.getApiFunctions().daily.function },
        { state: "Weekly Details", abbr: this.getApiFunctions().weekly.function },
        { state: "Monthly Details", abbr: this.getApiFunctions().monthly.function },
      ],
      selectedStockTime: this.getApiFunctions().daily.function,
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
      this.stockDetails = [...val.companyStockDetails];
      this.companyMetaData = val.metaData;
      console.log(this.companyMetaData);
    },
    selectedStockTime(val) {
      this.stockDetails = [];
      this.companyMetaData = null;
      this.getCompanyDailyDetails({
        symbol: this.companySymbol,
        function: val,
      });
    },
    $route(val) {
      this.selectedStockTime = this.getApiFunctions().daily.function;
      this.getCompanyDailyDetails({
        symbol: val.params.symbol,
        function: this.getApiFunctions().daily.function,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  width: 100%;
  text-align: center;
}

.meta-data {
  padding: 1rem;
}
</style>
