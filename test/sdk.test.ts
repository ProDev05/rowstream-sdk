/**
 * Copyright (c) 2019 Jonathan Andersen
 * Copyright (c) 2019 William R. Sullivan
 *
 * This software is proprietary and owned by Jonathan Andersen.
 *
 * This software was based on https://github.com/wrsulliv/SDKLibrary,
 * licensed under the MIT license.
 */

import {
  Profile,
  Session,
  SessionInternal,
  AggParams,
  SessionGeneralStatusStatInternal,
  SessionGeneralStatusStat,
  SessionAdditionalStatus1Stat,
  SessionAdditionalStatus1StatInternal,
  SessionAdditionalStatus2StatInternal,
  SessionAdditionalStatus2Stat,
  BucketQueryParamsAPI,
} from "../src";
import { TokenParams } from "../src/models/token-model";
import {
  userSDK,
  profileSDK,
  tokenSDK,
  sessionSDK,
  sessionGeneralStatSDK,
  sessionAdditional1StatSDK,
  sessionAdditional2StatSDK,
} from "../src/tools/rowstream-utils";
import {
  GeneralStatus,
  AdditionalStatus1,
  AdditionalStatus2,
  WorkoutType,
  IntervalType,
  WorkoutState,
  RowingState,
  StrokeState,
  WorkoutDurationType,
  RowingStrokeData,
} from "../src/tools/pm5-sdk";
import { expect } from "chai";

const consumerTokenParams: TokenParams = {
  username: "consumer",
  password: "testpass123",
};

const profile: Profile = {
  name: "test_name",
  city: "test_city",
  state: "MA",
  avatar:
    "https://media.licdn.com/dms/image/C4E03AQGCS-gtkIsWPw/profile-displayphoto-shrink_200_200/0?e=1553126400&v=beta&t=ra5ykvv7k9PASkNlT3zioLC_58aNCQZo31BMfSVIRm0",
};

const sessionParams: Session = {
  start: new Date().toISOString(),
};

const sessionGeneralStatParams: GeneralStatus = {
  elapsedTime: new Date(),
  distance: 5,
  workoutType: WorkoutType["Fixed Calorie"],
  intervalType: IntervalType.Calorie,
  workoutState: WorkoutState["Countdown Pause"],
  rowingState: RowingState.Active,
  strokeState: StrokeState.Driving,
  totalWorkDistance: 5,
  workoutDuration: 5,
  workoutDurationType: WorkoutDurationType["Calories Duration"],
  dragFactor: 5,
};

export const sessionGeneralStatParamsStart: GeneralStatus = {
  elapsedTime: new Date(0),
  distance: 0, //  0.1 Meters
  workoutType: WorkoutType["Fixed Calorie"],
  intervalType: IntervalType.Calorie,
  workoutState: WorkoutState["Workout Row"],
  rowingState: RowingState.Active,
  strokeState: StrokeState.Driving,
  totalWorkDistance: 0,
  workoutDuration: 0,
  workoutDurationType: WorkoutDurationType["Calories Duration"],
  dragFactor: 20,
};

export const sessionGeneralStatParamsEnd: GeneralStatus = {
  elapsedTime: new Date(1000 * 60 * 60), //  1 Hour expressed in MS
  distance: 10 * 1000, //  1000 Meters expressed in 0.1 Meters
  workoutType: WorkoutType["Fixed Calorie"],
  intervalType: IntervalType.Calorie,
  workoutState: WorkoutState["Countdown Pause"],
  rowingState: RowingState.Active,
  strokeState: StrokeState.Driving,
  totalWorkDistance: 10 * 1000,
  workoutDuration: 10 * 1000,
  workoutDurationType: WorkoutDurationType["Calories Duration"],
  dragFactor: 7,
};

export const sessionAdditional1StatParamsStart: AdditionalStatus1 = {
  elapsedTime: new Date(0),
  speed: 30,
  strokeRate: 30,
  heartRate: 90,
  currentPace: new Date(1000 * 60 * 1),
  averagePace: new Date(1000 * 60 * 1),
  restDistance: 50,
  restTime: 0,
};

export const sessionAdditional1StatParamsEnd: AdditionalStatus1 = {
  elapsedTime: new Date(1000 * 60 * 60),
  speed: 100,
  strokeRate: 100,
  heartRate: 180,
  currentPace: new Date(1000 * 60 * 3),
  averagePace: new Date(1000 * 60 * 3),
  restDistance: 100,
  restTime: 10,
};

export const sessionAdditional2StatParamsStart: AdditionalStatus2 = {
  elapsedTime: new Date(0),
  intervalCount: 5,
  averagePower: 5,
  totalCalories: 5,
  splitIntAvgPace: 5,
  splitIntAvgPower: 5,
  splitIntAvgCalories: 5,
  lastSplitTime: 5,
  lastSplitDistance: 5,
};

export const sessionAdditional2StatParamsEnd: AdditionalStatus2 = {
  elapsedTime: new Date(1000 * 60 * 60),
  intervalCount: 20,
  averagePower: 30,
  totalCalories: 30,
  splitIntAvgPace: 30,
  splitIntAvgPower: 30,
  splitIntAvgCalories: 30,
  lastSplitTime: 30,
  lastSplitDistance: 30,
};

