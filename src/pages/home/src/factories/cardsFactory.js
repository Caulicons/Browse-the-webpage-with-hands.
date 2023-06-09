import CardsController from "./../controllers/cardsController.js"
import CardsView from "./../views/cardsView.js"
import CardsService from "./../services/cardsService.js"
const cardSearchWorker = new Worker("./src/workers/cardSearchWorker.js")

const [rootPath] = window.location.href.split('/pages/')

const factory = {
  async initialize() {

    return CardsController.initialize({
      view: new CardsView(),
      service: new CardsService({
        dbUrl: `${rootPath}/assets/database.json`,
        worker: cardSearchWorker
      })
    })
  }
}

export default factory