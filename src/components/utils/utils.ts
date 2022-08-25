const generateIndex = (maxNumber: number) =>
  Math.floor(Math.random() * maxNumber);

export default generateIndex;

export const timer = (secs: number, div: HTMLElement) => {
  let secsTotal = secs;
  const timerId = setInterval(() => {
    // eslint-disable-next-line no-param-reassign
    div.innerText = String(secsTotal);

    secsTotal -= 1;

    if (secs === 0) clearInterval(timerId);
  }, 1000);
};
