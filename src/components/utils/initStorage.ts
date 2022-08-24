export default function initStorage() {
  const getValue = <string | null>localStorage.getItem('RSLang_Auth');
  if (getValue == null) {
    localStorage.setItem(
      'RSLang_Auth',
      JSON.stringify({
        message: '',
        id: '',
        token: '',
        refreshToken: '',
        name: '',
      })
    );
  }
}
