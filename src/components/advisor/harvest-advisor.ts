import RoomBrain from "../room-brain";
import {RoomHelper} from "../room-helper";
import {ColonyInfo} from "../colony-info";

export interface ISourceToHarvest {
  sourceId: string;
  source?: Source|null;
  coordinates: {
    x: number;
    y: number;
    roomName: string;
  }
}

export class HarvestAdvisor {
  public static readonly CREEP_SOURCE_MEMORY_ID = "HarvestAdvisor.sourceId";
  public static instance: HarvestAdvisor;

  public static getInstance(create: boolean = false): HarvestAdvisor {
    if (!HarvestAdvisor.instance || create) {
      HarvestAdvisor.instance = new HarvestAdvisor();
    }
    return HarvestAdvisor.instance;
  }

  private flagsBySourceId: {[sourceId: string]: Flag} = {};
  private spawn: Spawn;
  private harvestersPerSource: {[sourceId: string]: number} = {};

  public constructor() {
    this.spawn = ColonyInfo.getInstance().getSpawn();

    for (const flagName of Object.keys(Game.flags)) {
      const flag: Flag = Game.flags[flagName];
      if (flag.color === COLOR_YELLOW) {
        this.flagsBySourceId[flag.name.replace("source-", "")] = flag;
      }
    }
    this.calcHarvestersPerSource();
  }

  public scanSources() {
    for (const room of ColonyInfo.getInstance().getRooms()) {
      const roomBrain = RoomBrain.getInstanceForRoom(room);
      for (const source of roomBrain.info.getSources()) {
        if (!this.getFlagForSource(source.id)) {
          this.analyzeSource(source);
        }
      }
    }
  }

  public getBestSourceToHarvest(): ISourceToHarvest| null {
    const freeSources = _.filter<Flag>(
      _.values<Flag>(this.flagsBySourceId),
      (flag: Flag) => {
        return flag.memory.workersNow < flag.memory.workersNeeded && !flag.memory.ignored;
      }
    );

    const flags = _.sortBy<Flag, any>(freeSources, (flag: Flag) => {
      return flag.memory.priority;
    });
    if (flags.length) {
      const flag = flags.pop();
      if (flag) {
        return {
          sourceId: this.getSourceNameByFlagName(flag.name),
          coordinates: {
            x: flag.pos.x,
            y: flag.pos.y,
            roomName: flag.pos.roomName
          }
        };
      }
    }
    return null;
  }

  public getBestPlaceToStore(creep: Creep) {
    return this.spawn; // creep.pos.findClosestByPath<Structure>(FIND_MY_STRUCTURES);
  }

  public flushMemory() {
    for (const flag of _.values<Flag>(this.flagsBySourceId)) {
      flag.memory = {};
      flag.remove();
    }
  }

  public getHarvestersCountForSource(sourceId: string): number {
    return this.getFlagForSource(sourceId) ? parseInt(this.getFlagForSource(sourceId).memory.workersNow, 10) : 0;
  }

  public decHarvestersCountForSource(sourceId: string) {
    const flag = this.getFlagForSource(sourceId);
    if (!flag.memory.workersNow) {
      flag.memory.workersNow = 0;
    } else {
      flag.memory.workersNow--;
    }
  }

  public incHarvestersCountForSource(sourceId: string) {
    const flag = this.getFlagForSource(sourceId);
    if (!flag.memory.workersNow) {
      flag.memory.workersNow = 0;
    }
    flag.memory.workersNow++;
  }

  private getSourceNameByFlagName(flagName) {
    return flagName.replace("source-", "");
  }

  private getSourceByFlag(flag: Flag) {
    return Game.getObjectById<Source>(this.getSourceNameByFlagName(flag.name));
  }

  private calcHarvestersPerSource() {
    this.harvestersPerSource = {};
    for (const creepName of Object.keys(Game.creeps)) {
      const creep: Creep = Game.creeps[creepName];
      const sourceToHarvest: ISourceToHarvest = creep.memory[HarvestAdvisor.CREEP_SOURCE_MEMORY_ID];
      if (sourceToHarvest && sourceToHarvest.sourceId) {
        if (!this.harvestersPerSource[sourceToHarvest.sourceId]) {
          this.harvestersPerSource[sourceToHarvest.sourceId] = 0;
        }
        this.harvestersPerSource[sourceToHarvest.sourceId]++;
      }
    }

    console.log("calc", JSON.stringify(this.harvestersPerSource));
    for (const sourceId of Object.keys(this.harvestersPerSource)) {
      this.writeToMemory(sourceId, {
        "workersNow": this.harvestersPerSource[sourceId],
      });
    }
  }

  private analyzeSource(source: Source) {
    const range = RoomHelper.getPath(this.spawn.pos, source.pos).path.length;
    const harvestSpots = RoomHelper.getSourceHarvestSpots(source);

    let harvestersNeeded: number = Math.round((range / 25) * harvestSpots);
    if (harvestersNeeded < harvestSpots) {
      harvestersNeeded = harvestSpots;
    }

    this.createFlag(source);
    this.writeToMemory(source.id, {
      range,
      priority: -range,
      workersNeeded: harvestersNeeded,
      workersNow: 0,
      harvestSpots,
    });
  }

  private getFlagForSource(sourceId: string): Flag {
    return this.flagsBySourceId[sourceId];
  }

  private writeToMemory(sourceId: string, obj: {[key: string]: any}) {
    const flag = this.getFlagForSource(sourceId);
    if (flag) {
      for (const key of Object.keys(obj)) {
        flag.memory[key] = obj[key];
      }
    }
  }

  private createFlag(source: Source): Flag {
    const flagName = source.room.createFlag(source, this.getSourceFlagName(source), COLOR_YELLOW);
    this.flagsBySourceId[source.id] = Game.flags[flagName];
    return Game.flags[flagName];
  }

  private getSourceFlagName(source: Source) {
    return `source-${source.id}`;
  }
}
