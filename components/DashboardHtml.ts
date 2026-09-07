export const dashboardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Victim Distress Heatmap — India</title>

<script src="https://cdn.jsdelivr.net/npm/d3@7"></script>

<style>

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    font-family: Inter, Arial, sans-serif;
    background:
        radial-gradient(circle at top left, #241c45 0%, #100d1d 45%, #08070e 100%);
    color: #ffffff;
    min-height: 100vh;
}

.container {
    width: 94%;
    max-width: 1500px;
    margin: auto;
    padding: 25px 0 50px;
}

/* HEADER */

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
}

.title-section h1 {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.5px;
}

.title-section p {
    margin: 7px 0 0;
    color: #aaa2c4;
    font-size: 14px;
}

/* BREADCRUMB */

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    padding: 10px 15px;
    border-radius: 12px;
    margin-bottom: 18px;
    color: #cfc8e8;
    font-size: 14px;
}

.breadcrumb .link {
    color: #b6a9ff;
    cursor: pointer;
}

.breadcrumb .link:hover {
    text-decoration: underline;
}

/* CONTROLS */

.controls {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    align-items: center;
    margin-bottom: 18px;
}

.issue-box {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    flex: 1;
}

.chip {
    padding: 9px 13px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.05);
    color: #bfb8d4;
    cursor: pointer;
    font-size: 12px;
    transition: 0.2s;
}

.chip:hover {
    background: rgba(255,255,255,0.1);
    color: white;
}

.chip.active {
    background: linear-gradient(135deg, #7666ff, #bd63e8);
    color: white;
    border-color: transparent;
}

.metric-box {
    display: flex;
    align-items: center;
    gap: 8px;
}

.metric-box label {
    font-size: 12px;
    color: #aaa2c4;
}

select {
    background: #18142a;
    color: white;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 9px;
    padding: 9px 12px;
    outline: none;
}

/* STATS */

.stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-bottom: 18px;
}

.stat-card {
    background: rgba(255,255,255,0.055);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 15px;
    padding: 18px;
    min-height: 100px;
    box-shadow: 0 10px 35px rgba(0,0,0,0.18);
}

.stat-number {
    font-size: 25px;
    font-weight: 800;
    color: #ffffff;
}

.stat-label {
    color: #aaa2c4;
    font-size: 12px;
    margin-top: 7px;
}

/* MAP CARD */

.map-card {
    background: rgba(255,255,255,0.045);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    overflow: hidden;
    min-height: 760px;
}

.map-header {
    padding: 18px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.map-header h2 {
    margin: 0;
    font-size: 17px;
}

.map-header span {
    font-size: 12px;
    color: #aaa2c4;
}

.map-wrapper {
    position: relative;
    min-height: 680px;
}

#svgMap {
    width: 100%;
    height: 680px;
    display: block;
}

/* STATES / DISTRICTS */

.region {
    stroke: #5c2020;
    stroke-width: 1.2;
    cursor: pointer;
    transition: opacity 0.15s, stroke-width 0.15s;
}

.region:hover {
    opacity: 0.8;
    stroke: #000000;
    stroke-width: 2;
}

.district-label {
    pointer-events: none;
    fill: rgba(40,0,0,0.85);
    font-size: 8px;
    font-weight: 700;
    text-shadow:
        0 1px 3px rgba(255,255,255,0.7);
}

.map-title {
    fill: #ffffff;
    font-size: 17px;
    font-weight: 700;
    pointer-events: none;
}

/* LEGEND */

.legend {
    position: absolute;
    left: 20px;
    bottom: 18px;
    padding: 12px 14px;
    background: rgba(10,8,18,0.90);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    backdrop-filter: blur(8px);
}

.legend-title {
    font-size: 11px;
    color: #aaa2c4;
    margin-bottom: 7px;
}

.gradient {
    width: 220px;
    height: 12px;
    border-radius: 999px;

    background: linear-gradient(
        90deg,
        #ffffff 0%,
        #ffe5e5 20%,
        #ffb3b3 40%,
        #ff6666 60%,
        #ff1a1a 80%,
        #8b0000 100%
    );
}

