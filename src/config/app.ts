interface AppConfig {
  name: string;
  github: {
    title: string;
    url: string;
  };
  author: {
    name: string;
    url: string;
  };
}

export const appConfig: AppConfig = {
  name: 'Inventory',
  github: {
    title: 'Inventory',
    url: 'https://github.com/kamlesh502/',
  },
  author: {
    name: 'kamlesh',
    url: 'https://github.com/kamlesh502/',
  },
};
