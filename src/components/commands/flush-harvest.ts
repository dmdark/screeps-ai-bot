import {PlayerCommand} from "./player-command";
import {HarvestAdvisor} from "../advisor/harvest-advisor";

export class FlushHarvest extends PlayerCommand {
  public getId() {
    return "FlushHarvest";
  }

  public execute(flag: Flag) {
    flag.remove();
    HarvestAdvisor.getInstance().flushMemory();
  }
}