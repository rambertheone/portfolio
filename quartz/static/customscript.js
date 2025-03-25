function InitializeProjects() {
  if (!document.querySelector(".filter-container")) return;

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");

  // Remove existing event listeners to avoid duplicates
  filterButtons.forEach(button => {
    button.removeEventListener("click", HandleFilterClick);
    button.addEventListener("click", HandleFilterClick);
  });

  function HandleFilterClick() {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    this.classList.add("active");
    const filterValue = this.getAttribute("data-filter");

    localStorage.setItem("selectedFilter", filterValue);

    projectCards.forEach(card => {
      const tagElement = card.children[0].children[1];
      const tag = tagElement ? tagElement.classList[1] : "";
      if (filterValue === "all" || tag.includes(`tag-${filterValue}`)) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }
}

function CheckAndInitializeYouTube() {
  const container = document.getElementById("youtube-latest");

  const apiUrl = `https://portfolio-backend-rambertheones-projects.vercel.app/api/youtube`;
  const cacheKey = "youtube_latest_video";
  const cacheExpiry = 3600000;

  function UnescapeHTML(html) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = html;
    return textArea.value;
  }

  function RenderVideo(video) {
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
    container.innerHTML = UnescapeHTML(htmlString);
    container.setAttribute("data-loaded", "true"); // Mark as loaded
  }

  async function GetLatestVideo() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (!data.items) {
        console.log("No items found.");
        container.innerHTML = UnescapeHTML("<p>No items found.</p>");
        return;
      }
      if (data.items.length > 0) {
        const video = data.items[0];
        const cacheData = {
          timestamp: Date.now(),
          videoData: video,
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
        RenderVideo(video);
      } else {
        console.log("No videos found.");
        container.innerHTML = UnescapeHTML("<p>No videos found.</p>");
      }
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
      container.innerHTML = UnescapeHTML("<p>Error loading latest video.</p>");
    }
  }

  if (container.querySelector('.video-container') && container.getAttribute("data-loaded") === "true") {
    return; 
  }

  container.textContent = "Loading latest video...";

  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const { timestamp, videoData } = JSON.parse(cachedData);
      if (cacheExpiry > Date.now() - timestamp) {
        RenderVideo(videoData);
      } else {
        localStorage.removeItem(cacheKey);
        GetLatestVideo();
      }
    } catch (e) {
      console.error("Error parsing cached data:", e);
      GetLatestVideo();
    }
  } else {
    GetLatestVideo();
  }
}

function InitializeProgressBar() {
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

function InitializeAbout() {
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

function InitializeContact() {
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

function SetupNavigationHandlers() {
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
      
      if (link.hostname === window.location.hostname && !link.target) {
        setTimeout(() => {
          checkAndInitYouTube();
        }, 100);
      }
    }
  });
  
  window.addEventListener('popstate', function() {
    setTimeout(() => {
      checkAndInitYouTube();
    }, 100);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  
  SetupNavigationHandlers();
  
  if (document.getElementById("youtube-latest")) {
    checkAndInitYouTube();
  } else {
    const youtubeObserver = new MutationObserver(function(mutations) {
      if (document.getElementById("youtube-latest")) {
        checkAndInitYouTube();
        youtubeObserver.disconnect();
      }
    });
    youtubeObserver.observe(document.body, { childList: true, subtree: true });
  }
  
  if (document.getElementById("about")) {
    InitializeAbout();
    InitializeProgressBar();
  } else {
    const aboutObserver = new MutationObserver(function(mutations) {
      if (document.getElementById("about")) {
        InitializeAbout();
        InitializeProgressBar();
        aboutObserver.disconnect();
      }
    });
    aboutObserver.observe(document.body, { childList: true, subtree: true });
  }
  
  if (document.getElementById("filter")) {
    InitializeProjects();
  } else {
    const projectsObserver = new MutationObserver(function(mutations) {
      if (document.getElementById("filter")) {
        InitializeProjects();
        projectsObserver.disconnect();
      }
    });
    projectsObserver.observe(document.body, { childList: true, subtree: true });
  }
  
  if (document.getElementById("contact")) {
    InitializeContact();
  } else {
    const contactObserver = new MutationObserver(function(mutations) {
      if (document.getElementById("contact")) {
        InitializeContact();
        contactObserver.disconnect();
      }
    });
    contactObserver.observe(document.body, { childList: true, subtree: true });
  }
});