import {
  SessionInternal,
  AggResult,
  BaseObject,
  BucketQueryParamsAPI,
  BucketQueryReturn,
  Session,
  APIUser,
  LoggerEventName,
  LoggerEventType,
} from "../models";
import {
  TeamSDK,
  ProfileSDK,
  UserSDK,
  SessionStrokeDataStatSDK,
  SessionSDK,
  SessionGeneralStatSDK,
  SessionAdditional1StatSDK,
  SessionAdditional2StatSDK,
  EventLoggerSDK,
} from "../sdks";
import {
  sessionSDK,
  sessionGeneralStatSDK,
  sessionAdditional1StatSDK,
  sessionAdditional2StatSDK,
  sessionStrokeDataStatSDK,
  eventLoggerSDK,
} from "./rowstream-utils";
import { PM5Stat, StatType } from "./pm5-sdk";

const statTypeToSDK = {
  [StatType.General]: sessionGeneralStatSDK,
  [StatType.Additional1]: sessionAdditional1StatSDK,
  [StatType.Additional2]: sessionAdditional2StatSDK,
  [StatType.StrokeData]: sessionStrokeDataStatSDK,
};

//  Define Pending Queues Async Key
const PENDING_QUEUES_ASYNC_KEY = "pending-queues";

//  TODO:  In the future consider wrapping the SDKs to store other types of requests in LocalStorage when the server is not accessible.

export interface PendingQueues {
  sessionCloseQueue: { sessionId: string; session: Session }[];
  statCreateQueue: {
    sessionId: string;
    stats: PM5Stat[];
    statType: StatType;
  }[];
}

/**
 * Wrapper to ensure sessions and stats are synchronized with the server.
 */
export class SessionStorage {
  //  Create the Queues
  private pendingQueues: PendingQueues = {
    sessionCloseQueue: [],
    statCreateQueue: [],
  };

  constructor(
    private token: string,
    private user: APIUser,
    private onStorageChange: (docCount: number) => void,
    private storage: any
  ) {}

  public async init() {
    //  Hydrate the Queues from AsyncStorage
    const pendingQueuesStringified = await this.storage.getItem(
      PENDING_QUEUES_ASYNC_KEY
    );
    const pendingQueues = JSON.parse(pendingQueuesStringified) || {
      sessionCloseQueue: [],
      statCreateQueue: [],
    };
    console.log("PENDING QUEUES: " + pendingQueuesStringified);
    this.pendingQueues = pendingQueues;
  }

  public getDocCount() {
    const docCount =
      this.pendingQueues.sessionCloseQueue.length +
      this.pendingQueues.statCreateQueue.length;
    console.log("Session Storage :: Doc Count :: " + docCount);
    return docCount;
  }

  private async writeQueues() {
    console.log("Session Storage :: Writing Queues");
    await this.storage.setItem(
      PENDING_QUEUES_ASYNC_KEY,
      JSON.stringify(this.pendingQueues)
    );
  }

  /**
   *  Synchronize the In-Memory queues with the RowStream Server (and clear the queues)
   *  Currently, we only have two command queues.  Create State, and Close Session.
   */
  public async synchronize() {
    //  TODO:  Audit this code and be confident that we're at low risk of session data loss.

    //  Copy the Queues
    const sessionCloseQueue = [...this.pendingQueues.sessionCloseQueue];
    const statCreateQueue = [...this.pendingQueues.statCreateQueue];

    //  Clear the Queues
    //  TODO-NEXT:  DO NOT clear these queues before attempting to synchronize.  I don't believe all are being repopulated because the syncing gets stuck waiting for a reply.
    //  FOR NOW:  Just clear the data before synchronization.  If the app crashes during the sync, then we'll lose the data.
    this.pendingQueues = { sessionCloseQueue: [], statCreateQueue: [] };
    await this.writeQueues();

    //  Synchronize the Session Closures
    for (const session of sessionCloseQueue) {
      await this.closeSession(session.session, session.sessionId);
    }

    //  Synchronize the Stats
    for (const stat of statCreateQueue) {
      await this.uploadStats(stat.sessionId, stat.stats, stat.statType);
    }

    //  Update the Doc Count
    this.onStorageChange(this.getDocCount());
  }

  public async closeSession(session: Session, id: string) {
    try {
      const sessionInternal = await sessionSDK.update(id, session, this.token);

      //  Log Close Session Success Event
      await eventLoggerSDK.create(
        {
          name: LoggerEventName.CloseSession,
          description: `Successfully closed session:  '${id}'.`,
          user: this.user.username,
          type: LoggerEventType.Success,
        },
        this.token
      );
    } catch (err) {
      //  Add the Session to the Create Queue
      this.pendingQueues.sessionCloseQueue.push({ session, sessionId: id });

      //  Write Queues
      await this.writeQueues();

      //  Log Close Session Error Event
      await eventLoggerSDK.create(
        {
          name: LoggerEventName.CloseSession,
          description: `Error while closing session:  '${id}'.  Added to pending queue.`,
          user: this.user.username,
          type: LoggerEventType.Error,
        },
        this.token
      );
    }
  }

  public async uploadStats(
    sessionId: string,
    stats: PM5Stat[],
    statType: StatType
  ) {
    try {
      await (statTypeToSDK[statType] as any).createBulk(
        sessionId,
        stats,
        this.token
      );

      //  Log Upload Stat Success Event
      await eventLoggerSDK.create(
        {
          name: LoggerEventName.UploadStat,
          description: `Successfully uploaded ${stats.length} '${statType}' stats.`,
          user: this.user.username,
          type: LoggerEventType.Success,
        },
        this.token
      );
    } catch (err) {
      //  Add the Session to the Create Queue
      this.pendingQueues.statCreateQueue.push({ sessionId, stats, statType });

      //  Write Queues
      await this.writeQueues();

      //  Log Upload Stat Error Event
      await eventLoggerSDK.create(
        {
          name: LoggerEventName.UploadStat,
          description: `Failed to upload ${stats.length} '${statType}' stats.  Added to pending queue.`,
          user: this.user.username,
          type: LoggerEventType.Error,
        },
        this.token
      );
    }
  }
}