export const rowingStrokeDataStatParamsStart: RowingStrokeData = {
  elapsedTime: new Date(),
  distance: 1000,
  driveLength: 20,
  driveTime: 30,
  strokeRecoveryTime: 30,
  strokeDistance: 30,
  peakDriveForce: 50,
  averageDriveForce: 40,
  workPerStroke: 40,
  strokeCount: 30,
};

const totalNum = 300;

interface TestData {
  [key: string]: number | Date;
}

export enum TestDataGenerator {
  Linear,
  RandomBezier,
}

export const generateTestData = (
  initial: TestData,
  final: TestData,
  count: number,
  method: TestDataGenerator,
  multiplier: number = 1
): TestData[] => {
  if (method === TestDataGenerator.Linear) {
    const testData: TestData[] = [];
    for (let i = 0; i < count; i++) {
      const dataPoint: TestData = {};
      for (const key of Object.keys(initial)) {
        const rawInitialValue = initial[key];
        if (typeof rawInitialValue == "string") {
          dataPoint[key] = rawInitialValue;
        } else {
          const initialValue: number =
            initial[key] instanceof Date
              ? (initial[key] as Date).getTime()
              : (initial[key] as number);
          const finalValue =
            final[key] instanceof Date
              ? (final[key] as Date).getTime()
              : (final[key] as number);
          const interval = (finalValue - initialValue) / (count - 1);
          const pointValue = (initialValue + interval * i) * multiplier;
          dataPoint[key] = pointValue;
        }
      }
      testData.push(dataPoint);
    }
    return testData;
  } else {
    throw new Error("Unsupported Generator Specified.");
  }
};

const sessionAdditional2StatParams: AdditionalStatus2 = {
  elapsedTime: new Date(),
  intervalCount: 5,
  averagePower: 5,
  totalCalories: 5,
  splitIntAvgPace: 5,
  splitIntAvgPower: 5,
  splitIntAvgCalories: 5,
  lastSplitTime: 5,
  lastSplitDistance: 5,
};

