import HeroImage from '../../assets/img/hero.png';
import HeroImageForTablet from '../../assets/img/hero_tablet.png';
import FeatureImg1 from '../../assets/img/feature1.png';
import FeatureImg2 from '../../assets/img/feature2.png';
import FeatureImg3 from '../../assets/img/feature3.png';
import FeatureImg4 from '../../assets/img/feature4.png';
import AnnaAvatar from '../../assets/img/anna_avatar.jpg';
import AlexAvatar from '../../assets/img/alex_avatar.jpg';
import NatashaAvatar from '../../assets/img/natasha_avatar.jpg';

import GitHubLogo from '../../assets/img/github_logo.svg';

class Main {
  draw(rootContainer: HTMLElement) {
    const container = rootContainer;

    container.innerHTML = this.addHeroSection() + this.addFeatureSection() + this.addTeamSection();
  }

  private addHeroSection = () => `
    <section class="hero">
      <div class="container hero__container">
        <div class="hero__content">
          <h2>Aнглийский с&nbsp;RS&nbsp;Lang</h2>
          <div class="hero__text">Игровое приложение для&nbsp;эффективного изучения иностранных&nbsp;слов</div>
          <button class="btn btn--blue hero__btn" data-page="dictionary">Начать</button>
        </div>
        <picture class="hero__img">
          <source srcset="${HeroImageForTablet}" media="(max-width: 1000px)">
          <img src="${HeroImage}" alt="" class="hero__img--img">
        </picture>
        </div>
        </section>
        `;

  private addFeatureSection = () => `<section class="feature">
      <div class="container feature__container">
        <h3 class="feature__title">Наши преимущества</h3>
        <div class="subtitle">Зарегистрируйтесь, чтобы получить доступ ко всем возможностям</div>
        <ul class="feature__list">
          <li class="feature__item">
            <div class="feature__img">
              <img src="${FeatureImg1}" class="feature__img--img" />
            </div>
            <p class="feature__content"><b>+3600</b>слов</p>
          </li>
          <li class="feature__item">
            <div class="feature__img">
              <img src="${FeatureImg4}" class="feature__img--img" />
            </div>
            <p class="feature__content"><b>6</b> уровней</p>
          </li>
          <li class="feature__item">
            <div class="feature__img">
              <img src="${FeatureImg2}" class="feature__img--img" />
            </div>
            <p class="feature__content"><b>Игры</b></p>
          </li>
          <li class="feature__item">
            <div class="feature__img">
              <img src="${FeatureImg3}" class="feature__img--img" />
            </div>
            <p class="feature__content"><b>$</b>Бесплатно</p>
          </li>
        </ul>
      </div>
    </section>`;

  // eslint-disable-next-line max-lines-per-function
  private addTeamSection = () => `
  <section class="team">
    <div class="container team__container">
      <h3>Наша команда</h3>
      <div class="team__grid">
        <div id="Natasha" class="team__grid--container">
          <div class="team__grid--photo">
            <img src="${NatashaAvatar}" alt="" class="team__item--photo">
          </div>
          <div class="team__grid--name">
            Наталья
            <a href="https://github.com/sarafashka"><svg class="github-icon team__item--github-icon">
            <use xlink:href="${GitHubLogo}#github_logo"></use>
            </svg></a>
          </div>
          <div class="team__grid--content">
            <div>•</div><div class="team__item--content">Электронный учебник</div>
            <div>•</div><div class="team__item--content">Список слов и карточка слова</div>
            <div>•</div><div class="team__item--content">Игра &laquo;Аудиовызов&raquo;</div>
          </div>
        </div>

        <div id="Alex" class="team__grid--container">
          <div class="team__grid--photo">
            <img src="${AlexAvatar}" alt="" class="team__item--photo">
          </div>
          <div class="team__grid--name">
            Александр
            <a href="https://github.com/AdvisorGML"><svg class="github-icon team__item--github-icon">
                <use xlink:href="${GitHubLogo}#github_logo"></use>
              </svg></a>
          </div>
          <div class="team__grid--content">
            <div>•</div><div class="team__item--content">Страница регистрации и авторизации</div>
            <div>•</div><div class="team__item--content">Страница &laquo;Статистика&raquo;</div>
            <div>•</div><div class="team__item--content">Создание API</div>
          </div>
        </div>

        <div id="Anna" class="team__grid--container">
          <div class="team__grid--photo">
            <img src="${AnnaAvatar}" alt="" class="team__item--photo">
          </div>
          <div class="team__grid--name">Анна
          <a href="https://github.com/azozulya"><svg class="github-icon team__item--github-icon">
              <use xlink:href="${GitHubLogo}#github_logo"></use>
            </svg></a>
          </div>
          <div class="team__grid--content">
            <div>•</div><div class="team__item--content">Главная страница</div>
            <div>•</div><div class="team__item--content">Игра &laquo;Спринт&raquo;</div>
            <div>•</div><div class="team__item--content">Навигация, адаптив</div>
          </div>
        </div>
      </div>
    </div>
  </section>
  `;
}

export default Main;
