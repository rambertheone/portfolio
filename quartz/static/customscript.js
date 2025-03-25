function isMobileDevice() {
  return (window.innerWidth <= 768) || 
         (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

function initializeProjects() {
  if (!document.querySelector(".filter-container")) return;

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");

  // Remove existing event listeners to avoid duplicates
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

function checkAndInitYouTube() {
  const container = document.getElementById("youtube-latest");
  if (!container || container.getAttribute("data-loaded") === "true") return;

  // if (isMobileDevice()) {
  //   console.log(isMobileDevice());
  //   displayMobileYouTubeAlternative(container);
  //   return;
  // }


  const apiUrl = `https://portfolio-backend-rambertheones-projects.vercel.app/api/youtube`;
  const cacheKey = "youtube_latest_video";
  const cacheExpiry = 3600000;

  function unescapeHtml(html) {
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
    container.innerHTML = unescapeHtml(htmlString);
    container.setAttribute("data-loaded", "true"); // Mark as loaded
  }

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
        const cacheData = {
          timestamp: Date.now(),
          videoData: video,
        };
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
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

  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const { timestamp, videoData } = JSON.parse(cachedData);
      if (cacheExpiry > Date.now() - timestamp) {
        renderVideo(videoData);
      } else {
        // container.textContent = "Loading latest video...";
        localStorage.removeItem(cacheKey);
        getLatestVideo();
      }
    } catch (e) {
      console.error("Error parsing cached data:", e);
      getLatestVideo();
    }
  } else {
    getLatestVideo();
  }
}

function progressBar() {
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

function displayMobileYouTubeAlternative(container) {
  // Static content for mobile devices
  const mobileContent = `
    <div class="video-container">
        <a href="https://www.youtube.com/watch?v=FAAuFoIhU9U" target="_blank">
          <img src="https://i.ytimg.com/vi/FAAuFoIhU9U/hqdefault.jpg" alt="Featured Video">
        </a>
        <p class="video-caption">Une semaine dans ma vie</p>
        <p class="video-date">2023-12-03</p>
      </div>
  `;
  
  container.innerHTML = mobileContent;
  container.setAttribute("data-loaded", "true");
}

document.addEventListener("DOMContentLoaded", function () {
  // Replace the single observer with multiple targeted observers
  
  // Observer for YouTube component
  if (document.getElementById("youtube-latest")) {
    checkAndInitYouTube();
  } else {
    const youtubeObserver = new MutationObserver(function(mutations) {
      if (document.getElementById("youtube-latest")) {
        checkAndInitYouTube();
        youtubeObserver.disconnect(); // Disconnect once found and initialized
      }
    });
    youtubeObserver.observe(document.body, { childList: true, subtree: true });
  }
  
  // Observer for About section
  if (document.getElementById("about")) {
    initializeAbout();
    progressBar();
  } else {
    const aboutObserver = new MutationObserver(function(mutations) {
      if (document.getElementById("about")) {
        initializeAbout();
        progressBar();
        aboutObserver.disconnect(); // Disconnect once found and initialized
      }
    });
    aboutObserver.observe(document.body, { childList: true, subtree: true });
  }
  
  // Observer for Projects/Filter section
  if (document.getElementById("filter")) {
    initializeProjects();
  } else {
    const projectsObserver = new MutationObserver(function(mutations) {
      if (document.getElementById("filter")) {
        initializeProjects();
        projectsObserver.disconnect(); // Disconnect once found and initialized
      }
    });
    projectsObserver.observe(document.body, { childList: true, subtree: true });
  }
  
  // Observer for Contact section
  if (document.getElementById("contact")) {
    initializeContact();
  } else {
    const contactObserver = new MutationObserver(function(mutations) {
      if (document.getElementById("contact")) {
        initializeContact();
        contactObserver.disconnect(); // Disconnect once found and initialized
      }
    });
    contactObserver.observe(document.body, { childList: true, subtree: true });
  }
  
  // Initial call to functions if elements already exist in the DOM
  checkAndInitYouTube();
  progressBar();
  initializeProjects();
  initializeAbout();
  initializeContact();
});