//  Test the SDKs
describe("SDKs", () => {
  let consumerToken: string;
  let session: SessionInternal;
  let sessionStatGeneral: SessionGeneralStatusStatInternal;
  let sessionStatAdditional1: SessionAdditionalStatus1StatInternal;
  let sessionStatAdditional2: SessionAdditionalStatus2StatInternal;

  it("should create the tokens", async () => {
    const consumerTokenRes = await tokenSDK.create(consumerTokenParams);
    consumerToken = consumerTokenRes.token;
  });

  describe("User", () => {
    it("should retrieve a user", async () => {
      await userSDK.retrieve(consumerTokenParams.username, consumerToken);
    });
  });

  describe("Profile", () => {
    it("should create a profile", async () => {
      //  TODO:  Always do this with a NEW user because they're currently limited to ONE per user hmm...
      const profileInternal = await profileSDK.create(profile, consumerToken);
      expect(profileInternal !== undefined);
    });

    it("should retrieve a profile", async () => {
      await profileSDK.retrieve(consumerTokenParams.username, consumerToken);
    });

    it("should update a profile", async () => {
      //  NOTE:  ProfileID and UserID are the same.
      await profileSDK.update(
        consumerTokenParams.username,
        profile,
        consumerToken
      );
    });
  });

  describe("Session", () => {
    it("should create a session", async () => {
      session = await sessionSDK.create(sessionParams, consumerToken);
    });

    it("should create another session", async () => {
      await sessionSDK.create(sessionParams, consumerToken);
    });

    it("should retrieve a session", async () => {
      session = await sessionSDK.retrieve(session.id, consumerToken);
      if (session.end !== undefined) {
        throw new Error("SESSION END SHOULD BE UNDEFINED");
      }
    });

    it("should update a session", async () => {
      const updatedSessionParams: Session = {
        end: new Date().toISOString(),
        ...sessionParams,
      };
      await sessionSDK.update(session.id, updatedSessionParams, consumerToken);
    });

    it("should retrieve a session", async () => {
      session = await sessionSDK.retrieve(session.id, consumerToken);
      if (session.end === undefined) {
        throw new Error("SESSION END SHOULD BE DEFINED");
      }
    });

    it("should search sessions", async () => {
      const sessions = await sessionSDK.search({}, consumerToken);
      if (sessions.total < 2) {
        throw new Error("Unexpected number of sessions!");
      }
    });

    it("should search sessions with filter", async () => {
      const sessions = await sessionSDK.search(
        { search: { match: { id: session.id } } },
        consumerToken
      );
      if (sessions.total !== 1) {
        throw new Error("Unexpected number of sessions!");
      }
    });

    it("should search sessions with array (or) filter", async () => {
      const sessions = await sessionSDK.search(
        { search: { any: [{ match: { id: session.id } }] } },
        consumerToken
      );
      if (sessions.total !== 1) {
        throw new Error("Unexpected number of sessions!");
      }
    });
  });

  describe("General Session Stats", () => {
    it("should create a general session stat", async () => {
      const sessionStatParams: SessionGeneralStatusStat = {
        ...sessionGeneralStatParams,
        sessionId: session.id,
      };
      sessionStatGeneral = await sessionGeneralStatSDK.create(
        sessionStatParams,
        consumerToken
      );
    });
    it("should retrieve a general  session stat", async () => {
      sessionStatGeneral = await sessionGeneralStatSDK.retrieve(
        sessionStatGeneral.id,
        consumerToken
      );
    });
    it("should search general session stats", async () => {
      const sessionStats = await sessionGeneralStatSDK.search(
        { metadata: { sessionId: session.id } },
        consumerToken
      );
      console.log(sessionStats);
    });
    it("should create general session stats with the bulk API", async () => {
      const sessionStatParams: SessionGeneralStatusStat = {
        ...sessionGeneralStatParams,
        sessionId: session.id,
      };
      const sessionStatList = [
        sessionStatParams,
        sessionStatParams,
        sessionStatParams,
        sessionStatParams,
        sessionStatParams,
      ];
      await sessionGeneralStatSDK.createBulk(
        session.id,
        sessionStatList,
        consumerToken
      );
    });
    it("should give aggregations on general stats", async () => {
      const params: AggParams = {
        match: { sessionId: session.id },
        fields: ["elapsedTime", "distance"],
      };
      const sessionStats = await sessionGeneralStatSDK.getStats(
        params,
        consumerToken
      );
      console.log(sessionStats);
    });
  });

  describe("General Session Stats", () => {
    it("should create a additional1 session stat", async () => {
      const sessionStatParams: SessionAdditionalStatus1Stat = {
        ...sessionAdditional1StatParamsStart,
        sessionId: session.id,
      };
      sessionStatAdditional1 = await sessionAdditional1StatSDK.create(
        sessionStatParams,
        consumerToken
      );
    });
    it("should retrieve a additional1  session stat", async () => {
      sessionStatAdditional1 = await sessionAdditional1StatSDK.retrieve(
        sessionStatAdditional1.id,
        consumerToken
      );
    });
    it("should search additional1 session stats", async () => {
      const sessionStats = await sessionAdditional1StatSDK.search(
        { metadata: { sessionId: session.id } },
        consumerToken
      );
    });
    it("should create additional1 session stats with the bulk API", async () => {
      const sessionStatList = generateTestData(
        sessionAdditional1StatParamsStart as any,
        sessionAdditional1StatParamsEnd as any,
        totalNum,
        TestDataGenerator.Linear
      ) as any[];
      const sessionStatListUpdated = sessionStatList.map((testData) => ({
        ...testData,
        sessionId: session.id,
      }));
      await sessionAdditional1StatSDK.createBulk(
        session.id,
        sessionStatListUpdated,
        consumerToken
      );
    });
    it("should give aggregations on additional1 stats", async () => {
      const params: AggParams = {
        match: { sessionId: session.id },
        fields: ["elapsedTime", "distance"],
      };
      const sessionStats = await sessionAdditional1StatSDK.getStats(
        params,
        consumerToken
      );
      console.log(sessionStats);
    });
    it("should give bucket aggregations with extended stats", async () => {
      const params: BucketQueryParamsAPI = {
        sessionId: session.id,
        interval: "5s",
        bucketFields: ["strokeRate", "heartRate"],
      };
      try {
        const sessionStats = await sessionAdditional1StatSDK.bucketQuery(
          params,
          consumerToken
        );
        console.log(sessionStats);
      } catch (error) {
        throw error;
      }
    });
  });

  describe("General Session Stats", () => {
    it("should create a additional2 session stat", async () => {
      const sessionStatParams: SessionAdditionalStatus2Stat = {
        ...sessionAdditional2StatParams,
        sessionId: session.id,
      };
      sessionStatAdditional2 = await sessionAdditional2StatSDK.create(
        sessionStatParams,
        consumerToken
      );
    });
    it("should retrieve a additional2  session stat", async () => {
      sessionStatAdditional2 = await sessionAdditional2StatSDK.retrieve(
        sessionStatAdditional2.id,
        consumerToken
      );
    });
    it("should search additional2 session stats", async () => {
      const sessionStats = await sessionAdditional2StatSDK.search(
        { metadata: { sessionId: session.id } },
        consumerToken
      );
    });
    it("should create additional2 session stats with the bulk API", async () => {
      const sessionStatParams: SessionAdditionalStatus2Stat = {
        ...sessionAdditional2StatParams,
        sessionId: session.id,
      };
      const sessionStatList = [
        sessionStatParams,
        sessionStatParams,
        sessionStatParams,
        sessionStatParams,
        sessionStatParams,
      ];
      await sessionAdditional2StatSDK.createBulk(
        session.id,
        sessionStatList,
        consumerToken
      );
    });
    it("should give aggregations on additional2 stats", async () => {
      const params: AggParams = {
        match: { sessionId: session.id },
        fields: ["elapsedTime", "distance"],
      };
      const sessionStats = await sessionAdditional2StatSDK.getStats(
        params,
        consumerToken
      );
      console.log(sessionStats);
    });
  });
});
