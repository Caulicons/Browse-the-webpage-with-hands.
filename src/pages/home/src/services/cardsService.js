export default class CardService {
  #database = []
  #dbUrl = ''
  #cardWorker
  constructor({ dbUrl, worker }) {
    this.#dbUrl = dbUrl,
      this.#cardWorker = worker
  }
  async loadCards() {
    const response = await fetch(this.#dbUrl)
    this.#database = await response.json()
  }

  filterTitles(keyword) {
    const titles = this.#database
      .filter(({ title }) => !!keyword ? title.toLowerCase().includes(keyword.toLowerCase()) : true)

    if (keyword) {
      this.#cardWorker.postMessage({ maxItems: 1e4 })
    }

    const cards = titles.map(item => {
      return {
        background: item.imageUrl,
        display_background: "//external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fhdqwalls.com%2Fdownload%2Finterstellar-gargantua-u4-1920x1080.jpg&f=1&nofb=1",
        title: item.title,
        description: item.description,
        show_id: item.show_id,
        duration: item.duration
      }
    })
    return cards
  }
}