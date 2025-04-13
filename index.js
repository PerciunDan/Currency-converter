document.addEventListener("DOMContentLoaded", () => {
  const inputSuma = document.getElementById("inputSuma");
  const inputRezultat = document.getElementById("inputRezultat");
  const valutaDeLaText = document.getElementById("valutaDeLaText");
  const valutaCatreText = document.getElementById("valutaCatreText");
  const dropdownDeLa = document.querySelector("#valutaDeLaContainer select");
  const dropdownCatre = document.querySelector("#valutaCatreContainer select");

  let inputActiv = "suma"; // "suma" sau "rezultat"

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

    inputSuma.addEventListener("input", () => {
      inputActiv = "suma";
      convert();
    });

    inputRezultat.addEventListener("input", () => {
      inputActiv = "rezultat";
      convert();
    });
  }

  async function convert() {
    const valoare =
      inputActiv === "suma"
        ? parseFloat(inputSuma.value)
        : parseFloat(inputRezultat.value);

    const fromCurrency =
      inputActiv === "suma"
        ? valutaDeLaText.textContent.trim()
        : valutaCatreText.textContent.trim();

    const toCurrency =
      inputActiv === "suma"
        ? valutaCatreText.textContent.trim()
        : valutaDeLaText.textContent.trim();

    if (!valoare || isNaN(valoare)) {
      if (inputActiv === "suma") inputRezultat.value = "Introdu o sumă validă";
      else inputSuma.value = "Introdu o sumă validă";
      return;
    }

    try {
      const raspuns = await fetch(
        `https://v6.exchangerate-api.com/v6/626fb82fb949db88aae15695/latest/${fromCurrency}`
      );
      if (!raspuns.ok) throw new Error(`Eroare HTTP: ${raspuns.status}`);

      const date = await raspuns.json();
      if (date.result === "error") throw new Error(date["error-type"]);

      const rata = date.conversion_rates[toCurrency];
      if (!rata) throw new Error("Valuta nu există");

      const rezultat = (valoare * rata).toFixed(2);

      if (inputActiv === "suma") inputRezultat.value = rezultat;
      else inputSuma.value = rezultat;
    } catch (eroare) {
      console.error("Eroare API:", eroare);
      if (inputActiv === "suma") inputRezultat.value = "Eroare de conexiune";
      else inputSuma.value = "Eroare de conexiune";
    }
  }

  initEvents();
});
