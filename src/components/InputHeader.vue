<script lang="ts">

import { defineComponent } from 'vue'
import { mainStore } from '@/stores/store'
import { mapStores } from 'pinia';
import {debounce} from "lodash";

export default defineComponent({
  data() {
    return {
      size: 10,
    };
  },
  computed: {
    ...mapStores(mainStore)
  },
  props: {
    msg: String
  },
  methods: {
    sizeValidation() {
      if (this.size as any == '' || this.size < 10) {
        this.size = 10;
      }
      if (this.size > 300) {
        this.size = 300;
      }
      this.mainStore.$patch({
        size: this.size
      })
    },
    sizeChange() {
      const debouncedSizeValidation = debounce(this.sizeValidation, 500);
      debouncedSizeValidation();
    }
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <input class='sizeChange' v-model="size" @input="sizeChange()" />
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -5px;
  right: 10px;
}

.greetings {
  display: flex;
  text-align: center;
  justify-content: center;
}

.sizeChange {
  font-size: 30px;
  width: 100px;
}
</style>
