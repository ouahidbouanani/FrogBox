<template>
  <div class="navbar-custom">
    <div class="topbar container-fluid">
      <div class="d-flex align-items-center gap-lg-2 gap-1">
        <!-- Topbar Brand Logo -->
        <div class="logo-topbar">
          <!-- Logo Dark -->
          <router-link to="/" class="logo-light">
            <span class="logo-lg">
              <img src="@/assets/images/logo_treefrog_.png" alt="logo" />
            </span>
            <span class="logo-sm">
              <img src="@/assets/images/logo_treefrog_.png" alt="small logo" />
            </span>
          </router-link>

          <!-- Logo Light -->
          <router-link to="/" class="logo-dark">
            <span class="logo-lg">
              <img src="@/assets/images/logo_treefrog_.png" alt="dark logo" />
            </span>
            <span class="logo-sm">
              <img src="@/assets/images/logo_treefrog_.png" alt="small logo" />
            </span>
          </router-link>
        </div>

        <!-- Sidebar Menu Toggle Button -->
        <button class="button-toggle-menu">
          <i class="mdi mdi-menu"></i>
        </button>

        <!-- Horizontal Menu Toggle Button -->
        <button class="navbar-toggle horizontal-button-toggle-menu" data-bs-toggle="collapse"
          data-bs-target="#topnav-menu-content">
          <div class="lines">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

        <!-- Topbar Search Form -->
        <b-dropdown :variant="null" end class="app-search d-none d-lg-block"
          menu-class="dropdown-menu dropdown-menu-animated dropdown-lg" toggle-class="arrow-none nav-link">
          <template #button-content>
            <b-form>
              <b-form-group class="input-group">
                <b-form-input type="search" class="form-control dropdown-toggle" placeholder="Search..."
                  id="top-search" />
                <span class="ri-search-line search-icon"></span>
              </b-form-group>
              <b-button variant="success" class="input-group-text" type="submit">Search</b-button>
            </b-form>
          </template>

          
        </b-dropdown>
      </div>

      <ul class="topbar-menu d-flex align-items-center gap-3">
        <b-dropdown :variant="null" center auto-close="outside" class="d-lg-none"
          toggle-class="nav-link dropdown-toggle arrow-none"
          menu-class="dropdown-menu dropdown-menu-animated dropdown-lg p-0">
          <template #button-content>
            <i class="ri-search-line font-22"></i>
          </template>

          <b-form class="p-3">
            <b-form-input type="search" placeholder="Search ..." aria-label="Recipient's username" />
          </b-form>
        </b-dropdown>


        <b-dropdown is="li" end :variant="null" class="notification-list" toggle-class="arrow-none nav-link"
          menu-class="dropdown-menu notification-list dropdown-menu-end dropdown-menu-animated py-0 dropdown-lg">
          <template #button-content>
            <i class="ri-notification-3-line font-22"></i>
            <span class="noti-icon-badge"></span>
          </template>
          <div style="width: 320px">
            <div class="p-2 border-top-0 border-start-0 border-end-0 border-dashed border">
              <b-row class="align-items-center">
                <b-col>
                  <h6 class="m-0 font-16 fw-semibold">Notification</h6>
                </b-col>
                <b-col class="col-auto">
                  <a class="text-dark text-decoration-underline">
                    <small>Clear All</small>
                  </a>
                </b-col>
              </b-row>
            </div>

            <simplebar style="max-height: 300px" class="px-2 pt-2 overflow-x-hidden">
              <b-dropdown-item v-for="item in notificationItems" :key="item.id"
                class="p-0 mb-2 notify-item unread-noti card m-0 shadow-none">
                <div class="card-body" style="width: inherit">
                  <span class="float-end noti-close-btn text-muted"><i class="mdi mdi-close"></i></span>
                  <div class="d-flex align-items-center">
                    <div class="flex-shrink-0">
                      <div v-if="item.icon" class="notify-icon" :class="`bg-${item.iconColor}`">
                        <i :class="`${item.icon}`"></i>
                      </div>
                      <div v-if="item.user" class="notify-icon">
                        <img :src="`${item.user}`" class="img-fluid rounded-circle" alt="" />
                      </div>
                    </div>
                    <div class="flex-grow-1 text-truncate ms-2">
                      <h5 class="noti-item-title fw-semibold font-14">
                        {{ item.text }}
                      </h5>
                      <small class="noti-item-subtitle text-muted">{{ item.subText }}</small>
                    </div>
                  </div>
                </div>
              </b-dropdown-item>
              <div class="text-center">
                <i class="mdi mdi-dots-circle mdi-spin text-muted h3 mt-0"></i>
              </div>
            </simplebar>
            <!-- All-->
            <b-dropdown-item class="text-center text-primary text-decoration-underline fw-bold p-0"
              link-class=" border-top">
              <div class="py-2">View All</div>
            </b-dropdown-item>
          </div>
        </b-dropdown>

        

        <li class="d-none d-sm-inline-block">
          <a class="nav-link" @click="toggleRightSidebar">
            <i class="ri-settings-3-line font-22"></i>
          </a>
        </li>

        <li class="d-none d-sm-inline-block">
          <div class="nav-link" id="light-dark-mode" v-b-tooltip.hover.left title="Theme Mode">
            <i class="ri-moon-line font-22"></i>
          </div>
        </li>

        <li class="d-none d-md-inline-block">
          <button class="nav-link" @click="fullScreenListener">
            <i class="ri-fullscreen-line font-22"></i>
          </button>
        </li>

        <b-dropdown end :variant="null" toggle-class="arrow-none nav-link" class="dropdown"
          menu-class="dropdown-menu dropdown-menu-end dropdown-menu-animated profile-dropdown">
          <template #button-content data-bs-toggle="dropdown" role="button" aria-haspopup="false" aria-expanded="false">
            <div class="nav-link arrow-none nav-user px-2">
              <span class="account-user-avatar">
                <img src="@/assets/images/users/avatar-1.jpg" alt="user-image" width="32" class="rounded-circle" />
              </span>
              <span class="d-lg-flex flex-column gap-1 d-none">
                <h5 class="my-0">{{ fullName }}</h5>
                <h6 class="my-0 fw-normal text-start"></h6>
              </span>
            </div>
          </template>

          <b-dropdown-header class="noti-title">
            <h6 class="text-overflow m-0">Welcome !</h6>
          </b-dropdown-header>

          <b-dropdown-item href="#" class="">
            <i class="ri-account-circle-line fs-18 align-middle me-1"></i>
            <span>My Account</span>
          </b-dropdown-item>

          <b-dropdown-item href="#" class="">
            <i class="ri-settings-4-line fs-18 align-middle me-1"></i>
            <span>Settings</span>
          </b-dropdown-item>

          <b-dropdown-item href="#" class="">
            <i class="ri-customer-service-2-line fs-18 align-middle me-1"></i>
            <span>Support</span>
          </b-dropdown-item>

          <b-dropdown-item href="#" class="">
            <i class="ri-lock-password-line fs-18 align-middle me-1"></i>
            <span>Lock Screen</span>
          </b-dropdown-item>

          <b-dropdown-item @click="logout">
            <i class="ri-logout-box-line fs-18 align-middle me-1"></i>
            <span>Logout</span>
          </b-dropdown-item>
        </b-dropdown>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import simplebar from 'simplebar-vue'
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth' // ← Importer le store d'auth
import avatar2 from '@/assets/images/users/avatar-2.jpg'
import avatar4 from '@/assets/images/users/avatar-4.jpg'

