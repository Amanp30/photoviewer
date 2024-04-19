import confirmImages from "./utils/confirmImage";

const defaultSettings = {
  bg: "white",
  keys: true,
};

const mClass = "XViewer";
const arrowClass = `${mClass}-arrow`;
const closeClass = `${mClass}-close`;
const mainImgs = `${mClass}-img`;
const skipper = `${mClass}-skipper`;
const skipperWrapper = `${mClass}-skipper-wrapper`;
const imageWrapper = `${mClass}-image-wrapper`;
const endClass = `${mClass}-skipper-end-class`;
const skipperCurrent = "current";
const skipperNonCurrent = "non-current";

function XViewer(options) {
  if (!options.selector) {
    throw new Error("selector is required");
  }

  this.o = { ...defaultSettings, ...options };
  this.enabled = false;
  this.viewerElement = this.createViewer();
  this.current = 1;
  this.keyEnabled = this.o.keys ?? defaultSettings.keys;
  this.init();
}

XViewer.prototype.createViewer = function () {
  const viewerDiv = document.createElement("div");
  viewerDiv.classList.add(mClass);
  viewerDiv.style.background = this.o.bg;
  viewerDiv.style.display = "none";

  const closeIcon = document.createElement("img");
  closeIcon.onclick = () => this.toggleViewer();
  closeIcon.classList.add(closeClass);
  closeIcon.src = "./imgs/x.svg";

  this.rightArrow = document.createElement("img");
  this.rightArrow.onclick = () => this.inc();
  this.rightArrow.classList.add(arrowClass, "rightArrow");
  this.rightArrow.src = "./imgs/right.svg";

  this.leftArrow = document.createElement("img");
  this.leftArrow.classList.add(arrowClass, "leftArrow");
  this.leftArrow.onclick = () => this.dec();
  this.leftArrow.src = "./imgs/left.svg";

  viewerDiv.appendChild(closeIcon);
  viewerDiv.appendChild(this.leftArrow);
  viewerDiv.appendChild(this.rightArrow);
  document.body.appendChild(viewerDiv);

  return viewerDiv;
};

XViewer.prototype.toggleViewer = function () {
  this.enabled = !this.enabled;
  this.viewerElement.style.display = this.enabled ? "block" : "none";
  document.body.style.position = this.enabled ? "fixed" : "auto";
};

XViewer.prototype.init = function () {
  const imgElms = document.querySelectorAll(
    `[data-XViewer="${this.o.selector}"]`
  );
  this.onlyImgs = confirmImages(imgElms);

  this.wrapSkipper = document.createElement("div");
  this.wrapSkipper.classList.add(skipperWrapper);

  this.wrapImages = document.createElement("div");
  this.wrapImages.classList.add(imageWrapper);

  this.onlyImgs.forEach((elm, i) => {
    elm.addEventListener("click", () => {
      this.toggleViewer();
      this.current = i + 1;
      this.changeImage(i + 1);
    });

    const img = document.createElement("img");
    img.src = this.onlyImgs[i].src;
    img.classList.add(mainImgs, i);

    const div = document.createElement("div");
    div.classList.add(
      skipper,
      this.current === i + 1 ? skipperCurrent : skipperNonCurrent
    );
    div.addEventListener("click", () => this.changeImage(i + 1));

    this.wrapImages.appendChild(img);
    this.wrapSkipper.appendChild(div);
  });

  this.viewerElement.appendChild(this.wrapImages);
  this.viewerElement.appendChild(this.wrapSkipper);

  // adding arrow's support
  document.addEventListener("keydown", this.handleKeyDown.bind(this));
};

XViewer.prototype.handleKeyDown = function (event) {
  if (this.keyEnabled && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
    this[event.key === "ArrowLeft" ? "dec" : "inc"]();
  }
};

XViewer.prototype.changeImage = function (index) {
  this.current = index ?? this.current;
  const isFirst = this.current === 1;
  const isLast = this.current === this.onlyImgs.length;

  this.leftArrow.classList.toggle(endClass, isFirst);
  this.rightArrow.classList.toggle(endClass, isLast);

  const imageSet = Array.from(this.wrapImages.querySelectorAll("img"));
  imageSet.forEach((img, i) => {
    img.style.display = i + 1 === this.current ? "block" : "none";
  });

  const skipperSet = Array.from(
    this.wrapSkipper.querySelectorAll(`.${skipper}`)
  );
  skipperSet.forEach((skipper, i) => {
    skipper.classList.toggle(skipperCurrent, i + 1 === this.current);
    skipper.classList.toggle(skipperNonCurrent, i + 1 !== this.current);
  });
};

XViewer.prototype.inc = function () {
  if (this.current < this.onlyImgs.length) {
    this.current += 1;
    this.changeImage();
  }
};

XViewer.prototype.dec = function () {
  if (this.current > 1) {
    this.current -= 1;
    this.changeImage();
  }
};

export default XViewer;
