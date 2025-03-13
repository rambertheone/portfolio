---
title: projects
draft: false
---
<div style="gap: 0rem; border-bottom: 1px solid var(--lightgray); padding-inline: 5rem;">
<i class="bi bi-power" style="font-size: 4rem; color: var(--dark);"></i>
<p style="font-size: 2rem; padding-bottom: 1.5rem; color: var(--dark); margin: 0; padding-left: 0rem; width: 250px;">Projects</p>
</div>

<div style="padding-inline: 5rem;">

# [[2025]]

<div class="project-cards">
  <!-- <div class="project-card">
    <a href="index.md" class="project-image-link">
      <img src="/images/projects/bbqvalley.png" alt="BBQ Valley" class="project-image">
    </a>
    <div class="project-info">
      <div class="project-title">BBQ Valley</div>
      <div class="project-tools">
        <span class="tool" title="Vue.js"><i class="bi bi-code-slash"></i></span>
        <span class="tool" title="Firebase"><i class="bi bi-fire"></i></span>
        <span class="tool" title="Tailwind CSS"><i class="bi bi-palette"></i></span>
      </div>
    </div>
  </div> -->
</div>

# [[index | 2024]]

<div class="project-cards">
  <!-- Project Card Template
  <div class="project-card">
    <a href="PROJECT_URL" class="project-image-link">
      <img src="PATH_TO_IMAGE" alt="PROJECT_NAME" class="project-image">
    </a>
    <div class="project-info">
      <div class="project-title">PROJECT_NAME</div>
      <div class="project-tools">
        <span class="tool">Tool 1</span>
        <span class="tool">Tool 2</span>
        <span class="tool">Tool 3</span>
      </div>
    </div>
  </div> -->
  <div class="project-card">
    <a href="index.md" class="project-image-link">
      <img src="/images/projects/bbqvalley.png" alt="BBQ Valley" class="project-image">
    </a>
    <div class="project-info">
      <div class="project-title">BBQ Valley</div>
      <div class="project-tools">
        <span class="tool" title="Vue.js"><i class="bi bi-code-slash"></i></span>
        <span class="tool" title="Firebase"><i class="bi bi-fire"></i></span>
        <span class="tool" title="Tailwind CSS"><i class="bi bi-palette"></i></span>
      </div>
    </div>
  </div>
</div>

<style>
.project-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
.project-description {
  font-size: 0.8rem;
  color: var(--dark);
}
.project-card {
  /* Box model */
  overflow: hidden;
  
  /* Visual */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  /* Animation */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.project-image-link {
  display: block;
  overflow: hidden;
}

.project-image {
  /* Dimensions */
  width: 100%;
  
  /* Visual */
  object-fit: cover;
  
  /* Animation */
  transition: transform 0.5s ease;
}

/* .project-image:hover {
  transform: scale(1.05);
} */

.project-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0rem 1rem 1rem 1rem;
  background-color: var(--light);
}

.project-title {
  /* Box model */
  margin: 0 0 1rem 0;
  
  /* Typography */
  font-size: 1rem;
  color: var(--dark);
}

.project-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tool {
  /* Positioning */
  position: relative;
  
  /* Display & Box model */
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.5rem;
  
  /* Visual */
  /* background-color: var(--lightgray, #f0f0f0); */
  color: var(--dark);
  border-radius: 50%;
  
  /* Typography */
  font-size: 1rem;
  
  /* Animation */
  transition: all 0.3s ease;
}

.tool:hover {
  transform: scale(1.2);
}

.tool::after {
  /* Content */
  content: attr(title);
  
  /* Positioning */
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 5px;
  
  /* Box model */
  padding: 0.25rem 0.5rem;
  
  /* Visual */
  background-color: var(--dark);
  color: var(--light);
  border-radius: 4px;
  opacity: 0;
  visibility: hidden;
  
  /* Typography */
  font-size: 0.75rem;
  white-space: nowrap;
  
  /* Animation */
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.tool:hover::after {
  opacity: 1;
  visibility: visible;
}

.tool i {
  font-size: 1.5rem;
}

.popover {
  display: none;
}
</style>
