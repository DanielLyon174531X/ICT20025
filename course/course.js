// ---------- Utilities (clean, small helpers) ----------

/** Parse the query string as an object. */
function getQueryParams() {
  const url = new URL(window.location.href);
  return Object.fromEntries(url.searchParams.entries());
}

/** Create a normalized course record. */
function makeCourse({
  id, title, level,
  studyMode = "Online",
  duration = "12 Months",
  workload = "12–15 hrs / wk",
  fees = 0,
  startDates = "Mar / Jul / Oct",
  isInternational = false,
  applyPoints = []
} = {}) {
  return {
    id, title, level,
    studyMode, duration, workload, fees, startDates,
    isInternational, applyPoints
  };
}

/** Demo data map; swap this for API later. */
function buildCourseCatalog() {
  return {
    "b-it": makeCourse({
      id: "b-it",
      title: "Bachelor of Information Technology",
      level: "Undergraduate",
      workload: "12–15 hrs / wk",
      fees: 0,
      isInternational: false,
      applyPoints: [
        "Completed Year 12 (or equivalent)",
        "ATAR or entry via pathway",
        "Basic programming exposure helps"
      ]
    }),
    "b-cs": makeCourse({
      id: "b-cs",
      title: "Bachelor of Computer Science",
      level: "Undergraduate",
      workload: "12–15 hrs / wk",
      fees: 0,
      isInternational: true,
      applyPoints: [
        "Year 12 (or equivalent) with maths",
        "English language requirements apply",
        "Credit available for prior study"
      ]
    }),
    "m-ds": makeCourse({
      id: "m-ds",
      title: "Master of Data Science",
      level: "Postgraduate",
      duration: "24 Months",
      workload: "10–12 hrs / wk",
      fees: 38000,
      isInternational: true,
      applyPoints: [
        "Bachelor degree in related field",
        "Programming and statistics assumed",
        "Statement of purpose recommended"
      ]
    })
  };
}

/** Find one course by code (id) or return a placeholder. */
function findCourseOrFallback(id) {
  const catalog = buildCourseCatalog();
  return catalog[id] || makeCourse({
    id: id || "unknown",
    title: "Course Title Placeholder",
    level: "Undergraduate",
    applyPoints: ["Eligibility information will appear here."]
  });
}

/** Format a currency number; if zero, show fee-support message. */
function formatFees(value) {
  if (!value || value <= 0) return "Domestic fee support available";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "AUD", maximumFractionDigits: 0 }).format(value);
}

// ---------- Components ----------

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

/** Minimal, flat accordion matching the wireframe. */
const UiAccordion = {
  props: { title: { type: String, required: true }, openByDefault: { type: Boolean, default: false } },
  data() { return { open: this.openByDefault }; },
  methods: { toggle() { this.open = !this.open; } },
  template: `
    <section class="acc">
      <button class="acc-btn" :aria-expanded="open" @click="toggle">
        <span>{{ title }}</span>
        <span class="acc-icon">{{ open ? '–' : '+' }}</span>
      </button>
      <div v-if="open" class="acc-content"><slot /></div>
    </section>
  `
};

// ---------- Vue App ----------

function createAppConfig() {
  const { id } = getQueryParams();      // e.g. ?id=b-it
  const course = findCourseOrFallback(id);

  return {
    components: { FactCard, UiAccordion },
    data() {
      return {
        activeTab: "overview",
        course
      };
    },
    computed: {
      formattedFees() { return formatFees(this.course.fees); }
    },
    methods: {
      setTab(tab) { this.activeTab = tab; },
      tabClass(tab) { return { 'is-active': this.activeTab === tab }; }
    }
  };
}

// ---------- Mount ----------
(function mount() {
  const app = Vue.createApp(createAppConfig());
  app.mount("#app");
})();
