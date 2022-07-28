<script lang="ts">

import { defineComponent } from 'vue'
import { mainStore } from "../stores/store"
import { mapStores } from 'pinia';
import {debounce} from "lodash";
import {helloMixin} from "../mixins/helloMixin"

const MIN_SIZE = 5, MAX_SIZE = 300;

export default defineComponent({
  data() {
    return {
      size: MIN_SIZE,
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
      if (this.size as any == '' || this.size < MIN_SIZE) {
        this.size = MIN_SIZE;
      }
      if (this.size > MAX_SIZE) {
        this.size = MAX_SIZE;
      }
      this.mainStore.$patch({
        size: this.size
      })
    },
    sizeChange() {
      const debouncedSizeValidation = debounce(this.sizeValidation, 1000);
      debouncedSizeValidation();
    }
  },
  mixins: [helloMixin]
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
  height: 50px;
  align-self: end;
  top:-11px;
}
</style>
