function initializeProjects() {
  // Only run this code if we're on the projects page
  if (!document.querySelector(".filter-container")) return

  const filterButtons = document.querySelectorAll(".filter-button")
  const projectCards = document.querySelectorAll(".project-card")

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")
      const filterValue = this.getAttribute("data-filter")

      localStorage.setItem("selectedFilter", filterValue)
      
      projectCards.forEach(card => {
        const tagElement = card.children[0].children[1];      
        const tag = tagElement ? tagElement.classList[1] : "";
        if (filterValue === "all") {
          card.style.display = "";
        } else if (tag.includes(`tag-${filterValue}`)) {
          card.style.display = "";
        } else {
          card.style.display = "none";
        }
      });
    })
  })
}

function checkAndInitYouTube() {
  // First check if the container exists and needs loading
  const container = document.getElementById("youtube-latest")
  if (!container || container.getAttribute("data-loaded") === "true") {
    return // Either no container or already loaded
  }

  container.textContent = "Loading latest video..."

  const apiUrl = `https://portfolio-backend-five-lovat.vercel.app/api/youtube`
  const cacheKey = "youtube_latest_video"
  const cacheExpiry = 3600000

  function unescapeHtml(html) {
    const textArea = document.createElement("textarea")
    textArea.innerHTML = html
    return textArea.value
  }

  // Function to render the video
  function renderVideo(video) {
    const videoId = video.id.videoId
    const title = video.snippet.title
    const publishedAt = new Date(video.snippet.publishedAt)
    const thumbnailUrl =
      video.snippet.thumbnails.maxres?.url ||
      video.snippet.thumbnails.high?.url ||
      video.snippet.thumbnails.medium.url

    const options = { year: "numeric", month: "long", day: "numeric" }
    const formattedDate = publishedAt.toLocaleDateString("en-US", options)

    const htmlString = `
      <div class="video-container">
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
          <img src="${thumbnailUrl}" alt="${title}">
        </a>
        <p class="video-caption">${title}</p>
        <p class="video-date">${formattedDate}</p>
      </div>
    `
    container.innerHTML = unescapeHtml(htmlString)
    container.setAttribute("data-loaded", "true")
  }

  // Function to fetch the latest video from the API
  async function getLatestVideo() {
    try {
      const response = await fetch(apiUrl)
      const data = await response.json()
      if (!data.items) {
        console.log("No items found.")
        container.innerHTML = unescapeHtml("<p>No items found.</p>")
        return
      }
      if (data.items.length > 0) {
        const video = data.items[0]

        // Save the video data and timestamp to localStorage
        const cacheData = {
          timestamp: Date.now(),
          videoData: video,
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))

        // Render the video
        renderVideo(video)
      } else {
        console.log("No videos found.")
        container.innerHTML = unescapeHtml("<p>No videos found.</p>")
      }
    } catch (error) {
      console.error("Error fetching YouTube data:", error)
      container.innerHTML = unescapeHtml("<p>Error loading latest video.</p>")
    }
  }

  // Check if we have cached data
  const cachedData = localStorage.getItem(cacheKey)
  if (cachedData) {
    try {
      const { timestamp, videoData } = JSON.parse(cachedData)

      // Check if the cached data is still valid
      if (cacheExpiry > Date.now() - timestamp) {
        renderVideo(videoData)
      } else {
        localStorage.removeItem(cacheKey) // Clear expired cache
        getLatestVideo()
      }
    } catch (e) {
      console.error("Error parsing cached data:", e)
      getLatestVideo()
    }
  } else {
    getLatestVideo()
  }
}

function progressBar() {
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    if (bar.getAttribute("data-processed") === "true") return;

    let level = parseInt(bar.getAttribute("data-level"), 10)
    for (let i = 0; i < 10; i++) {
      let square = document.createElement("div")
      if (i < level) square.classList.add("filled")
      bar.appendChild(square)
    }

    bar.setAttribute("data-processed", "true")
  })
}

// function initializeProjects() {
//   // Only run this code if we're on the projects page
//   if (!document.querySelector(".filter-container")) return

//   const filterButtons = document.querySelectorAll(".filter-button")
//   const projectCards = document.querySelectorAll(".project-card")

//   filterButtons.forEach((button) => {
//     button.addEventListener("click", function () {
//       // Remove active class from all buttons
//       filterButtons.forEach((btn) => btn.classList.remove("active"))

//       // Add active class to clicked button
//       this.classList.add("active")
//       const filterValue = this.getAttribute("data-filter")

//       localStorage.setItem("selectedFilter", filterValue)

//       applyFilter(filterValue, projectCards)
//     })
//   })
// }

function initializeAbout() {
  // Only run this code if the filter buttons exist
  const filterButtons = document.querySelectorAll(".filter-button");
  if (!filterButtons.length) return;

  const collectionItems = document.querySelectorAll(".collection-item");

  // Add click event listeners to filter buttons
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to the clicked button
      this.classList.add("active");

      // Get the selected category
      const category = this.getAttribute("data-category");
      
      // Debug - check what we're filtering
      console.log("Category:", category);
      console.log("Items:", collectionItems);
      
      // Filter items based on category
      collectionItems.forEach(item => {
        if (category === "all" || item.getAttribute("data-category") === category) {
          item.style.display = "";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

function initializeContact() {
  var d = document,
      w = "https://tally.so/widgets/embed.js",
      v = function () {
        "undefined" != typeof Tally
          ? Tally.loadEmbeds()
          : d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach(function (e) {
              e.src = e.dataset.tallySrc;
            });
      };
    if ("undefined" != typeof Tally) v();
    else if (d.querySelector('script[src="' + w + '"]') == null) {
      var s = d.createElement("script");
      s.src = w;
      s.onload = v;
      s.onerror = function () {
        console.error("Failed to load Tally script.");
      };
      d.body.appendChild(s);
    }
}

// 1. On initial page load
document.addEventListener("DOMContentLoaded", function () {
  const observer = new MutationObserver(function (mutations) {
    if (document.getElementById("youtube-latest")) {
      checkAndInitYouTube()
    }
    if (document.getElementById("about")) {
      initializeAbout()
      progressBar()
    }
    if (document.getElementById("filter")) {
      initializeProjects()
    }
    if (document.getElementById("contact")) {
      initializeContact()
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })

  checkAndInitYouTube()
  progressBar()
  initializeProjects()
  initializeAbout()
  initializeContact()
})
