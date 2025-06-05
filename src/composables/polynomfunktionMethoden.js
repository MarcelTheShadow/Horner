import { ref } from "vue";

// Direkter Wert der Polynomfunktion aus Input über v-model
export const eingabeFunktion = ref("");

// Direkter Wert der Nullstelle aus Input über v-model
export const eingabeNullstelle = ref("");

// Polynomfunktion zum Zeitpunkt des Drückens des Buttons
export const polynomfunktion = ref("");

// Nullstelle zum Zeitpunkt des Drückens des Buttons
export const nullstelle = ref("");

// Ist Input eine gültige Polynomfunktion?
export const funktionGueltig = ref(false);

// Handelt es sich bei der eingegebenen Nullstelle tatsächlich um eine Nullstelle für die gegebene Funktion?
export const nullstelleGueltig = ref(false);

// Zwischenstand von eingegebeneFunktion, um den Input zu verarbeiten
const zwischenstand = ref("");

// Arrays für Vorzeichen, Koeffizienten und Exponenten beim Verarbeiten der Polynomfunktion
const vorzeichen = ref([]);
const koeffizienten = ref([]);
const exponenten = ref([]);

// Array nach Verarbeitung
const koeffizientenVollAufbereitet = ref([]);

// Ausgabe auf der Webseite
export const ausgabe = ref("");

// Funktion, die den Wert des Inputs aktualisiert und überprüft, ob es sich um eine gültige Polynomfunktion und eine gültige Nullstelle handelt

const inputGueltigOderNicht = () => {
    // Standardmäßig ist die Funktion gültig, prüfe mittels RegEx und weiterer Logik, ob sie es tatsächlich ist
    funktionGueltig.value = true;

    // Regulärer Ausdruck einer Polynomfunktion mit viel Flexibilität
    if (
        /^\s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*$/.test(
            zwischenstand.value
        ) === false
    ) {
        funktionGueltig.value = false;
    }
    // Überprüft, ob der Input nur aus '+' und '-' besteht
    if (zwischenstand.value.match(/^[+-\s]*$/)) {
        funktionGueltig.value = false;
    }
    const inputVerarbeitet = zwischenstand.value.replace(/\s/g, "");
    // Überprüft, ob der Input mit einem '+' oder '-' endet
    if (
        inputVerarbeitet[inputVerarbeitet.length - 1] === "+" ||
        inputVerarbeitet[inputVerarbeitet.length - 1] === "-"
    ) {
        funktionGueltig.value = false;
    }
    // Nullstelle sollte eine natürliche Zahl sein, keine weiteren Zeichen erlaubt
    if (/^-?\d+$/.test(eingabeNullstelle.value)) {
        nullstelleGueltig.value = true;
    } else {
        nullstelleGueltig.value = false;
    }
};

// Liest einzelne Terme und Werte aus RegEx aus und wandelt sie in Format um, das für das Auslesen der Vorzeichen, Koeffizienten und Exponenten geeignet ist

