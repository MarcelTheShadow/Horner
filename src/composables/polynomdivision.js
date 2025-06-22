/// Funktionen und Variablen ausschließlich der Polynomdivision

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

// Direkter Wert der Nullstelle aus Input über v-model
export const eingabeNullstelle = ref("");

// Polynomfunktion zum Zeitpunkt des Drückens des ButtonS
export const polynomfunktion = ref("");

// Nullstelle zum Zeitpunkt des Drückens des Buttons
export const nullstelle = ref("");

// Ist Input eine gültige Polynomfunktion?
export const funktionGueltig = ref(false);

// Handelt es sich bei der eingegebenen Nullstelle tatsächlich um eine ganze Zahl und ist sie eine Nullstelle für die gegebene Funktion?
export const stelleGueltig = ref(false);

// Ausgabe auf der Webseite
export const ausgabe = ref("");

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
        if (
            // Überprüft, ob der Input der Polynomfunktion mit einem '+' oder '-' endet -> Ungültig!
            inputVerarbeitet.value[inputVerarbeitet.value.length - 1] === "+" ||
            inputVerarbeitet.value[inputVerarbeitet.value.length - 1] === "-" ||
            // Überprüft, ob der Input der Polynomfunktion aufeinanderfolgende '+' oder '-' hat -> Ungültig!
            inputVerarbeitet.value.match(/\+\+|--|\+-|-\+/g) ||
            // Überprüft, ob der Input der Polynomfunktionen nur aus Leerzeichen besteht -> Ungültig!
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

// Nullstelle überprüfen -> Sollte eine ganze Zahl sein, keine weiteren Zeichen sind erlaubt

const nullstelleGueltigPruefen = () => {
    if (/^\s*[+-]?\d+\s*$/.test(eingabeNullstelle.value)) {
        stelleGueltig.value = true;
    } else {
        stelleGueltig.value = false;
    }
};

// Überprüft, ob die eingegebene Nullstelle tatsächlich eine Nullstelle der Polynomfunktion ist

const nullstelleVerifizieren = () => {
    // Berechnung des Funktionswertes an der Nullstelle schrittweise für alle Exponenten
    const sum = ref(0);
    for (let i = 0; i < koeffizientenAlsEinArrayIntern.value.length; i++) {
        sum.value +=
            koeffizientenAlsEinArrayIntern.value[i] *
            Math.pow(
                parseInt(nullstelle.value),
                koeffizientenAlsEinArrayIntern.value.length - i - 1
            );
    }
    // Wenn der Funktionswert an der Nullstelle != 0, ist die Nullstelle ungültig
    if (sum.value != 0) {
        stelleGueltig.value = false;
    }
};

// Umwandlung des Koeffizienten-Arrays zu lesbarer Funktion

const ergebnisZuString = () => {
    const ausgabeTmp = ref("");
    const highestExponent = ref(
        koeffizientenAlsEinArrayIntern.value.length - 1
    );

    // Iteriere von links nach rechts durch das Koeffizienten-Array, also vom höchsten zum niedrigsten Exponenten
    for (let i = 0; i < koeffizientenAlsEinArrayIntern.value.length; i++) {

        // Nur wenn der Koeffizient an der Stelle != 0 ist, füge ihn zur Ausgabe hinzu
        if (koeffizientenAlsEinArrayIntern.value[i] != 0) {

            // Füge Vorzeichen hinzu, Leerzeichen zum Abtrennen der Terme
            if (koeffizientenAlsEinArrayIntern.value[i] > 0) {
                ausgabeTmp.value += " +";
            } else {
                // Für negative Koeffizienten wird das Minuszeichen bereits im Koeffizienten berücksichtigt
                ausgabeTmp.value += " ";
            }

            // Wenn der Koeffizient 1 bzw. -1 ist und ein x folgt, soll dieser aufgrund der Lesbarkeit später nicht angezeigt werden

            if (koeffizientenAlsEinArrayIntern.value[i] === 1 && highestExponent.value - i !== 0) {
                koeffizientenAlsEinArrayIntern.value[i] = "";
            }

            if (koeffizientenAlsEinArrayIntern.value[i] === -1 && highestExponent.value - i !== 0) {
                koeffizientenAlsEinArrayIntern.value[i] = "-";
            }

            // Für x^0 nur den Koeffizienten hinzufügen
            if (highestExponent.value - i === 0) {
                ausgabeTmp.value += koeffizientenAlsEinArrayIntern.value[i];

                // Für x^1 nur den Koeffizienten und x hinzufügen
            } else if (highestExponent.value - i === 1) {
                ausgabeTmp.value +=
                    koeffizientenAlsEinArrayIntern.value[i] + "x";

                // Für alle anderen Exponenten den Koeffizienten, x und den Exponenten hinzufügen
            } else {
                ausgabeTmp.value +=
                    koeffizientenAlsEinArrayIntern.value[i] +
                    "x^" +
                    (highestExponent.value - i);
            }
        }
    }

    // Falls keine Terme in der Ausgabe sind bzw. die Eingabefunktion und die Nullstelle beide 0 waren, setze die Ausgabe auf 0
    if (ausgabeTmp.value === "") {
        ausgabeTmp.value = "0";
    }

    ausgabe.value = `${ausgabeTmp.value}`;
};

/// Main-Funktion für die Polynomdivision, die alle anderen Funktionen aufruft

export const eingabeVerarbeiten = () => {
    zwischenstandPolynomfunktionIntern.value = eingabeFunktion.value;
    polynomfunktion.value = eingabeFunktion.value;
    stelleIntern.value = eingabeNullstelle.value;
    nullstelle.value = eingabeNullstelle.value;
    polynomfunktionGueltigPruefen();
    nullstelleGueltigPruefen();
    polynomfunktionAuslesen();
    polynomfunktionZuArray();
    nullstelleVerifizieren();
    hornerSchema();
    entferneFunktionswert();
    ergebnisZuString();
};
