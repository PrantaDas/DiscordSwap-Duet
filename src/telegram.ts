import { TelegramClient } from "telegram";
import { NewMessage, NewMessageEvent } from 'telegram/events';
import { StringSession } from "telegram/sessions";
import nodeReadline, { Interface } from 'node:readline';
import { stdin, stdout } from "node:process";
import { TelegramArgs } from "./types";

class Telegram {
  private readline: Interface;
  private apiId: number;
  private apiHash: string;
  private session: StringSession;
  public client: TelegramClient;
  constructor(args: TelegramArgs) {
    this.apiId = args.apiId;
    this.apiHash = args.apiHash;
    this.session = new StringSession(args.session); // fill this later with the value from session.save()
    this.readline = nodeReadline.createInterface({
      input: stdin,
      output: stdout
    });

    this.client = new TelegramClient(this.session, this.apiId, this.apiHash, {
      connectionRetries: 5,
    });
  }

  async input(question?: string): Promise<string> {
    return new Promise<string>((resolve) => this.readline.question(question || "", (answer: string) => resolve(answer)));
  }

  async start() {
    await this.client.start({
      phoneNumber: async () => await this.input("Please enter your number: "),
      password: async () => await this.input("Please enter your password: "),
      phoneCode: async () =>
        await this.input("Please enter the code you received: "),
      onError: (err) => console.log(err),
    });
  }

  async listen(callback: (event: NewMessageEvent) => void): Promise<void> {
    await this.start();
    this.client.addEventHandler(callback, new NewMessage({}));
  }
}

export default Telegram;
