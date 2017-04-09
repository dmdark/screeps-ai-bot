import Ticker = Blackthorn.Ticker;
import Status = Blackthorn.Status;
import {Blackthorn} from "../../../lib/blackthorn";
import RoomBrain from "../../../components/room-brain";

export class TakeResource extends Blackthorn.Action {
  public static readonly GET_SOURCE_FROM_STORAGE = "getSourceFromStorage";

  open(ticker: Ticker): void {
    const creep = this.getCreep(ticker);
    const brain = RoomBrain.getInstanceForRoom(creep.room);
    const storages = brain.info.getStorages();
    if (storages) {
      creep.memory[TakeResource.GET_SOURCE_FROM_STORAGE] = storages[0].id;
      creep.say("Go take resource");
    }
  }

  tick(ticker: Ticker): Status {
    const creep = this.getCreep(ticker);

    if (_.sum(creep.carry) === creep.carryCapacity) {
      return Status.SUCCESS;
    }
    const storage = this.getStorage(creep);
    if (!storage) {
      return Status.FAILURE;
    }

    const withdrawResult = creep.withdraw(storage, RESOURCE_ENERGY, creep.carryCapacity);
    if (withdrawResult === ERR_NOT_ENOUGH_RESOURCES) {
      return Status.FAILURE;
    }
    if (withdrawResult === ERR_NOT_IN_RANGE) {
      creep.moveTo(storage);
    }
    return Status.RUNNING;
  }

  exit(ticker: Ticker): void {
  }

  close(ticker: Ticker): void {
    const creep = this.getCreep(ticker);
    delete (creep.memory[TakeResource.GET_SOURCE_FROM_STORAGE]);
  }

  private getCreep(ticker: Ticker): Creep {
    return <Creep>ticker.subject;
  }

  private getStorage(creep: Creep): Structure|null {
    return Game.getObjectById<Structure>(creep.memory[TakeResource.GET_SOURCE_FROM_STORAGE]);
  }
}
