<script setup>
import { ref } from 'vue';

// Direkter Wert der Polynomfunktion aus Input über v-model
const eingabeFunktion = ref('');

// Direkter Werte der Nullstelle aus Input über v-model 
const eingabeNullstelle = ref('');

// Polynomfunktion zum Zeitpunkt des Drückens des Buttons
const polynomfunktion = ref('');

// Nullstelle zum Zeitpunkt des Drückens des Buttons
const nullstelle = ref('');

// Zwischenstand von eingegebeneFunktion, um den Input zu verarbeiten
const zwischenstand = ref('');

// Ist Input eine gültige Polynomfunktion?
const funktionGueltig = ref(false);

// Handelt es sich bei der eingegebenen Nullstelle tatsächlich um eine Nullstelle für die gegebene Funktion?
const nullstelleGueltig = ref(false);

// Arrays für Vorzeichen, Koeffizienten und Exponenten beim Verarbeiten der Polynomfunktion
const vorzeichen = ref([]);
const koeffizienten = ref([]);
const exponenten = ref([]);

// Array nach Verarbeitung
const koeffizientenVollAufbereitet = ref([]);

// Ausgabe auf der Webseite
const ausgabe = ref('');


// Funktion, die den Wert des Inputs aktualisiert und überprüft, ob es sich um eine gültige Polynomfunktion handelt

const inputGueltigOderNicht = () => {
    if (checkeRegEx()) {
        funktionGueltig.value = true;
        if (zwischenstand.value.match(/^[+-\s]*$/)) {
            funktionGueltig.value = false;
        }
        const inputVerarbeitet = zwischenstand.value.replace(/\s/g, '');
        if (inputVerarbeitet[inputVerarbeitet.length - 1] === '+' || inputVerarbeitet[inputVerarbeitet.length - 1] === '-') {
            funktionGueltig.value = false;
        }
        if (inputVerarbeitet.match(/\+\+|--|\+-|-\+/g)) {
            funktionGueltig.value = false;
        }
    } else {
        funktionGueltig.value = false;
    }
}

// Überprüft, ob der Input eine gültige Polynomfunktion ist

const checkeRegEx = () => {
    // Regulärer Ausdruck einer Polynomfunktion
    const POLYNOM_REGEX = /^\s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*$/;
    return POLYNOM_REGEX.test(zwischenstand.value);
}

