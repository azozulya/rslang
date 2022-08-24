const generateIndex = (maxNumber: number) => Math.floor(Math.random() * maxNumber);

export default generateIndex;

export const timer = (secs: number, div: HTMLElement) => {
  setInterval(() => {
    const el = div;
    el.innerText = String(secs - 1);
  }, 1000);
};
