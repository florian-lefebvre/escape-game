import { createApp } from "vue";

const params = new URLSearchParams(window.location.search);

createApp({
  data() {
    return {
      data: null,
      inventory: ["test"],
      progress: 0,
      urlParams: {
        id: params.get("id"),
      },
    };
  },
  mounted() {
    this.loadStoredData();
    this.fetchData();
  },
  methods: {
    loadStoredData() {
      const parsed = JSON.parse(localStorage.getItem("inventory"));
      if (parsed) {
        this.inventory = parsed;
      }
    },
    async fetchData() {
      const res = await fetch("../data.json");
      this.data = await res.json();
    },
  },
  watch: {
    inventory(n) {
      console.log(n);
      localStorage.setItem("inventory", JSON.stringify(n));
    },
  },
}).mount("#app");
