export interface NavigationItem {
  name: string;
  href: string;
}

export const navigation: Array<NavigationItem> = [
  { name: 'Games', href: '/' },
  { name: 'About', href: '/about' },
];
