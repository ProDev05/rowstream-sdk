"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const rowstream_utils_1 = require("./rowstream-utils");
const pm5_sdk_1 = require("./pm5-sdk");
const statTypeToSDK = {
    [pm5_sdk_1.StatType.General]: rowstream_utils_1.sessionGeneralStatSDK,
    [pm5_sdk_1.StatType.Additional1]: rowstream_utils_1.sessionAdditional1StatSDK,
    [pm5_sdk_1.StatType.Additional2]: rowstream_utils_1.sessionAdditional2StatSDK,
    [pm5_sdk_1.StatType.StrokeData]: rowstream_utils_1.sessionStrokeDataStatSDK,
};
//  Define Pending Queues Async Key
const PENDING_QUEUES_ASYNC_KEY = "pending-queues";
/**
 * Wrapper to ensure sessions and stats are synchronized with the server.
 */
class SessionStorage {
    constructor(token, user, onStorageChange, storage) {
        this.token = token;
        this.user = user;
        this.onStorageChange = onStorageChange;
        this.storage = storage;
        //  Create the Queues
        this.pendingQueues = {
            sessionCloseQueue: [],
            statCreateQueue: [],
        };
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            //  Hydrate the Queues from AsyncStorage
            const pendingQueuesStringified = yield this.storage.getItem(PENDING_QUEUES_ASYNC_KEY);
            const pendingQueues = JSON.parse(pendingQueuesStringified) || {
                sessionCloseQueue: [],
                statCreateQueue: [],
            };
            console.log("PENDING QUEUES: " + pendingQueuesStringified);
            this.pendingQueues = pendingQueues;
        });
    }
    getDocCount() {
        const docCount = this.pendingQueues.sessionCloseQueue.length +
            this.pendingQueues.statCreateQueue.length;
        console.log("Session Storage :: Doc Count :: " + docCount);
        return docCount;
    }
    writeQueues() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Session Storage :: Writing Queues");
            yield this.storage.setItem(PENDING_QUEUES_ASYNC_KEY, JSON.stringify(this.pendingQueues));
        });
    }
    /**
     *  Synchronize the In-Memory queues with the RowStream Server (and clear the queues)
     *  Currently, we only have two command queues.  Create State, and Close Session.
     */
    synchronize() {
        return __awaiter(this, void 0, void 0, function* () {
            //  TODO:  Audit this code and be confident that we're at low risk of session data loss.
            //  Copy the Queues
            const sessionCloseQueue = [...this.pendingQueues.sessionCloseQueue];
            const statCreateQueue = [...this.pendingQueues.statCreateQueue];
            //  Clear the Queues
            //  TODO-NEXT:  DO NOT clear these queues before attempting to synchronize.  I don't believe all are being repopulated because the syncing gets stuck waiting for a reply.
            //  FOR NOW:  Just clear the data before synchronization.  If the app crashes during the sync, then we'll lose the data.
            this.pendingQueues = { sessionCloseQueue: [], statCreateQueue: [] };
            yield this.writeQueues();
            //  Synchronize the Session Closures
            for (const session of sessionCloseQueue) {
                yield this.closeSession(session.session, session.sessionId);
            }
            //  Synchronize the Stats
            for (const stat of statCreateQueue) {
                yield this.uploadStats(stat.sessionId, stat.stats, stat.statType);
            }
            //  Update the Doc Count
            this.onStorageChange(this.getDocCount());
        });
    }
    closeSession(session, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionInternal = yield rowstream_utils_1.sessionSDK.update(id, session, this.token);
                //  Log Close Session Success Event
                yield rowstream_utils_1.eventLoggerSDK.create({
                    name: models_1.LoggerEventName.CloseSession,
                    description: `Successfully closed session:  '${id}'.`,
                    user: this.user.username,
                    type: models_1.LoggerEventType.Success,
                }, this.token);
            }
            catch (err) {
                //  Add the Session to the Create Queue
                this.pendingQueues.sessionCloseQueue.push({ session, sessionId: id });
                //  Write Queues
                yield this.writeQueues();
                //  Log Close Session Error Event
                yield rowstream_utils_1.eventLoggerSDK.create({
                    name: models_1.LoggerEventName.CloseSession,
                    description: `Error while closing session:  '${id}'.  Added to pending queue.`,
                    user: this.user.username,
                    type: models_1.LoggerEventType.Error,
                }, this.token);
            }
        });
    }
    uploadStats(sessionId, stats, statType) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield statTypeToSDK[statType].createBulk(sessionId, stats, this.token);
                //  Log Upload Stat Success Event
                yield rowstream_utils_1.eventLoggerSDK.create({
                    name: models_1.LoggerEventName.UploadStat,
                    description: `Successfully uploaded ${stats.length} '${statType}' stats.`,
                    user: this.user.username,
                    type: models_1.LoggerEventType.Success,
                }, this.token);
            }
            catch (err) {
                //  Add the Session to the Create Queue
                this.pendingQueues.statCreateQueue.push({ sessionId, stats, statType });
                //  Write Queues
                yield this.writeQueues();
                //  Log Upload Stat Error Event
                yield rowstream_utils_1.eventLoggerSDK.create({
                    name: models_1.LoggerEventName.UploadStat,
                    description: `Failed to upload ${stats.length} '${statType}' stats.  Added to pending queue.`,
                    user: this.user.username,
                    type: models_1.LoggerEventType.Error,
                }, this.token);
            }
        });
    }
}
exports.SessionStorage = SessionStorage;
//# sourceMappingURL=session-storage.js.map