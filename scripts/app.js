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
  async mounted() {
    await this.fetchData();
    if (this.urlParams.id && this.data.find((e) => e.id == this.urlParams.id)) {
      this.manageInventory(this.urlParams.id);
    }
  },
  computed: {
    selectedCard() {
      return this.data?.find((e) => e.id == this.urlParams.id);
    },
    isSelectedCardCanceled() {
      return this.canceled.find((e) => e.id == this.urlParams.id) !== undefined;
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
    manageInventory(id) {
      const canceledCard = this.canceled.find((e) => e.id == id);
      if (canceledCard) return;
      let card = this.inventory.find((e) => e.id == id);
      if (!card) {
        this.inventory.push(this.data.find((e) => e.id == id));
        this.inventory = this.inventory.sort((a, b) => a.id - b.id);
        card = this.inventory.find((e) => e.id == id);
      }
      for (const canceledId of card.canceled) {
        this.canceled.push(this.data.find((e) => e.id == canceledId));
        const el = this.inventory?.find((e) => e.id == canceledId);
        if (el) {
          const i = this.inventory.indexOf(el);
          this.inventory.splice(i, 1);
        }
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