const polynomfunktionAuslesen = () => {
    // Hier sollen die einzelnen Terme gespeichert werden
    const terme = ref([]);
    terme.value = [];

    // Entfernt alle Leerzeichen aus dem Input
    let i = 0;
    while (i < zwischenstand.value.length) {
        if (zwischenstand.value[i] === " ") {
            zwischenstand.value =
                zwischenstand.value.slice(0, i) +
                zwischenstand.value.slice(i + 1);
            i--;
        }
        i++;
    }
    // Fügt dem Input ein '+' vor, wenn der erste Buchstabe kein '+' oder '-' ist, damit erster Term auch erkannt wird
    if (zwischenstand.value[0] != "+" && zwischenstand.value[0] != "-") {
        zwischenstand.value = "+" + zwischenstand.value;
    }
    // Fügt dem Input ein '*' oder '1*' vor dem 'x' hinzu, wenn es nicht schon da ist
    i = 0;
    let nachVorzeichen = false;
    while (i < zwischenstand.value.length) {
        if (zwischenstand.value[i] === "+" || zwischenstand.value[i] === "-") {
            nachVorzeichen = true;
        }
        if (
            nachVorzeichen &&
            zwischenstand.value[i] === "x" &&
            zwischenstand.value[i - 1] != "*"
        ) {
            if (
                zwischenstand.value[i - 1] === "+" ||
                zwischenstand.value[i - 1] === "-"
            ) {
                zwischenstand.value =
                    zwischenstand.value.slice(0, i) +
                    "1*" +
                    zwischenstand.value.slice(i);
            } else {
                zwischenstand.value =
                    zwischenstand.value.slice(0, i) +
                    "*" +
                    zwischenstand.value.slice(i);
            }
            nachVorzeichen = false;
        }
        i++;
    }
    // Fügt dem Input ein '^1' hinzu, wenn es nicht schon da ist
    i = 0;
    while (i < zwischenstand.value.length) {
        if (
            zwischenstand.value[i] === "x" &&
            zwischenstand.value[i + 1] != "^"
        ) {
            zwischenstand.value =
                zwischenstand.value.slice(0, i + 1) +
                "^1" +
                zwischenstand.value.slice(i + 1);
        }
        i++;
    }

    // Falls es sich um eine Konstante bzw. x^0 handelt, wird 'x^0' hinzugefügt
    i = 1;
    let xIstVorhanden = false;
    while (i < zwischenstand.value.length) {
        xIstVorhanden = false;
        while (
            zwischenstand.value[i] != "+" &&
            zwischenstand.value[i] != "-" &&
            i < zwischenstand.value.length
        ) {
            if (zwischenstand.value[i] === "x") {
                xIstVorhanden = true;
            }
            i++;
        }
        if (!xIstVorhanden) {
            zwischenstand.value =
                zwischenstand.value.slice(0, i) +
                "*x^0" +
                zwischenstand.value.slice(i);
            i += 5;
        }
    }

    const einzelnerTerm = /[+-]\d+\*x\^\d+/g;

    for (const match of zwischenstand.value.matchAll(einzelnerTerm)) {
        if (match) {
            terme.value += match + ",";
        }
    }
    zwischenstand.value = terme.value;
};

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
        // Da jeder Term aus Koeffizient und Exponent besteht, wird abwechselnd der Koeffizient und der Exponent in die jeweiligen Arrays eingefügt
        if (i % 2 === 0) {
            koeffizienten.value.push(parseInt(match[0]));
        } else {
            exponenten.value.push(parseInt(match[0]));
        }
        i++;
    }
};

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
    let sortierteKoeffizienten = ref(new Array(highestExponent.valueOf));

    // Initialisiert das Array mit 0
    for (let i = 0; i <= highestExponent; i++) {
        sortierteKoeffizienten.value[i] = 0;
    }

    // Füge Koeffizienten termweise aus dem Array von polynomfunktionZuArrays in das Array sortedKoeffizienten ein
    // Gleiche Exponenten werden addiert/subtrahiert, je nach Vorzeichen, jetzt gibt es nur noch ein Array mit den Koeffizienten, die nach Exponenten sortiert sind
    for (let i = 0; i < exponenten.value.length; i++) {
        let index = exponenten.value[i];
        if (vorzeichen.value[i] === "+") {
            sortierteKoeffizienten.value[index] += koeffizienten.value[i];
        } else {
            sortierteKoeffizienten.value[index] -= koeffizienten.value[i];
        }
    }

    // Kehre Array um, da das Horner-Schema beim höchsten Exponenten beginnt
    sortierteKoeffizienten.value.reverse();

    koeffizientenVollAufbereitet.value = [];
    koeffizientenVollAufbereitet.value = sortierteKoeffizienten.value;
};

// Überprüft, ob die eingegebene Nullstelle tatsächlich eine Nullstelle der Polynomfunktion ist

