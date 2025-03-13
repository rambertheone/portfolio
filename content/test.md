# My YouTube Video
<a href="https://www.youtube.com/watch?v=Dy0fhTFjPHE" target="_blank">
<div class="video-container" >
  <img src="https://img.youtube.com/vi/Dy0fhTFjPHE/maxresdefault.jpg" alt="Video Thumbnail">
  <p class="video-caption">je lui ai donné un poème</p>
  <p class="video-date">February 16, 2024</p>
</div>
</a>

<style>
.video-container {
  display: flex;
  flex-direction: column;
  padding: 0px;
  border-radius: 15px;
  max-width: 35vw;
  margin: auto;
  border: 1px solid var(--lightgray);
}

.video-container img {
  width: 100%;
  border-radius: 10px 10px 0px 0px;
  transition: transform 0.3s ease-in-out;
  margin: 0px;
}
.video-container:hover{
  /* transform: scale(1.05); */
  background-color: rgba(240, 240, 240, 0.5);
}
.video-caption {
  padding-left: 10px;
  color: var(--dark);
  font-size: 16px;
  margin: 5px 0px 0px 0px;
  text-align: left;
}
.video-date {
  padding-left: 10px;
  color: gray;
  font-size: 14px;
  margin-top: 0px;
  text-align: left;
}
.external-icon {
  display: none;
}
</style>