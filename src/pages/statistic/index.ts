import Chart from 'chart.js/auto';
import 'chartjs-adapter-luxon';
import userApi from '../../components/user/user';
import { IStatistic, IUserStatistics } from '../../interfaces/interfaces';
import updateDate from '../../utils/updateDate';

class Statistic {
  private response: IUserStatistics | undefined;

  private learnedWordsAll: number;

  private newWordsAll: number;

  private learnedWords: number;

  private sprintNewWords: number;

  private sprintRightAnswers: number;

  private sprintWrongAnswer: number;

  private sprintBestSeries: number;

  private audioNewWords: number;

  private audioRightAnswers: number;

  private audioWrongAnswer: number;

  private audioBestSeries: number;

  private percentRightAnswers: number;

  private percentRightSprint: number;

  private percentRightAudio: number;

  private labelsChart: number[];

  private dataChart1: number[];

  private dataChart2: number[];

  constructor() {
    this.learnedWordsAll = 0;
    this.newWordsAll = 0;
    this.learnedWords = 0;
    this.sprintNewWords = 0;
    this.sprintRightAnswers = 0;
    this.sprintWrongAnswer = 0;
    this.sprintBestSeries = 0;
    this.audioNewWords = 0;
    this.audioRightAnswers = 0;
    this.audioWrongAnswer = 0;
    this.audioBestSeries = 0;
    this.percentRightAnswers = 0;
    this.percentRightSprint = 0;
    this.percentRightAudio = 0;
    this.labelsChart = [];
    this.dataChart1 = [];
    this.dataChart2 = [];
    this.response = { learnedWords: 0 };
  }

  async getStatistic() {
    const currentDate = updateDate();
    this.response = await userApi.getUserStatistics();

    if (this.response) {
      const options = <Record<string, unknown>> this.response.optional;
      const dayStatistic = <IStatistic>options[currentDate];
      if (dayStatistic) {
        const rightAnswers = dayStatistic.sR + dayStatistic.aR;
        const allAnswers = rightAnswers + dayStatistic.sW + dayStatistic.aW;
        this.percentRightAnswers = Math.round((rightAnswers / allAnswers) * 100) || 0;
        this.percentRightSprint = Math.round(
          (dayStatistic.sR / (dayStatistic.sR + dayStatistic.sW)) * 100 || 0,
        );
        this.percentRightAudio = Math.round(
          (dayStatistic.aR / (dayStatistic.aR + dayStatistic.aW)) * 100 || 0,
        );

        this.learnedWordsAll = dayStatistic.L;
        this.newWordsAll = dayStatistic.sN + dayStatistic.aN;
        this.learnedWords = dayStatistic.L;
        this.sprintNewWords = dayStatistic.sN;
        this.sprintRightAnswers = dayStatistic.sR;
        this.sprintWrongAnswer = dayStatistic.sW;
        this.sprintBestSeries = dayStatistic.sB;
        this.audioNewWords = dayStatistic.aN;
        this.audioRightAnswers = dayStatistic.aR;
        this.audioWrongAnswer = dayStatistic.aW;
        this.audioBestSeries = dayStatistic.aB;
      }
    }
    this.initCharts();
  }

  async draw(rootContainer: HTMLElement) {
    const isAuthenticated = await userApi.isAuthenticated();

    if (isAuthenticated) {
      await this.getStatistic();

      const container = rootContainer;
      container.innerHTML = `
    <div id="statistic">
      <div id="body_statistic">
      </div>
    </div>
    `;
      this.drawToday();
      this.drawAllTime();
    } else {
      const container = rootContainer;
      container.innerHTML = `
    <div id="statistic">
      <div id="body_statistic">
      ?????? ?????????????????? ???????????????????? ???????????????????? ???????????????? ??????????????????????.
      </div>
    </div>
    `;
    }
  }

