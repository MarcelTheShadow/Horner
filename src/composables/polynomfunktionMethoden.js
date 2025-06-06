import { ref } from "vue";

// Direkter Wert der Polynomfunktion für Polynomdivision aus Input über v-model
export const eingabeFunktionPolynomdivision = ref("");

// Direkter Wert der Polynomfunktion für Funktionswertberechnung aus Input über v-model
export const eingabeFunktionFunktionswertberechnung = ref("");

// Direkter Wert der Nullstelle für Polynomdivision aus Input über v-model
export const eingabeNullstellePolynomdivision = ref("");

// Direkter Wert der Stelle für Funktionswertberechnung aus Input über v-model
export const eingabeStelleFunktionswertberechnung = ref("");

// Polynomfunktion zum Zeitpunkt des Drückens des Buttons für Polynomdivision
export const polynomfunktionPolynomdivision = ref("");

// Polynomfunktion zum Zeitpunkt des Drückens des Buttons für Funktionswertberechnung
export const polynomfunktionFunktionswertberechnung = ref("");

// Nullstelle zum Zeitpunkt des Drückens des Buttons
export const nullstellePolynomdivision = ref("");

// Stelle zum Zeitpunkt des Drückens des Buttons bei Funktionswertberechnung
export const stelleFunktionswertberechnung = ref("");

// Ist Input eine gültige Polynomfunktion?
export const funktionGueltigIntern = ref(false);

// Handelt es sich bei der eingegebenen Nullstelle tatsächlich um eine Nullstelle für die gegebene Funktion?
export const stelleGueltigIntern = ref(false);

// Zwischenstand von eingegebeneFunktion, um den Input zu verarbeiten
const zwischenstandIntern = ref("");

// Arrays für Vorzeichen, Koeffizienten und Exponenten beim Verarbeiten der Polynomfunktion
const vorzeichenIntern = ref([]);
const koeffizientenIntern = ref([]);
const exponentenIntern = ref([]);

// Array nach Verarbeitung
const koeffizientenVollAufbereitetIntern = ref([]);

// Ausgabe auf der Webseite für Polynomdivision
export const ausgabePolynomdivision = ref("");

// Ausgabe auf der Webseite für Funktionswertberechnung
export const ausgabeFunktionswertberechnung = ref("");

// Funktion, die den Wert des Inputs aktualisiert und überprüft, ob es sich um eine gültige Polynomfunktion und eine gültige Nullstelle handelt

const polynomfunktionGueltigOderNicht = () => {
    // Standardmäßig ist die Funktion gültig, prüfe mittels RegEx und weiterer Logik, ob sie es tatsächlich ist
    funktionGueltigIntern.value = true;

    // Regulärer Ausdruck einer Polynomfunktion mit viel Flexibilität
    if (
        /^\s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*$/.test(
            zwischenstandIntern.value
        ) === false
    ) {
        funktionGueltigIntern.value = false;
    }
    // Überprüft, ob der Input nur aus '+' und '-' besteht
    if (zwischenstandIntern.value.match(/^[+-\s]*$/)) {
        funktionGueltigIntern.value = false;
    }
    const inputVerarbeitet = zwischenstandIntern.value.replace(/\s/g, "");
    // Überprüft, ob der Input der Polynomfunktion mit einem '+' oder '-' endet
    if (
        inputVerarbeitet[inputVerarbeitet.length - 1] === "+" ||
        inputVerarbeitet[inputVerarbeitet.length - 1] === "-"
    ) {
        funktionGueltigIntern.value = false;
    }
};

// Nullstelle für Polynomdivision wird überprüft, sollte eine natürliche Zahl sein, keine weiteren Zeichen erlaubt

const nullstelleGueltigOderNicht = () => {
    if (/^-?\d+$/.test(eingabeNullstellePolynomdivision.value)) {
        stelleGueltigIntern.value = true;
    } else {
        stelleGueltigIntern.value = false;
    }
}

// Stelle für Funktionswertberechnung wird überprüft, sollte eine natürliche Zahl sein, keine weiteren Zeichen erlaubt

