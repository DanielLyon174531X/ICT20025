// ---------------- ICON COMPONENTS ----------------
const CapIcon = { template: `<svg width="28" height="28" viewBox="0 0 24 24"><path fill="#334155" d="M12 3 1 8l11 5 9-4.09V15h2V8L12 3zm0 7.32L4.74 8 12 4.68 19.26 8 12 10.32zM3 12v3.5c0 2.21 4.03 4 9 4s9-1.79 9-4V12h-2v3.5c0 .97-2.93 2.5-7 2.5s-7-1.53-7-2.5V12H3z"/></svg>` };
const BriefcaseIcon = { template: `<svg width="28" height="28" viewBox="0 0 24 24"><path fill="#334155" d="M10 4h4a2 2 0 0 1 2 2v1h4a2 2 0 0 1 2 2v3H2V9a2 2 0 0 1 2-2h4V6a2 2 0 0 1 2-2zm0 3h4V6h-4v1z"/><path fill="#334155" d="M2 12h22v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7zm8 2v2h4v-2h-4z"/></svg>` };
const GlobeIcon = { template: `<svg width="28" height="28" viewBox="0 0 24 24"><path fill="#334155" d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2zm7.93 9H15.7c-.19-2.03-.86-3.94-1.9-5.45A8.03 8.03 0 0 1 19.93 11zM12 4.07c.91 1.07 1.94 3.12 2.2 5.93H9.8c.26-2.81 1.29-4.86 2.2-5.93zM4.07 13H8.3c.19 2.03.86 3.94 1.9 5.45A8.03 8.03 0 0 1 4.07 13zM12 19.93c-.91-1.07-1.94-3.12-2.2-5.93h4.4c-.26 2.81-1.29 4.86-2.2 5.93zM8.3 11H4.07A8.03 8.03 0 0 1 10.1 6.55C9.16 8.06 8.49 9.97 8.3 11zm7.4 2h4.23a8.03 8.03 0 0 1-6.03 5.45c1.04-1.51 1.71-3.42 1.8-5.45z"/></svg>` };
const UserIcon = { template: `<svg width="28" height="28" viewBox="0 0 24 24"><path fill="#334155" d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/></svg>` };

// ---------------- COURSE DATA ----------------
function makeCourse(id, title, blurb) {
  return { id, title, blurb };
}

function getCoursesForAudience(path) {
  const data = {
    undergrad: [
      makeCourse("b-it", "Bachelor of Information Technology", "Programming, data, networks, web."),
      makeCourse("b-cs", "Bachelor of Computer Science", "Software engineering, algorithms, AI."),
      makeCourse("b-design", "Bachelor of Design (UX)", "Human-centred design & accessibility."),
      makeCourse("b-bus", "Bachelor of Business (Marketing)", "Strategy, research, digital, branding.")
    ],
    postgrad: [
      makeCourse("m-cs", "Master of Computer Science", "Advanced systems, ML, distributed."),
      makeCourse("mba", "MBA (Leadership)", "Strategy, finance, org leadership."),
      makeCourse("m-ds", "Master of Data Science", "Statistics, pipelines, ML ops."),
      makeCourse("m-ux", "Master of UX Design", "Research, prototyping, service design.")
    ],
    international: [
      makeCourse("intl-found", "International Foundation Program", "Prep for UG study in AU."),
      makeCourse("intl-eng", "Academic English", "Write, present, research at uni."),
      makeCourse("intl-bridge", "STEM Bridge", "Math & coding fundamentals."),
      makeCourse("intl-career", "Career & Employability Skills", "CVs, interviews, workplace culture.")
    ],
    mature: [
      makeCourse("mature-path", "Mature-age Pathway", "Refresh study skills and tech."),
      makeCourse("cert-it", "Cert IV in IT (Online)", "Practical IT skills refresher."),
      makeCourse("cert-bus", "Cert IV in Business", "Ops, projects, communication."),
      makeCourse("mature-digi", "Digital Literacy Accelerator", "Cloud, collaboration, security basics.")
    ]
  };
  return data[path] || [];
}

// ---------------- VUE APP ----------------
function createVueAppConfig() {
  return {
    components: { CapIcon, BriefcaseIcon, GlobeIcon, UserIcon },
    data() {
      return {
        cards: [
          { id: "undergrad", title: "Undergraduate", subtitle: "Starting your university journey", icon: "cap" },
          { id: "postgrad", title: "Postgraduate", subtitle: "Advancing your education", icon: "briefcase" },
          { id: "international", title: "International", subtitle: "Studying from abroad", icon: "globe" },
          { id: "mature", title: "Mature-age", subtitle: "Returning to study", icon: "user" }
        ],
        showModal: false,
        selectedPath: null,
        visibleCount: 3
      };
    },
    computed: {
      audienceTitle() {
        const map = {
          undergrad: "Undergraduate",
          postgrad: "Postgraduate",
          international: "International",
          mature: "Mature-age"
        };
        return map[this.selectedPath] || "";
      },
      currentCourses() {
        return getCoursesForAudience(this.selectedPath);
      },
      visibleCourses() {
        return this.currentCourses.slice(0, this.visibleCount);
      }
    },
    methods: {
      openModal(pathId) {
        this.selectedPath = pathId;
        this.visibleCount = 3;
        this.showModal = true;
      },
      closeModal() {
        this.showModal = false;
        this.selectedPath = null;
      },
      loadMore() {
        this.visibleCount = Math.min(this.visibleCount + 3, this.currentCourses.length);
      },
    onViewDetails(course) {
    const url = new URL("../course/course.html", window.location.href);
    url.searchParams.set("id", course.id);
    url.searchParams.set("title", course.title);
    window.location.href = url.toString();
    }

    }
  };
}

// ---------------- MOUNT ----------------
(function mountApp() {
  const app = Vue.createApp(createVueAppConfig());
  app.mount("#app");
})();
