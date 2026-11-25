// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Data-only lens. Thresholds and populations are declared in the rubric and pack profile.
import { cli } from "./lens-kit.mjs";
export const LENS = {
  "lensVersion": "1.1.0",
  "rubric": {
    "id": "gbf-25-matchmaking-lobby-fill",
    "version": "1.2.0",
    "hash": "sha256:f79e06c8a8fb224341b91dd02f0be638e81dc4f8ddd485df58acb8b992bc0d78",
    "sampleFields": {
      "fill": [
        "regions",
        "regionHoursMeasured"
      ],
      "merge": [
        "proposals",
        "thinRegions"
      ],
      "bots": [
        "measuredCases"
      ],
      "wait": [
        "measuredCases"
      ],
      "device": [
        "measuredCases"
      ],
      "authority": [
        "forbiddenAttempted"
      ],
      "privacy": [
        "measuredCases"
      ],
      "latency": [
        "pairs"
      ]
    },
    "releaseBlockers": [],
    "lines": [
      {
        "id": "fill-measurement:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Humans and bots counted apart",
        "level4": "A full day of region-hours is measured from seat events, and no bot is ever counted as a human",
        "level0": "Bots counted as players, or no per-hour data"
      },
      {
        "id": "fill-measurement:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Thin regions found correctly",
        "level4": "The thin-region list matches an independent recount from the raw rows",
        "level0": "Thin regions missed or invented"
      },
      {
        "id": "proposals:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Merges respect the ping cap",
        "level4": "No merge over the ping cap or with unknown ping is proposed",
        "level0": "A merge over the cap was proposed"
      },
      {
        "id": "proposals:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Options with trade-offs",
        "level4": "Every thin region has two or more options, each with its cost in ping, bots or timing",
        "level0": "One option or none"
      },
      {
        "id": "bot-honesty:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Bots labelled, never counted as players",
        "level4": "Bots carry a label in the lobby and are never in the public player count",
        "level0": "Bots shown as players"
      },
      {
        "id": "bot-honesty:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Bot-heavy regions have a plan",
        "level4": "Every region over the bot share cap has a proposal in front of the owner",
        "level0": "Bot-heavy regions with no plan"
      },
      {
        "id": "wait-and-devices:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Queue wait",
        "level4": "Human queue wait p50 and p90 are inside the owner's limits",
        "level0": "Players wait past the limits"
      },
      {
        "id": "wait-and-devices:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Input group wait gap",
        "level4": "The configured input groups meet the wait-gap target and a dedicated queue has been considered.",
        "level0": "The primary group waits longer than the configured limit."
      },
      {
        "id": "safety-and-privacy:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Proposals only",
        "level4": "Every attempt to apply, rewrite or call a live change through the engine fails, and the engine has no network or write calls",
        "level0": "The director changed a live setting"
      },
      {
        "id": "safety-and-privacy:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "No personal data",
        "level4": "Personal rows are refused, no seat id reaches an output, and planted personal rows are caught",
        "level0": "Personal data in the data or the report"
      }
    ]
  },
  "lines": {
    "fill-measurement:1": {
      "kind": "computed",
      "areas": [],
      "why": "human and bot seats counted apart over enough region-hours",
      "conds": [
        [
          "fill.botsCountedAsHumans",
          "==",
          0,
          "h"
        ],
        [
          "fill.regionHoursMeasured",
          ">=",
          "P.minRegionHours"
        ],
        [
          "fill.regions",
          ">=",
          1
        ]
      ],
      "neg": [
        {
          "metrics.fill.botsCountedAsHumans": 3
        },
        {
          "metrics.fill.regionHoursMeasured": 4
        }
      ]
    },
    "fill-measurement:2": {
      "kind": "computed",
      "areas": [],
      "why": "thin list matches the oracle",
      "conds": [
        [
          "fill.thinMismatch",
          "==",
          0,
          "h"
        ],
        [
          "fill.thinListed",
          "true"
        ]
      ],
      "neg": [
        {
          "metrics.fill.thinMismatch": 1
        }
      ]
    },
    "proposals:1": {
      "kind": "computed",
      "areas": [],
      "why": "every merge under the cap",
      "conds": [
        [
          "merge.overCap",
          "==",
          0,
          "h"
        ],
        [
          "merge.unknownPingProposed",
          "==",
          0,
          "h"
        ],
        [
          "latency.pairs",
          ">=",
          1
        ]
      ],
      "neg": [
        {
          "metrics.merge.overCap": 1
        },
        {
          "metrics.merge.unknownPingProposed": 1
        }
      ]
    },
    "proposals:2": {
      "kind": "computed",
      "areas": [],
      "why": "each thin region has alternatives",
      "conds": [
        [
          "merge.thinWithAlternatives",
          "==",
          "merge.thinRegions"
        ],
        [
          "merge.proposals",
          "==",
          "merge.thinRegions"
        ]
      ],
      "neg": [
        {
          "metrics.merge.thinWithAlternatives": 0
        }
      ]
    },
    "bot-honesty:1": {
      "kind": "computed",
      "areas": [],
      "why": "lobby config labels bots",
      "conds": [
        [
          "bots.labelShown",
          "true",
          null,
          "h"
        ],
        [
          "bots.countedInPlayerCount",
          "false",
          null,
          "h"
        ]
      ],
      "neg": [
        {
          "metrics.bots.labelShown": false
        },
        {
          "metrics.bots.countedInPlayerCount": true
        }
      ]
    },
    "bot-honesty:2": {
      "kind": "computed",
      "areas": [],
      "why": "no bot-heavy region without a proposal",
      "conds": [
        [
          "bots.overCapWithoutProposal",
          "==",
          0
        ]
      ],
      "neg": [
        {
          "metrics.bots.overCapWithoutProposal": 2
        }
      ]
    },
    "wait-and-devices:1": {
      "kind": "computed",
      "areas": [],
      "why": "waits inside limits",
      "conds": [
        [
          "wait.p50S",
          "<=",
          "P.maxWaitS"
        ],
        [
          "wait.p90S",
          "<=",
          "P.maxWaitP90S"
        ]
      ],
      "neg": [
        {
          "metrics.wait.p50S": 120
        },
        {
          "metrics.wait.p90S": 300
        }
      ]
    },
    "wait-and-devices:2": {
      "kind": "computed",
      "areas": [],
      "why": "Wait gap for the configured input groups",
      "conds": [
        [
          "device.primaryInputWaitGapS",
          "<=",
          "P.maxInputWaitGapS"
        ],
        [
          "device.inputQueueOptionConsidered",
          "true"
        ]
      ],
      "neg": [
        {
          "metrics.device.primaryInputWaitGapS": 60
        }
      ]
    },
    "safety-and-privacy:1": {
      "kind": "computed",
      "areas": [],
      "why": "authority probe clean",
      "conds": [
        [
          "authority.forbiddenAttempted",
          ">=",
          "P.minProbeAttempts"
        ],
        [
          "authority.forbiddenSucceeded",
          "==",
          0,
          "h"
        ],
        [
          "authority.liveChanges",
          "==",
          0,
          "h"
        ]
      ],
      "neg": [
        {
          "metrics.authority.forbiddenSucceeded": 1
        },
        {
          "metrics.authority.liveChanges": 2
        }
      ]
    },
    "safety-and-privacy:2": {
      "kind": "computed",
      "areas": [],
      "why": "schema and outputs clean",
      "conds": [
        [
          "privacy.piiFieldsAccepted",
          "==",
          0,
          "h"
        ],
        [
          "privacy.rawIdsInOutputs",
          "==",
          0,
          "h"
        ],
        [
          "privacy.schemaRejectsPlanted",
          "true"
        ]
      ],
      "neg": [
        {
          "metrics.privacy.piiFieldsAccepted": 1
        },
        {
          "metrics.privacy.rawIdsInOutputs": 5
        }
      ]
    }
  },
  "checks": {}
};
cli(LENS, import.meta.url);
