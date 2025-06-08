<script setup>
import { eingabeFunktionFunktionswertberechnung, eingabeStelleFunktionswertberechnung, eingabeAnzahlAbleitungen, polynomfunktionFunktionswertberechnung, stelleFunktionswertberechnung, funktionGueltigIntern, stelleGueltigIntern, ausgabeFunktionswertberechnung, eingabeVerarbeitenFunktionswertberechnung } from '../composables/polynomfunktionMethoden.js';
</script>

<template>
    <div class="Ueberschrift">
        Horner-Rechner - Funktionswertberechnung
    </div>
    <div class="inputUserTextAndButton">
        <div class="inputUserTextOnly">
            <input type="text" v-model="eingabeFunktionFunktionswertberechnung" @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()"
                placeholder="Polynomfunktion" style="width: 20vw;" />
            <input type="text" v-model="eingabeStelleFunktionswertberechnung" @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()"
                placeholder="Stelle von x" style="width: 10vw;">
            <input type="text" v-model="eingabeAnzahlAbleitungen" @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()"
                placeholder="Höhe der Ableitung" style="width: 10vw;">
        </div>
        <button @click="eingabeVerarbeitenFunktionswertberechnung()">Führe Funktionswertberechnung aus</button>
    </div>
    <div class="text">
          <p>Eingegebene Polynomfunktion: {{ polynomfunktionFunktionswertberechnung }}</p>
            <p>Eingegebene Nullstelle: {{ stelleFunktionswertberechnung }}</p>
            <p>Ergebnis der Polynomdivision: {{ ausgabeFunktionswertberechnung }} </p>
    </div>
</template>

<style scoped>
@import '../assets/styleForAll.css';
@import '../assets/styleForTextInputs.css';
</style>