export default {
  components: { simplebar },
  data() {
    const useLayout = useLayoutStore()
    const authStore = useAuthStore()

    return {
      useLayout,
      authStore, // ← Ajouté ici
      notificationItems: [
        {
          id: 1,
          icon: 'mdi mdi-comment-account-outline',
          iconColor: 'primary',
          text: 'Caleb Flakelar commented on Admin',
          subText: '1 min ago',
        },
        {
          id: 2,
          icon: 'mdi mdi-account-plus',
          iconColor: 'info',
          text: 'New user registered.',
          subText: '5 hours ago',
        },
        {
          id: 3,
          user: avatar2,
          text: 'Cristina Pride',
          subText: 'Hi, How are you? What about our next meeting',
        },
        {
          id: 4,
          icon: 'mdi mdi-comment-account-outline',
          iconColor: 'primary',
          text: 'Caleb Flakelar commented on Admin',
          subText: '4 days ago',
        },
        {
          id: 5,
          user: avatar4,
          text: 'Karen Robinson',
          subText: 'Wow ! this admin looks good and awesome design',
        },
        {
          id: 6,
          icon: 'mdi mdi-heart',
          iconColor: 'secondary',
          text: 'Carlos Crouch liked Admin',
          subText: '13 days ago',
        },
      ],
    }
  },
  computed: {
    // Computed pour afficher nom + prénom
    fullName(): string {
      const user = this.authStore.user
      if (user && user.nom && user.prenom) {
        return `${user.nom} ${user.prenom}`
      }
      return ''
    },
  },
  methods: {
    toggleRightSidebar() {
      this.useLayout.isRightSidebarOpen = !this.useLayout.isRightSidebarOpen
    },
    fullScreenListener() {
      document.body.classList.toggle('fullscreen-enable')
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen()
        }
      } else {
        if (document['exitFullscreen']) {
          document['exitFullscreen']()
        }
      }
    },
    logout() {
      this.authStore.logout()
      this.$router.push({ name: 'login' }) // Redirige vers la page de login
    },
  },
}
</script>
