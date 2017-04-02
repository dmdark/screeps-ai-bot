import {RoomInfo} from "../room-info";
import RoomDrawer from "../room-drawer";
import ControllerNeedsUpgrade from "../ideas/ControllerNeedsUpgrade";

export class UpgradeAdvisor {
  public constructor(private room: Room,
                     private roomInfo: RoomInfo,
                     private roomDrawer: RoomDrawer) {
  }

  public generateIdeas() {
    const ideas = [];

    const harvestersCount = this.roomInfo.getCountCreepsWithRole("harvester");
    const upgradersCount = this.roomInfo.getCountCreepsWithRole("upgrader");

    const needUpgraders = Math.floor(harvestersCount / 10);

    if (needUpgraders > upgradersCount && this.room.controller) {
      ideas.push(
        new ControllerNeedsUpgrade({
          roomId: this.room.controller.id,
          priority: 10
        })
      );
    }
    return ideas;
  }
}