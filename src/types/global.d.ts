// fe/src/types/global.d.ts

import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Fix for React types
declare module 'react' {
  interface Attributes {
    children?: ReactNode;
  }
}