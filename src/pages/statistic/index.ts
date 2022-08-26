class Statistic {
  draw(rootContainer: HTMLElement) {
    const container = rootContainer;
    container.innerHTML = '<br><br><br><br><br><br>Statistic page<br>';
    container.insertAdjacentHTML(
      'afterbegin',
      '<button data-page="sprint">Game Sprint</button><br><a href="#" data-page="audio-call">AudioCall</a>',
    );
  }
}

export default Statistic;
