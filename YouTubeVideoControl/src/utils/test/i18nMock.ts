export default function i18nMock() {
  return {
    useTranslation: () => ({
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => { }),
      },
    }),
  };
}
