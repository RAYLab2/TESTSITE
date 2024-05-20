function animateOnScroll(canvasID, videoInfo) {
  const canvas = document.getElementById(canvasID);
  const ctx = canvas.getContext("2d");

  canvas.height = screen.height;
  canvas.width = screen.width;

  loadImage();

  function loadImage() {
    for (let i = 1; i < videoInfo.totalFrames; i++) {
      const img = new Image();
      img.src = videoInfo.imagePrefix + i.toString().padStart(3, "0") + videoInfo.imageSuffix;
      videoInfo.images.push(img);
    }
  }


  gsap.to(videoInfo, {
    currentFrame: videoInfo.totalFrames,
    snap: "currentFrame",
    scrollTrigger: {
      trigger: canvas,
      start: "top",
      end: `bottom+=${videoInfo.totalFrames * videoInfo.totalTime}`,
      scrub: true,
      pin: true,
    },
    onUpdate: render,
  });

  videoInfo.images[0].onload = render;

  function render() {
    if(videoInfo.images[videoInfo.currentFrame]) {
      ctx.drawImage(videoInfo.images[videoInfo.currentFrame], 0, 0);
    }
  }
}
