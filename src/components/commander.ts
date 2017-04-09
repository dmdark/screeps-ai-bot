import {PlayerCommand} from "./commands/player-command";
import {FlushCreeps} from "./commands/flush-creeps";
import {FlushHarvest} from "./commands/flush-harvest";

export default class Commander {
  public static instance: Commander;

  private ordersStore: {[orderId: string]: any} = {};
  private commandsByName: {[name: string]: PlayerCommand} = {};

  public static getInstance(create: boolean = false): Commander {
    if (!Commander.instance || create) {
      Commander.instance = new Commander();
    }
    return Commander.instance;
  }

  constructor() {
    this.registerPlayerCommand(new FlushCreeps());
    this.registerPlayerCommand(new FlushHarvest());
  }

  public getCommandById(id): PlayerCommand|null {
    return this.commandsByName[id] ? this.commandsByName[id] : null;
  }

  public registerPlayerCommand(command: PlayerCommand) {
    this.commandsByName[command.getId()] = command;
  }

  public hasOrder(order): boolean {
    return !!this.ordersStore[order]
  }

  public executePlayerCommands() {
    for (const flagName of Object.keys(Game.flags)) {
      const flag = Game.flags[flagName];
      const command = this.getCommandById(flagName);
      if (command) {
        const order = command.execute(flag);
        if (order) {
          this.ordersStore[order] = 1;
        }
      }
    }
  }
}