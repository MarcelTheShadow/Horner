/// Funktionen und Variablen ausschließlich für die Funktionswertberechnung

import { ref } from "vue";
// Importiere die Basisfunktionen für die Polynomdivision
import {
    zwischenstandPolynomfunktionIntern,
    stelleIntern,
    polynomfunktionAuslesen,
    koeffizientenAlsEinArrayIntern,
    polynomfunktionZuArray,
    hornerSchema,
    entferneFunktionswert,
} from "./basisMethoden.js";

/// VARIABLEN

// Direkter Wert der Polynomfunktion aus Input über v-model
export const eingabeFunktion = ref("");

// Direkter Wert der Stelle aus Input über v-model
export const eingabeStelle = ref("");

// Direkter Wert der Höhe der Ableitung aus Input über v-model
export const eingabeOrdnungAbleitung = ref("");

// Polynomfunktion zum Zeitpunkt des Drückens des Buttons
export const polynomfunktion = ref("");

// Stelle zum Zeitpunkt des Drückens des Buttons
export const stelle = ref("");

// Ordnung der Ableitung zum Zeitpunkt des Drückens des Buttons
export const ordnungAbleitung = ref("");

// Ausgabe auf der Webseit
export const ausgabe = ref("");

// Ist Input eine gültige Polynomfunktion?
export const funktionGueltig = ref(false);

// Handelt es sich bei der eingegebenen Stelle um eine ganze Zahl?
export const stelleGueltig = ref(false);

// Handelt es sich bei der eingegebenen Ableitungshöhe um eine ganze Zahl und gibt es eine Ableitung dieser Ordnung?
export const ableitungOrdnungGueltig = ref(false);

/// FUNKTIONEN

// Funktion, die überprüft, ob es sich um eine gültige Polynomfunktion handelt

const polynomfunktionGueltigPruefen = () => {
    // Standardmäßig ist die Funktion gültig, prüfe mittels RegEx und weiterer Logik, ob sie es tatsächlich ist
    funktionGueltig.value = true;

    // Regulärer Ausdruck einer Polynomfunktion mit viel Flexibilität, Polynomfunktion muss diesen erfüllen
    // RegEx beginnt mit '^' und endet mit '$', um sicherzustellen, dass das GESAMTE Eingabefeld der Polynomfunktion genau dem Muster entspricht, nicht nur ein Teil davon
    // test() liefert true, wenn der RegEx auf den Input passt, false wenn nicht
    if (
        /^\s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*$/.test(
            zwischenstandPolynomfunktionIntern.value
        ) === false
    ) {
        funktionGueltig.value = false;
    } else {
        // Entferne Leerzeichen aus dem Input, um die Validierung zu erleichtern
        const inputVerarbeitet = ref(
            zwischenstandPolynomfunktionIntern.value.replace(/\s/g, "")
        );
        // Überprüft, ob der Input der Polynomfunktionen nur aus Leerzeichen besteht -> Ungültig!
        if (
            inputVerarbeitet.value[inputVerarbeitet.value.length - 1] === "+" ||
            inputVerarbeitet.value[inputVerarbeitet.value.length - 1] === "-" ||
            // Überprüft, ob der Input der Polynomfunktion aufeinanderfolgende '+' oder '-' hat -> Ungültig!
            inputVerarbeitet.value.match(/\+\+|--|\+-|-\+/g) ||
            // Überprüft, ob der Input der Polynomfunktion mit einem '+' oder '-' endet -> Ungültig!
            inputVerarbeitet.value === ""
        ) {
            funktionGueltig.value = false;
        }
        // Überprüft, ob der Input der Polynomfunktion ein '*' vor einem '+' oder '-' hat -> Ungültig!
        for (const match of inputVerarbeitet.value.matchAll(/\*/g)) {
            if (
                inputVerarbeitet.value[match.index - 1] === "+" ||
                inputVerarbeitet.value[match.index - 1] === "-" ||
                match.index - 1 < 0
            ) {
                funktionGueltig.value = false;
            }
        }
    }
};

// Stelle überprüften. Sollte eine ganze Zahl sein, keine weiteren Zeichen sind erlaubt

export const stelleGueltiPruefen = () => {
    if (/^[+-]?\d+$/.test(stelle.value)) {
        stelleGueltig.value = true;
    } else {
        stelleGueltig.value = false;
    }
};

// Ordnung der Ableitung überprüfen. Sollte eine ganze Zahl sein, keine weiteren Zeichen sind erlaubt

export const ableitungOrdnungGueltigPruefen = () => {
    if (/^[+]?\d+$/.test(ordnungAbleitung.value)) {
        ableitungOrdnungGueltig.value = true;
    } else {
        ableitungOrdnungGueltig.value = false;
    }
};

// Entsprechend der Ordnung der Ableitung wird die Funktion hornerSchema() und entferneFunktionswert() so oft aufgerufen, wie es Ableitungen gibt

export const iterationenHornerSchema = () => {
    for (let i = 0; i < ordnungAbleitung.value; i++) {
        hornerSchema();
        entferneFunktionswert();
    }
    hornerSchema();
};

// Auslesen des Funktionswertes (der angegebenen Ableitung)

export const funktionswertZuString = () => {
    // Lese den letzten Wert im Horner-Schema aus, der den Funktionswert der angegebenen Ableitung enthält
    let ausgabeTmp = ref(
        koeffizientenAlsEinArrayIntern.value[
            koeffizientenAlsEinArrayIntern.value.length - 1
        ]
    );
    // Der ausgelesene Wert muss mit der Fakultät der Ordnung der Ableitung multipliziert werden, um den realen Funktionswert zu erhalten. Dies ist Teil der Logik des Horner-Schemas
    for (let i = 1; i <= ordnungAbleitung.value; i++) {
        ausgabeTmp.value = ausgabeTmp.value * i;
    }
    if(isNaN(ausgabeTmp.value)) {
        ausgabeTmp.value = 0;
    }
    ausgabe.value = `${ausgabeTmp.value}`;
};

// Main-Funktion für die Funktionswertberechnung, die alle anderen Funktionen aufruft

export const eingabeVerarbeiten = () => {
    zwischenstandPolynomfunktionIntern.value = eingabeFunktion.value;
    polynomfunktion.value = eingabeFunktion.value;
    stelleIntern.value = eingabeStelle.value;
    stelle.value = eingabeStelle.value;
    ordnungAbleitung.value = eingabeOrdnungAbleitung.value;
    polynomfunktionGueltigPruefen();
    stelleGueltiPruefen();
    ableitungOrdnungGueltigPruefen();
    polynomfunktionAuslesen();
    polynomfunktionZuArray();
    iterationenHornerSchema();
    funktionswertZuString();
};