.legend-labels {
    width: 220px;
    display: flex;
    justify-content: space-between;
    margin-top: 5px;
    font-size: 10px;
    color: #aaa2c4;
}

/* TOOLTIP */

#tooltip {
    position: fixed;
    display: none;
    z-index: 1000;
    pointer-events: none;
    background: #161126;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 12px;
    padding: 12px 14px;
    min-width: 190px;
    box-shadow: 0 15px 40px rgba(0,0,0,0.4);
    font-size: 12px;
    line-height: 1.6;
}

/* LOADING */

.loading {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aaa2c4;
    font-size: 14px;
    background: rgba(8,7,14,0.4);
    z-index: 5;
}

/* ERROR */

.error-box {
    margin: 30px;
    padding: 20px;
    border-radius: 12px;
    background: rgba(255,80,120,0.08);
    border: 1px solid rgba(255,80,120,0.25);
    color: #ffb3c4;
}

/* DISTRICT LIST */

.district-list {
    display: none;
    padding: 25px;
}

.district-list h3 {
    margin-top: 0;
}

.district-item {
    padding: 14px;
    margin-bottom: 8px;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
}

/* RESPONSIVE */

@media(max-width: 900px) {

    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .header {
        flex-direction: column;
        align-items: flex-start;
    }

}

@media(max-width: 600px) {

    .container {
        width: 96%;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    #svgMap {
        height: 520px;
    }

    .map-wrapper {
        min-height: 520px;
    }

}

</style>
</head>

<body>

<div class="container">

    <!-- HEADER -->

    <div class="header">

        <div class="title-section">

            <h1>🗺️ Victim Distress Heatmap</h1>

            <p>
                India state & district level victim distress visualization
            </p>

        </div>

    </div>

    <!-- BREADCRUMB -->

    <div id="breadcrumb" class="breadcrumb">
        📍 National Overview
    </div>

    <!-- CONTROLS -->

    <div class="controls">

        <div id="issueChips" class="issue-box"></div>

        <div class="metric-box">

            <label for="metricSelect">
                Metric
            </label>

            <select id="metricSelect">

                <option value="cases">
                    Cases
                </option>

                <option value="distress">
                    Avg Distress
                </option>

                <option value="highRiskPct">
                    High-Risk %
                </option>

                <option value="escalation">
                    Escalation %
                </option>

            </select>

        </div>

    </div>

    <!-- STATS -->

    <div id="statsGrid" class="stats-grid"></div>

    <!-- MAP -->

    <div class="map-card">

        <div class="map-header">

            <h2 id="mapTitle">
                India — State Distress Map
            </h2>

            <span id="legendHint">
                Click a state to drill into districts
            </span>

        </div>

        <div class="map-wrapper">

            <div id="loadingMsg" class="loading">
                Loading India map...
            </div>

            <svg id="svgMap"></svg>

            <div id="legend" class="legend">

                <div class="legend-title">
                    Distress / Risk Intensity
                </div>

                <div class="gradient"></div>

                <div class="legend-labels">
                    <span>None</span>
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                    <span>Critical</span>
                </div>

            </div>

            <div id="districtList" class="district-list"></div>

        </div>

    </div>

</div>

<!-- TOOLTIP -->

<div id="tooltip"></div>

<script>

/* =========================================================
   CONFIGURATION
========================================================= */

const INDIA_GEOJSON =
    "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/india.geojson";

const STATE_GEOJSON_BASE =
    "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@2884453/geojson/states/";


/* =========================================================
   STATES
========================================================= */

const STATES = [

    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttarakhand",
    "Uttar Pradesh",
    "West Bengal"

];


/* =========================================================
   ISSUES
========================================================= */

const ISSUES = [

    {
        id: "all",
        label: "All Issues"
    },

    {
        id: "caste",
        label: "Caste Discrimination"
    },

    {
        id: "rape",
        label: "Rape"
    },

    {
        id: "murder",
        label: "Murder"
    },

    {
        id: "injury",
        label: "Grievous Hurt"
    },

    {
        id: "arson",
        label: "Arson"
    },

    {
        id: "witness",
        label: "Witness Intimidation"
    }

];


