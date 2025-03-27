// Store observers globally so we can manage them
const observers = {
  about: null,
  projects: null,
  contact: null
};

// Function to safely disconnect and reconnect observers
function resetObserver(key) {
  if (observers[key]) {
    observers[key].disconnect();
  }
  
  const config = {
    about: {
      id: "about",
      callback: () => {
        initializeAbout();
        initializeProgressBar();
      }
    },
    projects: {
      id: "filter",
      callback: initializeProjects
    },
    contact: {
      id: "contact",
      callback: initializeContact
    }
  };

  const { id, callback } = config[key];
  
  observers[key] = new MutationObserver((mutations) => {
    if (document.getElementById(id)) {
      callback();
    }
  });

  observers[key].observe(document.body, { childList: true, subtree: true });
}

// Function to handle navigation events
function handleNavigation() {
  // Reset all observers (except YouTube)
  Object.keys(observers).forEach(key => resetObserver(key));
  
  // Initialize components based on current content
  if (document.getElementById("youtube-latest")) {
    checkAndInitYouTube();
  }
  if (document.getElementById("about")) {
    initializeAbout();
    initializeProgressBar();
  }
  if (document.getElementById("filter")) {
    initializeProjects();
  }
  if (document.getElementById("contact")) {
    initializeContact();
  }
}

// YouTube initialization
function checkAndInitYouTube() {
  const container = document.getElementById("youtube-latest");
  if (!container) return;

  container.textContent = "Loading latest video...";
  
  const apiUrl = `https://portfolio-backend-rambertheones-projects.vercel.app/api/youtube`;
  const cacheKey = "youtube_latest_video";
  const cacheExpiry = 3600000;

  // Check if we're in development mode
  const isDevelopment = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';

  // Development fallback data
  const fallbackVideo = {
    id: { videoId: "OV1FlZfwZRA" },
    snippet: {
      title: "Latest Video Title",
      publishedAt: new Date().toISOString(),
      thumbnails: {
        medium: {
          url: "https://i.ytimg.com/vi/YOUR_VIDEO_ID/mqdefault.jpg"
        }
      }
    }
  };

  function unescapeHTML(html) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
  }

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
    container.innerHTML = unescapeHTML(htmlString);
  }

  async function getLatestVideo() {
    // If in development, use fallback data
    if (isDevelopment) {
      console.log("Development mode: using fallback data");
      renderVideo(fallbackVideo);
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        },
        credentials: 'omit'
      });
      
      const data = await response.json();
      if (!data.items) {
        throw new Error('No items found');
      }
      
      if (data.items.length > 0) {
        const video = data.items[0];
        const cacheData = {
          timestamp: Date.now(),
          videoData: video,
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        renderVideo(video);
      } else {
        throw new Error('No videos found');
      }
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
      
      // Try to use cached data
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const { videoData } = JSON.parse(cachedData);
          renderVideo(videoData);
          container.innerHTML += "<p style='font-size: 0.8em; color: #666;'>Using cached data</p>";
        } catch (e) {
          container.innerHTML = unescapeHTML("<p>Error loading latest video.</p>");
        }
      } else {
        // If no cache and in development, use fallback
        if (isDevelopment) {
          renderVideo(fallbackVideo);
        } else {
          container.innerHTML = unescapeHTML("<p>Error loading latest video.</p>");
        }
      }
    }
  }

  // Try cache first
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const { timestamp, videoData } = JSON.parse(cachedData);
      if (cacheExpiry > Date.now() - timestamp) {
        renderVideo(videoData);
        return;
      }
      localStorage.removeItem(cacheKey);
    } catch (e) {
      console.error("Error parsing cached data:", e);
    }
  }

  // If no valid cache, get new data
  getLatestVideo();
}

// Projects initialization
function initializeProjects() {
  const container = document.getElementById("filter");
  if (!container) return;

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");

  // Clean up existing listeners
  filterButtons.forEach(button => {
    button.removeEventListener("click", handleFilterClick);
    button.addEventListener("click", handleFilterClick);
  });

  function handleFilterClick() {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");
    const filterValue = this.getAttribute("data-filter");

    localStorage.setItem("selectedFilter", filterValue);

    projectCards.forEach(card => {
      const tagElement = card.children[0]?.children[1];
      const tag = tagElement ? tagElement.classList[1] : "";
      if (filterValue === "all" || tag.includes(`tag-${filterValue}`)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  // Apply stored filter if exists
  const storedFilter = localStorage.getItem("selectedFilter");
  if (storedFilter) {
    const button = document.querySelector(`.filter-button[data-filter="${storedFilter}"]`);
    if (button) {
      button.click();
    }
  }
}

// Progress bar initialization
function initializeProgressBar() {
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    if (bar.getAttribute("data-processed") === "true") return;

    let level = parseInt(bar.getAttribute("data-level"), 10);
    for (let i = 0; i < 10; i++) {
      let square = document.createElement("div");
      if (i < level) square.classList.add("filled");
      bar.appendChild(square);
    }

    bar.setAttribute("data-processed", "true");
  });
}

// About section initialization
function initializeAbout() {
  const filterButtons = document.querySelectorAll(".filter-button");
  if (!filterButtons.length) return;

  const collectionItems = document.querySelectorAll(".collection-item");

  filterButtons.forEach((button) => {
    button.removeEventListener("click", handleFilterClick);
    button.addEventListener("click", handleFilterClick);
  });

  function handleFilterClick() {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");

    const category = this.getAttribute("data-category");
    collectionItems.forEach(item => {
      if (category === "all" || item.getAttribute("data-category") === category) {
        item.style.display = "";
      } else {
        item.style.display = "none";
      }
    });
  }
}

// Contact form initialization
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

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initial setup
  handleNavigation();
  
  // Handle navigation events
  window.addEventListener('popstate', () => {
    const youtubeContainer = document.getElementById("youtube-latest");
    if (youtubeContainer) {
      youtubeContainer.removeAttribute("data-loaded");
      checkAndInitYouTube();
    }
    setTimeout(handleNavigation, 50);
  });

  // Handle link clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.hostname === window.location.hostname) {
      const youtubeContainer = document.getElementById("youtube-latest");
      if (youtubeContainer) {
        youtubeContainer.removeAttribute("data-loaded");
        checkAndInitYouTube();
      }
      setTimeout(handleNavigation, 50);
    }
  });

  // Initial YouTube check
  const youtubeContainer = document.getElementById("youtube-latest");
  if (youtubeContainer) {
    checkAndInitYouTube();
  }
});