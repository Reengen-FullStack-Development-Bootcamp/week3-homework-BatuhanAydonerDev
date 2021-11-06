<template>
  <!-- Row -->
  <v-row>
    <!-- Col -->
    <v-col sm="12" md="12" lg="8">
      <!-- Chart Container -->
      <div class="chart-container">
        <!-- Company Select -->
        <v-select
          :items="stockTimes"
          v-model="selectedStockTime"
          label="Time Series"
          item-text="state"
          item-value="abbr"
          outlined
        ></v-select>
        <!-- Candlestick Chart -->
        <candlestick-chart :stockDetails="stockDetails"></candlestick-chart>
      </div>
    </v-col>
    <!-- Col -->
    <v-col sm="12" md="12" lg="4">
      <!-- Company Detail Card -->
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
    // Compant details
    company: {
      type: Object,
    },
  },
  data() {
    return {
      stockDetails: [], // Stock details coming from API.
      companyMetaData: null, // Company details coming from API.
      companySymbol: null, // Company symbol at URL params.
      // Stock time selections for select input.
      stockTimes: [
        { state: "Daily Details", abbr: this.getApiFunctions().daily.function },
        { state: "Weekly Details", abbr: this.getApiFunctions().weekly.function },
        { state: "Monthly Details", abbr: this.getApiFunctions().monthly.function },
      ],
      selectedStockTime: this.getApiFunctions().daily.function, // Selected stock time.
    };
  },
  created() {
    // Company symbol value at URL params.
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
    /**
     * Watch companyData in store to show in select input and
     * get company meta data.
     */
    "$store.state.companyData": function (val) {
      this.stockDetails = [...val.companyStockDetails];
      this.companyMetaData = val.metaData;
    },
    /**
     * Watch selectedStocktime to send API to get company's stock data.
     */
    selectedStockTime(val) {
      this.stockDetails = [];
      this.companyMetaData = null;
      this.getCompanyDailyDetails({
        symbol: this.companySymbol,
        function: val,
      });
    },
    /**
     * Watch route to get company' stock details
     * using symbol  at URL.
     */
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
