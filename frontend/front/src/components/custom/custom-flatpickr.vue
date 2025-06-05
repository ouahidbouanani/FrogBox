<template>
  <b-form-input
      type="text"
      :id="id!"
  />
</template>

<script lang="ts">
import "flatpickr";
import flatpickr from 'flatpickr';

export default {
  props: {id: {type: String,required:true}, options: {type: Object}},
  mounted() {
    const el = document.getElementById(this.id);
    if (el) {
      flatpickr(el, this.options);
    }
  }
}
</script>
