<script setup>
import { h, ref } from 'vue';

// Direkter Wert aus Input über v-model
const eingegebeneFunktion = ref('');


// Zwischenstand von eingegebeneFunktion, um den Input zu verarbeiten
const zwischenstand = ref('');

// Ist Input eine gültige Polynomfunktion?
const polynomGueltig = ref(false);

// Ausgabe auf der Webseite
const ausgabe = ref('');


// Arrays für Vorzeichen, Koeffizienten und Exponenten
let vorzeichen = ref([]);
let koeffizienten = ref([]);
let exponenten = ref([]);

// Funktion, die den Wert des Inputs aktualisiert und überprüft, ob es sich um eine gültige Polynomfunktion handelt

const inputGueltigOderNicht = () => {
    if (checkeRegEx()) {
        polynomGueltig.value = true;
        if (zwischenstand.value.match(/^[+-\s]*$/)) {
            polynomGueltig.value = false;
        }
        const inputVerarbeitet = zwischenstand.value.replace(/\s/g, '');
        if (inputVerarbeitet[inputVerarbeitet.length - 1] === '+' || inputVerarbeitet[inputVerarbeitet.length - 1] === '-') {
            polynomGueltig.value = false;
        }
        if (inputVerarbeitet.match(/\+\+|--|\+-|-\+/g)) {
            polynomGueltig.value = false;
        }
    } else {
        polynomGueltig.value = false;
    }
}

// Überprüft, ob der Input eine gültige Polynomfunktion ist

const checkeRegEx = () => {
    // Regulärer Ausdruck einer Polynomfunktion
    const POLYNOM_REGEX = /^\s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*$/;
    return POLYNOM_REGEX.test(zwischenstand.value);
}

// Liest einzelne Terme und Werte aus RegEx aus

const polynomfunktionAuslesen = () => {
    // Hier sollen die einzelnen Terme gespeichert werden
    const terme = ref([]);
    terme.value = [];

    // Entfernt alle Leerzeichen aus dem Input
    let i = 0;
    while (i < zwischenstand.value.length) {
        i++;
        if (zwischenstand.value[i] === ' ') {
            zwischenstand.value = zwischenstand.value.slice(0, i) + zwischenstand.value.slice(i + 1);
        }

    }
    // Fügt dem Input ein '+' vor, wenn der erste Buchstabe kein '+' oder '-' ist, damit erster Term auch erkannt wird
    if (zwischenstand.value[0] != '+' && zwischenstand.value[0] != '-') {
        zwischenstand.value = '+' + zwischenstand.value;
    }
    // Fügt dem Input ein '*' vor dem 'x' hinzu, wenn es nicht schon da ist
    i = 0;
    let nachVorzeichen = false;
    while (i < zwischenstand.value.length) {
        if (zwischenstand.value[i] === '+' || zwischenstand.value[i] === '-') {
            nachVorzeichen = true;
        }
        if (nachVorzeichen && zwischenstand.value[i] === 'x' && zwischenstand.value[i - 1] != '*') {
            zwischenstand.value = zwischenstand.value.slice(0, i) + '*' + zwischenstand.value.slice(i);
            nachVorzeichen = false;
        }
        i++;
    }
    // Fügt dem Input ein '^1' hinzu, wenn es nicht schon da ist
    i = 0;
    while (i < zwischenstand.value.length) {
        if (zwischenstand.value[i] === 'x' && zwischenstand.value[i + 1] != '^') {
            zwischenstand.value = zwischenstand.value.slice(0, i + 1) + '^1' + zwischenstand.value.slice(i + 1);
        }
        i++;
    }

    // Falls es sich um eine Konstante bzw. x^0 handelt, wird 'x^0' hinzugefügt
    i = 1;
    let xIstVorhanden = false;
    while (i < zwischenstand.value.length) {
        xIstVorhanden = false;
        while (zwischenstand.value[i] != '+' && zwischenstand.value[i] != '-' && i < zwischenstand.value.length) {
            if (zwischenstand.value[i] === 'x') {
                xIstVorhanden = true;
            }
            i++;
        }
        if (!xIstVorhanden) {
            zwischenstand.value = zwischenstand.value.slice(0, i) + '*x^0' + zwischenstand.value.slice(i);
            i += 5;
        }
    }

    const einzelnerTerm = /[+-]\d*\*x\^\d+/g;

    for (const match of zwischenstand.value.matchAll(einzelnerTerm)) {
        if (match) {
            terme.value += match + ',';
        }
    }
    zwischenstand.value = terme.value;
}

// Konvertiert die Polynomfunktion in Arrays für Vorzeichen, Koeffizienten und Exponenten

const polynomfunktionZuArrays = () => {
    // Arrays für Vorzeichen, Koeffizienten und Exponenten
    vorzeichen = ref([]);
    koeffizienten = ref([]);
    exponenten = ref([]);

    // Vorzeichen extrahieren
    for (let match of zwischenstand.value.matchAll(/[+-]/g)) {
        vorzeichen.value.push(match[0]);
    }

    // Koeffizienten und Exponenten extrahieren
    let i = 0;
    for (let match of zwischenstand.value.matchAll(/\d+/g)) {
        if (i % 2 === 0) {
            koeffizienten.value.push(parseInt(match[0]));
        } else {
            exponenten.value.push(parseInt(match[0]));
        }
        i++;
    }
}

// Sortiert die Arrays für Vorzeichen, Koeffizienten und Exponenten nach den Exponenten

const arraysSortieren = () => {
    let highestExponent = 0;
    for(let i = 0; i < exponenten.value.length; i++) {
        if (exponenten.value[i] > highestExponent) {
            highestExponent = exponenten.value[i];
        }
    }

    const sortedKoeffizienten = ref(new Array(highestExponent.value).fill(0));

    for (let i = 0; i < exponenten.value.length; i++) {
        let index = exponenten.value[i];
        if (vorzeichen.value[i] === '+') {
            sortedKoeffizienten.value[index] = koeffizienten.value[i];
        } else {
            sortedKoeffizienten.value[index] = koeffizienten.value[i];
        }
    }

    koeffizienten.value = sortedKoeffizienten.value;

    ausgabe.value = `Ergebnis: ${koeffizienten.value}`;
}


// Verarbeitet den Input, führt obige Funktionen aus
const eingabeVerarbeiten = () => {
    zwischenstand.value = eingegebeneFunktion.value;
    inputGueltigOderNicht();
    polynomfunktionAuslesen();
    polynomfunktionZuArrays();
    arraysSortieren();
}
</script>

<template>
    <div class="view">
        <input type="text" v-model="eingegebeneFunktion" placeholder="Gib hier deine Funktion ein"
            @keyup.enter="eingabeVerarbeiten()" />
        <button @click="eingabeVerarbeiten()">Führe Polynomdivision aus</button>
    </div>
    <div class="anzeige">
        <div v-if="polynomGueltig">
            <p>Der Term ist: {{ ausgabe }} </p>
        </div>
        <div v-else>
            <p>Die Funktion ist ungültig</p>
            <p>Arbeite mit dem Format a*x^n +- b*x^m +- c*x^k...</p>
            <p> Die Koeffizienten a,b,c... sowie die Exponenten n,m,k... müssen natürliche Zahlen sein</p>
        </div>

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