<!-- Import von benötigten Variablen; Delegation der Berechnung an die .js-Datei -->
<script setup>
import { eingabeFunktionFunktionswertberechnung, eingabeStelleFunktionswertberechnung, eingabeAnzahlAbleitungenFunktionswertberechnung, polynomfunktionFunktionswertberechnung, stelleFunktionswertberechnung, funktionGueltigFunktionswertberechnung, stelleGueltigFunktionswertberechnung, ableitungshoheGueltigFunktionswertberechnung, ausgabeFunktionswertberechnung, eingabeVerarbeitenFunktionswertberechnung } from '../composables/polynomfunktionMethoden.js';
</script>

<template>
    <div class="Ueberschrift">
        Horner-Rechner - Funktionswertberechnung
    </div>
    <!-- Eingabe -->
    <div class="eingabeBenutzerTextUndButton">
        <div class="eingabeBenutzerNurText">
            <!-- Eingabe der Polynomfunktion, durch Enter Berechnung -->
            <input type="text" v-model="eingabeFunktionFunktionswertberechnung"
                @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()" placeholder="Polynomfunktion"
                style="width: 20vw;" />
            <!-- Eingabe der Stelle zur Funktionswertberechnung, durch Enter Berechnung -->
            <input type="text" v-model="eingabeStelleFunktionswertberechnung"
                @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()" placeholder="Stelle von x"
                style="width: 10vw;">
            <!-- Eingabe der Ordnung der Ableitung, durch Enter Berechnung -->
            <input type="text" v-model="eingabeAnzahlAbleitungenFunktionswertberechnung"
                @keyup.enter="eingabeVerarbeitenFunktionswertberechnung()" placeholder="Ordnung der Ableitung"
                style="width: 15vw;">
        </div>
        <!-- Durch Drücken Berechnung-->
        <button @click="eingabeVerarbeitenFunktionswertberechnung()">Führe Funktionswertberechnung aus</button>
    </div>

    <!-- Ausgabe -->
    <div class="text">
        <!-- Ausgabe der Ergebnisse, wenn die Eingaben gültig sind -->
        <div
            v-if="(funktionGueltigFunktionswertberechnung && stelleGueltigFunktionswertberechnung && ableitungshoheGueltigFunktionswertberechnung)">
            <p>Eingegebene Polynomfunktion: {{ polynomfunktionFunktionswertberechnung }}</p>
            <p>Eingegebene Nullstelle: {{ stelleFunktionswertberechnung }}</p>
            <p>Ergebnis der Funktionswertberechnung: <span class="wichtigeAusgabe"> {{ ausgabeFunktionswertberechnung }}
                </span> </p>
        </div>
        <!-- Ausgabe der Fehlermeldungen, wenn die Eingaben ungültig sind -->
        <!-- Fehlermeldung bei ungültiger Polynomfunktion gibt allgemein an, wie welche Daten eingegeben werden müssen, nicht nur Polynomfunktion-->
        <div v-else-if="!funktionGueltigFunktionswertberechnung">
            <p>Die eingegebene Funktion ist ungültig!</p>
            <p>Es ist zu beachten:</p>
            <p>Arbeite für die Polynomfunktion mit dem Format a*x^n + b*x^m + c*x^k...</p>
            <p>Die Koeffizienten a,b,c... und die eingegebene Stelle müssen ganze Zahlen, die Exponenten n,m,k... sowie
                die angegebene Ordnung der Ableitung natürliche Zahlen
                sein</p>
        <!-- Fehlermeldung für ungültige Stelle-->
        </div>
        <div v-else-if="!stelleGueltigFunktionswertberechnung">
            <p>Es muss eine ganze Zahl als Stelle eingegeben werden!</p>
        </div>
        <!-- Fehlermeldung für ungültige Ordnung der Ableitung-->
        <div v-else-if="!ableitungshoheGueltigFunktionswertberechnung">
            <p>Es muss eine natürliche Zahl als Ordnung der Ableitung angegeben werden!</p>
        </div>
    </div>
</template>

<!-- Import von benötigten CSS-Dateien für Style -->
<style scoped>
@import '../assets/styleForAll.css';
@import '../assets/styleForTextInputs.css';
</style>