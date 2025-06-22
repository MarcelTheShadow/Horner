<!--
    Seite zur Anwendung der Funktionswertberechnung. Es werden eine Polynomfunktion, 
    eine Nullstelle und eine Ordnung der Ableitung eingegeben 
    und der zugehörige Funktionswert wird mit den gespiegelten Eingaben ausgegeben. 
    Bei Fehlern erscheint eine Nachricht, welche Eingabe falsch gesetzt wurde
-->

<!-- Import von benötigten Variablen; Delegation der Berechnung an die .js-Dateien -->
<script setup>
import { eingabeFunktion, eingabeStelle, eingabeOrdnungAbleitung, polynomfunktion, stelle, ordnungAbleitung, funktionGueltig, stelleGueltig, ableitungOrdnungGueltig, ausgabe, eingabeVerarbeiten } from '../composables/funktionswertberechnung.js';
</script>

<template>
    <div class="Ueberschrift">
        Horner-Rechner - Funktionswertberechnung
    </div>
    <!-- Eingabe -->
    <div class="eingabeSektion">
        <div class="eingabeTextfelder">

            <!-- Eingabe der Polynomfunktion, durch Enter Berechnung -->
            <input type="text" v-model="eingabeFunktion" @keyup.enter="eingabeVerarbeiten()"
                placeholder="Polynomfunktion" style="width: 20vw;" />

            <!-- Eingabe der Stelle zur Funktionswertberechnung, durch Enter Berechnung -->
            <input type="text" v-model="eingabeStelle" @keyup.enter="eingabeVerarbeiten()" placeholder="Stelle von x"
                style="width: 10vw;">

            <!-- Eingabe der Ordnung der Ableitung, durch Enter Berechnung -->
            <input type="text" v-model="eingabeOrdnungAbleitung" @keyup.enter="eingabeVerarbeiten()"
                placeholder="Ordnung der Ableitung" style="width: 15vw;">
        </div>
        <!-- Durch Drücken Berechnung-->
        <button @click="eingabeVerarbeiten()">Führe Funktionswertberechnung aus</button>
    </div>

    <!-- Ausgabe -->
    <div class="text">

        <!-- Ausgabe der Ergebnisse, wenn die Eingaben gültig sind -->
        <div v-if="(funktionGueltig && stelleGueltig && ableitungOrdnungGueltig)">
            <p>Eingegebene Polynomfunktion: <span class="AusgabeEingabe"> {{ polynomfunktion }} </span></p>
            <p>Eingegebene Nullstelle: <span class="AusgabeEingabe"> {{ stelle }} </span></p>
            <p>Eingebene Ordnung der Ableitung: <span class="AusgabeEingabe">{{ ordnungAbleitung }}</span></p>
            <p>Ergebnis der Funktionswertberechnung: <span class="Ausgabewerte"> {{ ausgabe }}
                </span></p>
        </div>

        <!-- Ausgabe der Fehlermeldungen, wenn die Eingaben ungültig sind -->

        <!-- Fehlermeldung bei ungültiger Polynomfunktion gibt allgemein an, wie welche Daten eingegeben werden müssen, nicht nur Polynomfunktion-->
        <div v-else-if="!funktionGueltig">
            <p>Die eingegebene Funktion ist ungültig!</p>
            <p>Es ist zu beachten:</p>
            <p>Arbeite für die Polynomfunktion mit dem Format a*x^n + b*x^m + c*x^k...</p>
            <p>Die Koeffizienten a,b,c... und die eingegebene Stelle müssen ganze Zahlen, 
                <br>die Exponenten n,m,k... sowie die angegebene Ordnung der Ableitung natürliche Zahlen
                sein</p>

            <!-- Fehlermeldung für ungültige Stelle-->
        </div>
        <div v-else-if="!stelleGueltig">
            <p>Es muss eine ganze Zahl als Stelle eingegeben werden!</p>
        </div>

        <!-- Fehlermeldung für ungültige Ordnung der Ableitung-->
        <div v-else-if="!ableitungOrdnungGueltig">
            <p>Es muss eine natürliche Zahl als Ordnung der Ableitung angegeben werden!</p>
        </div>
    </div>
</template>

<!-- Import von benötigten CSS-Dateien für Style -->
<style scoped>
@import '../assets/styleForAll.css';
@import '../assets/styleForUseCases.css';
</style>