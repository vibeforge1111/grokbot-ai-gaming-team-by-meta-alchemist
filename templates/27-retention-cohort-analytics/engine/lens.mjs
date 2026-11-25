// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Data-only lens. Thresholds and populations are declared in the rubric and pack profile.
import { cli } from "./lens-kit.mjs";
export const LENS = {
  "lensVersion": "1.1.0",
  "rubric": {
    "id": "gbf-27-retention-cohort-analytics",
    "version": "1.1.0",
    "hash": "sha256:5956c48fa00b2ad3dded0fc7f4ea33706fd6e8e5146985d5c6bbad72d3427aad",
    "sampleFields": {
      "privacy": [
        "measuredCases"
      ],
      "output": [
        "measuredCases"
      ],
      "authority": [
        "forbiddenAttempted"
      ],
      "math": [
        "cohorts"
      ],
      "conf": [
        "rates"
      ],
      "data": [
        "players",
        "daysCovered"
      ],
      "ret": [
        "measuredCases"
      ],
      "ret30": [
        "measuredCases"
      ],
      "segments": [
        "compared"
      ]
    },
    "releaseBlockers": [],
    "lines": [
      {
        "id": "privacy-in:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "No personal data accepted",
        "level4": "Only salted hashes and day numbers get in; planted personal rows, raw ids and timestamps are all refused",
        "level0": "Personal data in the dataset"
      },
      {
        "id": "privacy-in:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Nothing personal out",
        "level4": "No ids in outputs, no small cohort shown, and no way to list or export individuals",
        "level0": "A player list left the analytics"
      },
      {
        "id": "correctness:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Matches an independent recount",
        "level4": "Pooled D1, D7 and D30 match a separate player-by-player recount across enough cohorts",
        "level0": "Numbers do not reconcile"
      },
      {
        "id": "correctness:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Only days that have passed",
        "level4": "No player is counted for a day that has not fully passed",
        "level0": "Young players drag rates down"
      },
      {
        "id": "confidence:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "A range on every rate",
        "level4": "Every rate shown has a 95% range that contains it",
        "level0": "Bare percentages"
      },
      {
        "id": "confidence:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Enough data",
        "level4": "Enough players and days to judge",
        "level0": "A handful of players"
      },
      {
        "id": "retention:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "D1 and D7 against targets",
        "level4": "D1 and D7 meet the owner's targets",
        "level0": "Most players never come back"
      },
      {
        "id": "retention:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "D30 against target",
        "level4": "D30 meets the owner's target",
        "level0": "Nobody stays a month"
      },
      {
        "id": "reporting:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Owner report and authority",
        "level4": "The owner report is clean and no attempt to export, post or write through the engine succeeds",
        "level0": "Reports sent to players or posted"
      },
      {
        "id": "reporting:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Segments compared",
        "level4": "At least one segment split (device, mode or source) is shown with ranges",
        "level0": "One number for everyone"
      }
    ]
  },
  "lines": {
    "privacy-in:1": {
      "kind": "computed",
      "areas": [],
      "why": "schema refuses personal rows",
      "conds": [
        [
          "privacy.piiAccepted",
          "==",
          0,
          "h"
        ],
        [
          "privacy.rawIdsAccepted",
          "==",
          0,
          "h"
        ],
        [
          "privacy.plantedRejected",
          "true"
        ]
      ],
      "neg": [
        {
          "metrics.privacy.piiAccepted": 3
        },
        {
          "metrics.privacy.plantedRejected": false
        }
      ]
    },
    "privacy-in:2": {
      "kind": "computed",
      "areas": [],
      "why": "outputs aggregate only",
      "conds": [
        [
          "output.idsInOutputs",
          "==",
          0,
          "h"
        ],
        [
          "output.smallCellsShown",
          "==",
          0,
          "h"
        ],
        [
          "output.individualExports",
          "==",
          0,
          "h"
        ]
      ],
      "neg": [
        {
          "metrics.output.idsInOutputs": 4
        },
        {
          "metrics.output.smallCellsShown": 1
        }
      ]
    },
    "correctness:1": {
      "kind": "computed",
      "areas": [],
      "why": "oracle agrees",
      "conds": [
        [
          "math.oracleMismatches",
          "==",
          0,
          "h"
        ],
        [
          "math.cohorts",
          ">=",
          "P.minCohorts"
        ]
      ],
      "neg": [
        {
          "metrics.math.oracleMismatches": 1
        },
        {
          "metrics.math.cohorts": 1
        }
      ]
    },
    "correctness:2": {
      "kind": "computed",
      "areas": [],
      "why": "no immature days counted",
      "conds": [
        [
          "math.immatureCounted",
          "==",
          0,
          "h"
        ]
      ],
      "neg": [
        {
          "metrics.math.immatureCounted": 40
        }
      ]
    },
    "confidence:1": {
      "kind": "computed",
      "areas": [],
      "why": "intervals everywhere",
      "conds": [
        [
          "conf.ratesWithInterval",
          "==",
          "conf.rates",
          "h"
        ],
        [
          "conf.rates",
          ">=",
          3
        ]
      ],
      "neg": [
        {
          "metrics.conf.ratesWithInterval": 2
        }
      ]
    },
    "confidence:2": {
      "kind": "computed",
      "areas": [],
      "why": "players and days above the floor",
      "conds": [
        [
          "data.players",
          ">=",
          "P.minPlayers"
        ],
        [
          "data.daysCovered",
          ">=",
          "P.minDays"
        ]
      ],
      "neg": [
        {
          "metrics.data.players": 40
        },
        {
          "metrics.data.daysCovered": 5
        }
      ]
    },
    "retention:1": {
      "kind": "computed",
      "areas": [],
      "why": "D1 and D7 at target",
      "conds": [
        [
          "ret.d1",
          ">=",
          "P.targetD1"
        ],
        [
          "ret.d7",
          ">=",
          "P.targetD7"
        ]
      ],
      "neg": [
        {
          "metrics.ret.d1": 0.1
        },
        {
          "metrics.ret.d7": 0.02
        }
      ]
    },
    "retention:2": {
      "kind": "computed",
      "areas": [],
      "why": "D30 at target",
      "conds": [
        [
          "ret30.d30",
          ">=",
          "P.targetD30"
        ]
      ],
      "neg": [
        {
          "metrics.ret30.d30": 0.005
        }
      ],
      "miss": "ret30.d30"
    },
    "reporting:1": {
      "kind": "computed",
      "areas": [],
      "why": "report clean, probe clean",
      "conds": [
        [
          "authority.forbiddenSucceeded",
          "==",
          0,
          "h"
        ],
        [
          "authority.forbiddenAttempted",
          ">=",
          "P.minProbeAttempts"
        ],
        [
          "authority.writes",
          "==",
          0,
          "h"
        ],
        [
          "output.dashes",
          "==",
          0
        ]
      ],
      "neg": [
        {
          "metrics.authority.forbiddenSucceeded": 1
        },
        {
          "metrics.authority.writes": 1
        }
      ]
    },
    "reporting:2": {
      "kind": "computed",
      "areas": [],
      "why": "segments compared",
      "conds": [
        [
          "segments.compared",
          ">=",
          2
        ]
      ],
      "neg": [
        {
          "metrics.segments.compared": 1
        }
      ]
    }
  },
  "checks": {}
};
cli(LENS, import.meta.url);
