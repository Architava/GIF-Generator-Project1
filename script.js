
let submitBtn = document.getElementById("submit-btn");
let generateGif = () => {
  // Display loader until gif load
  let loader = document.querySelector(".loader");
  loader.style.display = "block";
  document.querySelector(".wrapper").style.display = "none";

  // Get search value (default => laugh)
  let q = document.getElementById("search-box").value || 'laugh';
  // We need 10 gifs to be displayed in result
  let gifCount = 10;
  // API URL with your Giphy API key
  let apiKey = "EYMdmxkfLFPrgV1rfEJjHA9bIAkgZEJH"; // Replace with your actual API key
  let finalURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${q}&limit=${gifCount}&offset=0&rating=g&lang=en`;
  document.querySelector(".wrapper").innerHTML = "";

  // Make a call to API
  fetch(finalURL)
    .then((resp) => {
      if (!resp.ok) {
        throw new Error(`Network response was not ok: ${resp.statusText}`);
      }
      return resp.json();
    })
    .then((info) => {
      console.log(info.data);
      // All gifs
      let gifsData = info.data;
      gifsData.forEach((gif) => {
        // Generate cards for every gif
        let container = document.createElement("div");
        container.classList.add("container");
        let img = document.createElement("img");
        console.log(gif);
        img.setAttribute("src", gif.images.downsized_medium.url);
        img.onload = () => {
          // If images have loaded correctly, reduce the count when each gif loads
          gifCount--;
          if (gifCount === 0) {
            // If all gifs have loaded, then hide loader and display gifs UI
            loader.style.display = "none";
            document.querySelector(".wrapper").style.display = "grid";
          }
        };
        container.append(img);

        // Copy link button
        let copyBtn = document.createElement("button");
        copyBtn.innerText = "Copy Link";
        copyBtn.onclick = () => {
          // Append the obtained ID to default URL
          let copyLink = `https://media4.giphy.com/media/${gif.id}/giphy.mp4`;
          // Copy text inside the text field
          navigator.clipboard
            .writeText(copyLink)
            .then(() => {
              alert("GIF copied to clipboard");
            })
            .catch(() => {
              // If navigator is not supported
              alert("GIF copied to clipboard");
              // Create temporary input
              let hiddenInput = document.createElement("input");
              hiddenInput.setAttribute("type", "text");
              document.body.appendChild(hiddenInput);
              hiddenInput.value = copyLink;
              // Select input
              hiddenInput.select();
              // Copy the value
              document.execCommand("copy");
              // Remove the input
              document.body.removeChild(hiddenInput);
            });
        };
        container.append(copyBtn);
        document.querySelector(".wrapper").append(container);
      });
    })
    .catch((error) => {
      console.error('Error fetching the GIFs:', error);
      loader.style.display = "none";
      alert('Failed to load GIFs. Please check your API key and try again.');
    });
};

// Generate GIFs on screen load or when user clicks on submit
submitBtn.addEventListener("click", generateGif);
window.addEventListener("load", generateGif);