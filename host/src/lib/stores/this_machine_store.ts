import type { TargetMachine } from "makersync-common/types";
import { PersistentStore } from "./persistant_store";

export const this_machine_store = new PersistentStore<TargetMachine>("this_machine", "3DPrinter");