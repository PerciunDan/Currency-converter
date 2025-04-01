document.addEventListener("DOMContentLoaded", () => {
  // Selectare elemente DOM
  const inputSuma = document.getElementById("inputSuma");
  const inputRezultat = document.getElementById("inputRezultat");
  const valutaDeLaText = document.getElementById("valutaDeLaText");
  const valutaCatreText = document.getElementById("valutaCatreText");
  const dropdownDeLa = document.querySelector("#valutaDeLaContainer select");
  const dropdownCatre = document.querySelector("#valutaCatreContainer select");

  // Inițializare evenimente
  function initEvents() {
    dropdownDeLa.addEventListener("change", () => {
      valutaDeLaText.textContent = dropdownDeLa.value;
      convert();
    });

    dropdownCatre.addEventListener("change", () => {
      valutaCatreText.textContent = dropdownCatre.value;
      convert();
    });

    document.querySelectorAll("#butoaneValutaDeLa").forEach((buton) => {
      buton.addEventListener("click", () => {
        valutaDeLaText.textContent = buton.textContent;
        convert();
      });
    });

    document.querySelectorAll("#butoaneValutaCatre").forEach((buton) => {
      buton.addEventListener("click", () => {
        valutaCatreText.textContent = buton.textContent;
        convert();
      });
    });

    inputSuma.addEventListener("input", convert);
  }

  // Funcția principală
  async function convert() {
    const suma = parseFloat(inputSuma.value);
    const valutaDeLa = valutaDeLaText.textContent.trim();
    const valutaCatre = valutaCatreText.textContent.trim();

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

  // Pornire aplicație
  initEvents();
});
