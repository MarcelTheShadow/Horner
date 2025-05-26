<script setup>
import { eingabeFunktion, eingabeNullstelle, polynomfunktion, nullstelle, funktionGueltig, nullstelleGueltig, ausgabe, eingabeVerarbeiten, } from '../composables/polynomfunktionMethoden.js';
</script>

<template>
    <div class="Ueberschrift">
        Horner-Rechner
    </div>

    <div class="eingabeAlles">
        <div class="inputs">
            <input type="text" v-model="eingabeFunktion" @keyup.enter="eingabeVerarbeiten()"
                placeholder="Polynomfunktion" style="width: 20vw;" />
            <input type="text" v-model="eingabeNullstelle" @keyup.enter="eingabeVerarbeiten()" placeholder="Nullstelle"
                style="width: 10vw;">
        </div>
        <button @click="eingabeVerarbeiten()">Führe Polynomdivision aus</button>
    </div>

    <div class="anzeige">
        <div v-if="(funktionGueltig && nullstelleGueltig)">
            <p>Eingegebene Polynomfunktion: {{ polynomfunktion }}</p>
            <p>Eingegebene Nullstelle: {{ nullstelle }}</p>
            <p>Ergebnis der Polynomdivision: {{ ausgabe }} </p>
        </div>
        <div v-else-if="!funktionGueltig">
            <p>Die Funktion ist ungültig!</p>
            <p>Für die Eingabe ist zu beachten:</p>
            <ul>
                <li>Arbeite für die Polynomfunktion mit dem Format a*x^n +- b*x^m +- c*x^k...</li> <br>
                <li>Die Koeffizienten a,b,c... , die Exponenten n,m,k... sowie die Nullstelle müssen natürliche Zahlen
                    sein
                </li>
            </ul>
        </div>
        <div v-else-if="!nullstelleGueltig">
            <p>Die Nullstelle ist ungültig! Wenn man die angegebene Stelle in die Polynomfunktion eingibt, muss 0
                als Ergebnis rausbekommen!</p>
        </div>
    </div>
</template>

<style>
@import '../assets/style.css';
</style>