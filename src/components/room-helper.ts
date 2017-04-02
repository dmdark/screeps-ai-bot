import {CreepRole} from "./creeps/role";

export class RoomHelper {
  public static getSourceHarvestSpots(source: Source) {
    const terrains = <LookAtResultWithPos[]>source.room.lookForAtArea(
      LOOK_TERRAIN,
      source.pos.y - 1, source.pos.x - 1,
      source.pos.y + 1, source.pos.x + 1,
      true
    );

    let workSpots = 0;
    for (const terrain of terrains) {
      if (terrain.terrain === "plain") {
        workSpots++;
      }
    }
    return workSpots;
  }

  public static getDistanceBetween(from: RoomPosition, to: RoomPosition) {
    return from.findPathTo(to, {ignoreCreeps: true, ignoreRoads: true}).length;
  }
}