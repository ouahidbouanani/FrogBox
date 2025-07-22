<template>
<div class="topnav">
    <div class="container-fluid">
        <nav class="navbar navbar-expand-lg">
            <div class="collapse navbar-collapse" id="topnav-menu-content">
                <ul class="navbar-nav">

                    <b-dropdown as="li" class="nav-item" toggle-class="nav-link dropdown-toggle arrow-none" menu-class="dropdown-menu" :variant="null">
                        <template #button-content>
                            <i class="uil-dashboard"></i>Outils PDF
                            <div class="arrow-down"></div>
                        </template>
                        <template #default>
                            <router-link to="/outilsPdf" class="dropdown-item side-nav-link-ref">Tous les outils</router-link>
                            <router-link to="/outils-pdf/pdf-merge" class="dropdown-item side-nav-link-ref">Fussioner PDF</router-link>
                            <router-link to="/outils-pdf/pdf-split" class="dropdown-item side-nav-link-ref">Diviser PDF</router-link>
                            <router-link to="/outils-pdf/pdf-image" class="dropdown-item side-nav-link-ref">PDF en JPG</router-link>
                            <router-link to="/outils-pdf/pdf-word" class="dropdown-item side-nav-link-ref">PDF en Word</router-link>
                            <router-link to="/outils-pdf/pdf-excel" class="dropdown-item side-nav-link-ref">PDF en Excel</router-link>
                            <router-link to="/outils-pdf/pdftoppt" class="dropdown-item side-nav-link-ref">PDF en PowerPoint </router-link>
                            <router-link to="/outils-pdf/rotation-pdf" class="dropdown-item side-nav-link-ref">Faire Pivoter PDF</router-link>
                            <router-link to="/outils-pdf/ajout-numero" class="dropdown-item side-nav-link-ref">Numéro de pages</router-link>
                        </template>

                    </b-dropdown>

                    <b-dropdown as="li" class="nav-item" toggle-class="nav-link dropdown-toggle arrow-none" menu-class="dropdown-menu" :variant="null">
                        <template #button-content>
                            <i class="bi bi-journal-text"></i>Formulaires
                            <div class="arrow-down"></div>
                        </template>
                        <template #default>
                            <router-link to="/formulaires-semi" class="dropdown-item side-nav-link-ref">Formulaires Semi finis</router-link>
                            <router-link to="/formulaires-finis" class="dropdown-item side-nav-link-ref">Formulaires Finis</router-link>
                            <router-link to="/formulaires-semi/declaration-nc" class="dropdown-item side-nav-link-ref">Déclaration NC</router-link>
                        </template>

                    </b-dropdown>

                    <li class="nav-item">
                        <RouterLink to="/data" class="nav-link">
                            <i class="uil-apps"></i> Data
                        </RouterLink>
                    </li>
                    <li class="nav-item">
                        <RouterLink to="/dash" class="nav-link">
                            <i class="uil-user-circle"></i> dash
                        </RouterLink>
                    </li>

                </ul>
            </div>
        </nav>
    </div>
</div>
</template>

<script lang="ts">
export default {
    mounted() {
        this.activateMenuItems()
    },
    methods: {
        activateMenuItems() {
            const links = document.getElementsByClassName('side-nav-link-ref')

            let menuItemEl: HTMLAnchorElement | null = null;
            for (let i = 0; i < links.length; i++) {
                const link = links[i] as HTMLAnchorElement;
                if (window.location.pathname === link.pathname) {
                    menuItemEl = link
                    break
                }
            }

            if (menuItemEl) {
                const parentEl = menuItemEl.parentElement
                // level 1
                menuItemEl.classList.add('active')
                parentEl!.parentElement!.classList.add('active')

                if (parentEl!.parentElement!.parentElement) {
                    // level 2 nested
                    parentEl!.parentElement!.parentElement!.classList.add('active')
                    parentEl!.parentElement!.parentElement!.parentElement!.classList.add('active')
                }
            }
        },
    }
}
</script>