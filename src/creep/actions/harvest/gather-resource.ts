import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../../lib/blackthorn";
import {HarvestAdvisor, ISourceToHarvest} from "../../../components/advisor/harvest-advisor";

export class GatherResource extends Blackthorn.Action {

  open(ticker: Ticker): void {
    const creep = this.getCreep(ticker);
    const placeToHarvest = HarvestAdvisor.getInstance().getBestSourceToHarvest();
    if (placeToHarvest) {
      HarvestAdvisor.getInstance().incHarvestersCountForSource(placeToHarvest.sourceId);
      creep.memory[HarvestAdvisor.CREEP_SOURCE_MEMORY_ID] = placeToHarvest;
      creep.say("GatherResource");
    }
  }

  tick(ticker: Ticker): Status {
    const creep = this.getCreep(ticker);

    if (_.sum(creep.carry) === creep.carryCapacity) {
      return Status.SUCCESS;
    }
    const source = this.getSourceToHarvest(creep);
    if (!source) {
      return Status.FAILURE;
    }

    const sourcePosition = new RoomPosition(source.coordinates.x, source.coordinates.y, source.coordinates.roomName);
    if (!creep.pos.isNearTo(sourcePosition)) {
      creep.moveTo(sourcePosition, {reusePath: 50});
      return Status.RUNNING;
    }

    if (source.source) {
      if (creep.harvest(source.source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source.source, {reusePath: 50});
      }
    }
    return Status.RUNNING;
  }

  exit(ticker: Ticker): void {
  }

  close(ticker: Ticker): void {
    const creep = this.getCreep(ticker);

    const placeToHarvest: ISourceToHarvest = creep.memory[HarvestAdvisor.CREEP_SOURCE_MEMORY_ID];
    if (placeToHarvest && placeToHarvest.sourceId) {
      HarvestAdvisor.getInstance().decHarvestersCountForSource(
        placeToHarvest.sourceId
      );
    }

    delete (creep.memory[HarvestAdvisor.CREEP_SOURCE_MEMORY_ID]);
  }

  private getCreep(ticker: Ticker): Creep {
    return <Creep>ticker.subject;
  }

  private getSourceToHarvest(creep: Creep) {
    const placeToHarvest: ISourceToHarvest = creep.memory[HarvestAdvisor.CREEP_SOURCE_MEMORY_ID];
    if (!placeToHarvest) {
      return null;
    }
    placeToHarvest["source"] = Game.getObjectById<Source>(placeToHarvest.sourceId);
    return placeToHarvest;
  }
}
