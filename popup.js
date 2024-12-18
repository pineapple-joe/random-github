document.addEventListener("DOMContentLoaded", () => {
  const languageDropdown = document.getElementById("language");
  const labelInput = document.getElementById("label");
  const fetchButton = document.getElementById("fetch-repo");

  // Load the saved language preference from chrome.storage
  chrome.storage.sync.get("selectedLanguage", (data) => {
    if (data.selectedLanguage) {
      languageDropdown.value = data.selectedLanguage;
    }
  });

  // Save the selected language when the user changes it
  languageDropdown.addEventListener("change", () => {
    const selectedLanguage = languageDropdown.value;
    chrome.storage.sync.set({ selectedLanguage });
  });

  labelInput.addEventListener("input", () => {
    chrome.storage.sync.set({ selectedLabel: labelInput.value });
  });

  // Fetch a random GitHub repo when the button is clicked
  fetchButton.addEventListener("click", () => {

    fetchButton.classList.add("animate-spin");

    const language = languageDropdown.value;
    const label = labelInput.value.trim();
    const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));

    let query = `${randomLetter}+stars:>100+stars:<1500`;

    if (language) {
      query += `+language:${language}`;
    }

    if (label) {
      query += `+${encodeURIComponent(label)}`;
    }

    const url = `https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc&per_page=100&page=1`;
    console.log(url)

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.items && data.items.length > 0) {
          const randomRepo = data.items[Math.floor(Math.random() * data.items.length)];
          chrome.tabs.update({ url: randomRepo.html_url });
        } else {
          alert("No repositories found. Try again!");
        }
      })
      .finally(() => {
        fetchButton.classList.remove("animate-spin");
      })
      .catch(error => {
        console.error(error);
        alert("An error occurred while fetching the repository.");
      });
  });
});
