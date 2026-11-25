// Created by @meta_alchemist (https://x.com/meta_alchemist).
// Data-only lens. Thresholds and populations are declared in the rubric and pack profile.
import { cli } from "./lens-kit.mjs";
export const LENS = {
  "lensVersion": "1.1.0",
  "rubric": {
    "id": "gbf-26-balance-patch-director",
    "version": "1.1.0",
    "hash": "sha256:9cb5e3a3969dd9c0416acab9708abfff51e427847dbd32371c8dc06734c15da9",
    "sampleFields": {
      "defs": [
        "parsedParameters"
      ],
      "map": [
        "measuredCases"
      ],
      "math": [
        "itemsComputed"
      ],
      "telemetry": [
        "observations"
      ],
      "proposals": [
        "items"
      ],
      "authority": [
        "forbiddenAttempted",
        "parameterCount"
      ],
      "notes": [
        "measuredCases"
      ]
    },
    "releaseBlockers": [],
    "lines": [
      {
        "id": "data-fidelity:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Reference values",
        "level4": "Numeric parameters match a separate reference export for the identified build.",
        "level0": "Values disagree with the reference export."
      },
      {
        "id": "data-fidelity:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Names mapped to real ids",
        "level4": "Every complaint is mapped to ids; unclear names are flagged for the owner and never recommended as sure",
        "level0": "A guess acted on as fact"
      },
      {
        "id": "evidence:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Check modeled outcomes",
        "level4": "Predicted changes agree with an independent ratio check on measured outcomes.",
        "level0": "The prediction check disagrees."
      },
      {
        "id": "evidence:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Recent observations",
        "level4": "The observation sample meets the count and age limits and differences from target are listed.",
        "level0": "The observation set is stale or undersized."
      },
      {
        "id": "proposals:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Small, reversible steps",
        "level4": "Every change is inside the step cap, the patch stays inside the lever cap, and each option rolls back to today's value",
        "level0": "Big swings with no way back"
      },
      {
        "id": "proposals:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Options, predictions and follow-up",
        "level4": "Each resolved request has alternatives, a modeled outcome and a follow-up measure.",
        "level0": "A resolved request lacks an alternative or prediction."
      },
      {
        "id": "authority:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Proposes only",
        "level4": "Every attempt to ship, rewrite or call a live change through the engine fails and the engine has no write path",
        "level0": "The director changed a live value"
      },
      {
        "id": "authority:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "trace",
        "name": "Game data untouched",
        "level4": "The parsed game data is identical before and after proposing",
        "level0": "Game data changed by the run"
      },
      {
        "id": "patch-notes:1",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Draft notes, honest and clean",
        "level4": "Patch notes are labelled as a draft and carry no dates, prices or long dashes",
        "level0": "Notes posted or promising dates"
      },
      {
        "id": "patch-notes:2",
        "weight": 10,
        "passAt": 3,
        "evidence": "static",
        "name": "Recommendation follows the evidence",
        "level4": "With a stale ledger the recommendation is to measure; with a fresh one at most the lever cap moves",
        "level0": "Changes pushed on stale data"
      }
    ]
  },
  "lines": {
    "data-fidelity:1": {
      "kind": "computed",
      "areas": [],
      "why": "parsed values match the separate reference export",
      "conds": [
        [
          "defs.parsedParameters",
          ">=",
          "P.minParameters"
        ],
        [
          "defs.valueMismatches",
          "==",
          0,
          "h"
        ],
        [
          "defs.sourceShaSet",
          "true"
        ]
      ],
      "neg": [
        {
          "metrics.defs.valueMismatches": 2
        },
        {
          "metrics.defs.parsedParameters": 1
        }
      ]
    },
    "data-fidelity:2": {
      "kind": "computed",
      "areas": [],
      "why": "ambiguous names flagged",
      "conds": [
        [
          "map.unresolvedProposedAsSure",
          "==",
          0,
          "h"
        ],
        [
          "map.ambiguousFlagged",
          "==",
          "map.ambiguous"
        ]
      ],
      "neg": [
        {
          "metrics.map.unresolvedProposedAsSure": 1
        },
        {
          "metrics.map.ambiguousFlagged": 0
        }
      ]
    },
    "evidence:1": {
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
          "math.itemsComputed",
          ">=",
          "P.minParameters"
        ]
      ],
      "neg": [
        {
          "metrics.math.oracleMismatches": 1
        }
      ]
    },
    "evidence:2": {
      "kind": "computed",
      "areas": [],
      "why": "ledger fresh and large",
      "conds": [
        [
          "telemetry.ageDays",
          "<=",
          "P.maxTelemetryAgeDays"
        ],
        [
          "telemetry.observations",
          ">=",
          "P.minObservations"
        ],
        [
          "telemetry.outliersListed",
          "true"
        ]
      ],
      "neg": [
        {
          "metrics.telemetry.ageDays": 30
        },
        {
          "metrics.telemetry.observations": 1
        }
      ]
    },
    "proposals:1": {
      "kind": "computed",
      "areas": [],
      "why": "steps and levers within caps",
      "conds": [
        [
          "proposals.maxStepPct",
          "<=",
          "P.maxStepPct",
          "h"
        ],
        [
          "proposals.leversRecommended",
          "<=",
          "P.maxLevers"
        ],
        [
          "proposals.withRollback",
          "==",
          "proposals.items"
        ]
      ],
      "neg": [
        {
          "metrics.proposals.maxStepPct": 60
        },
        {
          "metrics.proposals.withRollback": 0
        }
      ]
    },
    "proposals:2": {
      "kind": "computed",
      "areas": [],
      "why": "alternatives, predictions and follow-up present",
      "conds": [
        [
          "proposals.withAlternatives",
          "==",
          "proposals.items"
        ],
        [
          "proposals.withPrediction",
          "==",
          "proposals.items"
        ],
        [
          "proposals.withFollowUp",
          "==",
          "proposals.items"
        ]
      ],
      "neg": [
        {
          "metrics.proposals.withPrediction": 1
        }
      ]
    },
    "authority:1": {
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
          "authority.repoWrites",
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
          "metrics.authority.repoWrites": 1
        }
      ]
    },
    "authority:2": {
      "kind": "computed",
      "areas": [],
      "why": "no mutation",
      "conds": [
        [
          "authority.defsMutated",
          "==",
          0,
          "h"
        ]
      ],
      "neg": [
        {
          "metrics.authority.defsMutated": 1
        }
      ]
    },
    "patch-notes:1": {
      "kind": "computed",
      "areas": [],
      "why": "draft notes clean",
      "conds": [
        [
          "notes.draftLabelled",
          "true",
          null,
          "h"
        ],
        [
          "notes.datesOrPrices",
          "==",
          0,
          "h"
        ],
        [
          "notes.dashes",
          "==",
          0
        ]
      ],
      "neg": [
        {
          "metrics.notes.draftLabelled": false
        },
        {
          "metrics.notes.datesOrPrices": 2
        }
      ]
    },
    "patch-notes:2": {
      "kind": "computed",
      "areas": [],
      "why": "recommendation fits freshness",
      "conds": [
        [
          "proposals.changesOnStaleEvidence",
          "==",
          0,
          "h"
        ],
        [
          "proposals.items",
          ">=",
          1
        ]
      ],
      "neg": [
        {
          "metrics.proposals.changesOnStaleEvidence": 2
        }
      ]
    }
  },
  "checks": {}
};
cli(LENS, import.meta.url);
