import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { Ginger } from "../ginger";
import type { Track } from "../types";
import type { RenderGingerProviderOptions } from "./helpers";

export type RenderGingerOptions = RenderGingerProviderOptions & {
  tracks?: Track[];
};

export function renderGinger(ui: ReactNode, options: RenderGingerOptions = {}) {
  const { tracks = [], withPlayer = true, ...providerProps } = options;
  return render(
    <Ginger.Provider initialTracks={tracks} {...providerProps}>
      {withPlayer ? <Ginger.Player /> : null}
      {ui}
    </Ginger.Provider>,
  );
}
