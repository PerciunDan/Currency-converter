document.addEventListener("DOMContentLoaded", () => {
  const inputSuma = document.getElementById("inputSuma");
  const inputRezultat = document.getElementById("inputRezultat");
  const valutaDeLaText = document.getElementById("valutaDeLaText");
  const valutaCatreText = document.getElementById("valutaCatreText");
  const dropdownDeLa = document.querySelector("#valutaDeLaContainer select");
  const dropdownCatre = document.querySelector("#valutaCatreContainer select");

  // 2. Adăugăm evenimente pentru dropdown-uri
  dropdownDeLa.addEventListener("change", function () {
    valutaDeLaText.textContent = this.value; // Actualizează textul în <p>
    convert(); // Rulează conversia
  });

  dropdownCatre.addEventListener("change", function () {
    valutaCatreText.textContent = this.value; // Actualizează textul în <p>
    convert();
  });

  // 3. Funcția convert() rămâne aceeași ca în codul tău original
  async function convert() {
    const suma = parseFloat(document.getElementById("inputSuma").value);
    const valutaDeLa = valutaDeLaText.textContent;
    const valutaCatre = valutaCatreText.textContent;

    if (!suma || isNaN(suma)) {
      document.getElementById("inputRezultat").value = "Introdu o sumă validă";
      return;
    }

    try {
      const raspuns = await fetch(
        `https://v6.exchangerate-api.com/v6/626fb82fb949db88aae15695/latest/USD${valutaDeLa}`
      );
      const date = await raspuns.json();
      const rata = date.conversion_rates[valutaCatre];
      document.getElementById("inputRezultat").value = (suma * rata).toFixed(2);
    } catch (eroare) {
      document.getElementById("inputRezultat").value = "Eroare conexiune";
    }
  }

  // Butoanele pentru valute "de la"
  document.querySelectorAll("#butoaneValutaDeLa").forEach((buton) => {
    buton.addEventListener("click", () => {
      valutaDeLaText.textContent = buton.textContent;
      convert();
    });
  });

  // Butoanele pentru valute "către"
  document.querySelectorAll("#butoaneValutaCatre").forEach((buton) => {
    buton.addEventListener("click", () => {
      valutaCatreText.textContent = buton.textContent;
      convert();
    });
  });

  // Ascultă schimbări în input
  inputSuma.addEventListener("input", convert);

  async function convert() {
    const suma = parseFloat(inputSuma.value);
    const valutaDeLa = valutaDeLaText.textContent.trim(); // ex: "USD"
    const valutaCatre = valutaCatreText.textContent.trim(); // ex: "EUR"

    if (!suma || isNaN(suma)) {
      inputRezultat.value = "Introdu o sumă validă";
      return;
    }

    try {
      const raspuns = await fetch(
        `https://v6.exchangerate-api.com/v6/626fb82fb949db88aae15695/latest/${valutaDeLa}`
      );
      if (!raspuns.ok) throw new Error(`Eroare HTTP: ${raspuns.status}`);

      const date = await raspuns.json();
      if (date.result === "error") throw new Error(date["error-type"]);

      const rata = date.conversion_rates[valutaCatre];
      if (!rata) throw new Error("Valuta nu există");

      inputRezultat.value = (suma * rata).toFixed(2);
    } catch (eroare) {
      console.error("Eroare API:", eroare);
      inputRezultat.value = "Eroare de conexiune";
    }
  }
});
