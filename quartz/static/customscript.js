// First, define all initialization functions at the top level
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

// Store observers globally
const observers = {
  youtube: null,
  about: null,
  projects: null,
  contact: null
};

function resetObserver(key) {
  try {
    if (observers[key]) {
      observers[key].disconnect();
    }
    
    const config = {
      youtube: {
        id: "youtube-latest",
        callback: () => {
          const container = document.getElementById("youtube-latest");
          if (container) checkAndInitYouTube();
        }
      },
      about: {
        id: "about",
        callback: () => {
          const aboutSection = document.getElementById("about");
          if (aboutSection) {
            setTimeout(() => {
              initializeAbout();
              progressBar();
            }, 50);
          }
        }
      },
      projects: {
        id: "filter",
        callback: () => {
          const filterContainer = document.getElementById("filter");
          if (filterContainer) initializeProjects();
        }
      },
      contact: {
        id: "contact",
        callback: () => {
          const contactSection = document.getElementById("contact");
          if (contactSection) initializeContact();
        }
      }
    };

    if (!config[key]) return;

    const { id, callback } = config[key];
    
    observers[key] = new MutationObserver((mutations) => {
      if (document.getElementById(id)) {
        callback();
      }
    });

    observers[key].observe(document.body, { childList: true, subtree: true });
  } catch (error) {
    console.error(`Error in resetObserver for ${key}:`, error);
  }
}

// Function to handle navigation events
function handleNavigation() {
  // Reset all observers
  Object.keys(observers).forEach(key => resetObserver(key));
  
  // Initialize components based on current content
  if (document.getElementById("youtube-latest")) {
    checkAndInitYouTube();
  }
  if (document.getElementById("about")) {
    initializeAbout();
    progressBar();
  }
  if (document.getElementById("filter")) {
    initializeProjects();
  }
  if (document.getElementById("contact")) {
    initializeContact();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  try {
    handleNavigation();
    
    window.addEventListener('popstate', () => {
      setTimeout(handleNavigation, 50);
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (link && link.hostname === window.location.hostname) {
        setTimeout(handleNavigation, 50);
      }
    });
  } catch (error) {
    console.error("Error in initialization:", error);
  }
});

// Update checkAndInitYouTube to handle CORS errors
function checkAndInitYouTube() {
  const container = document.getElementById("youtube-latest");
  if (!container) return;

  const apiUrl = `https://portfolio-backend-rambertheones-projects.vercel.app/api/youtube`;
  const cacheKey = "youtube_latest_video";
  const cacheExpiry = 3600000;

  // Try to load from cache first
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const { timestamp, videoData } = JSON.parse(cachedData);
      if (Date.now() - timestamp < cacheExpiry) {
        renderVideo(videoData);
        return;
      }
    } catch (e) {
      console.error("Error parsing cached data:", e);
    }
  }

  // If no cache or expired, try to fetch
  container.textContent = "Loading latest video...";
  
  fetch(apiUrl, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    if (data.items && data.items.length > 0) {
      const video = data.items[0];
      localStorage.setItem(cacheKey, JSON.stringify({
        timestamp: Date.now(),
        videoData: video
      }));
      renderVideo(video);
    } else {
      container.innerHTML = "<p>No videos found.</p>";
    }
  })
  .catch(error => {
    console.error("Error fetching YouTube data:", error);
    // On error, try to show cached content even if expired
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const { videoData } = JSON.parse(cachedData);
        renderVideo(videoData);
        container.innerHTML += "<p class='error-message'>Unable to fetch latest video. Showing cached content.</p>";
      } catch (e) {
        container.innerHTML = "<p>Error loading video content.</p>";
      }
    } else {
      container.innerHTML = "<p>Error loading video content.</p>";
    }
  });
}

function initializeProjects() {
  if (!document.querySelector(".filter-container")) return;

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");

  // Clean up existing listeners
  filterButtons.forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });

  // Reattach listeners
  document.querySelectorAll(".filter-button").forEach(button => {
    button.addEventListener("click", handleFilterClick);
  });
}

function initializeAbout() {
  const filterButtons = document.querySelectorAll(".filter-button");
  if (!filterButtons.length) return;

  // Clean up existing listeners
  filterButtons.forEach(button => {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
  });

  // Reattach listeners
  document.querySelectorAll(".filter-button").forEach(button => {
    button.addEventListener("click", handleFilterClick);
  });
}

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

function SetupNavigationHandlers() {
  document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' || e.target.closest('a')) {
      const link = e.target.tagName === 'A' ? e.target : e.target.closest('a');
      
      if (link.hostname === window.location.hostname && !link.target) {
        setTimeout(() => {
          CheckAndInitializeYouTube();
        }, 100);
      }
    }
  });
  
  window.addEventListener('popstate', function() {
    setTimeout(() => {
      CheckAndInitializeYouTube();
    }, 100);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  
  SetupNavigationHandlers();
  
  if (document.getElementById("youtube-latest")) {
    CheckAndInitializeYouTube();
  } else {
    const youtubeObserver = new MutationObserver(function(mutations) {
      if (document.getElementById("youtube-latest")) {
        CheckAndInitializeYouTube();
        // youtubeObserver.disconnect();
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
        // aboutObserver.disconnect();
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
        // projectsObserver.disconnect();
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
        // contactObserver.disconnect();
      }
    });
    contactObserver.observe(document.body, { childList: true, subtree: true });
  }
});