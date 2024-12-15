document.getElementById("fetch-repo").addEventListener("click", () => {
  const randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26));
  const url = `https://api.github.com/search/repositories?q=${randomLetter}+stars:>100+stars:<1500&sort=stars&order=desc&per_page=100&page=1`;

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
        chrome.tabs.create({ url: randomRepo.html_url });
      } else {
        alert("No repositories found. Try again!");
      }
    })
    .catch(error => {
      console.error(error);
      alert("An error occurred while fetching the repository.");
    });
});

