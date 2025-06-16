import { ref } from "vue";

/// INTERNE VARIABLEN FÜR POLYNOMDIVISION UND FUNKTIONSWERTBERECHNUNG

// Interne (Null)stelle zur Berechnung
export const stelleIntern = ref("");

// Zwischenstand von eingegebeneFunktion, um den Input zu verarbeiten
export const zwischenstandPolynomfunktionIntern = ref("");

// Arrays für Vorzeichen, Koeffizienten und Exponenten beim Verarbeiten der Polynomfunktion
export const vorzeichenIntern = ref([]);
export const koeffizientenIntern = ref([]);
export const exponentenIntern = ref([]);

// Array nach Verarbeitung
export const koeffizientenVollAufbereitetIntern = ref([]);

/// BASISFUNKTIONEN POLYNOMDIVISION UND FUNKTIONSWERTBERECHNUNG

// Liest einzelne Terme und Werte aus RegEx aus und wandelt sie in Format um, das für das Auslesen der Vorzeichen, Koeffizienten und Exponenten geeignet ist

export const polynomfunktionAuslesen = () => {
    // Hier sollen die einzelnen Terme gespeichert werden
    const terme = ref([]);
    terme.value = [];

    // Entfernt alle Leerzeichen aus dem Input
    let i = 0;
    while (i < zwischenstandPolynomfunktionIntern.value.length) {
        if (zwischenstandPolynomfunktionIntern.value[i] === " ") {
            zwischenstandPolynomfunktionIntern.value =
                zwischenstandPolynomfunktionIntern.value.slice(0, i) +
                zwischenstandPolynomfunktionIntern.value.slice(i + 1);
            i--;
        }
        i++;
    }
    // Fügt dem Input ein '+' vor, wenn der erste Buchstabe kein '+' oder '-' ist, damit erster Term auch erkannt wird
    if (
        zwischenstandPolynomfunktionIntern.value[0] != "+" &&
        zwischenstandPolynomfunktionIntern.value[0] != "-"
    ) {
        zwischenstandPolynomfunktionIntern.value =
            "+" + zwischenstandPolynomfunktionIntern.value;
    }
    // Fügt dem Input ein '*' oder '1*' vor dem 'x' hinzu, wenn es nicht schon da ist
    i = 0;
    let nachVorzeichen = false;
    while (i < zwischenstandPolynomfunktionIntern.value.length) {
        if (
            zwischenstandPolynomfunktionIntern.value[i] === "+" ||
            zwischenstandPolynomfunktionIntern.value[i] === "-"
        ) {
            nachVorzeichen = true;
        }
        if (
            nachVorzeichen &&
            zwischenstandPolynomfunktionIntern.value[i] === "x" &&
            zwischenstandPolynomfunktionIntern.value[i - 1] != "*"
        ) {
            if (
                zwischenstandPolynomfunktionIntern.value[i - 1] === "+" ||
                zwischenstandPolynomfunktionIntern.value[i - 1] === "-"
            ) {
                zwischenstandPolynomfunktionIntern.value =
                    zwischenstandPolynomfunktionIntern.value.slice(0, i) +
                    "1*" +
                    zwischenstandPolynomfunktionIntern.value.slice(i);
            } else {
                zwischenstandPolynomfunktionIntern.value =
                    zwischenstandPolynomfunktionIntern.value.slice(0, i) +
                    "*" +
                    zwischenstandPolynomfunktionIntern.value.slice(i);
            }
            nachVorzeichen = false;
        }
        i++;
    }
    // Fügt dem Input ein '^1' hinzu, wenn es nicht schon da ist
    i = 0;
    while (i < zwischenstandPolynomfunktionIntern.value.length) {
        if (
            zwischenstandPolynomfunktionIntern.value[i] === "x" &&
            zwischenstandPolynomfunktionIntern.value[i + 1] != "^"
        ) {
            zwischenstandPolynomfunktionIntern.value =
                zwischenstandPolynomfunktionIntern.value.slice(0, i + 1) +
                "^1" +
                zwischenstandPolynomfunktionIntern.value.slice(i + 1);
        }
        i++;
    }

    // Falls es sich um eine Konstante bzw. x^0 handelt, wird 'x^0' hinzugefügt
    i = 1;
    let xIstVorhanden = false;
    while (i < zwischenstandPolynomfunktionIntern.value.length) {
        xIstVorhanden = false;
        while (
            zwischenstandPolynomfunktionIntern.value[i] != "+" &&
            zwischenstandPolynomfunktionIntern.value[i] != "-" &&
            i < zwischenstandPolynomfunktionIntern.value.length
        ) {
            if (zwischenstandPolynomfunktionIntern.value[i] === "x") {
                xIstVorhanden = true;
            }
            i++;
        }
        if (!xIstVorhanden) {
            zwischenstandPolynomfunktionIntern.value =
                zwischenstandPolynomfunktionIntern.value.slice(0, i) +
                "*x^0" +
                zwischenstandPolynomfunktionIntern.value.slice(i);
            i += 5;
        }
    }

    for (const match of zwischenstandPolynomfunktionIntern.value.matchAll(
        /[+-]\d+\*x\^\d+/g
    )) {
        if (match) {
            terme.value += match + ",";
        }
    }
    zwischenstandPolynomfunktionIntern.value = terme.value;
};

