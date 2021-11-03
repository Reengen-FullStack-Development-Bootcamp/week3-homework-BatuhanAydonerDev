import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    api_endpoint: "https://alpha-vantage.p.rapidapi.com", // Alpha Vantage API endpoint.
    isAdmin: false, // Control that user is admin.
    matchedCompanies: [], // Array of matched companies coming from API.
    companyData: null, // Searching company's data,
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
  },
  actions: {
    // Search companies using api.
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
  },
});
