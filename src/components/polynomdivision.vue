<script setup>
import { eingabeFunktionPolynomdivision, eingabeNullstellePolynomdivision, polynomfunktionPolynomdivision, nullstellePolynomdivision, funktionGueltigPolynomdivision, stelleGueltigPolynomdivision, ausgabePolynomdivision, eingabeVerarbeitenPolynomdivision } from '../composables/polynomfunktionMethoden.js';
</script>

<template>
    <div class="Ueberschrift">
        Horner-Rechner - Polynomdivision
    </div>
    <div class="inputUserTextAndButton">
        <div class="inputUserTextOnly">
            <input type="text" v-model="eingabeFunktionPolynomdivision"
                @keyup.enter="eingabeVerarbeitenPolynomdivision()" placeholder="Polynomfunktion" style="width: 20vw;" />
            <input type="text" v-model="eingabeNullstellePolynomdivision"
                @keyup.enter="eingabeVerarbeitenPolynomdivision()" placeholder="Nullstelle" style="width: 10vw;">
        </div>
        <button @click="eingabeVerarbeitenPolynomdivision()">Führe Polynomdivision aus</button>
    </div>

    <div class="text">
        <div v-if="(funktionGueltigPolynomdivision && stelleGueltigPolynomdivision)">
            <p>Eingegebene Polynomfunktion: {{ polynomfunktionPolynomdivision }}</p>
            <p>Eingegebene Nullstelle: {{ nullstellePolynomdivision }}</p>
            <p>Ergebnis der Polynomdivision: {{ ausgabePolynomdivision }} </p>
        </div>
        <div v-else-if="!funktionGueltigPolynomdivision">
            <p>Die Funktion ist ungültig!</p>
            <p>Für die Eingabe ist zu beachten:</p>
            <p>Arbeite für die Polynomfunktion mit dem Format a*x^n +- b*x^m +- c*x^k...</p>
            <p>Die Koeffizienten a,b,c... müssen natürliche , die Exponenten n,m,k... sowie die eingegebene Nullstelle müssen ganze Zahlen
                sein</p>
        </div>
        <div v-else-if="!stelleGueltigPolynomdivision">
            <p>Die Nullstelle ist ungültig! Wenn man die angegebene Stelle in die Polynomfunktion eingibt, muss 0
                als Ergebnis rausbekommen!</p>
        </div>
    </div>
</template>

<style scoped>
@import '../assets/styleForAll.css';
@import '../assets/styleForTextInputs.css';
</style>