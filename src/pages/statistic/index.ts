import Chart from 'chart.js/auto';
// import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { ru } from 'date-fns/locale';
import userApi from '../../components/user/user';
import { IStatistic } from '../../interfaces/interfaces';
import updateDate from '../../utils/updateDate';

class Statistic {
  private learnedWordsAll: number;

  private learnedWords: number;

  private sprintLearnedWords: number;

  private sprintRightAnswers: number;

  private sprintIncorrectAnswer: number;

  private sprintBestSeries: number;

  private audioLearnedWords: number;

  private audioRightAnswers: number;

  private audioIncorrectAnswer: number;

  private audioBestSeries: number;

  private percentRightAnswers: number;

  private labelsChart: number[];

  private dataChart1: number[];

  private dataChart2: number[];

  constructor() {
    this.learnedWordsAll = 0;
    this.learnedWords = 0;
    this.sprintLearnedWords = 0;
    this.sprintRightAnswers = 0;
    this.sprintIncorrectAnswer = 0;
    this.sprintBestSeries = 0;
    this.audioLearnedWords = 0;
    this.audioRightAnswers = 0;
    this.audioIncorrectAnswer = 0;
    this.audioBestSeries = 0;
    this.audioIncorrectAnswer = 0;
    this.percentRightAnswers = 0;
    this.labelsChart = [];
    this.dataChart1 = [];
    this.dataChart2 = [];
  }

  async getDayStatistic() {
    const currentDate = updateDate();
    const response = await userApi.getUserStatistics();

    if (response) {
      const options = <Record<string, unknown>>response.optional;
      const dayStatistic = <IStatistic>options[currentDate];
      if (dayStatistic) {
        const rightAnswers = dayStatistic.sR + dayStatistic.aR;
        const allAnswers = rightAnswers + dayStatistic.sI + dayStatistic.aI;
        this.percentRightAnswers = Math.round((rightAnswers / allAnswers) * 100);
        this.learnedWordsAll = dayStatistic.L + dayStatistic.sL + dayStatistic.aL;
        this.learnedWords = dayStatistic.L;
        this.sprintLearnedWords = dayStatistic.sL;
        this.sprintRightAnswers = dayStatistic.sR;
        this.sprintIncorrectAnswer = dayStatistic.sI;
        this.sprintBestSeries = dayStatistic.sB;
        this.audioLearnedWords = dayStatistic.aL;
        this.audioRightAnswers = dayStatistic.aR;
        this.audioIncorrectAnswer = dayStatistic.aI;
        this.audioBestSeries = dayStatistic.aB;
      }
    }
  }

  async draw(rootContainer: HTMLElement) {
    await this.getDayStatistic();

    const container = rootContainer;
    container.innerHTML = `
    <div id="statistic">
      <div id="body_statistic">
      </div>
    </div>
    `;
    this.drawToday();
    this.drawAllTime();

    // await userApi.updateAudioStatistic(10, 10, 5, 7);
    // await userApi.updateSprintStatistic(15, 15, 4, 5);
  }

  // eslint-disable-next-line max-lines-per-function
  drawToday() {
    const bodyStatistic = <HTMLElement>document.getElementById('body_statistic');
    const content = `
      <div id="body_title">
        Сегодня
      </div>
        <div class="today_statistic">
          <div id="learnedWords" class="today_statistic-block">
            <div class="number">
              ${this.learnedWordsAll}
            </div>
            <div class="content">
            <span class="word1">слов</span><span>изучено</span>
            </div>
          </div>
          <div id="percentAnswer" class="today_statistic-block">
            <div class="percent">${this.percentRightAnswers}%</div>
            <div class="content"><span>верных</span><span>ответов</span></div>
          </div>
          <div id="sprint" class="today_statistic-block">
            <div class="title">
              <div class="imgGame_sprint"></div>
              <div class="nameGame_sprint">Спринт</div>
            </div>  
            <div class="results">
              <div class="numbers">
                ${this.sprintLearnedWords}<br>${this.sprintRightAnswers}<br>${this.sprintBestSeries}
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
            ${this.audioLearnedWords}<br>${this.audioRightAnswers}<br>${this.audioBestSeries}
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

  async drawAllTime() {
    const bodyStatistic = <HTMLElement>document.getElementById('body_statistic');
    const content = `
      <div id="body_title">
        За всё время
      </div>
        <div class="allTime_statistic">
          <div class="allTime_statistic-block">
            <div class="title">Изученные слова</div>
            <div class="graph">
              <canvas id="chart1" width="90%" height="50%"></canvas>
            </div>
          </div>
          <div class="allTime_statistic-block">
            <div class="title">Прогресс изучения</div>
            <div class="graph">
              <canvas id="chart2" width="90%" height="50%"></canvas>
            </div>
          </div>
        <div>
      </div>
    `;
    bodyStatistic.insertAdjacentHTML('beforeend', content);

    await this.initCharts();

    this.drawChart1();
    this.drawChart2();
  }

  async initCharts() {
    const response = await userApi.getUserStatistics();
    if (response) {
      const options = <Record<string, unknown>>response.optional;
      const dataLabels = Object.keys(options);
      let sumLearnedWords = 0;
      for (let i = 0; i < dataLabels.length; i += 1) {
        this.labelsChart.push(Date.parse(dataLabels[i]));
        const allLearnedWords = (<IStatistic>options[dataLabels[i]]).L
        + (<IStatistic>options[dataLabels[i]]).sL
        + (<IStatistic>options[dataLabels[i]]).aL;
        sumLearnedWords += allLearnedWords;
        this.dataChart1.push(allLearnedWords);
        this.dataChart2.push(sumLearnedWords);
      }
    }
  }

  // eslint-disable-next-line max-lines-per-function
  async drawChart1() {
    const dataSet = {
      labels: this.labelsChart,

      datasets: [
        {
          data: this.dataChart1,

          label: '',
          borderColor: 'rgb(43, 121, 172)',
          backgroundColor: 'rgba(43, 121, 172, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chart = new Chart(<HTMLCanvasElement>document.getElementById('chart1'), {
      type: 'line',
      data: dataSet,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            adapters: {
              date: {
                locale: ru,
              },
            },
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                quarter: 'MMM YYYY',
              },
            },
          },
        },
      },
    });
  }

  // eslint-disable-next-line max-lines-per-function
  drawChart2() {
    const dataSet = {
      labels: this.labelsChart,
      datasets: [
        {
          data: this.dataChart2,
          label: '',
          borderColor: 'rgb(198, 53, 46)',
          backgroundColor: 'rgba(198, 53, 46, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const chart = new Chart(<HTMLCanvasElement>document.getElementById('chart2'), {
      type: 'line',
      data: dataSet,
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            adapters: {
              date: {
                locale: ru,
              },
            },
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                quarter: 'MMM YYYY',
              },
            },
          },
        },
      },
    });
  }
}

export default Statistic;
