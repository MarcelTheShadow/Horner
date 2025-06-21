# Vue.js-Implementation des Horner-Schemas mit Anwendungsfällen Polynomdivision und Funktionswertberechnung

### Um die Anwendung lokal laufen zu lassen, muss im Terminal einmalig **'npm install'** und für jede Ausführung **'npm run dev'** eingegeben werden.

### Im Ordner "components" finden sich die realen Vue-Seiten, die durch die .js-Dateien in "composables" mit Logik und durch die .css-Dateien in "assets" mit Style gefüllt werden.

## Components:
### home.vue stellt eine Startseite dar.
### In der funktionswertberechnung.vue kann eine Funktionswertberechnung unter Eingabe einer Polynomfunktion, einer Stelle und einer Ordnung der Ableitung erfolgen.
### In der polynomdivision.vue kann eine Polynomdivision unter Eingabe einer Polynomfunktion und einer gültigen Stelle erfolgen.
### Es muss sich an die angegebenen Formate gehalten werden, sonst wird eine Fehlernachricht zurückgegeben.

## Composables:
### In basismethoden.js finden sich Methoden und Variablen, die von Funktionswertberechnung und Polynomdivision gleichermaßen verwendet werden, etwa die Umwandlung der Polynomfunktion und die tatsächliche Methode zur Ausführung des Horner-Schemas.
### In funktionswertberechnung.js und polynomdivision.js finden sich diejenigen Methoden und Variablen, die nur für einen der beiden Anwendungsfälle verwendet werden, unter anderem die Main-Funktionen, die nach der Eingabe laufen, um das gewünschte Ergebnis zu generieren.



### Es wird mit Vue router gearbeitet, die Konfiguration hierzu ist in index.js. Daher handelt es sich um eine Single Page Application.

### Die reale Einbindung der App erfolgt über index.html, main.js und App.vue.