import { ref } from "vue";
import {
    zwischenstandPolynomfunktionIntern,
    stelleIntern,
    anzahlAbleitungenIntern,
    polynomfunktionAuslesen,
    polynomfunktionZuArrays,
    arraysSortieren,
    koeffizientenVollAufbereitetIntern,
    hornerSchema,
    entferneFunktionswert,
} from "../composables/polynomfunktionMethoden.js";

/// VARIABLEN

// Direkter Wert der Polynomfunktion aus Input über v-model
export const eingabeFunktion = ref("");

// Direkter Wert der Stelle aus Input über v-model
export const eingabeStelle = ref("");

// Direkter Wert der Höhe der Ableitung aus Input über v-model
export const eingabeAnzahlAbleitungen = ref("");

// Polynomfunktion zum Zeitpunkt des Drückens des Buttons
export const polynomfunktion = ref("");

// Stelle zum Zeitpunkt des Drückens des Buttons
export const stelle = ref("");

// Ausgabe auf der Webseit
export const ausgabe = ref("");

// Ist Input eine gültige Polynomfunktion?
export const funktionGueltig = ref(false);

// Handelt es sich bei der eingegebenen Stelle um eine ganze Zahl?
export const stelleGueltig = ref(false);

// Handelt es sich bei der eingegebenen Ableitungshöhe um eine ganze Zahl und gibt es eine Ableitung dieser Ordnung?
export const ableitungshoheGueltig = ref(false);

/// FUNKTIONEN

// Funktion, die überprüft, ob es sich um eine gültige Polynomfunktion handelt

const polynomfunktionGueltigPruefen = () => {
    // Standardmäßig ist die Funktion gültig, prüfe mittels RegEx und weiterer Logik, ob sie es tatsächlich ist
    funktionGueltig.value = true;

    // Regulärer Ausdruck einer Polynomfunktion mit viel Flexibilität, Polynomfunktion muss diesen erfüllen
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
        // Überprüft, ob der Input der Polynomfunktion mit einem '+' oder '-' endet -> Ungültig!
        // Überprüft, ob der Input der Polynomfunktion aufeinanderfolgende '+' oder '-' hat -> Ungültig!
        // Überprüft, ob der Input der Polynomfunktionen nur aus Leerzeichen besteht -> Ungültig!
        if (
            inputVerarbeitet.value[inputVerarbeitet.value.length - 1] === "+" ||
            inputVerarbeitet.value[inputVerarbeitet.value.length - 1] === "-" ||
            inputVerarbeitet.value.match(/\+\+|--|\+-|-\+/g) ||
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

export const ableitungshoeheGueltigPruefen = () => {
    if (/^[+-]?\d+$/.test(anzahlAbleitungenIntern.value)) {
        ableitungshoheGueltig.value = true;
    } else {
        ableitungshoheGueltig.value = false;
    }
};

// Entsprechend der Höhe der Ableitung wird die Funktion hornerSchema() und entferneFunktionswert() so oft aufgerufen, wie es Ableitungen gibt

export const iterationenHornerSchema = () => {
    for (let i = 0; i < anzahlAbleitungenIntern.value; i++) {
        // Wenn nur noch ein Koeffizient übrig ist, ist die Ableitungshöhe nicht gültig, da mindestens noch ein Koeffizient entfernt werden muss
        // Die Ordnung der Ableitung wurde dann zu hoch gewählt und ist ungültig
        if (koeffizientenVollAufbereitetIntern.value.length == 1) {
            ableitungshoheGueltig.value = false;
            return;
        }
        hornerSchema();
        entferneFunktionswert();
    }
};

// Auslesen des Funktionswertes (der angegebenen Ableitung)

export const funktionswertZuString = () => {
    let ausgabeTmp = ref(
        koeffizientenVollAufbereitetIntern.value[
            koeffizientenVollAufbereitetIntern.value.length - 1
        ]
    );
    // Der ausgelesene Wert muss mit der Fakultät der Ordnung der Ableitung multipliziert werden, um den realen Funktionswert zu erhalten. Dies ist Teil der Logik des Horner-Schemas
    for (let i = 1; i <= anzahlAbleitungenIntern.value; i++) {
        ausgabeTmp.value = ausgabeTmp.value * i;
    }
    ausgabe.value = `${ausgabeTmp.value}`;
};

// Main-Funktion für die Funktionswertberechnung, die alle anderen Funktionen aufruft

export const eingabeVerarbeiten = () => {
    zwischenstandPolynomfunktionIntern.value = eingabeFunktion.value;
    polynomfunktion.value = eingabeFunktion.value;
    stelleIntern.value = eingabeStelle.value;
    stelle.value = eingabeStelle.value;
    anzahlAbleitungenIntern.value = eingabeAnzahlAbleitungen.value;
    polynomfunktionGueltigPruefen();
    stelleGueltiPruefen();
    ableitungshoeheGueltigPruefen();
    polynomfunktionAuslesen();
    polynomfunktionZuArrays();
    arraysSortieren();
    iterationenHornerSchema();
    hornerSchema();
    funktionswertZuString();
};
