declare module 'animejs' {
  export interface AnimeParams {
    targets?: any;
    duration?: number;
    delay?: number | ((el: HTMLElement, i: number, l: number) => number);
    easing?: string;
    opacity?: number | number[] | { from: number; to: number };
    translateX?: number | number[] | string | string[] | { from: number | string; to: number | string };
    translateY?: number | number[] | string | string[] | { from: number | string; to: number | string };
    translateZ?: number | number[] | string | string[] | { from: number | string; to: number | string };
    scale?: number | number[] | { from: number; to: number };
    scaleX?: number | number[] | { from: number; to: number };
    scaleY?: number | number[] | { from: number; to: number };
    rotate?: number | number[] | string | string[] | { from: number | string; to: number | string };
    rotateX?: number | number[] | string | string[] | { from: number | string; to: number | string };
    rotateY?: number | number[] | string | string[] | { from: number | string; to: number | string };
    rotateZ?: number | number[] | string | string[] | { from: number | string; to: number | string };
    skewX?: number | number[] | string | string[] | { from: number | string; to: number | string };
    skewY?: number | number[] | string | string[] | { from: number | string; to: number | string };
    x?: number | number[] | string | string[] | { from: number | string; to: number | string };
    y?: number | number[] | string | string[] | { from: number | string; to: number | string };
    z?: number | number[] | string | string[] | { from: number | string; to: number | string };
    width?: number | number[] | string | string[] | { from: number | string; to: number | string };
    height?: number | number[] | string | string[] | { from: number | string; to: number | string };
    backgroundColor?: string | string[] | { from: string; to: string };
    color?: string | string[] | { from: string; to: string };
    borderRadius?: number | number[] | string | string[] | { from: number | string; to: number | string };
    strokeDashoffset?: number | number[] | string | string[] | { from: number | string; to: number | string };
    [prop: string]: any;
  }

  export interface AnimeInstance {
    play(): void;
    pause(): void;
    restart(): void;
    reverse(): void;
    seek(time: number): void;
    finished: Promise<void>;
  }

  export function animate(targets: string | HTMLElement | HTMLElement[] | NodeList | null, params: AnimeParams): AnimeInstance;
  export function stagger(value: number, options?: { from?: string | number; start?: number; direction?: string }): (el: HTMLElement, i: number, l: number) => number;
  export function createTimeline(options?: { defaults?: AnimeParams }): {
    add(params: AnimeParams, offset?: number | string): any;
    play(): void;
    pause(): void;
  };
}
