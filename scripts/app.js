import { createApp } from "vue";

const params = new URLSearchParams(window.location.search);

createApp({
  data() {
    return {
      data: null,
      inventory: [],
      progress: 0,
      urlParams: {
        id: params.get("id"),
      },
      showInventory: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    selectedCard() {
      return this.data?.find((e) => e.id == this.urlParams.id);
    },
  },
  methods: {
    async fetchData() {
      const res = await fetch("./data.json");
      this.data = await res.json();
    },
  },
}).mount("#app");
