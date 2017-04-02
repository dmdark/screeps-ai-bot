import {RoomInfo} from "../room-info";
import {RoomHelper} from "../room-helper";
import RoomDrawer from "../room-drawer";
import SourceNeedsHarvesting from "../ideas/SourceNeedsHarvesting";

export class HarvestAdvisor {
  public constructor(private room: Room,
                     private roomInfo: RoomInfo,
                     private roomDrawer: RoomDrawer) {
  }

  public generateIdeas() {
    const ideas = [];
    const spawn = this.roomInfo.getSpawn();
    for (const source of this.roomInfo.getSources()) {
      const range = RoomHelper.getDistanceBetween(spawn.pos, source.pos);
      const harvestSpots = RoomHelper.getSourceHarvestSpots(source);

      const harvestersNeeded: number = Math.round((range / 7) * harvestSpots);
      const usedNow = this.roomInfo.getHarvestersCountForSource(source.id);

      this.roomDrawer.drawHarvestersInfoInSource(source, harvestersNeeded, usedNow);

      if (usedNow < harvestersNeeded) {
        for (let i = 0; i < harvestersNeeded - usedNow; i++) {
          ideas.push(
            new SourceNeedsHarvesting({
              sourceId: source.id,
              priority: -range
            })
          );
        }
      }
    }


    return _.sortBy<any, any>(ideas, (task: any) => {
      return task.priority;
    });
  }


}