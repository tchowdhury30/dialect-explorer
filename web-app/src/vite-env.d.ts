/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module 'figma:asset/*' {
  const src: string;
  export default src;
}

declare module '*/svg-*' {
  const content: unknown;
  export default content;
}
