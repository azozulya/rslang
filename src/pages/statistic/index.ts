class Statistic {
  draw(rootContainer: HTMLElement) {
    const container = rootContainer;
    container.innerHTML = '<br><br><br><br><br><br>Statistic page<br>';
    container.insertAdjacentHTML(
      'afterbegin',
      '<button data-page="games" data-menu="">Game Sprint</button><br><a href="/games" data-page="games">Game</a>',
    );
  }
}

export default Statistic;
