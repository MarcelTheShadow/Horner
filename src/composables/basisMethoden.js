import { ref } from "vue";

/// INTERNE VARIABLEN FÜR POLYNOMDIVISION UND FUNKTIONSWERTBERECHNUNG

// (Null)stelle zur Berechnung
export const stelleIntern = ref("");

// Zwischenstand von eingegebeneFunktion, um den Input zu verarbeiten
export const zwischenstandPolynomfunktionIntern = ref("");

// Arrays für Vorzeichen, Koeffizienten und Exponenten beim Verarbeiten der Polynomfunktion
export const vorzeichenIntern = ref([]);
export const koeffizientenIntern = ref([]);
export const exponentenIntern = ref([]);

// Array nach Verarbeitung
export const koeffizientenAlsEinArrayIntern = ref([]);

/// BASISFUNKTIONEN POLYNOMDIVISION UND FUNKTIONSWERTBERECHNUNG

// Liest einzelne Terme und Werte aus RegEx aus und wandelt sie in Format um, das für das Auslesen der Vorzeichen, Koeffizienten und Exponenten geeignet ist

export const polynomfunktionAuslesen = () => {
    /// Aktuelle RegEx: \s*[+-]?\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*(\s*[+-]\s*\d*\s*(\*?\s*x(\s*\^\s*\d+)?)?\s*)*

    // Entfernt alle Leerzeichen aus dem Input
    let i = 0;
    // Allgemein iterieren über while-Schleife anstatt for-Schleife, da die Länge des Inputs sich während der Iteration ändert
    while (i < zwischenstandPolynomfunktionIntern.value.length) {
        if (zwischenstandPolynomfunktionIntern.value[i] === " ") {
            zwischenstandPolynomfunktionIntern.value =
                // Konkateniere alle Zeichen vor und nach dem Leerzeichen
                zwischenstandPolynomfunktionIntern.value.slice(0, i) +
                zwischenstandPolynomfunktionIntern.value.slice(i + 1);
            // Da ein Zeichen entfernt wurde, muss der Index um 1 verringert werden, damit das nächste Zeichen nicht übersprungen wird
            i--;
        }
        i++;
    }

    /// Aktuelle RegEx: [+-]?\d*(\*?x(\^\d+)?)?([+-]\d*(\*?x(\^\d+)?)?)*

    // Fügt dem Input ein '+' vor, wenn der erste Buchstabe kein '+' oder '-' ist, damit der erste Term auch mit Vorzeichen erkannt wird
    if (
        zwischenstandPolynomfunktionIntern.value[0] != "+" &&
        zwischenstandPolynomfunktionIntern.value[0] != "-"
    ) {
        zwischenstandPolynomfunktionIntern.value =
            "+" + zwischenstandPolynomfunktionIntern.value;
    }

    /// Aktuelle RegEx: ([+-]\d*(\*?x(\^\d+)?)?)*

    // Fügt dem Input ein '*' oder '1*' vor dem 'x' hinzu, wenn es nicht schon da ist
    i = 0;
    // Nach jedem Vorzeichen wird geprüft, ob bei dem vorhandenen x ein '*' fehlt
    let nachVorzeichen = false;
    while (i < zwischenstandPolynomfunktionIntern.value.length) {
        if (
            zwischenstandPolynomfunktionIntern.value[i] === "+" ||
            zwischenstandPolynomfunktionIntern.value[i] === "-"
        ) {
            nachVorzeichen = true;
        }
        if (
            // Wenn nach einem Vorzeichen ein 'x' kommt, aber kein '*' davor steht
            nachVorzeichen &&
            zwischenstandPolynomfunktionIntern.value[i] === "x" &&
            zwischenstandPolynomfunktionIntern.value[i - 1] != "*"
        ) {
            // Wenn der Term '+x' oder '-x' ist, wird er zu '+1*x' bzw. '-1*x' abgewandelt
            if (
                zwischenstandPolynomfunktionIntern.value[i - 1] === "+" ||
                zwischenstandPolynomfunktionIntern.value[i - 1] === "-"
            ) {
                zwischenstandPolynomfunktionIntern.value =
                    zwischenstandPolynomfunktionIntern.value.slice(0, i) +
                    "1*" +
                    zwischenstandPolynomfunktionIntern.value.slice(i);
                // Wenn der Term '+ax' oder '-ax' ist, wird er zu '+a*x' bzw. '-a*x' abgewandelt
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

    /// Aktuelle RegEx: ([+-]\d+(\*x(\^\d+)?)?)*

    // Fügt dem Input ein '^1' hinzu, wenn es nicht schon da ist
    i = 0;
    while (i < zwischenstandPolynomfunktionIntern.value.length) {
        if (
            // Wenn ein 'x' gefunden wird, aber kein '^' dahinter steht, so fehlt das '^1'
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

    /// Aktuelle RegEx: ([+-]\d+(\*x\^\d+)?)*

    // Falls es sich um eine Konstante bzw. x^0 handelt, wird 'x^0' hinzugefügt
    i = 1;
    let xIstVorhanden = false;
    // Allgemein iterieren über while-Schleife anstatt for-Schleife, da die Länge des Inputs sich während der Iteration ändert
    while (i < zwischenstandPolynomfunktionIntern.value.length) {
        xIstVorhanden = false;
        while (
            // Betrachten eines einzelnen Monoms bis zum nächsten '+' oder '-' oder bis zum Ende des Strings
            zwischenstandPolynomfunktionIntern.value[i] != "+" &&
            zwischenstandPolynomfunktionIntern.value[i] != "-" &&
            i < zwischenstandPolynomfunktionIntern.value.length
        ) {
            // Falls ein 'x' gefunden wird, wird xIstVorhanden auf true gesetzt und Monom wird hier ignoriert
            if (zwischenstandPolynomfunktionIntern.value[i] === "x") {
                xIstVorhanden = true;
            }
            i++;
        }
        // Falls bei Erreichen des nächsten '+' oder '-' kein 'x' gefunden wurde, wird ein 'x^0' hinzugefügt
        if (!xIstVorhanden) {
            zwischenstandPolynomfunktionIntern.value =
                zwischenstandPolynomfunktionIntern.value.slice(0, i) +
                "*x^0" +
                zwischenstandPolynomfunktionIntern.value.slice(i);
            // Anpassen des Index, da mehrere Zeichen hinzugefügt wurden; Muss über das näcjhste '+' oder '-' hinausgehen, damit die Schleife nicht in einer Endlosschleife endet
            i += 5;
        }
    }

    /// Aktuelle RegEx: ([+-]\d+\*x\^\d+)*

    const terme = [];

    // Füge jedes Monom in das Array terme ein
    for (const match of zwischenstandPolynomfunktionIntern.value.matchAll(
        /[+-]\d+\*x\^\d+/g
    )) {
        // match[0] enthält den gefundenen Text, also das Monom
        terme.push(match[0]);
    }
    zwischenstandPolynomfunktionIntern.value = terme;
};

export const polynomfunktionDirektZuArray = () => {
    let hoechsterExponent = 0;
    // Bestimme den höchsten Exponenten in der Polynomfunktion
    // Gehe durch jedes Monom und finde jeweils den Exponenten zum Vergleich mit dem bisherig höchsten Exponenten
    for (let i = 0; i < zwischenstandPolynomfunktionIntern.value.length; i++) {
        let exponentBetrachet = false;
        let monom = zwischenstandPolynomfunktionIntern.value[i];
        for (const match of monom.match(/\d+/g)) {
            // Der zweite gefundene Wert ist immer der Exponent, da ein Monom die Form [+-]\d+\*x\^\d+ hat
            if (exponentBetrachet) {
                if (parseInt(match) > hoechsterExponent) {
                    hoechsterExponent = parseInt(match);
                }
            } else {
                // Koeffizient wird ignoriert und setzt exponent auf true
                exponentBetrachet = true;
            }
        }
    }

    // In Array sollen alle Koeffizienten entsprechend der Höhe ihrer Exponenten gespeichert werden
    // Ganz links höchster Exponent, ganz rechts Exponent 0
    let sortierteKoeffizienten = ref(new Array(hoechsterExponent + 1));

    // Initialisiert das Array mit 0
    for (let i = 0; i <= hoechsterExponent; i++) {
        sortierteKoeffizienten.value[i] = 0;
    }

    // Initialisiere Vorzeichen, Koeffizient, Exponent
    let minusBeiKoeffizient = false;
    let koeffizient = 0;
    let exponent = 0;

    // Suche für jedes Monom das Vorzeichen, den Koeffizienten und den Exponenten
    for (let i = 0; i < zwischenstandPolynomfunktionIntern.value.length; i++) {
        let monom = zwischenstandPolynomfunktionIntern.value[i];
        let first = true;
        let minusBeiKoeffizient = false;

        for (const match of monom.matchAll(/\d+/g)) {
            // Der erste gefundene Wert ist der Koeffizient
            if (first) {
                koeffizient = parseInt(match);
                first = false;
                if(match.index > 0 && monom[match.index - 1] === "-") {
                    // Wenn der Koeffizient negativ ist, wird minusBeiKoeffizient auf true gesetzt
                    minusBeiKoeffizient = true;
                }
            } else {
                exponent = parseInt(match);
            }
        }

        // Füge den Koeffizienten an der Stelle des Exponenten im Array sortierteKoeffizienten ein
        if (minusBeiKoeffizient) {
            koeffizient = -koeffizient;
        }
        sortierteKoeffizienten.value[sortierteKoeffizienten.value.length - exponent - 1] += koeffizient;
    }
     koeffizientenAlsEinArrayIntern.value = sortierteKoeffizienten.value;
};

// Auf Basis der sortierten Daten von arraysSortieren wird das Horner-Schema ausgeführt

export const hornerSchema = () => {
    const tmp = ref(0);
    for (let i = 0; i < koeffizientenAlsEinArrayIntern.value.length; i++) {
        koeffizientenAlsEinArrayIntern.value[i] =
            koeffizientenAlsEinArrayIntern.value[i] + tmp.value;
        tmp.value =
            koeffizientenAlsEinArrayIntern.value[i] *
            parseInt(stelleIntern.value);
    }
};

// Entferne den letzten Eintrag, die Wertung der Exponenten ist durch die Verringerung der Länge des Arrays gegeben

export const entferneFunktionswert = () => {
    koeffizientenAlsEinArrayIntern.value =
        koeffizientenAlsEinArrayIntern.value.slice(
            0,
            koeffizientenAlsEinArrayIntern.value.length - 1
        );
};
