import { createApp } from "vue";

const params = new URLSearchParams(window.location.search);

createApp({
  data() {
    return {
      data: null,
      inventory: [],
      canceled: [],
      urlParams: {
        id: params.get("id"),
      },
      showInventory: false,
      search: "",
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
      this.data = (await res.json()).sort((a, b) => a.id - b.id);
      this.load();
    },
    load() {
      const storedInventory = localStorage.getItem("inventory");
      if (storedInventory) {
        this.inventory = JSON.parse(storedInventory);
      } else {
        this.inventory.push(this.data[0]);
      }
      const storedCanceled = localStorage.getItem("canceled");
      if (storedCanceled) {
        this.canceled = JSON.parse(storedCanceled);
      }
    },
  },
  watch: {
    inventory: {
      handler(n, o) {
        localStorage.setItem("inventory", JSON.stringify(n));
      },
      deep: true,
    },
    canceled: {
      handler(n, o) {
        localStorage.setItem("canceled", JSON.stringify(n));
      },
      deep: true,
    },
  },
}).mount("#app");
