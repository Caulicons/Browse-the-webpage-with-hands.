export default class MovieController {
  #view
  #worker
  #camera
  #blinkCounter = 0
  constructor({ view, worker, camera }) {
    this.#view = view
    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
    this.#worker = this.#configWorker(worker)
    this.#camera = camera
  }

  static async initialize(deps) {

    const controller = new MovieController(deps)
    controller.log('not yet detecting eye blink! Click in the button to start')
    return controller.init()
  }

  async init() {

  }

  log(text) {
    const timers = `      - Blinked times: ${this.#blinkCounter}`
    this.#view.log(`logger: ${text}`.concat(timers));
  }

  loopBlinkCapture() {
    const video = this.#camera.video
    const image = this.#view.getVideoFrame(video)
    this.#worker.send(image)
    this.log(`detecting eye blink...`)
    setTimeout(() => this.loopBlinkCapture(), 400)
  }

  onBtnStart() {
    this.#blinkCounter = 0
    this.#view.log('initializing detection...');
    this.loopBlinkCapture()
  }

  #configWorker(worker) {

    let ready = false
    worker.onmessage = ({ data }) => {

      if (data === 'READY') {
        
        console.log('worker is ready!');
        this.#view.enableButton()
        ready = true
        return
      }
      
      this.log(data)
      const blinked = data.blinked
      this.#blinkCounter += blinked
      this.#view.toggleVideoPause()
      console.log('blinked', blinked)
    }

    return {
      send(msg) {
        if (!ready) return;
        worker.postMessage(msg)
      }

    }
  }
}


