<script setup>
import { eingabeFunktion, eingabeNullstelle, polynomfunktion, nullstelle, funktionGueltig, nullstelleGueltig, ausgabe, eingabeVerarbeitenFunktionswertberechnung } from '../composables/polynomfunktionMethoden.js';
</script>

<template>
    <div class="Ueberschrift">
        Horner-Rechner - Funktionswertberechnung
    </div>
    <div class="inputUserTextAndButton">
        <div class="inputUserTextOnly">
            <input type="text" v-model="eingabeFunktion" @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()"
                placeholder="Polynomfunktion" style="width: 20vw;" />
            <input type="text" v-model="eingabeNullstelle" @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()"
                placeholder="Stelle von x" style="width: 10vw;">
            <input type="text" v-model="eingabeAnzahlAbleitungen" @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()"
                placeholder="Höhe der Ableitung" style="width: 10vw;">
        </div>
        <button @click="eingabeVerarbeitenFunktionswertberechnung()">Führe Funktionswertberechnung aus</button>
    </div>
</template>

<style scoped>
@import '../assets/styleForAll.css';
@import '../assets/styleForTextInputs.css';
</style>