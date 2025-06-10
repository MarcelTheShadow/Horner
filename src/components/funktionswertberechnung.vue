<script setup>
import { eingabeFunktionFunktionswertberechnung, eingabeStelleFunktionswertberechnung, eingabeAnzahlAbleitungenFunktionswertberechnung, polynomfunktionFunktionswertberechnung, stelleFunktionswertberechnung, funktionGueltigFunktionswertberechnung, stelleGueltigFunktionswertberechnung, ableitungshoheGueltigFunktionswertberechnung, ausgabeFunktionswertberechnung, eingabeVerarbeitenFunktionswertberechnung } from '../composables/polynomfunktionMethoden.js';
</script>

<template>
    <div class="Ueberschrift">
        Horner-Rechner - Funktionswertberechnung
    </div>
    <div class="eingabeBenutzerTextUndButton">
        <div class="eingabeBenutzerNurText">
            <input type="text" v-model="eingabeFunktionFunktionswertberechnung"
                @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()" placeholder="Polynomfunktion"
                style="width: 20vw;" />
            <input type="text" v-model="eingabeStelleFunktionswertberechnung"
                @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()" placeholder="Stelle von x"
                style="width: 10vw;">
            <input type="text" v-model="eingabeAnzahlAbleitungenFunktionswertberechnung"
                @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()" placeholder="Ordnung der Ableitung"
                style="width: 10vw;">
        </div>
        <button @click="eingabeVerarbeitenFunktionswertberechnung()">Führe Funktionswertberechnung aus</button>
    </div>
    <div class="text">
        <div v-if="(funktionGueltigFunktionswertberechnung && stelleGueltigFunktionswertberechnung && ableitungshoheGueltigFunktionswertberechnung)">
            <p>Eingegebene Polynomfunktion: {{ polynomfunktionFunktionswertberechnung }}</p>
            <p>Eingegebene Nullstelle: {{ stelleFunktionswertberechnung }}</p>
            <p>Ergebnis der Funktionswertberechnung: <span class="wichtigeAusgabe"> {{ ausgabeFunktionswertberechnung }} </span> </p>
        </div>
        <div v-else-if="!funktionGueltigFunktionswertberechnung">
            <p>Die eingegebene Funktion ist ungültig!</p>
            <p>Es ist zu beachten:</p>
            <p>Arbeite für die Polynomfunktion mit dem Format a*x^n + b*x^m + c*x^k...</p>
            <p>Die Koeffizienten a,b,c... und die eingegebene Stelle müssen ganze Zahlen, die Exponenten n,m,k... sowie die angegebene Ordnung der Ableitung natürliche Zahlen
                sein</p>
        </div>
        <div v-else-if="!stelleGueltigFunktionswertberechnung">
            <p>Es muss eine ganze Zahl als Stelle eingegeben werden!</p>
        </div>
        <div v-else-if="!ableitungshoheGueltigFunktionswertberechnung">
            <p>Es muss eine natürliche Zahl als Ordnung der Ableitung angegeben werden!</p>
        </div>
    </div>
</template>

<style scoped>
@import '../assets/styleForAll.css';
@import '../assets/styleForTextInputs.css';
</style>