const stelleGueltigOderNicht = () => {
    if (/^-?\d+$/.test(eingabeStelleFunktionswertberechnung.value)) {
        stelleGueltigIntern.value = true;
    } else {
        stelleGueltigIntern.value = false;
    }
}

// Liest einzelne Terme und Werte aus RegEx aus und wandelt sie in Format um, das für das Auslesen der Vorzeichen, Koeffizienten und Exponenten geeignet ist

const polynomfunktionAuslesen = () => {
    // Hier sollen die einzelnen Terme gespeichert werden
    const terme = ref([]);
    terme.value = [];

    // Entfernt alle Leerzeichen aus dem Input
    let i = 0;
    while (i < zwischenstandIntern.value.length) {
        if (zwischenstandIntern.value[i] === " ") {
            zwischenstandIntern.value =
                zwischenstandIntern.value.slice(0, i) +
                zwischenstandIntern.value.slice(i + 1);
            i--;
        }
        i++;
    }
    // Fügt dem Input ein '+' vor, wenn der erste Buchstabe kein '+' oder '-' ist, damit erster Term auch erkannt wird
    if (zwischenstandIntern.value[0] != "+" && zwischenstandIntern.value[0] != "-") {
        zwischenstandIntern.value = "+" + zwischenstandIntern.value;
    }
    // Fügt dem Input ein '*' oder '1*' vor dem 'x' hinzu, wenn es nicht schon da ist
    i = 0;
    let nachVorzeichen = false;
    while (i < zwischenstandIntern.value.length) {
        if (zwischenstandIntern.value[i] === "+" || zwischenstandIntern.value[i] === "-") {
            nachVorzeichen = true;
        }
        if (
            nachVorzeichen &&
            zwischenstandIntern.value[i] === "x" &&
            zwischenstandIntern.value[i - 1] != "*"
        ) {
            if (
                zwischenstandIntern.value[i - 1] === "+" ||
                zwischenstandIntern.value[i - 1] === "-"
            ) {
                zwischenstandIntern.value =
                    zwischenstandIntern.value.slice(0, i) +
                    "1*" +
                    zwischenstandIntern.value.slice(i);
            } else {
                zwischenstandIntern.value =
                    zwischenstandIntern.value.slice(0, i) +
                    "*" +
                    zwischenstandIntern.value.slice(i);
            }
            nachVorzeichen = false;
        }
        i++;
    }
    // Fügt dem Input ein '^1' hinzu, wenn es nicht schon da ist
    i = 0;
    while (i < zwischenstandIntern.value.length) {
        if (
            zwischenstandIntern.value[i] === "x" &&
            zwischenstandIntern.value[i + 1] != "^"
        ) {
            zwischenstandIntern.value =
                zwischenstandIntern.value.slice(0, i + 1) +
                "^1" +
                zwischenstandIntern.value.slice(i + 1);
        }
        i++;
    }

    // Falls es sich um eine Konstante bzw. x^0 handelt, wird 'x^0' hinzugefügt
    i = 1;
    let xIstVorhanden = false;
    while (i < zwischenstandIntern.value.length) {
        xIstVorhanden = false;
        while (
            zwischenstandIntern.value[i] != "+" &&
            zwischenstandIntern.value[i] != "-" &&
            i < zwischenstandIntern.value.length
        ) {
            if (zwischenstandIntern.value[i] === "x") {
                xIstVorhanden = true;
            }
            i++;
        }
        if (!xIstVorhanden) {
            zwischenstandIntern.value =
                zwischenstandIntern.value.slice(0, i) +
                "*x^0" +
                zwischenstandIntern.value.slice(i);
            i += 5;
        }
    }

    const einzelnerTerm = /[+-]\d+\*x\^\d+/g;

    for (const match of zwischenstandIntern.value.matchAll(einzelnerTerm)) {
        if (match) {
            terme.value += match + ",";
        }
    }
    zwischenstandIntern.value = terme.value;
};

// Konvertiert die Polynomfunktion in Arrays für Vorzeichen, Koeffizienten und Exponenten

