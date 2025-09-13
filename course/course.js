// ---------- Course: static example (no URL params) ----------

/** Create a normalized course record. */
function makeCourse({
  id, title, level,
  studyMode = "Online / On-campus",
  duration = "3 years full-time (or part-time equiv.)",
  workload = "12–15 hrs / wk",
  fees = 0,
  startDates = "February / July",
  isInternational = true,
  applyPoints = []
} = {}) {
  return {
    id, title, level,
    studyMode, duration, workload, fees, startDates,
    isInternational, applyPoints
  };
}

/** Format a currency number; if zero, show fee-support message. */
function formatFees(value) {
  if (!value || value <= 0) return "Domestic fee support available";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0
  }).format(value);
}

/** Fact pill used in the header (icon + label + value). */
const FactCard = {
  props: { label: String, value: String },
  template: `
    <div class="fact">
      <div class="icon" aria-hidden="true"></div>
      <div class="label">{{ label }}</div>
      <div class="value">{{ value }}</div>
    </div>
  `
};

/** Minimal, flat accordion. */
const UiAccordion = {
  props: { title: { type: String, required: true }, openByDefault: { type: Boolean, default: false } },
  data() { return { open: this.openByDefault }; },
  methods: { toggle() { this.open = !this.open; } },
  template: `
    <section class="acc">
      <button class="acc-btn" :aria-expanded="open.toString()" @click="toggle">
        <span>{{ title }}</span>
        <span class="acc-icon">{{ open ? '–' : '+' }}</span>
      </button>
      <div v-if="open" class="acc-content"><slot /></div>
    </section>
  `
};

// ---------- Static data for Bachelor of ICT – Software Technology ----------
const COURSE = makeCourse({
  id: "b-ict-softdev",
  title: "Bachelor of Information and Communication Technology – Software Technology",
  level: "Undergraduate",
  studyMode: "Online / On-campus",
  duration: "3 years full-time (or part-time equiv.)",
  workload: "12–15 hrs / wk",
  startDates: "February / July",
  isInternational: true,
  fees: 0,
  applyPoints: [
    "Year 12 (or equivalent). Math recommended.",
    "English language requirements apply for international students.",
    "Credit available via RPL for prior study/work."
  ]
});

// ---------- Vue App ----------
function createAppConfig() {
  return {
    components: { FactCard, UiAccordion },
    data() {
      return {
        activeTab: "overview",
        showSearch: false,
        course: COURSE
      };
    },
    computed: {
      formattedFees() { return formatFees(this.course.fees); }
    },
    methods: {
      toggleSearch() { this.showSearch = !this.showSearch; },
      tabClass(tab) { return { 'is-active': this.activeTab === tab }; },

      /** Scroll to a section and open its accordion if present. */
      goto(tab) {
        this.activeTab = tab;

        // map tab -> section id in the DOM
        const idMap = {
          overview: "overview",
          fees: "fees",
          entry: "entry",
          rpl: "rpl",
          support: "support"
        };
        const targetId = idMap[tab] || "overview";
        const el = document.getElementById(targetId);
        if (!el) return;

        // If the section is an accordion, open it (click its button if closed)
        const btn = el.querySelector(".acc-btn");
        if (btn && btn.getAttribute("aria-expanded") === "false") {
          btn.click();
        }

        // Smooth scroll with offset for the sticky header
        const header = document.querySelector(".topnav");
        const offset = header ? header.offsetHeight + 12 : 0;
        const y = el.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };
}

// ---------- Mount ----------
(function mount() {
  const app = Vue.createApp(createAppConfig());
  app.mount("#app");
})();
