<script setup>
import { eingabeFunktionPolynomdivision, eingabeNullstellePolynomdivision, polynomfunktionPolynomdivision, nullstellePolynomdivision, funktionGueltigPolynomdivision, stelleGueltigPolynomdivision, ausgabePolynomdivision, eingabeVerarbeitenPolynomdivision } from '../composables/polynomfunktionMethoden.js';
</script>

<template>
    <div class="Ueberschrift">
        Horner-Rechner - Polynomdivision
    </div>
    <div class="eingabeBenutzerTextUndButton">
        <div class="eingabeBenutzerNurText">
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
            <p >Ergebnis der Polynomdivision: <span class="wichtigeAusgabe"> {{ ausgabePolynomdivision }} </span></p>
        </div>
        <div v-else-if="!funktionGueltigPolynomdivision">
            <p>Die eingegebene Funktion ist ungültig!</p>
            <p>Es ist zu beachten:</p>
            <p>Arbeite für die Polynomfunktion mit dem Format a*x^n + b*x^m + c*x^k...</p>
            <p>Die Koeffizienten a,b,c... sowie die eingegebene Nullstelle müssen ganze Zahlen, die Exponenten n,m,k...
                natürliche Zahlen sein</p>
        </div>
        <div v-else-if="!stelleGueltigPolynomdivision">
            <p>Es muss eine ganze Zahl als Nullstelle der Polynomfunktion eingegeben werden!</p>
        </div>
    </div>
</template>

<style scoped>
@import '../assets/styleForAll.css';
@import '../assets/styleForTextInputs.css';
</style>