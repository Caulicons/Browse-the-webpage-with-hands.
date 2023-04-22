import { prepareRunChecker } from "../../../../util/util.js";

const { shouldRun: shouldRunScroll }  = prepareRunChecker({ timeDelay: 200 });
const { shouldRun: shouldRunClick }  = prepareRunChecker({ timeDelay: 600 });

export default class HandGestureController {
  #view
  #service
  #camera
  constructor({ view, service, camera }) {
    this.#view = view;
    this.#service = service;
    this.#camera = camera;
  }

  static async initialize(dependencies) {
    const controller = new HandGestureController(dependencies)
    return controller.#init()
  }

  async #init() {
    return this.#loop()
  }

  /* Loop to recognize gesture */
  async #loop() {
    await this.#service.initializeDetector()
    await this.#estimateHands()
    this.#view.loop(this.#loop.bind(this))
  }

  async #estimateHands() {

    try {
      const hands = await this.#service.estimateHands(this.#camera.video);
      this.#view.clearCanvas()

      if (hands?.length) this.#view.drawHands(hands)

      for await (const {event, x, y} of this.#service.detectorGesture(hands)) {
        if (event === 'click') {
          if (!shouldRunClick()) continue;

          this.#view.clickElementWithHand(x, y);
          continue;
        }

        if (event.includes('scroll')) {
          if (!shouldRunScroll()) continue;
          this.#view.handleScrollWithGestores(event)
        }
      }

    } catch (error) {
      console.log(`damn, have error: ${error}`);
    }
  }
}