tem
<template>
  <div>
    <search-input
      :items="matchedCompanies"
      @selected-item="getSelectedCompany"
      @keywords="searchCompaniesByKeywords"
    />
  </div>
</template>

<script>
import SearchInput from "./CustomVuetify/SearchInput.vue";

export default {
  components: {
    SearchInput,
  },
  data() {
    return {
      selectedCompany: null, // Selected item from search-input emit.
      keywords: null, // Keywords from search-input emit.
    };
  },
  methods: {
    /**
     * Get selected compant from search-input emit and
     * push to Company page when selectedCompany is not null.
     *
     * @param {Object} value - Company data.
     */
    getSelectedCompany(company) {
      this.$router.push({
        name: `Company`,
        params: { symbol: company["1. symbol"], company },
      });
    },
    /**
     * Get companies from API and if keywords is not bigger than 3 characters,
     * execute deleteMatchedCompanies() in mutations to remove items.
     * @param {String} keywords - Keywords from search-input emit.
     */
    searchCompaniesByKeywords(keywords) {
      if (keywords && keywords.length >= 3 && this.selectedCompany === null) {
        // Dispatch searchCompany to get items from API using keywords.
        this.$store.dispatch("searchCompany", { keywords: keywords });
      } else {
        // In order to remove all items, commit deleteMatchedCompanies.
        this.$store.commit("deleteMatchedCompanies");
      }
    },
  },
  computed: {
    // Returns matchedCompanies from store.
    matchedCompanies() {
      return this.$store.state.matchedCompanies;
    },
  },
};
</script>

<style lang="scss"></style>
