import { ICreateElement } from '../types/interfaces';

export default function create(el: ICreateElement): HTMLElement {
  let element: HTMLElement | null = null;
  try {
    element = document.createElement(el.tagname);
  } catch (error) {
    throw new Error('Incorrect tag name');
  }
  if (el.class) element.classList.add(el.class);
  if (el.id) element.setAttribute('id', el.id);
  el.parent?.appendChild(element);
  if (el.child) element.appendChild(el.child);
  if (el.text) element.innerHTML = el.text;

  return element;
}