/* =========================================================
   VARIABLES
========================================================= */

let currentIssue = "all";

let currentMetric = "cases";

let selectedState = null;

let selectedDistrict = null;

let indiaGeo = null;

let stateGeo = null;

let districtData = {};


/* =========================================================
   METRIC CONFIG
========================================================= */

const METRICS = {

    cases: {
        label: "Cases",
        unit: "",
        max: 70
    },

    distress: {
        label: "Avg Distress",
        unit: "/10",
        max: 10
    },

    highRiskPct: {
        label: "High-Risk %",
        unit: "%",
        max: 100
    },

    escalation: {
        label: "Escalation",
        unit: "%",
        max: 50
    }

};


/* =========================================================
   NORMALIZE
========================================================= */

function normalize(value) {

    return String(value || "")
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]/g, "");

}


/* =========================================================
   STATE NAME MATCHING
========================================================= */

function matchState(value) {

    const n = normalize(value);

    const aliases = {

        "orissa": "Odisha",

        "odisha": "Odisha",

        "telengana": "Telangana",

        "jammukashmir": "Jammu and Kashmir",

        "jammuandkashmir": "Jammu and Kashmir"

    };

    if (aliases[n]) {

        return aliases[n];

    }

    return STATES.find(
        state => normalize(state) === n
    ) || null;

}


/* =========================================================
   STATE GEOJSON PROPERTY
========================================================= */

function getStateName(properties) {

    if (!properties) {
        return null;
    }

    const possible = [

        "ST_NM",
        "st_nm",
        "STATE",
        "state",
        "State_Name",
        "STATE_NAME",
        "name",
        "NAME",
        "NAME_1",
        "name_1"

    ];

    for (const key of possible) {

        if (properties[key]) {

            const result =
                matchState(properties[key]);

            if (result) {

                return result;

            }

        }

    }

    return null;

}


/* =========================================================
   DISTRICT NAME
========================================================= */

function getDistrictName(properties, index) {

    if (!properties) {

        return "District " + (index + 1);

    }

    const possible = [

        "DISTRICT",
        "district",
        "District",
        "DIST_NAME",
        "district_name",
        "DISTRICT_NAME",
        "dtname",
        "DT_NAME",
        "NAME_2",
        "name_2",
        "NAME",
        "name"

    ];

    for (const key of possible) {

        if (
            properties[key] !== undefined &&
            properties[key] !== null &&
            String(properties[key]).trim() !== ""
        ) {

            return String(properties[key]).trim();

        }

    }

    return "District " + (index + 1);

}


/* =========================================================
   WHITE → RED COLOR SCALE
========================================================= */

