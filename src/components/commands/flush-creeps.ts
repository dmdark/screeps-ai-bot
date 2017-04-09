import {PlayerCommand} from "./player-command";
import {HarvestAdvisor} from "../advisor/harvest-advisor";

export class FlushCreeps extends PlayerCommand {
  public getId() {
    return "Flag1";
  }

  public execute(flag: Flag) {
    for (let name in Memory.creeps) {
      delete Memory.creeps[name];
    }
    flag.remove();

    HarvestAdvisor.getInstance().flushMemory();
  }
}