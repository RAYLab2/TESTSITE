gsap.registerPlugin(ScrollTrigger);

const demoVideo4Info = {
  totalFrames: 1133,
  totalTime: 37,
  images: [],
  currentFrame: 0,
  imagePrefix: './gy/gy',
  imageSuffix: '.png',
};

animateOnScroll("demo_video4", demoVideo4Info);