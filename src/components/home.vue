<script setup>
import router from '../router/index.js';
</script>

<template>
    <div class="Ueberschrift">
        Willkommen zum Horner-Rechner!
    </div>
    <div class="text">
        <p>Es stehen aktuell 2 Anwendungsmöglichkeiten zur Verfügung: </p>
    </div>
    <div class="routerButtons">
        <button @click="router.push('/funktionswertberechnung')">Zur Funktionswertberechnung</button>
        <button @click="router.push('/polynomdivision')">Zur Polynomdivision</button>
    </div>
</template>

<style scoped>
@import '../assets/style.css';

.routerButtons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 40%;
    row-gap: 10%;
}
</style>