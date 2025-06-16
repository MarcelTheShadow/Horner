<!-- Import von benötigten Variablen; Delegation der Berechnung an die .js-Dateien -->
<script setup>
import { eingabeFunktion, eingabeNullstelle, polynomfunktion, nullstelle, funktionGueltig, stelleGueltig, ausgabe, eingabeVerarbeiten } from '../composables/polynomdivision.js';
</script>

<template>
    <div class="Ueberschrift">
        Horner-Rechner - Polynomdivision
    </div>
    <!-- Eingabe -->
    <div class="eingabeSektion">
        <div class="eingabeTextfelder">

            <!-- Eingabe der Polynomfunktion, durch Enter Berechnung -->
            <input type="text" v-model="eingabeFunktion"

                @keyup.enter="eingabeVerarbeiten()" placeholder="Polynomfunktion" style="width: 20vw;" />
            <!-- Eingabe der Nullstelle, durch Enter Berechnung -->
            <input type="text" v-model="eingabeNullstelle"
                @keyup.enter="eingabeVerarbeiten()" placeholder="Nullstelle" style="width: 10vw;">
        </div>
        <!-- Durch Drücken Berechnung-->
        <button @click="eingabeVerarbeiten()">Führe Polynomdivision aus</button>
    </div>

    <!-- Ausgabe -->
    <div class="text">

        <!-- Ausgabe der Ergebnisse, wenn die Eingaben gültig sind -->
        <div v-if="(funktionGueltig && stelleGueltig)">
            <p>Eingegebene Polynomfunktion: <span class="AusgabeEingabe"> {{ polynomfunktion }} </span></p>
            <p>Eingegebene Nullstelle: <span class="AusgabeEingabe"> {{ nullstelle }} </span></p>
            <p>Ergebnis der Polynomdivision: <span class="Ausgabewerte"> {{ ausgabe }} </span></p>
        </div>

        <!-- Ausgabe der Fehlermeldungen, wenn die Eingaben ungültig sind -->

        <!-- Fehlermeldung bei ungültiger Polynomfunktion gibt allgemein an, wie welche Daten eingegeben werden müssen, nicht nur Polynomfunktion-->
        <div v-else-if="!funktionGueltig">
            <p>Die eingegebene Funktion ist ungültig!</p>
            <p>Es ist zu beachten:</p>
            <p>Arbeite für die Polynomfunktion mit dem Format a*x^n + b*x^m + c*x^k...</p>
            <p>Die Koeffizienten a,b,c... sowie die eingegebene Nullstelle müssen ganze Zahlen, die Exponenten n,m,k...
                natürliche Zahlen sein</p>
        </div>
        
        <!-- Fehlermeldung für ungültige Nullstelle-->
        <div v-else-if="!stelleGueltig">
            <p>Es muss eine ganze Zahl als Nullstelle der Polynomfunktion eingegeben werden, die wirklich eine Nullstelle ist!</p>
        </div>
    </div>
</template>

<!-- Import von benötigten CSS-Dateien für Style -->
<style scoped>
@import '../assets/styleForAll.css';
@import '../assets/styleForUseCases.css';
</style>