<template>
  <!-- ========== Left Sidebar Start ========== -->
  <div
      v-click-outside="clickOutSideConfig"
      class="leftside-menu"
      :class="classes"
  >
    <simplebar
        v-if="!isCondensed"
        :settings="settings"
        class="h-100"
    >
      <div
          v-if="includeUser"
          class="leftbar-user"
      >
        <a href="javascript: void(0);">
          <img
              src="@/assets/images/users/avatar-1.jpg"
              alt="user-image"
              height="42"
              class="rounded-circle shadow-sm"
          />
          <span class="leftbar-user-name">Dominic Keller</span>
        </a>
      </div>
      <a
          v-else
          href="/"
          class="logo text-center"
      >
        <span class="logo-lg">
          <img
              id="side-main-logo"
              src="@/assets/images/logo_treefrog_.png"
              alt=""
              height="16"
          />
        </span>
        <span class="logo-sm">
          <img
              id="side-sm-main-logo"
              src="@/assets/images/logo-sm.png"
              alt=""
              height="16"
          />
        </span>
      </a>

      <AppMenu mode="vertical"/>

      <div class="help-box text-white text-center">
        <a
            href="javascript: void(0);"
            class="float-right close-btn text-white"
        >
          <i class="mdi mdi-close"></i>
        </a>
        <img
            src="@/assets/images/svg/help-icon.svg"
            height="90"
            alt="Helper Icon Image"
        />
        <h5 class="mt-3">Unlimited Access</h5>
        <p class="mb-3">Upgrade to plan to get access to unlimited reports</p>
        <a
            href="javascript: void(0);"
            class="btn btn-outline-light btn-sm"
        >Upgrade</a>
      </div>
    </simplebar>

    <div v-else>
      <div
          v-if="includeUser"
          class="leftbar-user"
      >
        <a href="javascript: void(0);">
          <img
              src="@/assets/images/users/avatar-1.jpg"
              alt="user-image"
              height="42"
              class="rounded-circle shadow-sm"
          />
          <span class="leftbar-user-name">Dominic Keller</span>
        </a>
      </div>

      <a
          v-else
          href="/"
          class="logo text-center"
      >
        <span class="logo-lg">
          <img
              id="side-main-logo"
              src="@/assets/images/logo.png"
              alt=""
              height="16"
          />
        </span>
        <span class="logo-sm">
          <img
              id="side-sm-main-logo"
              src="@/assets/images/logo-sm.png"
              alt=""
              height="16"
          />
        </span>
      </a>

      <AppMenu/>

      <div class="help-box text-white text-center">
        <a
            href="javascript: void(0);"
            class="float-right close-btn text-white"
        >
          <i class="mdi mdi-close"></i>
        </a>
        <img
            src="@/assets/images/svg/help-icon.svg"
            height="90"
            alt="Helper Icon Image"
        />
        <h5 class="mt-3">Unlimited Access</h5>
        <p class="mb-3">Upgrade to plan to get access to unlimited reports</p>
        <a
            href="javascript: void(0);"
            class="btn btn-outline-light btn-sm"
        >Upgrade</a>
      </div>
    </div>
    <!-- Sidebar -left -->
  </div>
  <!-- Left Sidebar End -->
</template>

<script lang="ts">
import simplebar from 'simplebar-vue'
import AppMenu from "@/components/layouts/partials/app-menu.vue";

export default {
  components: {AppMenu, simplebar},
  props: {
    isCondensed: {
      type: Boolean,
      default: false,
    },
    theme: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    includeUser: {
      type: Boolean,
      default: false,
    },
    classes: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      settings: {
        minScrollbarLength: 60,
      },
      clickOutSideConfig: {
        handler: this.handleMenuClick,
        middleware: this.middleware,
        events: ['click'],
      },
    }
  },
  watch: {
    theme: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.activateTheme(newVal)
      }
    },
    type: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.activateType(newVal)
      }
    },
  },
  created: function () {
    this.activateTheme(this.theme)
    this.activateType(this.type)
  },
  methods: {
    handleMenuClick() {
      this.$parent!.hideMenu()
    },
    middleware(event:any) {
      return !event.target.classList.contains('toggle-menu')
    },
    activateTheme(theme:string) {
      switch (theme) {
        case 'default':
          document.body.removeAttribute('data-leftbar-theme')
          break
        case 'light':
          document.body.setAttribute('data-leftbar-theme', 'light')
          break
        case 'dark':
          document.body.setAttribute('data-leftbar-theme', 'dark')
          break
        default:
          document.body.removeAttribute('data-leftbar-theme')
          break
      }
    },
    activateType(type:string) {
      switch (type) {
        case 'fixed':
          document.body.removeAttribute('data-leftbar-compact-mode')
          break
        case 'condensed':
          document.body.setAttribute('data-leftbar-compact-mode', 'condensed')
          document.body.classList.remove('left-side-menu-dark')
          document.body.classList.remove('boxed-layout')
          break
        case 'scrollable':
          document.body.setAttribute('data-leftbar-compact-mode', 'scrollable')
          break
        default:
          document.body.removeAttribute('data-leftbar-compact-mode')
          break
      }
    },
  },
}
</script>