gsap.registerPlugin(ScrollTrigger);

const demoVideo3Info = {
  totalFrames: 499,
  totalTime: 25,
  images: [],
  currentFrame: 0,
  imagePrefix: './layer/Layer',
  imageSuffix: '.jpg',
};


animateOnScroll("demo_video3", demoVideo3Info);