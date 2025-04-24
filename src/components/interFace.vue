<script setup>
import { ref } from 'vue';

// Direkter Wert aus Input
const eingabe = ref('');

// Durch Button aktualisierter Wert des Inputs
const polynomOnClick = ref('');

// Einzelner Term aus dem Input
const term = ref('');

// Ist Input eine gültige Polynomfunktion?
const polynomGueltig = ref(false);

// Funktion, die den Wert des Inputs aktualisiert und überprüft, ob es sich um eine gültige Polynomfunktion handelt
const funktionGueltigOderNicht = (input) => {
    polynomOnClick.value = input;
    if (checkeRegEx(polynomOnClick.value)) {
        polynomGueltig.value = true;
    } else {
        polynomGueltig.value = false;
    }
};

// Überprüft, ob der Input eine gültige Polynomfunktion ist
const checkeRegEx = (input) => {
    // Regulärer Ausdruck einer Polynomfunktion
    const POLYNOM_REGEX = /^\s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*$/;
    return POLYNOM_REGEX.test(input);
}

// Sortiert einzelnen Term ordentlich und liest Skalar und Exponent aus
const termAuslesenUndAnordnen = (input) => {
    let skalar = '';
    let exponent = '';
    let positive = true;

    let skalarInt = 1;

    let i = 0;
    while (input[i] == ' ' && i < input.length) {
        i++;
    }
    if (/\d/.test(input[i])) {
        const anfangIndexSkalar = i;
        while (/\d/.test(input[i]) && i < input.length) {
            i++;
        }
        const endeIndexSkalar = i;
        skalar = input.slice(anfangIndexSkalar, endeIndexSkalar);
        skalarInt = parseInt(skalar);
    }
    while (input[i] == ' ' || input[i] == '*' && i < input.length) {
        i++;
    }
    if (input[i] == 'x') {
        i++;
    }
    while (input[i] == ' ' && i < input.length) {
        i++;
    }
    if (input[i] == '^') {
        i++;
    }
    while (input[i] == ' ' && i < input.length) {
        i++;
    }
    if (/\d/.test(input[i])) {
        const anfangIndexExponent = i;
        while (/\d/.test(input[i]) && i < input.length) {
            i++;
        }
        const endeIndexExponent = i;
        exponent = input.slice(anfangIndexExponent, endeIndexExponent);
    }
    term.value = skalar + "x" + " ^ " + exponent;
}

</script>

<template>
    <div class="view">
        <input type="text" v-model="eingabe" placeholder="Gib hier deine Zahl ein" />
        <button @click="funktionGueltigOderNicht(eingabe)">Berechne</button>
        <button @click="termAuslesenUndAnordnen(eingabe)">Term auslesen</button>
    </div>
    <div class="anzeige">
        <p>Die Funktion ist: {{ polynomOnClick }}</p>
        <p v-if="polynomGueltig">Die Funktion ist gültig</p>
        <p v-else>Die Funktion ist ungültig</p>

        <p>Der Term ist: {{ term }} </p>
    </div>
</template>

<style scoped>
.view {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 60%;

}

.anzeige {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 40%;
}

input {
    height: 40px;
    width: 400px;
    margin-bottom: 20px;
}

button {
    height: 40px;
    width: 200px;
}
</style>