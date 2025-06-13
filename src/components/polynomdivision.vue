<!-- Import von benötigten Variablen; Delegation der Berechnung an die .js-Datei -->
<script setup>
import { eingabeFunktionPolynomdivision, eingabeNullstellePolynomdivision, polynomfunktionPolynomdivision, nullstellePolynomdivision, funktionGueltigPolynomdivision, stelleGueltigPolynomdivision, ausgabePolynomdivision, eingabeVerarbeitenPolynomdivision } from '../composables/polynomfunktionMethoden.js';
</script>

<template>
    <div class="Ueberschrift">
        Horner-Rechner - Polynomdivision
    </div>
    <!-- Eingabe -->
    <div class="eingabeBenutzerTextUndButton">
        <div class="eingabeBenutzerNurText">
            <!-- Eingabe der Polynomfunktion, durch Enter Berechnung -->
            <input type="text" v-model="eingabeFunktionPolynomdivision"
                @keyup.enter="eingabeVerarbeitenPolynomdivision()" placeholder="Polynomfunktion" style="width: 20vw;" />
            <!-- Eingabe der Nullstelle, durch Enter Berechnung -->
                <input type="text" v-model="eingabeNullstellePolynomdivision"
                @keyup.enter="eingabeVerarbeitenPolynomdivision()" placeholder="Nullstelle" style="width: 10vw;">
        </div>
        <!-- Durch Drücken Berechnung-->
        <button @click="eingabeVerarbeitenPolynomdivision()">Führe Polynomdivision aus</button>
    </div>

    <!-- Ausgabe -->
    <div class="text">
        <!-- Ausgabe der Ergebnisse, wenn die Eingaben gültig sind -->
        <div v-if="(funktionGueltigPolynomdivision && stelleGueltigPolynomdivision)">
            <p>Eingegebene Polynomfunktion: {{ polynomfunktionPolynomdivision }}</p>
            <p>Eingegebene Nullstelle: {{ nullstellePolynomdivision }}</p>
            <p >Ergebnis der Polynomdivision: <span class="wichtigeAusgabe"> {{ ausgabePolynomdivision }} </span></p>
        </div>
        <!-- Ausgabe der Fehlermeldungen, wenn die Eingaben ungültig sind -->
        <!-- Fehlermeldung bei ungültiger Polynomfunktion gibt allgemein an, wie welche Daten eingegeben werden müssen, nicht nur Polynomfunktion-->
        <div v-else-if="!funktionGueltigPolynomdivision">
            <p>Die eingegebene Funktion ist ungültig!</p>
            <p>Es ist zu beachten:</p>
            <p>Arbeite für die Polynomfunktion mit dem Format a*x^n + b*x^m + c*x^k...</p>
            <p>Die Koeffizienten a,b,c... sowie die eingegebene Nullstelle müssen ganze Zahlen, die Exponenten n,m,k...
                natürliche Zahlen sein</p>
        </div>
        <!-- Fehlermeldung für ungültige Nullstelle-->
        <div v-else-if="!stelleGueltigPolynomdivision">
            <p>Es muss eine ganze Zahl als Nullstelle der Polynomfunktion eingegeben werden!</p>
        </div>
    </div>
</template>

<!-- Import von benötigten CSS-Dateien für Style -->
<style scoped>
@import '../assets/styleForAll.css';
@import '../assets/styleForTextInputs.css';
</style>