// Liest einzelne Terme und Werte aus RegEx aus und wandelt sie in Format um, das für das Auslesen der Vorzeichen, Koeffizienten und Exponenten geeignet ist

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
            i--;
        }
    }
    // Fügt dem Input ein '+' vor, wenn der erste Buchstabe kein '+' oder '-' ist, damit erster Term auch erkannt wird
    if (zwischenstand.value[0] != '+' && zwischenstand.value[0] != '-') {
        zwischenstand.value = '+' + zwischenstand.value;
    }
    // Fügt dem Input ein '*' oder '1*' vor dem 'x' hinzu, wenn es nicht schon da ist
    i = 0;
    let nachVorzeichen = false;
    while (i < zwischenstand.value.length) {
        if (zwischenstand.value[i] === '+' || zwischenstand.value[i] === '-') {
            nachVorzeichen = true;
        }
        if (nachVorzeichen && zwischenstand.value[i] === 'x' && zwischenstand.value[i - 1] != '*') {
            if (zwischenstand.value[i - 1] === '+' || zwischenstand.value[i - 1] === '-') {
                zwischenstand.value = zwischenstand.value.slice(0, i) + '1*' + zwischenstand.value.slice(i);
            }
            else {
                zwischenstand.value = zwischenstand.value.slice(0, i) + '*' + zwischenstand.value.slice(i);
            }
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
    vorzeichen.value = [];
    koeffizienten.value = [];
    exponenten.value = [];

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
    // Höchster Exponent in gesamter Polynomfunktion
    let highestExponent = 0;
    for (let i = 0; i < exponenten.value.length; i++) {
        if (exponenten.value[i] > highestExponent) {
            highestExponent = exponenten.value[i];
        }
    }

    // In Array sollen alle Koeffizienten entsprechend der Höhe ihrer Exponenten gespeichert werden
    let sortierteKoeffizienten = ref(new Array(highestExponent.value));

    // Initialisiert das Array mit 0
    for (let i = 0; i <= highestExponent; i++) {
        sortierteKoeffizienten.value[i] = 0;
    }

    //Füge Koeffizienten termweise aus dem Array von polynomfunktionZuArrays in das Array sortedKoeffizienten ein
    for (let i = 0; i < exponenten.value.length; i++) {
        let index = exponenten.value[i];
        if (vorzeichen.value[i] === '+') {
            sortierteKoeffizienten.value[index] += koeffizienten.value[i];
        } else {
            sortierteKoeffizienten.value[index] -= koeffizienten.value[i];
        }
    }

    // Kehre Array um, da das Horner-Schema beim höchsten Exponenten beginnt
    sortierteKoeffizienten.value.reverse();

    koeffizientenVollAufbereitet.value = [];
    koeffizientenVollAufbereitet.value = sortierteKoeffizienten.value;
}

const nullstelleVerifizieren = () => {
    const sum = ref(0);
    for (let i = 0; i < koeffizientenVollAufbereitet.value.length; i++) {
        sum.value += koeffizientenVollAufbereitet.value[i] * (Math.pow(parseInt(nullstelle.value), koeffizientenVollAufbereitet.value.length - i - 1));
    }
    if (sum.value === 0) {
        nullstelleGueltig.value = true;
    }
    else {
        nullstelleGueltig.value = false;
    }
}

// Auf Basis der sortierten Daten von arraysSortieren wird das Horner-Schema ausgeführt

const hornerSchema = () => {
    const tmp = ref(0);
    for (let i = 0; i < koeffizientenVollAufbereitet.value.length; i++) {
        koeffizientenVollAufbereitet.value[i] = koeffizientenVollAufbereitet.value[i] + tmp.value;
        tmp.value = koeffizientenVollAufbereitet.value[i] * parseInt(nullstelle.value);
    }
    koeffizientenVollAufbereitet.value = koeffizientenVollAufbereitet.value.slice(0, koeffizientenVollAufbereitet.value.length-1);
}

// Umwandlung des Koeffizienten-Arrays zu lesebarer Funktion

const ergebnisZuString = () => {
const ausgabeTmp = ref('');
const highestExponent = ref(koeffizientenVollAufbereitet.value.length - 1);
for (let i = 0; i < koeffizientenVollAufbereitet.value.length; i++) {
    if (koeffizientenVollAufbereitet.value[i] != 0) {
        if (koeffizientenVollAufbereitet.value[i] > 0) {
            ausgabeTmp.value += ' +';
        }
        else {
            ausgabeTmp.value += ' ';
        }
        if (highestExponent.value - i === 0) {
            ausgabeTmp.value += koeffizientenVollAufbereitet.value[i];
        }
        else if (highestExponent.value - i === 1) {
            ausgabeTmp.value += koeffizientenVollAufbereitet.value[i] + 'x';
        }
        else {
            ausgabeTmp.value += koeffizientenVollAufbereitet.value[i] + 'x^' + (highestExponent.value - i);
        }
    }
    // Kann für mehrfaches Horner-Schema bei Ableitungen zur Differenzierbarkeit genutzt werden verwendet werden!
    if (ausgabeTmp.value === '') {
        ausgabeTmp.value = '0';
    }
}
// Ausgabe
ausgabe.value = `${ausgabeTmp.value}`;
}

// Anstatt Polynomdivison für Auslesen des Funktionswertes (der Ableitung)

const funktionswertZuString = () => {
    //TODO Fakultät
    ausgabe.value = `${koeffizientenVollAufbereitet.value[koeffizientenVollAufbereitet.value.length-1]}`;
}


// Verarbeitet den Input, führt obige Funktionen aus
const eingabeVerarbeiten = () => {
    zwischenstand.value = eingabeFunktion.value;
    polynomfunktion.value = eingabeFunktion.value;
    nullstelle.value = eingabeNullstelle.value;
    inputGueltigOderNicht();
    polynomfunktionAuslesen();
    polynomfunktionZuArrays();
    arraysSortieren();
    nullstelleVerifizieren();
    hornerSchema();
    hornerSchema();
    //ergebnisZuString();
    funktionswertZuString();
}
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
        <div v-if="funktionGueltig & nullstelleGueltig">
            <p>Eingegebene Polynomfunktion: {{ polynomfunktion }}</p>
            <p>Eingegebene Nullstelle: {{ nullstelle }}</p>
            <p>Ergebnis der Polynomdivision: {{ ausgabe }} </p>
        </div>
        <div v-else>
            <div v-if="!funktionGueltig">
                <p>Die Funktion ist ungültig!</p>
                <p>Für die Eingabe ist zu beachten:</p>
                <li>Arbeite für die Polynomfunktion mit dem Format a*x^n +- b*x^m +- c*x^k...</li> <br>
                <li>Die Koeffizienten a,b,c... , die Exponenten n,m,k... sowie die Nullstelle müssen natürliche Zahlen
                    sein
                </li>
            </div>
            <div else>
                <p>Die Nullstelle ist ungültig! Wenn man die angegebene Stelle in die Polynomfunktion eingibt, muss 0
                    als Ergebnis rausbekommen!</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.Ueberschrift {
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    padding-top: 3%;
    font-size: 300%;
    font-weight: 600;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.eingabeAlles {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 40%;
    row-gap: 10%;
}

.inputs {
    display: flex;
    justify-content: center;
    align-items: row;
    flex-direction: row;
    height: 20%;
    gap: 5%;
}

.anzeige {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color: white;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    text-align: center;
    font-size: 120%;
}

button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 15%;
    width: 15%;
    width: fit-content
}
</style>