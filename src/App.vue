<script setup lang="ts">
import MainHeader from './components/MainHeader.vue'
import TicTacToe from './components/TicTacToe.vue'
import InputHeader from './components/InputHeader.vue';
</script>

<template>
  <header>
    <div class="titleWrapper">
      <MainHeader msg="Tic tac toe ∞" />
    </div>
    <div>
      <InputHeader msg="Enter the size of the field: " />
    </div>
  </header>

  <main>
    <TicTacToe />
  </main>
</template>

<style>
@import './assets/base.css';

#app {
  padding: 2rem;
  font-weight: normal;
}
</style>
