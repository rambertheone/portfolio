function initializeProjects() {
  // Only run this code if we're on the projects page
  if (!document.querySelector(".filter-container")) return;

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      this.classList.add("active");
      const filterValue = this.getAttribute("data-filter");

      localStorage.setItem("selectedFilter", filterValue);

      applyFilter(filterValue, projectCards);
    });
  });
}

function applyFilter(filterValue, projectCards) {
  projectCards.forEach((card) => {
    const tag = card.children[0].children[1].classList[1];
    if (filterValue === "all") {
      card.classList.remove("hidden");
    } else if (filterValue === "personal") {
      if (tag === "tag-personal") {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    } else if (filterValue === "work") {
      if (tag === "tag-work") {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    } else if (filterValue === "freelance") {
      if (tag === "tag-freelance") {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    }
  });
}

function checkAndInitYouTube() {
  // First check if the container exists and needs loading
  const container = document.getElementById("youtube-latest");
  if (!container || container.getAttribute("data-loaded") === "true") {
    return; // Either no container or already loaded
  }

  console.log("Loading YouTube content");
  container.textContent = "Loading latest video...";

  const apiUrl = `https://portfolio-backend-five-lovat.vercel.app/api/youtube`;
  const cacheKey = "youtube_latest_video";
  const cacheExpiry = 3600000; // 1 hour in milliseconds

  function unescapeHtml(html) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
  }

  // Function to render the video
  function renderVideo(video) {
    const videoId = video.id.videoId;
    const title = video.snippet.title;
    const publishedAt = new Date(video.snippet.publishedAt);
    const thumbnailUrl =
      video.snippet.thumbnails.maxres?.url ||
      video.snippet.thumbnails.high?.url ||
      video.snippet.thumbnails.medium.url;

    const options = { year: "numeric", month: "long", day: "numeric" };
    const formattedDate = publishedAt.toLocaleDateString("en-US", options);

    const htmlString = `
      <div class="video-container">
        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">
          <img src="${thumbnailUrl}" alt="${title}">
        </a>
        <p class="video-caption">${title}</p>
        <p class="video-date">${formattedDate}</p>
      </div>
    `;
    container.innerHTML = unescapeHtml(htmlString);
    container.setAttribute("data-loaded", "true");
    console.log("YouTube content loaded successfully");
  }

  // Function to fetch the latest video from the API
  async function getLatestVideo() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (!data.items) {
        console.log("No items found.");
        container.innerHTML = unescapeHtml("<p>No items found.</p>");
        return;
      }
      if (data.items.length > 0) {
        const video = data.items[0];

        // Save the video data and timestamp to localStorage
        const cacheData = {
          timestamp: Date.now(),
          videoData: video,
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));

        // Render the video
        renderVideo(video);
      } else {
        console.log("No videos found.");
        container.innerHTML = unescapeHtml("<p>No videos found.</p>");
      }
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
      container.innerHTML = unescapeHtml("<p>Error loading latest video.</p>");
    }
  }

  // Check if we have cached data
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const { timestamp, videoData } = JSON.parse(cachedData);

      // Check if the cached data is still valid
      if (cacheExpiry > Date.now() - timestamp) {
        console.log("Using cached data.");
        renderVideo(videoData);
      } else {
        console.log("Cached data expired. Fetching new data.");
        localStorage.removeItem(cacheKey); // Clear expired cache
        getLatestVideo();
      }
    } catch (e) {
      console.error("Error parsing cached data:", e);
      getLatestVideo();
    }
  } else {
    console.log("No cached data found. Fetching new data.");
    getLatestVideo();
  }
}

// 1. On initial page load
document.addEventListener("DOMContentLoaded", function() {
  checkAndInitYouTube();
  
  const observer = new MutationObserver(function(mutations) {
    if (document.getElementById("youtube-latest")) {
      checkAndInitYouTube();
    }
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  let filterObserver = new MutationObserver(function(mutations) {
    if (document.getElementById("filter")) {
      initializeProjects();
    }
  });
  
  filterObserver.observe(document.body, { childList: true, subtree: true });
  initializeProjects();
});