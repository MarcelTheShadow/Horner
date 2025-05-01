<script setup>
import { ref } from 'vue';

// Direkter Wert aus Input
const eingegebeneFunktion = ref('');

// Ist Input eine gültige Polynomfunktion?
const polynomGueltig = ref(false);

// Ausgabe
const ausgabe = ref('');

// Funktion, die den Wert des Inputs aktualisiert und überprüft, ob es sich um eine gültige Polynomfunktion handelt

const inputGueltigOderNicht = (eingabe) => {
    if (checkeRegEx(eingabe)) {
        polynomGueltig.value = true;
        if (eingabe.match(/^[+-\s]*$/)) {
            polynomGueltig.value = false;
        }
        const inputVerarbeitet = eingabe.replace(/\s/g, '');
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

const checkeRegEx = (eingabe) => {
    // Regulärer Ausdruck einer Polynomfunktion
    const POLYNOM_REGEX = /^\s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*$/;
    return POLYNOM_REGEX.test(eingabe);
}

// Liest einzelne Terme und Werte aus RegEx aus

const polynomfunktionAuslesen = (eingabe) => {
    // Hier sollen die einzelnen Terme gespeichert werden
    const terme = ref([]);
    terme.value = [];

    // Entfernt alle Leerzeichen aus dem Input
    let i = 0;
    while (i < eingabe.length) {
        i++;
        if (eingabe[i] === ' ') {
            eingabe = eingabe.slice(0, i) + eingabe.slice(i + 1);
        }

    }
    // Fügt dem Input ein '+' vor, wenn der erste Buchstabe kein '+' oder '-' ist, damit erster Term auch erkannt wird
    if (eingabe[0] != '+' && eingabe[0] != '-') {
        eingabe = '+' + eingabe;
    }
    // Fügt dem Input ein '*' vor dem 'x' hinzu, wenn es nicht schon da ist
    i = 0;
    let nachVorzeichen = false;
    while (i < eingabe.length) {
        if (eingabe[i] === '+' || eingabe[i] === '-') {
            nachVorzeichen = true;
        }
        if (nachVorzeichen && eingabe[i] === 'x' && eingabe[i - 1] != '*') {
            eingabe = eingabe.slice(0, i) + '*' + eingabe.slice(i);
            nachVorzeichen = false;
        }
        i++;
    }
    // Fügt dem Input ein '^1' hinzu, wenn es nicht schon da ist
    i = 0;
    while (i < eingabe.length) {
        if (eingabe[i] === 'x' && eingabe[i + 1] != '^') {
            eingabe = eingabe.slice(0, i + 1) + '^1' + eingabe.slice(i + 1);
        }
        i++;
    }

    // Falls es sich um eine Konstante bzw. x^0 handelt, wird 'x^0' hinzugefügt
    i = 1;
    let xIstVorhanden = false;
    while (i < eingabe.length) {
        xIstVorhanden = false;
        while (eingabe[i] != '+' && eingabe[i] != '-' && i < eingabe.length) {
            if (eingabe[i] === 'x') {
                xIstVorhanden = true;
            }
            i++;
        }
        if (!xIstVorhanden) {
            eingabe = eingabe.slice(0, i) + '*x^0' + eingabe.slice(i);
            i += 5;
        }
    }

    const einzelnerTerm = /[+-]\d*\*x\^\d+/g;

    for (const match of eingabe.matchAll(einzelnerTerm)) {
        if (match) {
            terme.value += match + ',';
        }
    }
    ausgabe.value = terme.value; //TODO: WEGMACHEN
}

const polynomfunktionZuArrays = () => {
    // Arrays für Vorzeichen, Koeffizienten und Exponenten
    const vorzeichen = [];
    const koeffizienten = [];
    const exponenten = [];

    // Vorzeichen extrahieren
    for (let match of ausgabe.value.matchAll(/[+-]/g)) {
        vorzeichen.push(match[0]);
    }

    // Koeffizienten und Exponenten extrahieren
    let i = 0;
    for(let match of ausgabe.value.matchAll(/\d+/g)) {
        if (i % 2 === 0) {
            koeffizienten.push(match[0]);
        } else {
            exponenten.push(match[0]);
        }
        i++;
    }

    ausgabe.value = `Vorzeichen: ${vorzeichen}\nKoeffizienten: ${koeffizienten}\nExponenten: ${exponenten}`; //TODO: WEGMACHEN
}


// Verarbeitet den Input, führt obige Funktionen aus
const eingabeVerarbeiten = (eingabe) => {
    inputGueltigOderNicht(eingabe);
    polynomfunktionAuslesen(eingabe);
    polynomfunktionZuArrays();
}
</script>

<template>
    <div class="view">
        <input type="text" v-model="eingegebeneFunktion" placeholder="Gib hier deine Funktion ein"
            @keyup.enter="eingabeVerarbeiten(eingegebeneFunktion)" />
        <button @click="eingabeVerarbeiten(eingegebeneFunktion)">Führe Polynomdivision aus</button>
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