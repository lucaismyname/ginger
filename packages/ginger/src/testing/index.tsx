import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { Ginger } from "../ginger";
import type { Track } from "../types";

type RenderGingerOptions = {
  tracks?: Track[];
};

export function renderGinger(ui: ReactNode, options: RenderGingerOptions = {}) {
  const tracks = options.tracks ?? [];
  return render(
    <Ginger.Provider initialTracks={tracks}>
      <Ginger.Player />
      {ui}
    </Ginger.Provider>,
  );
}