// Konvertiert die Polynomfunktion in Arrays für Vorzeichen, Koeffizienten und Exponenten

export const polynomfunktionZuArrays = () => {
    // Arrays für Vorzeichen, Koeffizienten und Exponenten
    vorzeichenIntern.value = [];
    koeffizientenIntern.value = [];
    exponentenIntern.value = [];

    // Vorzeichen extrahieren
    for (const match of zwischenstandPolynomfunktionIntern.value.matchAll(
        /[+-]/g
    )) {
        vorzeichenIntern.value.push(match[0]);
    }

    // Koeffizienten und Exponenten extrahieren
    let i = 0;
    for (const match of zwischenstandPolynomfunktionIntern.value.matchAll(
        /\d+/g
    )) {
        // Da jeder Term aus Koeffizient und Exponent besteht, wird abwechselnd der Koeffizient und der Exponent in die jeweiligen Arrays eingefügt
        if (i % 2 === 0) {
            koeffizientenIntern.value.push(parseInt(match[0]));
        } else {
            exponentenIntern.value.push(parseInt(match[0]));
        }
        i++;
    }
};

// Sortiert die Arrays für Vorzeichen, Koeffizienten und Exponenten nach den Exponenten

export const arraysSortieren = () => {
    // Höchster Exponent in gesamter Polynomfunktion
    let highestExponent = 0;
    for (let i = 0; i < exponentenIntern.value.length; i++) {
        if (exponentenIntern.value[i] > highestExponent) {
            highestExponent = exponentenIntern.value[i];
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
    for (let i = 0; i < exponentenIntern.value.length; i++) {
        let index = exponentenIntern.value[i];
        if (vorzeichenIntern.value[i] === "+") {
            sortierteKoeffizienten.value[index] += koeffizientenIntern.value[i];
        } else {
            sortierteKoeffizienten.value[index] -= koeffizientenIntern.value[i];
        }
    }

    // Kehre Array um, da das Horner-Schema beim höchsten Exponenten beginnt
    sortierteKoeffizienten.value.reverse();

    koeffizientenVollAufbereitetIntern.value = [];
    koeffizientenVollAufbereitetIntern.value = sortierteKoeffizienten.value;
};

// Auf Basis der sortierten Daten von arraysSortieren wird das Horner-Schema ausgeführt

export const hornerSchema = () => {
    const tmp = ref(0);
    for (let i = 0; i < koeffizientenVollAufbereitetIntern.value.length; i++) {
        koeffizientenVollAufbereitetIntern.value[i] =
            koeffizientenVollAufbereitetIntern.value[i] + tmp.value;
        tmp.value =
            koeffizientenVollAufbereitetIntern.value[i] *
            parseInt(stelleIntern.value);
    }
};

// Entferne den letzten Eintrag, die Wertung der Exponenten ist durch die Verringerung der Länge des Arrays gegeben

export const entferneFunktionswert = () => {
    koeffizientenVollAufbereitetIntern.value =
        koeffizientenVollAufbereitetIntern.value.slice(
            0,
            koeffizientenVollAufbereitetIntern.value.length - 1
        );
};