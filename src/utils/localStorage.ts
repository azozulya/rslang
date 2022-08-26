export function setLocalStorage<T>(name: string, value: T): void {
  localStorage.setItem(name, JSON.stringify(value));
}

export function getLocalStorage<T>(name: string): T {
  return JSON.parse(<string>localStorage.getItem(name));
}
