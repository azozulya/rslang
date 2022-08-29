/* eslint-disable max-lines-per-function */
class Statistic {
  draw(rootContainer: HTMLElement) {
    const container = rootContainer;
    container.innerHTML = `
    <div id="statistic">
      <div class="title">
        <h1>Статистика</h1>
      </div>
      <div id="body_statistic">
      </div>
    </div>
    `;
    this.drawToday();
    this.drawAllTime();
  }

  drawToday() {
    const bodyStatistic = <HTMLElement>document.getElementById('body_statistic');
    const learnedWords = 0;
    const percent = 0;
    const sprintLearnedWords = 0;
    const sprintPercent = 0;
    const sprintBest = 0;

    const content = `
      <div id="today">
        <h1>Сегодня</div>
        <div class="today_statistic">
          <div id="learnedWords" class="today_statistic-block">
            <div class="number">
              ${learnedWords}
            </div>
            <div class="">
            <h3>слов</h3><br><span>изучено</span>
            </div>
          </div>
          <div class="today_statistic-block">
            <div>Правильных ответов</div>
            <div class="percent">${percent}%</div>
          </div>
          <div id="sprint" class="today_statistic-block">
            <div>
              <div class="imgGame_sprint"></div>
              <div class="nameGame_sprint">Спринт</div>
            </div>  
            <div>
              ${sprintLearnedWords} изученных слов<br>
              ${sprintPercent} правильных ответов<br>
              ${sprintBest} лучшая серия
            </div>
          </div>
          <div id="audio" class="today_statistic-block">
            <div class="nameGame_audio">Аудиовызов</div>        
        <div>
      </div>
    `;
    bodyStatistic.insertAdjacentHTML(
      'beforeend',
      content,
    );
  }

  drawAllTime() {
    const bodyStatistic = <HTMLElement>document.getElementById('body_statistic');
    const learnedWords = 0;
    const content = `
      <div id="today">
        <h1>За все время</div>
        <div class="today_statistic">
          <div id="learnedWords" class="today_statistic-block">
            <div>
              ${learnedWords}
            </div>
            <div>
            <span>слов</span><br><span>изучено</span>
            </div>
          </div>
          <div class="today_statistic-block">%</div>
        <div>
      </div>
    `;
    bodyStatistic.insertAdjacentHTML(
      'beforeend',
      content,
    );
  }
}

export default Statistic;
