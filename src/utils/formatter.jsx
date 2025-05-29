const normalizeText = (text) => {
  const stopWords = new Set(["de", "el", "con", "e", "y"]);

  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Elimina tildes
    .replace(/ñ/g, "n") // Sustituye ñ por n
    .toLowerCase() // Convierte todo a minúsculas para facilitar el filtrado
    .split(/\s+/) // Divide por espacios
    .filter((word) => !stopWords.has(word)) // Elimina palabras no deseadas
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palabra
    .join(""); // Une todo en un solo string sin espacios
};

const capitalize = (fullName) => {
  const capitalize = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  return fullName
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

const formatter = {
  normalizeText,
  capitalize,
};

export default formatter;
