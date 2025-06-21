<!-- Homepage/Startseite, von der aus zur Polynomdivision oder zur Funktionswertberechnung navigiert werden kann-->

<!-- Router, um von der Homepage aus auf die beiden anderen Seiten zu gelangen -->
<script setup>
import router from '../router/index.js';
</script>

<template>
    <div class="Ueberschrift">
        Willkommen zum Horner-Rechner!
    </div>
    <div class="text">
        <p>Es stehen 2 Anwendungsmöglichkeiten des Horner-Rechners zur Verfügung: </p>
    </div>
    <div class="routerButtons">
        <!-- Buttons führen zu den zwei Vue-Seiten zur Anwendung des Horner-Schemas, Konfiguration in router/index.js --> 
        <button @click="router.push('/funktionswertberechnung')">Zur Funktionswertberechnung</button>
        <button @click="router.push('/polynomdivision')">Zur Polynomdivision</button>
    </div>
</template>

<!-- Import von benötigter CSS-Dateie für Style -->
 <!-- Zusätzlich Style für routerButtons, der nur hier genutzt wird-->
<style scoped>
@import '../assets/styleForAll.css';

.routerButtons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 40%;
    row-gap: 10%;
}
</style>