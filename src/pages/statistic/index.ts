import Chart from 'chart.js/auto';
/* eslint-disable max-lines-per-function */
class Statistic {
  draw(rootContainer: HTMLElement) {
    const container = rootContainer;
    container.innerHTML = `
    <div id="statistic">
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
    const audioLearnedWords = 0;
    const audioPercent = 0;
    const audioBest = 0;

    const content = `
      <div id="today">
        <h1>Сегодня</div>
        <div class="today_statistic">
          <div id="learnedWords" class="today_statistic-block">
            <div class="number">
              ${learnedWords}
            </div>
            <div class="content">
            <span class="word1">слов</span><span>изучено</span>
            </div>
          </div>
          <div id="percentAnswer" class="today_statistic-block">
            <div class="percent">${percent}%</div>
            <div class="content"><span>верных</span><span>ответов</span></div>
          </div>
          <div id="sprint" class="today_statistic-block">
            <div class="title">
              <div class="imgGame_sprint"></div>
              <div class="nameGame_sprint">Спринт</div>
            </div>  
            <div class="results">
              <div class="numbers">
                ${sprintLearnedWords}<br>${sprintPercent}<br>${sprintBest}
              </div>
              <div class=text>
                изученных слов<br>
                правильных ответов<br>
                лучшая серия
                </div>
            </div>
          </div>

          <div id="audio" class="today_statistic-block">
          <div class="title">
            <div class="imgGame_audio"></div>
            <div class="nameGame_sprint">Аудиовызов</div>
          </div>  
          <div class="results">
            <div class="numbers">
            ${audioLearnedWords}<br>${audioPercent}<br>${audioBest}
            </div>
            <div class="text">
              изученных слов<br>
              правильных ответов<br>
              лучшая серия
            </div>
          </div>
        </div>
    
      </div>
    `;
    bodyStatistic.insertAdjacentHTML('beforeend', content);
  }

  drawAllTime() {
    const bodyStatistic = <HTMLElement>document.getElementById('body_statistic');
    const content = `
      <div id="today">
        <h1>За все время</div>
        <div class="allTime_statistic">
          <div class="allTime_statistic-block">
            <div class="title">Изученные слова</div>
            <canvas id="chart1" width="100%" height="80%"></canvas>
          </div>
          <div class="allTime_statistic-block">
            <div class="title">Прогресс изучения</div>
            <canvas id="chart2" width="100%" height="80%"></canvas>
          </div>
        <div>
      </div>
    `;
    bodyStatistic.insertAdjacentHTML('beforeend', content);

    this.drawChart1();
    this.drawChart2();
  }

  drawChart1() {
    const dataSet = {
      labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
      datasets: [
        {
          data: [86, 114, 136, 106, 107, 11, 133, 221, 783, 478],
          label: '',
          borderColor: 'rgb(43, 121, 172)',
          backgroundColor: 'rgba(43, 121, 172, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const optionsSet = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    const chart = new Chart(<HTMLCanvasElement>document.getElementById('chart1'), {
      type: 'line',
      data: dataSet,
      options: optionsSet,
    });
  }

  drawChart2() {
    const dataSet = {
      labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
      datasets: [
        {
          data: [86, 14, 136, 106, 17, 119, 133, 331, 483, 78],
          label: '',
          borderColor: 'rgb(198, 53, 46)',
          backgroundColor: 'rgba(198, 53, 46, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    const optionsSet = {
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    const chart = new Chart(<HTMLCanvasElement>document.getElementById('chart2'), {
      type: 'line',
      data: dataSet,
      options: optionsSet,
    });
  }
}

export default Statistic;
