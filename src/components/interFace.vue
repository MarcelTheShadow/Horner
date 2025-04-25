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

// Liest einzelne Terme und Werte aus RegEx aus

const polynomfunktionAuslesen = (input) => {
    terme.value = [];

    // Fügt dem Input ein '+' vor, wenn der erste Buchstabe kein '+' oder '-' ist, damit erster Term auch erkannt wird
    let i = 0;
    while (i < input.length) {
        i++;
        if(input[i] === ' '){
            input = input.slice(0, i) + input.slice(i + 1);
        }
    }
    if (input[0] != '+' && input[0] != '-') {
        input = '+' + input;
    }

    const einzelnerTerm = /[+-]\d*\*x\^\d+/g;

    for(const match of input.matchAll(einzelnerTerm)) {
       if(match){
            terme.value += match;
       }
    }
}

</script>

<template>
    <div class="view">
        <input type="text" v-model="eingabe" placeholder="Gib hier deine Zahl ein" />
        <button @click="funktionGueltigOderNicht(eingabe)">Berechne</button>
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