import { createApp } from "vue";

const params = new URLSearchParams(window.location.search);

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

const DEFAULT_TIME = 45 * 60;

createApp({
  data() {
    return {
      data: null,
      inventory: [],
      canceled: [],
      score: 100,
      initTimer: false,
      timer: DEFAULT_TIME,
      konamiTab: [],
      konami: [
        "ArrowUp",
        "ArrowUp",
        "ArrowDown",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ArrowLeft",
        "ArrowRight",
        "KeyB",
        "KeyQ",
      ],
      konamiTest: 0,
      urlParams: {
        id: params.get("id"),
        status: params.get("status"),
        check: params.get("check"),
      },
      showInventory: false,
      search: "",
      mounted: false,
    };
  },
  async mounted() {
    await this.fetchData();
    this.load();
    if (this.urlParams.id && this.data.find((e) => e.id == this.urlParams.id)) {
      this.manageInventory(this.urlParams.id);
    }
    this.decreaseScore();
    if (this.urlParams.id == 142857) {
      this.victory();
    }
    if (this.urlParams.id == 0) {
      if (!this.initTimer) {
        this.timer = DEFAULT_TIME;
      }
      this.initTimer = true;
    }
    if (this.urlParams.id == 69 && !this.urlParams.check) {
      history.back();
    }
    if (
      this.inventory.map((e) => e.id).includes(1967) &&
      this.inventory.map((e) => e.id).includes(1987) &&
      !this.inventory.map((e) => e.id).includes(11)
    ) {
      window.location.href = "/card.html?id=11";
    }
    if (this.initTimer) {
      setInterval(() => {
        this.timer--;
      }, 1000);
    }
    this.watchKonami();
    this.mounted = true;
  },
  computed: {
    selectedCard() {
      return this.data?.find((e) => e.id == this.urlParams.id);
    },
    isSelectedCardCanceled() {
      return this.canceled.find((e) => e.id == this.urlParams.id) !== undefined;
    },
    cleanTimer() {
      const time = this.timer / 60;
      const minutes = parseInt(time);
      const secondes = Math.round((time - minutes) * 60);
      return minutes + ":" + secondes;
    },
  },
  methods: {
    async fetchData() {
      const res = await fetch("./data.json");
      this.data = (await res.json()).sort((a, b) => a.id - b.id);
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
      const storedScore = localStorage.getItem("score");
      if (storedScore) {
        this.score = JSON.parse(storedScore);
      }
      const storedTimer = localStorage.getItem("timer");
      if (storedTimer) {
        this.timer = JSON.parse(storedTimer);
      }
      const storedInitTimer = localStorage.getItem("init-timer");
      if (storedInitTimer) {
        this.initTimer = JSON.parse(storedInitTimer);
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
    decreaseScore() {
      if (!this.selectedCard) {
        this.score -= 3;
      }
    },
    parseMarkdown(str) {
      const converter = new showdown.Converter();
      setTimeout(() => {
        for (const link of document.querySelectorAll(".prose a")) {
          link.target = "_blank";
        }
      }, 50);
      return converter.makeHtml(str);
    },
    reset() {
      localStorage.removeItem("inventory");
      localStorage.removeItem("canceled");
      localStorage.removeItem("score");
      localStorage.removeItem("timer");
      localStorage.removeItem("init-timer");
    },
    defeat() {
      this.reset();
      window.location.href = "/result.html?status=defeat";
    },
    victory() {
      this.reset();
      window.location.href = "/result.html?status=victory";
    },
    konamiCode(e) {
      this.konamiTab.push(e.code);
      const verif = arrayEquals(this.konami, this.konamiTab);
      if (verif) {
        window.location.href = "/card.html?id=69&check=true";
      }
    },
    watchKonami() {
      window.addEventListener("keydown", (e) => {
        if (e.code == "ArrowUp" || this.konamiTest > 0) {
          window.addEventListener("keydown", this.konamiCode(e));
          this.konamiTest++;
        }
        if (
          this.konamiTab[this.konamiTest - 1] !=
          this.konami[this.konamiTest - 1]
        ) {
          this.konamiTab = [];
          this.konamiTest = 0;
        }
      });
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
    score(n, o) {
      localStorage.setItem("score", n);
      if (n <= 0) {
        this.defeat();
      }
    },
    timer(n, o) {
      localStorage.setItem("timer", n);
      if (n <= 0) {
        this.defeat();
      }
    },
    initTimer(n, o) {
      localStorage.setItem("init-timer", n);
    },
  },
}).mount("#app");
