import { ref } from "vue";

//// FUNKTIONSWERTBERECHNUNG

// Direkter Wert der Polynomfunktion für Funktionswertberechnung aus Input über v-model
export const eingabeFunktionFunktionswertberechnung = ref("");

// Direkter Wert der Stelle für Funktionswertberechnung aus Input über v-model
export const eingabeStelleFunktionswertberechnung = ref("");

// Direkter Wert der Höhe der Ableitung für die Funktionswertberechnung aus Input über v-model
export const eingabeAnzahlAbleitungenFunktionswertberechnung = ref("");

// Polynomfunktion zum Zeitpunkt des Drückens des Buttons für Funktionswertberechnung
export const polynomfunktionFunktionswertberechnung = ref("");

// Stelle zum Zeitpunkt des Drückens des Buttons bei Funktionswertberechnung
export const stelleFunktionswertberechnung = ref("");

// Ausgabe auf der Webseite für Funktionswertberechnung
export const ausgabeFunktionswertberechnung = ref("");

// Ist Input eine gültige Polynomfunktion?
export const funktionGueltigFunktionswertberechnung = ref(false);

// Handelt es sich bei der eingegebenen Nullstelle tatsächlich um eine Nullstelle für die gegebene Funktion?
export const stelleGueltigFunktionswertberechnung = ref(false);

// Handelt es sich bei der eingegebenen Ableitungshöhe tatsächlich um eine gültige Angabe?
export const ableitungshoheGueltigFunktionswertberechnung = ref(false);

//// INTERNE VARIABLEN FÜR POLYNOMDIVISION UND FUNKTIONSWERTBERECHNUNG

// Höhe der Ableitung für die Funktionswertberechnung zum Zeitpunkt des Drückens des Buttons
export const anzahlAbleitungenIntern = ref("");

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

// FUNKTIONEN FÜR POLYNOMDIVISION UND FUNKTIONSWERTBERECHNUNG

// Funktion, die bei der Funktionswertberechnung überprüft, ob es sich um eine gültige Polynomfunktion handelt

export const polynomfunktionGueltigOderNichtFunktionswertberechnung = () => {
    // Standardmäßig ist die Funktion gültig, prüfe mittels RegEx und weiterer Logik, ob sie es tatsächlich ist
    funktionGueltigFunktionswertberechnung.value = true;

    // Regulärer Ausdruck einer Polynomfunktion mit viel Flexibilität
    if (
        /^\s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*$/.test(
            zwischenstandPolynomfunktionIntern.value
        ) === false
    ) {
        funktionGueltigFunktionswertberechnung.value = false;
    } else {
        const inputVerarbeitet = ref(
            zwischenstandPolynomfunktionIntern.value.replace(/\s/g, "")
        );
        // Überprüft, ob der Input der Polynomfunktion mit einem '+' oder '-' endet
        // Überprüft, ob der Input der Polynomfunktion aufeinanderfolgende '+' oder '-' hat
        // Überprüft, ob der Input der Polynomfunktionen nur aus Leerzeichen besteht
        if (
            inputVerarbeitet.value[inputVerarbeitet.value.length - 1] === "+" ||
            inputVerarbeitet.value[inputVerarbeitet.value.length - 1] === "-" ||
            inputVerarbeitet.value.match(/\+\+|--|\+-|-\+/g) ||
            inputVerarbeitet.value === ""
        ) {
            funktionGueltigFunktionswertberechnung.value = false;
        }
        // Überprüft, ob der Input der Polynomfunktion ein '*' vor einem '+' oder '-' hat
        for (const match of inputVerarbeitet.value.matchAll(/\*/g)) {
            if (
                inputVerarbeitet.value[match.index - 1] === "+" ||
                inputVerarbeitet.value[match.index - 1] === "-" ||
                match.index - 1 < 0
            ) {
                funktionGueltigFunktionswertberechnung.value = false;
            }
        }
    }
};

// Für Funktionswertberechnung wird die eingegebene Stelle überprüft. Sollte eine ganze Zahl sein, keine weiteren Zeichen sind erlaubt

export const stelleGueltigOderNichtFunktionswertberechnung = () => {
    if (/^[+-]?\d+$/.test(eingabeStelleFunktionswertberechnung.value)) {
        stelleGueltigFunktionswertberechnung.value = true;
    } else {
        stelleGueltigFunktionswertberechnung.value = false;
    }
};

// Für Funktionswertberechnung wird die Ordnung der Ableitung überprüft. Sollte eine ganze Zahl sein, keine weiteren Zeichen sind erlaubt

export const ableitungshoeheGueltigOderNichtFunktionswertberechnung = () => {
    if (/^[+-]?\d+$/.test(anzahlAbleitungenIntern.value)) {
        ableitungshoheGueltigFunktionswertberechnung.value = true;
    } else {
        ableitungshoheGueltigFunktionswertberechnung.value = false;
    }
};

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

// Entsprechend der Höhe der Ableitung wird die Funktion hornerSchema() und entferneFunktionswert() so oft aufgerufen, wie es Ableitungen gibt

export const iterationenHornerSchema = () => {
    for (let i = 0; i < anzahlAbleitungenIntern.value; i++) {
        hornerSchema();
        entferneFunktionswert();
    }
};

// Anstatt Polynomdivison für Auslesen des Funktionswertes (der Ableitung)

export const funktionswertZuString = () => {
    let ausgabeTmp = ref(
        koeffizientenVollAufbereitetIntern.value[
            koeffizientenVollAufbereitetIntern.value.length - 1
        ]
    );
    for (let i = 1; i <= anzahlAbleitungenIntern.value; i++) {
        ausgabeTmp.value = ausgabeTmp.value * i;
    }
    ausgabeFunktionswertberechnung.value = `${ausgabeTmp.value}`;
};

// MAIN-FUNKTIONEN FÜR POLYNOMDIVISION UND FUNKTIONSWERTBERECHNUNG

// Funktionswertberechnung
export const eingabeVerarbeitenFunktionswertberechnung = () => {
    zwischenstandPolynomfunktionIntern.value =
        eingabeFunktionFunktionswertberechnung.value;
    polynomfunktionFunktionswertberechnung.value =
        eingabeFunktionFunktionswertberechnung.value;
    stelleIntern.value = eingabeStelleFunktionswertberechnung.value;
    stelleFunktionswertberechnung.value =
        eingabeStelleFunktionswertberechnung.value;
    anzahlAbleitungenIntern.value =
        eingabeAnzahlAbleitungenFunktionswertberechnung.value;
    polynomfunktionGueltigOderNichtFunktionswertberechnung();
    stelleGueltigOderNichtFunktionswertberechnung();
    ableitungshoeheGueltigOderNichtFunktionswertberechnung();
    polynomfunktionAuslesen();
    polynomfunktionZuArrays();
    arraysSortieren();
    iterationenHornerSchema();
    hornerSchema();
    funktionswertZuString();
};
