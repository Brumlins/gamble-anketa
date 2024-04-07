const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // pro statické soubory (CSS, JS)
app.set('view engine', 'ejs'); // nastavení EJS jako šablonovacího nástroje

app.listen(PORT, () => {
console.log(`Server běží na portu ${PORT}`);
});



/* Routa pro zpracování dat z formuláře */
app.post("/submit", (req, res) => {
  // Zde budeme ukládat data z formuláře do souboru responses.json
  const newResponse = {
    id: Date.now(), // Jednoduchý způsob, jak generovat unikátní ID
    timestamp: new Date().toISOString(),
    answers: req.body, // Předpokládáme, že všechny odpovědi jsou ve formátu, který chceme uložit
  };

  // Čtení stávajících dat z souboru
  fs.readFile("responses.json", (err, data) => {
    if (err) throw err;
    let json = JSON.parse(data);
    json.push(newResponse);

    // Zápis aktualizovaných dat zpět do souboru
    fs.writeFile("responses.json", JSON.stringify(json, null, 2), (err) => {
      if (err) throw err;
      console.log("Data byla úspěšně uložena.");
      console.log(json)
      res.redirect("/results"); 
    });
  });
});

/* Routa pro zobrazení úvodní stránky */ 
app.get('/', (req, res) => {
  // Zde, na úvodní stránce, budeme zobrazovat formulář pro vyplnění ankety
  fs.readFile('responses.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Nastala chyba při čtení dat.');
    }
    const responses = JSON.parse(data);
    res.render('index', { title: 'Webová anketa', responses }); // Předání dat-odpovědí šabloně index.ejs
  });
});


/* Routa pro zobrazení výsledků ankety */
app.get("/results", (req, res) => {
  // Zde bude načtení dat ze souboru responses.json a jejich předání do šablony
  fs.readFile('responses.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Nastala chyba při čtení dat.');
    }
    const responses = JSON.parse(data);
    res.render('results', { responses }); // Předání dat-odpovědí šabloně results.ejs
  });
});


