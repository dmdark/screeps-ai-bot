import {HarvestAdvisor} from "./advisor/harvest-advisor";
import {RoomInfo} from "./room-info";
import RoomDrawer from "./room-drawer";
import {UpgradeAdvisor} from "./advisor/upgrade-advisor";
import Harvester from "./creeps/roles/harvester";
import SourceNeedsHarvesting from "./ideas/SourceNeedsHarvesting";
import ControllerNeedsUpgrade from "./ideas/ControllerNeedsUpgrade";
import Upgrader from "./creeps/roles/upgrader";

export default class RoomBrain {
  private harvestAdvisor: HarvestAdvisor;
  private upgradeAdvisor: UpgradeAdvisor;
  private info: RoomInfo;

  constructor(private room: Room) {
    if (!room) {
      console.error("No room no RoomBrain");
      return;
    }
    this.info = new RoomInfo(room);
    const roomDrawer = new RoomDrawer(room);

    this.harvestAdvisor = new HarvestAdvisor(room, this.info, roomDrawer);
    this.upgradeAdvisor = new UpgradeAdvisor(room, this.info, roomDrawer);
  }


  public generateIdeas() {
    this.executeHarvestIdeas();
    this.executeUpgraderIdeas();
  }

  private executeHarvestIdeas() {
    const ideas = this.harvestAdvisor.generateIdeas();
    if (ideas.length === 0) {
      return;
    }

    const idea = ideas[0];
    console.log("Harvest IDEA: ", JSON.stringify(idea));

    if (idea instanceof SourceNeedsHarvesting) {
      const spawn = this.info.getSpawn();
      const bodyParts = [WORK, CARRY, MOVE, MOVE];
      const name = `harvester-${Game.time}`;
      if (spawn && spawn.canCreateCreep(bodyParts, name) === OK) {
        spawn.createCreep(bodyParts, name, {
          "role": Harvester.ROLE,
          "bindToSourceId": idea.info.sourceId
        });
      }
    }
  }

  private executeUpgraderIdeas() {
    const ideas = this.upgradeAdvisor.generateIdeas();
    if (ideas.length === 0) {
      return;
    }

    const idea = ideas[0];
    console.log("Upgrader IDEA: ", JSON.stringify(idea));

    if (idea instanceof ControllerNeedsUpgrade) {
      const spawn = this.info.getSpawn();
      const bodyParts = [WORK, CARRY, CARRY, MOVE, MOVE];
      const name = `upgrader-${Game.time}`;
      if (spawn && spawn.canCreateCreep(bodyParts, name) === OK) {
        spawn.createCreep(bodyParts, name, {
          "role": Upgrader.ROLE
        });
      }
    }
  }

  public commandCreeps() {
    _.each(this.info.getCreeps(), (creep: Creep) => {
      if (creep.memory.role === Harvester.ROLE) {
        new Harvester(creep);
      }
      if (creep.memory.role === Upgrader.ROLE) {
        new Upgrader(creep);
      }
    });
  }

  private prepareIdeas() {

  }
}