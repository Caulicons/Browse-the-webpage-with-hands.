import MovieController from "../controllers/movieController.js"
import MovieView from "../views/movieView.js"
import Camera from "../../../shared/Camera.js"
import { SupportWorkerModules } from "../../../../util/util.js"
import MovieService from "../services/movieService.js";

async function getWorker() {

  if (SupportWorkerModules()) {
    console.log('initializing with esm workers');
    const workers = new Worker("./src/workers/movieWorker.js", { type: "module" })
    workers.postMessage('hey I here')
    return workers
  }
  console.warm("your browser doesn't support esm modules on webworkers");
  console.warm("import libraries ")
  await import("https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js")
  await import("https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js")
  await import("https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js")
  await import("https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js")

  console.warm("using worker mock instead!")
  const service = new MovieService()

  const mockWorker = {
    async postMessage(video) {
      const blinked = await service.handleBlinked(video)
      if (!blinked) return;
      mockWorker.onmessage({ data: blinked })
    },
    //will be overridden by the controller
    onmessage(msg) { }
  }

  console.time('load time TF service 🧇')
  await service.loadModel()
  console.timeEnd('load time TF service 🧇')

  setTimeout(() => worker.onmessage({data: 'READY'}), 700)
  return mockWorker
}

const worker = await getWorker();
const camera = await Camera.init();

const factory = {

  async initialize() {

    return MovieController.initialize({
      view: new MovieView(),
      worker,
      camera
    })
  }
}

export default factory