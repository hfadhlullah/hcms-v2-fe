/**
 * Navigation Types
 */

import type { ReactNode } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  icon: ReactNode;
  items: MenuItem[];
}
