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

  public static getPath(from: RoomPosition, to: RoomPosition) {
    PathFinder.use(true);
    const path = PathFinder.search(from, {pos: to, range: 1});
    PathFinder.use(false);
    return path;
  }
}