  // eslint-disable-next-line max-lines-per-function
  drawToday() {
    const bodyStatistic = <HTMLElement>(
      document.getElementById('body_statistic')
    );
    const content = `
    <div id="body_title">??????????????</div>
    <div class="today_statistic">
      <div id="learnedWords" class="today_statistic-block">
        <div class="number">${this.learnedWordsAll}</div>
        <div class="content">???????? ??????????????</div>
      </div>
      <div id="newWords" class="today_statistic-block">
        <div class="number">${this.newWordsAll}</div>
        <div class="content">?????????? ????????</div>
      </div>
      <div id="percentAnswer" class="today_statistic-block">
        <div class="number">${this.percentRightAnswers}%</div>
        <div class="content">???????????????????? ??????????????</div>
      </div>

      <div id="sprint" class="today_statistic-block">
        <div class="title">
          <div class="title_sprint">????????????</div>
        </div>
        <div class="results">
          <div class="results_grid">
            <div>${this.sprintNewWords}</div>
            <div>?????????? ????????</div>
            <div>${this.percentRightSprint}%</div>
            <div>???????????????????? ??????????????</div>
            <div>${this.sprintBestSeries}</div>
            <div>???????????? ??????????</div>
          </div>
        </div>
      </div>

      <div id="audio" class="today_statistic-block">
        <div class="title">
          <div class="title_audio">????????????????????</div>
        </div>
        <div class="results">
          <div class="results_grid">
            <div>${this.audioNewWords}</div>
            <div>?????????? ????????</div>
            <div>${this.percentRightAudio}%</div>
            <div>???????????????????? ??????????????</div>
            <div>${this.audioBestSeries}</div>
            <div>???????????? ??????????</div>
          </div>
        </div>
      </div>
    </div>
    `;

    bodyStatistic.insertAdjacentHTML('beforeend', content);
  }

  async drawAllTime() {
    const bodyStatistic = <HTMLElement>(
      document.getElementById('body_statistic')
    );
    const content = `
      <div id="body_title">
        ???? ?????? ??????????
      </div>
        <div class="allTime_statistic">
          <div id="chart_1" class="allTime_statistic-block">
            <div class="title">?????????? ??????????</div>
            <div class="graph">
              <canvas id="chart1"></canvas>
            </div>
          </div>
          <div id="chart_2" class="allTime_statistic-block">
            <div class="title">???????????????? ????????????????</div>
            <div class="graph">
              <canvas id="chart2"></canvas>
            </div>
          </div>
        <div>
      </div>
    `;
    bodyStatistic.insertAdjacentHTML('beforeend', content);

    this.drawChart1();
    this.drawChart2();
  }

  initCharts() {
    if (this.response) {
      const options = <Record<string, unknown>> this.response.optional;
      const dataLabels = Object.keys(options);
      let sumLearnedWords = 0;
      const timeNow = new Date();
      for (let i = 0; i < dataLabels.length; i += 1) {
        this.labelsChart.push(
          Date.parse(dataLabels[i]) + timeNow.getTimezoneOffset() * 60000,
        );
        const allNewWords = (<IStatistic>options[dataLabels[i]]).sN
          + (<IStatistic>options[dataLabels[i]]).aN;
        sumLearnedWords += (<IStatistic>options[dataLabels[i]]).L;
        this.dataChart1.push(allNewWords);
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
    const chart = new Chart(
      <HTMLCanvasElement>document.getElementById('chart1'),
      {
        type: 'line',
        data: dataSet,
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                tooltipFormat: 'dd.MM.yyyy',
                unit: 'day',
                displayFormats: {
                  quarter: 'MMM YYYY',
                },
              },
            },
            y: {
              title: {
                display: true,
                text: '?????????? ??????????',
              },
            },
          },
        },
      },
    );
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
    const chart = new Chart(
      <HTMLCanvasElement>document.getElementById('chart2'),
      {
        type: 'line',
        data: dataSet,
        options: {
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            x: {
              type: 'time',
              time: {
                tooltipFormat: 'dd.MM.yyyy',
                unit: 'day',
                displayFormats: {
                  quarter: 'MMM YYYY',
                },
              },
            },
            y: {
              title: {
                display: true,
                text: '?????????????????? ??????????',
              },
            },
          },
        },
      },
    );
  }
}

export default Statistic;