function colorForValue(value, max) {

    const t = Math.max(
        0,
        Math.min(
            1,
            Number(value || 0) / max
        )
    );


    /*
       0%    = WHITE
       20%   = VERY LIGHT RED
       40%   = LIGHT RED
       60%   = RED
       80%   = DARK RED
       100%  = DEEP RED
    */

    const stops = [

        [255, 255, 255],   // White

        [255, 229, 229],   // Very light red

        [255, 179, 179],   // Light red

        [255, 102, 102],   // Medium red

        [255, 26, 26],     // Strong red

        [139, 0, 0]        // Deep red

    ];


    const position =
        t * (stops.length - 1);


    const index =
        Math.min(
            stops.length - 2,
            Math.floor(position)
        );


    const local =
        position - index;


    const c =
        stops[index].map(
            (value, i) =>
                Math.round(
                    value +
                    (
                        stops[index + 1][i] -
                        value
                    ) *
                    local
                )
        );


    return \`rgb(\${c[0]},\${c[1]},\${c[2]})\`;

}


/* =========================================================
   DETERMINISTIC MOCK VALUE
========================================================= */

function seededValue(text, min, max) {

    let hash = 0;

    for (let i = 0; i < text.length; i++) {

        hash =
            (
                hash * 31 +
                text.charCodeAt(i)
            ) >>> 0;

    }

    const fraction =
        (hash % 10000) / 10000;


    return Math.round(
        min +
        fraction *
        (max - min)
    );

}


/* =========================================================
   DISTRICT STATISTICS
========================================================= */

function createDistrictData(
    stateName,
    districtName
) {

    const seed =
        normalize(
            stateName +
            districtName +
            currentIssue
        );


    const cases =
        seededValue(
            seed + "cases",
            5,
            70
        );


    const distress =
        Number(
            (
                4 +
                (
                    seededValue(
                        seed + "distress",
                        0,
                        550
                    ) / 100
                )
            ).toFixed(1)
        );


    const highRiskPct =
        seededValue(
            seed + "risk",
            10,
            85
        );


    const escalation =
        seededValue(
            seed + "escalation",
            5,
            45
        );


    return {

        name: districtName,

        cases,

        distress,

        highRiskPct,

        escalation

    };

}


/* =========================================================
   ISSUE ADJUSTMENT
========================================================= */

function applyIssueAdjustment(
    data,
    issue
) {

    if (issue === "all") {

        return data;

    }


    const factorMap = {

        caste: 0.78,
        rape: 0.55,
        murder: 0.45,
        injury: 0.72,
        arson: 0.35,
        witness: 0.30

    };


    const factor =
        factorMap[issue] || 1;


    return {

        ...data,

        cases:
            Math.max(
                1,
                Math.round(
                    data.cases * factor
                )
            ),

        distress:
            Number(
                Math.min(
                    10,
                    data.distress *
                    (0.8 + factor * 0.3)
                ).toFixed(1)
            ),

        highRiskPct:
            Math.max(
                1,
                Math.round(
                    data.highRiskPct *
                    (0.65 + factor * 0.35)
                )
            ),

        escalation:
            Math.max(
                1,
                Math.round(
                    data.escalation *
                    (0.7 + factor * 0.3)
                )
            )

    };

}


/* =========================================================
   BUILD DISTRICT DATA
========================================================= */

function buildDistrictData(
    stateName,
    features
) {

    districtData = {};


    features.forEach(
        (feature, index) => {

            const name =
                getDistrictName(
                    feature.properties,
                    index
                );


            const base =
                createDistrictData(
                    stateName,
                    name
                );


            districtData[
                normalize(name)
            ] =
                applyIssueAdjustment(
                    base,
                    currentIssue
                );

        }
    );

}


/* =========================================================
   ISSUE CHIPS
========================================================= */

function renderIssueChips() {

    const container =
        document.getElementById(
            "issueChips"
        );


    container.innerHTML = "";


    ISSUES.forEach(issue => {

        const chip =
            document.createElement("div");


        chip.className =
            "chip" +
            (
                issue.id === currentIssue
                    ? " active"
                    : ""
            );


        chip.textContent =
            issue.label;


        chip.onclick = () => {

            currentIssue =
                issue.id;


            renderIssueChips();


            if (selectedState) {

                loadStateMap(
                    selectedState
                );

            }
            else {

                drawIndiaMap();

            }


            updateStats();

        };


        container.appendChild(chip);

    });

}


/* =========================================================
   BREADCRUMB
========================================================= */

function renderBreadcrumb() {

    const element =
        document.getElementById(
            "breadcrumb"
        );


    if (!selectedState) {

        element.innerHTML =
            "📍 National Overview";

        return;

    }


    if (!selectedDistrict) {

        element.innerHTML = \`

            <span
                class="link"
                onclick="goNational()"
            >
                📍 India
            </span>

            <span>›</span>

            <span>
                \${selectedState}
            </span>

        \`;

        return;

    }


    element.innerHTML = \`

        <span
            class="link"
            onclick="goNational()"
        >
            📍 India
        </span>

        <span>›</span>

        <span
            class="link"
            onclick="backToState()"
        >
            \${selectedState}
        </span>

        <span>›</span>

        <span>
            \${selectedDistrict}
        </span>

    \`;

}


/* =========================================================
   STATS
========================================================= */

function updateStats() {

    const grid =
        document.getElementById(
            "statsGrid"
        );


    const metric =
        METRICS[currentMetric];


    /* NATIONAL */

    if (!selectedState) {

        let totalCases = 0;

        let values = [];


        STATES.forEach(state => {

            const base =
                seededValue(
                    normalize(
                        state +
                        currentIssue +
                        "national"
                    ),
                    15,
                    65
                );


            const value =
                currentMetric === "cases"
                    ? base
                    : currentMetric === "distress"
                        ? Number(
                            (
                                4 +
                                base / 15
                            ).toFixed(1)
                        )
                        : currentMetric === "highRiskPct"
                            ? Math.min(
                                90,
                                base
                            )
                            : Math.min(
                                45,
                                Math.round(
                                    base * 0.6
                                )
                            );


            totalCases += base;


            values.push({
                state,
                value
            });

        });


        values.sort(
            (a,b) =>
                b.value - a.value
        );


        const average =
            (
                values.reduce(
                    (sum,item) =>
                        sum + item.value,
                    0
                ) /
                values.length
            ).toFixed(1);


        grid.innerHTML = \`

            <div class="stat-card">

                <div class="stat-number">
                    \${totalCases}
                </div>

                <div class="stat-label">
                    Total Cases
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-number">
                    \${values[0].state}
                </div>

                <div class="stat-label">
                    Highest \${metric.label}
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-number">
                    \${average}\${metric.unit}
                </div>

                <div class="stat-label">
                    National Average
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-number">
                    \${STATES.length}
                </div>

                <div class="stat-label">
                    States Monitored
                </div>

            </div>

        \`;

        return;

    }


    /* DISTRICT */

    if (selectedDistrict) {

        const data =
            districtData[
                normalize(
                    selectedDistrict
                )
            ];


        if (!data) {

            return;

        }


        grid.innerHTML = \`

            <div class="stat-card">

                <div class="stat-number">
                    \${data.cases}
                </div>

                <div class="stat-label">
                    Cases
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-number">
                    \${data.distress}/10
                </div>

                <div class="stat-label">
                    Avg Distress
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-number">
                    \${data.highRiskPct}%
                </div>

                <div class="stat-label">
                    High-Risk Cases
                </div>

            </div>


            <div class="stat-card">

                <div class="stat-number">
                    \${data.escalation}%
                </div>

                <div class="stat-label">
                    Escalation Rate
                </div>

            </div>

        \`;

        return;

    }


    /* STATE */

    let totalCases = 0;

    let values = [];


    Object.values(
        districtData
    ).forEach(data => {

        totalCases += data.cases;

        values.push(
            data[currentMetric]
        );

    });


    const average =
        values.length
            ? (
                values.reduce(
                    (a,b) =>
                        a + b,
                    0
                ) /
                values.length
            ).toFixed(1)
            : 0;


    const highest =
        values.length
            ? Math.max(...values)
            : 0;


    grid.innerHTML = \`

        <div class="stat-card">

            <div class="stat-number">
                \${totalCases}
            </div>

            <div class="stat-label">
                Total Cases
            </div>

        </div>


        <div class="stat-card">

            <div class="stat-number">
                \${average}\${metric.unit}
            </div>

            <div class="stat-label">
                Average \${metric.label}
            </div>

        </div>


        <div class="stat-card">

            <div class="stat-number">
                \${highest}\${metric.unit}
            </div>

            <div class="stat-label">
                Highest \${metric.label}
            </div>

        </div>


        <div class="stat-card">

            <div class="stat-number">
                \${Object.keys(districtData).length}
            </div>

            <div class="stat-label">
                Districts
            </div>

        </div>

    \`;

}


/* =========================================================
   TOOLTIP
========================================================= */

function showTooltip(
    event,
    title,
    data,
    subtitle = ""
) {

    const tooltip =
        document.getElementById(
            "tooltip"
        );


    const metric =
        METRICS[currentMetric];


    tooltip.innerHTML = \`

        <strong>\${title}</strong>

        \${
            subtitle
                ? \`<br>
                   <span style="color:#aaa2c4">
                       \${subtitle}
                   </span>\`
                : ""
        }

        <br><br>

        \${metric.label}:
        <strong>
            \${data[currentMetric]}\${metric.unit}
        </strong>

        <br>

        Cases:
        <strong>
            \${data.cases}
        </strong>

        <br>

        Distress:
        <strong>
            \${data.distress}/10
        </strong>

        <br>

        High Risk:
        <strong>
            \${data.highRiskPct}%
        </strong>

        <br>

        Escalation:
        <strong>
            \${data.escalation}%
        </strong>

        <br><br>

        <span style="color:#8b85a8">
            Click for details
        </span>

    \`;


    tooltip.style.display = "block";


    tooltip.style.left =
        (event.clientX + 15) +
        "px";


    tooltip.style.top =
        (event.clientY + 15) +
        "px";

}


function hideTooltip() {

    document
        .getElementById("tooltip")
        .style.display =
        "none";

}


/* =========================================================
   NATIONAL STATE DATA
========================================================= */

function getStateData(state) {

    const base =
        seededValue(
            normalize(
                state +
                currentIssue
            ),
            10,
            65
        );


    return {

        cases: base,

        distress:
            Number(
                (
                    4 +
                    base / 14
                ).toFixed(1)
            ),

        highRiskPct:
            Math.min(
                90,
                base + 15
            ),

        escalation:
            Math.min(
                45,
                Math.round(
                    base * 0.55
                )
            )

    };

}


/* =========================================================
   DRAW INDIA MAP
========================================================= */

function drawIndiaMap() {

    if (!indiaGeo) {

        return;

    }


    selectedDistrict = null;

    renderBreadcrumb();

    updateStats();


    document
        .getElementById("mapTitle")
        .textContent =
        "India — State Distress Map";


    document
        .getElementById("legendHint")
        .textContent =
        "Click a state to drill into districts";


    const svg =
        d3.select("#svgMap");


    svg
        .selectAll("*")
        .remove();


    const width =
        document
            .getElementById("svgMap")
            .clientWidth || 1000;


    const height = 680;


    const projection =
        d3.geoMercator()
            .fitExtent(
                [
                    [30,30],
                    [width - 30, height - 30]
                ],
                indiaGeo
            );


    const path =
        d3.geoPath()
            .projection(
                projection
            );


    const metric =
        METRICS[currentMetric];


    svg
        .selectAll("path")
        .data(
            indiaGeo.features
        )
        .join("path")

        .attr(
            "class",
            "region"
        )

        .attr(
            "d",
            path
        )

        .attr(
            "fill",
            feature => {

                const name =
                    getStateName(
                        feature.properties
                    );


                if (!name) {

                    return "#ffffff";

                }


                const data =
                    getStateData(
                        name
                    );


                return colorForValue(
                    data[currentMetric],
                    metric.max
                );

            }
        )

        .on(
            "mousemove",
            function(event, feature) {

                const name =
                    getStateName(
                        feature.properties
                    );


                if (!name) {

                    return;

                }


                const data =
                    getStateData(
                        name
                    );


                showTooltip(
                    event,
                    name,
                    data
                );

            }
        )

        .on(
            "mouseleave",
            hideTooltip
        )

        .on(
            "click",
            function(event, feature) {

                const name =
                    getStateName(
                        feature.properties
                    );


                if (!name) {

                    return;

                }


                selectedState =
                    name;

                selectedDistrict =
                    null;


                hideTooltip();


                loadStateMap(
                    name
                );

            }
        );


    svg
        .append("text")
        .attr(
            "class",
            "map-title"
        )
        .attr(
            "x",
            width / 2
        )
        .attr(
            "y",
            25
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            "India — State Distress Map"
        );

}


/* =========================================================
   STATE SLUG
========================================================= */

function stateSlug(state) {

    return state
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(
            /^-+|-+$/g,
            ""
        );

}


/* =========================================================
   LOAD STATE MAP
========================================================= */

async function loadStateMap(
    stateName
) {

    selectedState =
        stateName;

    selectedDistrict =
        null;


    renderBreadcrumb();

    updateStats();


    document
        .getElementById("mapTitle")
        .textContent =
        \`\${stateName} — District Distress Map\`;


    document
        .getElementById("legendHint")
        .textContent =
        \`Loading districts of \${stateName}...\`;


    const loading =
        document.getElementById(
            "loadingMsg"
        );


    loading.style.display =
        "flex";


    loading.textContent =
        \`Loading \${stateName} districts...\`;


    try {

        const slug =
            stateSlug(
                stateName
            );


        const url =
            STATE_GEOJSON_BASE +
            slug +
            ".geojson";


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                \`Could not load \${url}\`
            );

        }


        stateGeo =
            await response.json();


        if (
            !stateGeo.features ||
            !stateGeo.features.length
        ) {

            throw new Error(
                "No district features found."
            );

        }


        buildDistrictData(
            stateName,
            stateGeo.features
        );


        loading.style.display =
            "none";


        renderDistrictMap(
            stateName,
            stateGeo
        );


        updateStats();

    }
    catch(error) {

        console.error(error);


        loading.style.display =
            "none";


        showDistrictError(
            stateName,
            error.message
        );

    }

}


/* =========================================================
   RENDER DISTRICT MAP
========================================================= */

function renderDistrictMap(
    stateName,
    geo
) {

    if (!geo) {
        return;
    }


    const svg =
        d3.select("#svgMap");


    svg
        .selectAll("*")
        .remove();


    const width =
        document
            .getElementById("svgMap")
            .clientWidth || 1000;


    const height = 680;


    const projection =
        d3.geoMercator()
            .fitExtent(
                [
                    [35,45],
                    [width - 35, height - 45]
                ],
                geo
            );


    const path =
        d3.geoPath()
            .projection(
                projection
            );


    const metric =
        METRICS[currentMetric];


    svg
        .selectAll("path.region")
        .data(
            geo.features
        )
        .join("path")

        .attr(
            "class",
            "region"
        )

        .attr(
            "d",
            path
        )

        .attr(
            "fill",
            (feature, index) => {

                const name =
                    getDistrictName(
                        feature.properties,
                        index
                    );


                const data =
                    districtData[
                        normalize(name)
                    ];


                if (!data) {

                    return "#ffffff";

                }


                return colorForValue(
                    data[currentMetric],
                    metric.max
                );

            }
        )

        .on(
            "mousemove",
            function(event, feature) {

                const index =
                    geo.features.indexOf(
                        feature
                    );


                const name =
                    getDistrictName(
                        feature.properties,
                        index
                    );


                const data =
                    districtData[
                        normalize(name)
                    ];


                if (!data) {

                    return;

                }


                showTooltip(
                    event,
                    name,
                    data,
                    stateName
                );

            }
        )

        .on(
            "mouseleave",
            hideTooltip
        )

        .on(
            "click",
            function(event, feature) {

                const index =
                    geo.features.indexOf(
                        feature
                    );


                const name =
                    getDistrictName(
                        feature.properties,
                        index
                    );


                const data =
                    districtData[
                        normalize(name)
                    ];


                if (!data) {

                    return;

                }


                selectedDistrict =
                    name;


                hideTooltip();


                renderBreadcrumb();

                updateStats();

            }
        );


    /* DISTRICT LABELS */

    svg
        .selectAll(
            "text.district-label"
        )
        .data(
            geo.features
        )
        .join("text")

        .attr(
            "class",
            "district-label"
        )

        .attr(
            "transform",
            feature => {

                const centroid =
                    path.centroid(
                        feature
                    );


                if (
                    !isFinite(
                        centroid[0]
                    ) ||
                    !isFinite(
                        centroid[1]
                    )
                ) {

                    return "translate(-9999,-9999)";

                }


                return \`translate(
                    \${centroid[0]},
                    \${centroid[1]}
                )\`;

            }
        )

        .attr(
            "text-anchor",
            "middle"
        )

        .text(
            (feature, index) =>
                getDistrictName(
                    feature.properties,
                    index
                )
        );


    /* TITLE */

    svg
        .append("text")
        .attr(
            "class",
            "map-title"
        )
        .attr(
            "x",
            width / 2
        )
        .attr(
            "y",
            25
        )
        .attr(
            "text-anchor",
            "middle"
        )
        .text(
            \`\${stateName} — District Distress Map\`
        );


    /* BACK BUTTON */

    svg
        .append("text")
        .attr(
            "x",
            35
        )
        .attr(
            "y",
            height - 20
        )
        .attr(
            "fill",
            "#b6a9ff"
        )
        .attr(
            "font-size",
            "13px"
        )
        .attr(
            "font-weight",
            "600"
        )
        .attr(
            "cursor",
            "pointer"
        )
        .text(
            "← Back to India"
        )
        .on(
            "click",
            goNational
        );


    document
        .getElementById(
            "legendHint"
        )
        .textContent =
        "Click a district to view details";

}


/* =========================================================
   ERROR
========================================================= */

function showDistrictError(
    stateName,
    message
) {

    const svg =
        d3.select("#svgMap");


    svg
        .selectAll("*")
        .remove();


    document
        .getElementById(
            "legendHint"
        )
        .textContent =
        "Unable to load district boundaries";


    document
        .getElementById(
            "mapTitle"
        )
        .textContent =
        \`\${stateName} — District Map\`;


    svg
        .append("foreignObject")
        .attr(
            "x",
            "5%"
        )
        .attr(
            "y",
            "20%"
        )
        .attr(
            "width",
            "90%"
        )
        .attr(
            "height",
            "250"
        )
        .append("xhtml:div")
        .attr(
            "class",
            "error-box"
        )
        .html(\`

            <h3>
                ⚠️ District map could not be loaded
            </h3>

            <p>
                \${message}
            </p>

            <p>
                Make sure you are connected to the
                internet and refresh the page.
            </p>

        \`);

}


/* =========================================================
   BACK TO INDIA
========================================================= */

function goNational() {

    selectedState = null;

    selectedDistrict = null;

    stateGeo = null;

    districtData = {};


    renderBreadcrumb();

    updateStats();


    document
        .getElementById(
            "mapTitle"
        )
        .textContent =
        "India — State Distress Map";


    document
        .getElementById(
            "legendHint"
        )
        .textContent =
        "Click a state to drill into districts";


    drawIndiaMap();

}


/* =========================================================
   BACK TO STATE
========================================================= */

function backToState() {

    selectedDistrict = null;


    renderBreadcrumb();

    updateStats();


    if (selectedState && stateGeo) {

        renderDistrictMap(
            selectedState,
            stateGeo
        );

    }

}


/* =========================================================
   METRIC CHANGE
========================================================= */

document
    .getElementById(
        "metricSelect"
    )
    .addEventListener(
        "change",
        function(event) {

            currentMetric =
                event.target.value;


            updateStats();


            if (selectedState && stateGeo) {

                renderDistrictMap(
                    selectedState,
                    stateGeo
                );

            }
            else {

                drawIndiaMap();

            }

        }
    );


/* =========================================================
   WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    function() {

        if (selectedState && stateGeo) {

            renderDistrictMap(
                selectedState,
                stateGeo
            );

        }
        else if (indiaGeo) {

            drawIndiaMap();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

async function init() {

    renderIssueChips();

    renderBreadcrumb();

    updateStats();


    const loading =
        document.getElementById(
            "loadingMsg"
        );


    try {

        const response =
            await fetch(
                INDIA_GEOJSON
            );


        if (!response.ok) {

            throw new Error(
                "India GeoJSON could not be loaded."
            );

        }


        indiaGeo =
            await response.json();


        loading.style.display =
            "none";


        drawIndiaMap();

    }
    catch(error) {

        console.error(error);


        loading.innerHTML = \`

            <div class="error-box">

                <h3>
                    ⚠️ Could not load India map
                </h3>

                <p>
                    \${error.message}
                </p>

                <p>
                    Please check your internet connection
                    and reload the page.
                </p>

            </div>

        \`;

    }

}


/* =========================================================
   START
========================================================= */

init();

</script>

</body>
</html>`;
