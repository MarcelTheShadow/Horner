<script setup>
import router from '../router/index.js';
</script>

<template>
    <div class="Ueberschrift">
        Willkommen zum Horner-Rechner!
    </div>
    <div class="output">
        <p>Es stehen aktuell 2 Anwendungsmöglichkeiten zur Verfügung: </p>
    </div>
    <div class="inputUserTextAndButton">
        <button @click="router.push('/funktionswertberechnung')">Zur Funktionswertberechnung</button>
        <button @click="router.push('/polynomdivision')">Zur Polynomdivision</button>
    </div>
</template>