class Main {
  draw(rootContainer: HTMLElement) {
    const container = rootContainer;

    container.innerHTML =
      this.addHeroSection() + this.addFeatureSection() + this.addTeamSection();
  }

  addHeroSection = () => `
    <section class="hero">
      <div class="container hero__container">
        <div class="hero__content">
          <h2>Aнглийский <br>с RS Lang</h2>
          <div class="hero__text">Игровое приложение для&nbsp;эффективного изучения иностранных&nbsp;слов</div>
          <button class="btn btn--blue">Начать</button>
        </div>
        <div class="hero__img">
          <img src="./assets/img/hero.png" alt="" class="hero__img--img">
        </div>
      </div>
    </section>
  `;

  addFeatureSection = () => `<section class="feature">
      <div class="container feature__container">
        <h3 class="feature__title">Наши преимущества</h3>
        <div class="subtitle">Зарегистрируйтесь, чтобы получить доступ ко всем возможностям</div>
        <ul class="feature__list">
          <li class="feature__item">
            <div class="feature__img">
              <img src="./assets/img/feature1.png" class="feature__img--img" />
            </div>
            <p class="feature__content"><b>+3600</b>слов</p>
          </li>
          <li class="feature__item">
            <div class="feature__img">
              <img src="./assets/img/feature4.png" class="feature__img--img" />
            </div>
            <p class="feature__content"><b>9</b> уровней</p>
          </li>
          <li class="feature__item">
            <div class="feature__img">
              <img src="./assets/img/feature2.png" class="feature__img--img" />
            </div>
            <p class="feature__content"><b>Игры</b></p>
          </li>
          <li class="feature__item">
            <div class="feature__img">
              <img src="./assets/img/feature3.png" class="feature__img--img" />
            </div>
            <p class="feature__content"><b>$</b>Бесплатно</p>
          </li>
        </ul>
      </div>
    </section>`;

  addTeamSection = () => `
   <section class="team">
      <div class="container team__container">
        <h3>Наша команда</h3>
        <ul class="team__list">
          <li class="team__item">
            <img src="./assets/img/avatar.jpg" alt="" class="team__item--photo">
            <div class="team__item--name">Наталья
              <a href="https://github.com/sarafashka"><svg class="github-icon team__item--github-icon">
                  <use xlink:href="./assets/img/github_logo.svg#github_logo"></use>
                </svg></a>
            </div>
          </li>
          <li class="team__item"><img src="./assets/img/avatar.jpg" alt="" class="team__item--photo">
            <div class="team__item--name">Александр
              <a href="https://github.com/AdvisorGML"><svg class="github-icon team__item--github-icon">
                  <use xlink:href="./assets/img/github_logo.svg#github_logo"></use>
                </svg></a>
            </div>
          </li>
          <li class="team__item"><img src="./assets/img/avatar.jpg" alt="" class="team__item--photo">
            <div class="team__item--name">Анна
              <a href="https://github.com/azozulya"><svg class="github-icon team__item--github-icon">
                  <use xlink:href="./assets/img/github_logo.svg#github_logo"></use>
                </svg></a>
            </div>
          </li>
        </ul>
    </section>
  `;
}

export default Main;
