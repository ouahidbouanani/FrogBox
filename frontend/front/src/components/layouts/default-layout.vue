<template>
  <slot/>
</template>

<script lang="ts">
export default {
  props: {bodyClass: String},
  mounted() {
    let classes = this.bodyClass?.split(" ")
    if (this.bodyClass) {
      for (let className of classes ?? []) {
        document.body.classList.add(className)
      }
    }
  },
  unmounted() {
    let classes = this.bodyClass?.split(" ")
    if (this.bodyClass) {
      for (let className of classes ?? []) {
        document.body.classList.remove(className)
      }
    }
  }
}
</script>


