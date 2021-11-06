import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api_endpoint: "https://alpha-vantage.p.rapidapi.com", // Alpha Vantage API endpoint.
    isAdmin: true, // Control that user is admin.
    matchedCompanies: [], // Array of matched companies coming from API.
    companyData: null, // Searching company's data,
    // Time series functions for API.
    api_functions: {
      daily: { function: "TIME_SERIES_DAILY", series: "Time Series (Daily)" },
      weekly: { function: "TIME_SERIES_WEEKLY", series: "Weekly Time Series" },
      monthly: {
        function: "TIME_SERIES_MONTHLY",
        series: "Monthly Time Series",
      },
    },
    // Show or hide dialog.
    isWarningDialogOpen: true,
  },
  getters: {
    // Returns isAdmin.
    getIsAdmin(state) {
      return state.isAdmin;
    },
    // Returns mateched companies' data.
    getMatchedCompaniesData(state) {
      return state.companyData;
    },
    // Returns searching company's data.
    getCompanyData(state) {
      return state.companyData;
    },
    // Returns api functions.
    getApiFunctions(state) {
      return state.api_functions;
    },
  },
  mutations: {
    // Change state of isAdmin.
    changeStateOfAdmin(state) {
      state.isAdmin = !state.isAdmin;
    },
    // Set matched companyies' data to matchedCompanies in state.
    setMatchedCompanies(state, companiesData) {
      state.matchedCompanies = [...companiesData];
    },
    // Remove all matched companies from array.
    deleteMatchedCompanies(state) {
      state.matchedCompanies = [];
    },
    // Remove selected company's stock details.
    deleteCompanyData(state) {
      state.companyData = null;
    },
    /**
     * Set companyStockDetails to companyData in state.
     * @param{Object} companyStockDetails - It has companyStockDetail and metaData attributes.
     */
    setCompanyStockDetails(state, companyStockDetails) {
      state.companyData = null;
      state.companyData = companyStockDetails;
    },
    // Change isWarningDialogOpen state.
    changeWarningDialogState(state) {
      state.isWarningDialogOpen = false;
    },
  },
  actions: {
    /**
     * Search companies using api.
     * @param {Object} data - It has keywords attribute to send API.
     */
    searchCompany(context, data) {
      axios
        .get(`${context.state.api_endpoint}/query`, {
          params: {
            keywords: data.keywords,
            function: "SYMBOL_SEARCH",
            datatype: "json",
          },
          headers: {
            "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
            "x-rapidapi-key":
              "09bbce69f1msh35d8a59adc05c29p1e0ca3jsn163d8c7f8e92",
          },
        })
        .then((response) => {
          context.commit("setMatchedCompanies", response.data.bestMatches);
        });
    },
    /**
     * Get company's stock details using company's symbol.
     * @param {Object} data - Has symbol and function attributes.
     * symbol attribute is company's symbol.
     * function attribute is about detail and it can be TIME_SERIES_DAILY,
     * TIME_SERIES_WEEKLY and TIME_SERIES_MONTHLY.
     */
    getCompanyDailyDetails(context, data) {
      axios
        .get(`${context.state.api_endpoint}/query`, {
          params: {
            symbol: data.symbol,
            function: data.function,
            outputsize: "compact",
            datatype: "json",
          },
          headers: {
            "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
            "x-rapidapi-key":
              "09bbce69f1msh35d8a59adc05c29p1e0ca3jsn163d8c7f8e92",
          },
        })
        .then((response) => {
          let series = "";
          switch (data.function) {
            case context.state.api_functions.daily.function:
              series = context.state.api_functions.daily.series;
              break;
            case context.state.api_functions.weekly.function:
              series = context.state.api_functions.weekly.series;
              break;
            case context.state.api_functions.monthly.function:
              series = context.state.api_functions.monthly.series;
              break;
          }
          const dates = Object.keys(response.data[series]).map((key) => key);

          let companyStockDetails = [];
          dates.map((item) => {
            let detail = {
              timestamp: item,
              open: response.data[series][item]["1. open"],
              high: response.data[series][item]["2. high"],
              low: response.data[series][item]["3. low"],
              close: response.data[series][item]["4. close"],
              volume: response.data[series][item]["5. volume"],
            };
            companyStockDetails.push(detail);
          });
          context.commit("setCompanyStockDetails", {
            companyStockDetails,
            metaData: response.data["Meta Data"],
          });
        });
    },
  },
});