const nullstelleVerifizieren = () => {
    const sum = ref(0);
    for (let i = 0; i < koeffizientenVollAufbereitet.value.length; i++) {
        sum.value +=
            koeffizientenVollAufbereitet.value[i] *
            Math.pow(
                parseInt(nullstelle.value),
                koeffizientenVollAufbereitet.value.length - i - 1
            );
    }
    if (sum.value != 0) {
        nullstelleGueltig.value = false;
    }
};

// Auf Basis der sortierten Daten von arraysSortieren wird das Horner-Schema ausgeführt

const hornerSchema = () => {
    const tmp = ref(0);
    for (let i = 0; i < koeffizientenVollAufbereitet.value.length; i++) {
        koeffizientenVollAufbereitet.value[i] =
            koeffizientenVollAufbereitet.value[i] + tmp.value;
        tmp.value =
            koeffizientenVollAufbereitet.value[i] * parseInt(nullstelle.value);
    }
};

// Entferne den letzten Eintrag, die Wertung der Exponenten ist durch die Verringerung der Länge des Arrays gegeben

const entferneFunktionswert = () => {
    koeffizientenVollAufbereitet.value =
        koeffizientenVollAufbereitet.value.slice(
            0,
            koeffizientenVollAufbereitet.value.length - 1
        );
}

// Umwandlung des Koeffizienten-Arrays zu lesbarer Funktion

const ergebnisZuString = () => {

    const ausgabeTmp = ref("");
    const highestExponent = ref(koeffizientenVollAufbereitet.value.length - 1);
    for (let i = 0; i < koeffizientenVollAufbereitet.value.length; i++) {
        if (koeffizientenVollAufbereitet.value[i] != 0) {
            if (koeffizientenVollAufbereitet.value[i] > 0) {
                ausgabeTmp.value += " +";
            } else {
                ausgabeTmp.value += " ";
            }
            if (highestExponent.value - i === 0) {
                ausgabeTmp.value += koeffizientenVollAufbereitet.value[i];
            } else if (highestExponent.value - i === 1) {
                ausgabeTmp.value += koeffizientenVollAufbereitet.value[i] + "x";
            } else {
                ausgabeTmp.value +=
                    koeffizientenVollAufbereitet.value[i] +
                    "x^" +
                    (highestExponent.value - i);
            }
        }
    }

    if (ausgabeTmp.value === "") {
        ausgabeTmp.value = "0";
    }

    ausgabe.value = `${ausgabeTmp.value}`;
};

// Anstatt Polynomdivison für Auslesen des Funktionswertes (der Ableitung)

const funktionswertZuString = () => {
    //TODO Fakultät
    ausgabe.value = `${
        koeffizientenVollAufbereitet.value[
            koeffizientenVollAufbereitet.value.length - 1
        ]
    }`;
};

// Verarbeitet den Input, Funktion für Polynomdivision
export const eingabeVerarbeitenPolynomdivision = () => {
    zwischenstand.value = eingabeFunktion.value;
    polynomfunktion.value = eingabeFunktion.value;
    nullstelle.value = eingabeNullstelle.value;
    inputGueltigOderNicht();
    polynomfunktionAuslesen();
    polynomfunktionZuArrays();
    arraysSortieren();
    nullstelleVerifizieren();
    hornerSchema();
    entferneFunktionswert();
    ergebnisZuString();
};

// Verarbeitet den Input, Funktion für Funktionswertberechnung

export const eingabeVerarbeitenFunktionswertberechnung = () => {
    zwischenstand.value = eingabeFunktion.value;
    polynomfunktion.value = eingabeFunktion.value;
    nullstelle.value = eingabeNullstelle.value;
    inputGueltigOderNicht();
    polynomfunktionAuslesen();
    polynomfunktionZuArrays();
    arraysSortieren();
    for(let i = 0; i < 5; i++) {
        hornerSchema();
        entferneFunktionswert();
    }
    hornerSchema();
    funktionswertZuString();
};
