import type { TargetMachine } from "makersync-common/types";

export interface PageState {
  step: 1 | 2 | 3 | 4;
  file: File | null;
  target: TargetMachine | null;
}