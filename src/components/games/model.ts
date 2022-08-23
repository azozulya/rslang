class GamesModel {
  private onGetWordsHandler: (() => void) | undefined;

  bindGetWords(handler: (() => void) | undefined) {
    this.onGetWordsHandler = handler;
  }
}

export default GamesModel;
