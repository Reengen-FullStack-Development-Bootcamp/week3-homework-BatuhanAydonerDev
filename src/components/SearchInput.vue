<template>
  <v-autocomplete
    v-model="selectedItem"
    :search-input.sync="keywords"
    :items="items"
    item-text="2. name"
    item-value="2. name"
    hide-no-data
    hide-selected
    dense
    outlined
    label="Companies"
    placeholder="Search a company"
    return-object
  >
    <template v-slot:item="data">
      <template>
        <v-list-item-content class="item">
          <!-- Title -->
          <v-list-item-title v-html="data.item['2. name']"></v-list-item-title>
          <!-- Subtitle -->
          <v-list-item-subtitle v-html="data.item['1. symbol']"></v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
export default {
  props: {
    // Data to use in input.
    items: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      selectedItem: null, // Selected item from items.
      keywords: null, // Searching keywords.
    };
  },
  watch: {
    // Emit selected item to parent.
    selectedItem(val) {
      this.$emit("selected-item", val);
    },
    /**
     * Emit keywords.
     */
    keywords(val) {
      this.$emit("keywords", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  width: 100% !important;
  display: flex !important;
  justify-content: space-between !important;
}
</style>
