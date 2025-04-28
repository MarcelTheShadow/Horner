<script setup>
import { ref } from 'vue';

// Direkter Wert aus Input
const eingabe = ref('');

// Durch Button aktualisierter Wert des Inputs
const polynomOnClick = ref('');

// Ist Input eine gültige Polynomfunktion?
const polynomGueltig = ref(false);

// Einzelner Term aus dem Input
const term = ref('');
const terme = ref([]);

// Funktion, die den Wert des Inputs aktualisiert und überprüft, ob es sich um eine gültige Polynomfunktion handelt

const inputGueltigOderNicht = (input) => {
    polynomOnClick.value = input;
    if (checkeRegEx(polynomOnClick.value)) {
        polynomGueltig.value = true;
        if (input.match(/^[+-\s]*$/)) {
            polynomGueltig.value = false;
        }
        const inputVerarbeitet = input.replace(/\s/g, '');
        if(inputVerarbeitet[inputVerarbeitet.length - 1] === '+' || inputVerarbeitet[inputVerarbeitet.length - 1] === '-') {
            polynomGueltig.value = false;
        }
        if(inputVerarbeitet.match(/\+\+|--|\+-|-\+/g)){
            polynomGueltig.value = false;
        }
    } else {
        polynomGueltig.value = false;
    }
}

// Überprüft, ob der Input eine gültige Polynomfunktion ist

const checkeRegEx = (input) => {
    // Regulärer Ausdruck einer Polynomfunktion
    const POLYNOM_REGEX = /^\s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*$/;
    return POLYNOM_REGEX.test(input);
}

// Liest einzelne Terme und Werte aus RegEx aus

const polynomfunktionAuslesen = (input) => {
    terme.value = [];

    // Entfernt alle Leerzeichen aus dem Input
    let i = 0;
    while (i < input.length) {
        i++;
        if (input[i] === ' ') {
            input = input.slice(0, i) + input.slice(i + 1);
        }

    }
    // Fügt dem Input ein '+' vor, wenn der erste Buchstabe kein '+' oder '-' ist, damit erster Term auch erkannt wird
    if (input[0] != '+' && input[0] != '-') {
        input = '+' + input;
    }
    // Fügt dem Input ein '*' vor dem 'x' hinzu, wenn es nicht schon da ist
    i = 0;
    let nachVorzeichen = false;
    while (i < input.length) {
        if (input[i] === '+' || input[i] === '-') {
            nachVorzeichen = true;
        }
        if (nachVorzeichen && input[i] === 'x' && input[i - 1] != '*') {
            input = input.slice(0, i) + '*' + input.slice(i);
            nachVorzeichen = false;
        }
        i++;
    }
    // Fügt dem Input ein '^1' hinzu, wenn es nicht schon da ist
    i = 0;
    while (i < input.length) {
        if (input[i] === 'x' && input[i + 1] != '^') {
            input = input.slice(0, i + 1) + '^1' + input.slice(i + 1);
        }
        i++;
    }

    // Falls es sich um eine Konstante bzw. x^0 handelt, wird 'x^0' hinzugefügt
   

    const einzelnerTerm = /[+-]\d*\*x\^\d+/g;

    for (const match of input.matchAll(einzelnerTerm)) {
        if (match) {
            terme.value += match + ',';
        }
    }
}

</script>

<template>
    <div class="view">
        <input type="text" v-model="eingabe" placeholder="Gib hier deine Zahl ein" />
        <button @click="inputGueltigOderNicht(eingabe)">Berechne</button>
        <button @click="polynomfunktionAuslesen(eingabe)">Term auslesen</button>
    </div>
    <div class="anzeige">
        <p>Die Funktion ist: {{ polynomOnClick }}</p>
        <p v-if="polynomGueltig">Die Funktion ist gültig</p>
        <p v-else>Die Funktion ist ungültig</p>

        <p>Der Term ist: {{ terme }} </p>
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