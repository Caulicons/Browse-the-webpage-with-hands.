
export default class MovieView {
  #btnStart = document.querySelector('.blink-recognize-container>button');
  #loggerElement = document.querySelector('.status-blink-recognize');
  #videoFrameCanvas = document.createElement('canvas') 
  #canvasContext = this.#videoFrameCanvas.getContext('2d', { willReadFrequently: true})
  #video = document.querySelector('#video')

  getVideoFrame(video) {
    const canvas = this.#videoFrameCanvas; 
    const [width, height] = [video.videoWidth, video.videoHeight ];

    canvas.width = width
    canvas.height = height

    this.#canvasContext.drawImage(video, 0, 0, width, height)
    return this.#canvasContext.getImageData(0, 0 , width, height)
  }

  toggleVideoPause() {
    if(this.#video.paused) {
      this.#video.play()
      return
    }

    this.#video.pause()
  }
  
  enableButton() {
    this.#btnStart.disabled = false;
  }

  configureOnBtnClick(fn) {
    this.#btnStart.addEventListener('click', fn)
  }

  log(text) {
    this.#loggerElement.innerHTML = text;
  }
}