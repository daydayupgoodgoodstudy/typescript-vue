/// <reference types="vite/client" />
import "axios";
import "postcss-preset-env";
import "postcss-px-to-viewport";

declare module "postcss-preset-env";
declare module "postcss-px-to-viewport";
declare module "axios" {
  interface AxiosInstance {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config: AxiosRequestConfig): Promise<any>;
  }
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
