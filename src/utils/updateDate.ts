export default function updateDate(): string {
  const dateNow = new Date();
  return `${dateNow.getFullYear()}-${dateNow.getMonth()}-${dateNow.getDate()}`;
}