const polynomfunktionZuArrays = () => {
    // Arrays für Vorzeichen, Koeffizienten und Exponenten
    vorzeichenIntern.value = [];
    koeffizientenIntern.value = [];
    exponentenIntern.value = [];

    // Vorzeichen extrahieren
    for (let match of zwischenstandIntern.value.matchAll(/[+-]/g)) {
        vorzeichenIntern.value.push(match[0]);
    }

    // Koeffizienten und Exponenten extrahieren
    let i = 0;
    for (let match of zwischenstandIntern.value.matchAll(/\d+/g)) {
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

const arraysSortieren = () => {
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

// Überprüft, ob die eingegebene Nullstelle tatsächlich eine Nullstelle der Polynomfunktion ist

const nullstelleVerifizieren = () => {
    const sum = ref(0);
    for (let i = 0; i < koeffizientenVollAufbereitetIntern.value.length; i++) {
        sum.value +=
            koeffizientenVollAufbereitetIntern.value[i] *
            Math.pow(
                parseInt(nullstellePolynomdivision.value),
                koeffizientenVollAufbereitetIntern.value.length - i - 1
            );
    }
    if (sum.value != 0) {
        stelleGueltigIntern.value = false;
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
    koeffizientenVollAufbereitetIntern.value =
        koeffizientenVollAufbereitetIntern.value.slice(
            0,
            koeffizientenVollAufbereitetIntern.value.length - 1
        );
}

// Umwandlung des Koeffizienten-Arrays zu lesbarer Funktion

const ergebnisZuString = () => {

    const ausgabeTmp = ref("");
    const highestExponent = ref(koeffizientenVollAufbereitetIntern.value.length - 1);
    for (let i = 0; i < koeffizientenVollAufbereitetIntern.value.length; i++) {
        if (koeffizientenVollAufbereitetIntern.value[i] != 0) {
            if (koeffizientenVollAufbereitetIntern.value[i] > 0) {
                ausgabeTmp.value += " +";
            } else {
                ausgabeTmp.value += " ";
            }
            if (highestExponent.value - i === 0) {
                ausgabeTmp.value += koeffizientenVollAufbereitetIntern.value[i];
            } else if (highestExponent.value - i === 1) {
                ausgabeTmp.value += koeffizientenVollAufbereitetIntern.value[i] + "x";
            } else {
                ausgabeTmp.value +=
                    koeffizientenVollAufbereitetIntern.value[i] +
                    "x^" +
                    (highestExponent.value - i);
            }
        }
    }

    if (ausgabeTmp.value === "") {
        ausgabeTmp.value = "0";
    }

    ausgabePolynomdivision.value = `${ausgabeTmp.value}`;
};

// Anstatt Polynomdivison für Auslesen des Funktionswertes (der Ableitung)

const funktionswertZuString = () => {
    //TODO Fakultät
    ausgabeFunktionswertberechnung.value = `${
        koeffizientenVollAufbereitetIntern.value[
            koeffizientenVollAufbereitetIntern.value.length - 1
        ]
    }`;
};

// Verarbeitet den Input, Funktion für Polynomdivision
export const eingabeVerarbeitenPolynomdivision = () => {
    zwischenstandIntern.value = eingabeFunktionPolynomdivision.value;
    polynomfunktionPolynomdivision.value = eingabeFunktionPolynomdivision.value;
    nullstellePolynomdivision.value = eingabeNullstellePolynomdivision.value;
    polynomfunktionGueltigOderNicht();
    nullstelleGueltigOderNicht();
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
    zwischenstandIntern.value = eingabeFunktionFunktionswertberechnung.value;
    polynomfunktionFunktionswertberechnung.value = eingabeFunktionFunktionswertberechnung.value;
    stelleFunktionswertberechnung.value = eingabeStelleFunktionswertberechnung.value;
    polynomfunktionGueltigOderNicht();
    stelleGueltigOderNicht();
    polynomfunktionAuslesen();
    polynomfunktionZuArrays();
    arraysSortieren();
    for(let i = 0; i < 1; i++) {
        hornerSchema();
        entferneFunktionswert();
    }
    hornerSchema();
    funktionswertZuString();
};
