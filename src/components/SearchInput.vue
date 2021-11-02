<template>
  <v-autocomplete
    v-model="selectedCompany"
    :items="items"
    dense
    filled
    label="Filled"
  ></v-autocomplete>
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
  created() {
    console.log(this.items);
  },
  data() {
    return {
      selectedCompany: null, // Selected company from items.
    };
  },
  watch: {
    // Emit to parent selected company's symbol.
    selectedCompany(val) {
      console.log(val);
    },
  },
};
</script>
