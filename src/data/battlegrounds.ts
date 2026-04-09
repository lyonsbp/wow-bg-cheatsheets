import type { BGMap } from '../types';
import { ROUTE_ORANGE, ROUTE_YELLOW, ROUTE_GREEN, ROUTE_CYAN, ROUTE_PURPLE } from '../utils/constants';

const O = ROUTE_ORANGE, Y = ROUTE_YELLOW, G = ROUTE_GREEN, C = ROUTE_CYAN, P = ROUTE_PURPLE;

const BGS: BGMap = {

  wsg: {
    name:"Warsong Gulch", short:"WSG", type:"Capture the Flag", size:"10v10", cat:"blitz",
    map:"/maps/wsg.jpg",
    win:"Capture enemy flag 3 times",
    tips:[
      "Tunnel (center) is fastest but riskiest — heavy traffic",
      "Ramp / GY-side exit is ideal for flag carriers with healer",
      "Control midfield to prevent flag returns",
      "Berserking (+30% dmg) in center hut — always grab if up",
      "Speed buff in alcove left of tunnel — key for FC escape",
      "3 attackers + 2 midfield + rest base is a common split",
      "Call FC health & position in /bg chat at all times"
    ],
    graveyards:[
      {n:"Alliance GY",x:16,y:20,f:"alliance"},
      {n:"Horde GY",  x:84,y:80,f:"horde"}
    ],
    powerups:[
      {n:"Speed Buff",    x:30,y:54,t:"speed"},
      {n:"Berserking",    x:63,y:49,t:"berserk"},
      {n:"Restoration",   x:50,y:42,t:"restore"}
    ],
    routes:[
      {n:"Tunnel (Center)",     pts:[[16,57],[50,57],[84,54]], c:Y},
      {n:"Upper Field (Ramp)",  pts:[[16,28],[50,32],[84,36]], c:C},
      {n:"GY Side (Lower)",     pts:[[16,72],[50,66],[84,63]], c:G}
    ],
    objectives:[
      {n:"Alliance Flag Room",x:14,y:13,t:"flag",f:"alliance"},
      {n:"Horde Flag Room",   x:86,y:87,t:"flag",f:"horde"}
    ]
  },

  ab: {
    name:"Arathi Basin", short:"AB", type:"Domination", size:"15v15", cat:"blitz",
    map:"/maps/ab.jpg",
    win:"First to 1,600 resources",
    tips:[
      "Opening rush: Alliance → Stables/Mine, Horde → Farm/Mine",
      "Blacksmith (center) is highest-value — always contest",
      "Lumber Mill is defensively strong (elevated cliffs)",
      "3-cap beats 5-cap — never overextend and drop to 1",
      "Leave at least 1 defender per node",
      "GY at each node keeps your team in the fight",
      "Farm→LM back-cap is a classic momentum swing"
    ],
    graveyards:[
      {n:"Alliance Base",   x:12,y:13,f:"alliance"},
      {n:"Horde Base",      x:88,y:87,f:"horde"},
      {n:"Stables GY",      x:20,y:24,f:"neutral"},
      {n:"Lumber Mill GY",  x:20,y:74,f:"neutral"},
      {n:"Blacksmith GY",   x:50,y:50,f:"neutral"},
      {n:"Gold Mine GY",    x:80,y:24,f:"neutral"},
      {n:"Farm GY",         x:80,y:76,f:"neutral"}
    ],
    powerups:[
      {n:"Blacksmith Buff", x:51,y:50,t:"berserk"},
      {n:"Mine Buff",       x:80,y:22,t:"speed"}
    ],
    routes:[
      {n:"Stables → BS",  pts:[[20,24],[50,50]], c:Y},
      {n:"BS → Farm",     pts:[[50,50],[80,76]], c:Y},
      {n:"BS → Mine",     pts:[[50,50],[80,24]], c:Y},
      {n:"BS → LM",       pts:[[50,50],[20,74]], c:Y},
      {n:"LM → Farm",     pts:[[20,74],[80,76]], c:C},
      {n:"Stables → Mine",pts:[[20,24],[80,24]], c:C}
    ],
    objectives:[
      {n:"Stables",     x:20,y:24,t:"node"},
      {n:"Lumber Mill", x:20,y:74,t:"node"},
      {n:"Blacksmith",  x:50,y:50,t:"node"},
      {n:"Gold Mine",   x:80,y:24,t:"node"},
      {n:"Farm",        x:80,y:76,t:"node"}
    ]
  },

  eots: {
    name:"Eye of the Storm", short:"EotS", type:"Domination + Flag", size:"15v15", cat:"blitz",
    map:"/maps/eots.jpg",
    win:"First to 1,600 points (towers × flag caps)",
    tips:[
      "Flag only scores if your team holds 2 or more towers",
      "3-cap + flag runner = fastest possible win",
      "Mage Tower (NW) is traditionally Alliance-leaning",
      "Blood Elf Tower (SE) is traditionally Horde-leaning",
      "Flag runner should carry to a tower your team controls",
      "Stealthies are strong — can ninja-cap far towers",
      "Mid fights are secondary to tower pressure"
    ],
    graveyards:[
      {n:"Alliance Base",       x:50,y:8, f:"alliance"},
      {n:"Horde Base",          x:50,y:92,f:"horde"},
      {n:"Mage Tower GY",       x:22,y:25,f:"neutral"},
      {n:"Draenei Ruins GY",    x:78,y:25,f:"neutral"},
      {n:"Fel Reaver GY",       x:22,y:75,f:"neutral"},
      {n:"Blood Elf Tower GY",  x:78,y:75,f:"neutral"}
    ],
    powerups:[
      {n:"Speed (NW Path)",    x:34,y:37,t:"speed"},
      {n:"Speed (SE Path)",    x:66,y:63,t:"speed"},
      {n:"Berserking (NE)",    x:64,y:37,t:"berserk"},
      {n:"Berserking (SW)",    x:36,y:63,t:"berserk"}
    ],
    routes:[
      {n:"Alliance → NW",  pts:[[50,8],[22,25]], c:C},
      {n:"Alliance → NE",  pts:[[50,8],[78,25]], c:C},
      {n:"Horde → SW",     pts:[[50,92],[22,75]], c:O},
      {n:"Horde → SE",     pts:[[50,92],[78,75]], c:O},
      {n:"Mid → NW",       pts:[[50,50],[22,25]], c:Y},
      {n:"Mid → NE",       pts:[[50,50],[78,25]], c:Y},
      {n:"Mid → SW",       pts:[[50,50],[22,75]], c:Y},
      {n:"Mid → SE",       pts:[[50,50],[78,75]], c:Y}
    ],
    objectives:[
      {n:"Mage Tower",      x:22,y:25,t:"tower"},
      {n:"Draenei Ruins",   x:78,y:25,t:"tower"},
      {n:"Fel Reaver Ruins",x:22,y:75,t:"tower"},
      {n:"Blood Elf Tower", x:78,y:75,t:"tower"},
      {n:"Flag Spawn",      x:50,y:50,t:"flag",f:"neutral"}
    ]
  },

  bfg: {
    name:"Battle for Gilneas", short:"BfG", type:"Domination", size:"10v10", cat:"blitz",
    map:"/maps/bfg.jpg",
    win:"First to 2,000 resources",
    tips:[
      "UNIQUE: You respawn at your 2nd nearest GY, not nearest!",
      "This GY mechanic can trap enemies — learn to exploit it",
      "Waterworks (center) is the highest-value node to hold",
      "Lighthouse: elevated position, strong for defenders",
      "Mine: typically Horde-favored opening node",
      "Control 2 of 3 nodes and hold — don't overextend",
      "River bridge at Waterworks is the key chokepoint"
    ],
    graveyards:[
      {n:"Alliance Main GY",  x:14,y:12,f:"alliance"},
      {n:"Horde Main GY",     x:86,y:88,f:"horde"},
      {n:"Lighthouse GY",     x:17,y:40,f:"neutral"},
      {n:"Waterworks GY",     x:50,y:55,f:"neutral"},
      {n:"Mine GY",           x:78,y:66,f:"neutral"}
    ],
    powerups:[
      {n:"Speed (Center-W)", x:34,y:50,t:"speed"},
      {n:"Berserking (C-E)", x:63,y:53,t:"berserk"}
    ],
    routes:[
      {n:"Alliance Open",  pts:[[14,12],[17,40],[50,55]], c:C},
      {n:"Horde Open",     pts:[[86,88],[78,66],[50,55]], c:O},
      {n:"LH → WW",        pts:[[17,40],[50,55]], c:Y},
      {n:"WW → Mine",      pts:[[50,55],[78,66]], c:Y},
      {n:"LH → Mine",      pts:[[17,40],[78,66]], c:G}
    ],
    objectives:[
      {n:"Lighthouse",  x:17,y:40,t:"node"},
      {n:"Waterworks",  x:50,y:55,t:"node"},
      {n:"Mine",        x:78,y:66,t:"node"}
    ]
  },

  tp: {
    name:"Twin Peaks", short:"TP", type:"Capture the Flag", size:"10v10", cat:"blitz",
    map:"/maps/tp.jpg",
    win:"Capture enemy flag 3 times",
    tips:[
      "2 graveyards per faction — don't let enemy cap both",
      "River bridge is the main chokepoint — control it",
      "Outpost buffs on each side grant short bonuses",
      "3 base entrances: Front, East, West — vary your route",
      "FC with healer via west entrance avoids the bridge fight",
      "Tunnels in each mountain base allow quick base exit",
      "Mark and CC healers immediately when killing FC"
    ],
    graveyards:[
      {n:"Alliance GY 1 (N)", x:19,y:28,f:"alliance"},
      {n:"Alliance GY 2 (S)", x:19,y:68,f:"alliance"},
      {n:"Horde GY 1 (N)",    x:81,y:32,f:"horde"},
      {n:"Horde GY 2 (S)",    x:81,y:72,f:"horde"}
    ],
    powerups:[
      {n:"Alliance Outpost",  x:31,y:44,t:"speed"},
      {n:"Horde Outpost",     x:69,y:56,t:"speed"}
    ],
    routes:[
      {n:"Bridge (Center)",  pts:[[20,50],[50,50],[80,50]], c:Y},
      {n:"North Pass",       pts:[[20,28],[50,30],[80,32]], c:C},
      {n:"South Pass",       pts:[[20,68],[50,65],[80,72]], c:G}
    ],
    objectives:[
      {n:"Alliance Flag",  x:10,y:50,t:"flag",f:"alliance"},
      {n:"Horde Flag",     x:90,y:50,t:"flag",f:"horde"}
    ]
  },

  sm: {
    name:"Silvershard Mines", short:"SSM", type:"Resource Race", size:"10v10", cat:"blitz",
    map:"/maps/sm.jpg",
    win:"First to 1,600 resources via mine carts",
    tips:[
      "3 carts auto-move along rail tracks — stand near to control",
      "Carts can be redirected at junction switches on the track",
      "3 drop-off points: NW, North, NE — N is most central",
      "Never let all 3 carts go uncontested — split your team",
      "Killing cart escort frees the cart for your team",
      "NW cart track has the most cover — good for healing FCs",
      "Burst down lone defenders quickly then push carts"
    ],
    graveyards:[
      {n:"Alliance GY (N)", x:42,y:10,f:"alliance"},
      {n:"Horde GY (S)",    x:58,y:90,f:"horde"}
    ],
    powerups:[
      {n:"Speed (NW area)",    x:22,y:38,t:"speed"},
      {n:"Berserking (Mid)",   x:50,y:55,t:"berserk"},
      {n:"Speed (NE area)",    x:78,y:38,t:"speed"}
    ],
    routes:[
      {n:"NW Track",  pts:[[50,58],[35,44],[22,30],[12,18]], c:Y},
      {n:"N Track",   pts:[[50,58],[50,38],[50,18]],         c:C},
      {n:"NE Track",  pts:[[50,58],[65,44],[78,30],[88,18]], c:G}
    ],
    objectives:[
      {n:"Cart Spawn",    x:50,y:58,t:"node"},
      {n:"NW Drop-off",   x:12,y:18,t:"node"},
      {n:"North Drop-off",x:50,y:15,t:"node"},
      {n:"NE Drop-off",   x:88,y:18,t:"node"}
    ]
  },

  tok: {
    name:"Temple of Kotmogu", short:"ToK", type:"Orb Control", size:"10v10", cat:"blitz",
    map:"/maps/tok.jpg",
    win:"First to 1,600 points (hold orbs near center)",
    tips:[
      "Orbs score more points the closer they are to the center",
      "Carrying an orb stacks a debuff — you take increasing damage",
      "4 orbs total — holding 2+ gives dominant point rate",
      "Orbs respawn at their pedestal when the carrier dies",
      "Healer on orb carriers = massive sustained point gain",
      "Corner GY assignment can be random — check on death",
      "Force orb carriers into outer plaza to reduce their score"
    ],
    graveyards:[
      {n:"GY NW", x:20,y:18,f:"alliance"},
      {n:"GY NE", x:80,y:18,f:"alliance"},
      {n:"GY SW", x:20,y:82,f:"horde"},
      {n:"GY SE", x:80,y:82,f:"horde"}
    ],
    powerups:[
      {n:"Speed (N)",       x:50,y:20,t:"speed"},
      {n:"Speed (S)",       x:50,y:80,t:"speed"},
      {n:"Berserking (W)",  x:20,y:50,t:"berserk"},
      {n:"Berserking (E)",  x:80,y:50,t:"berserk"}
    ],
    routes:[
      {n:"N → Center",  pts:[[50,20],[50,50]], c:Y},
      {n:"S → Center",  pts:[[50,80],[50,50]], c:Y},
      {n:"W → Center",  pts:[[20,50],[50,50]], c:C},
      {n:"E → Center",  pts:[[80,50],[50,50]], c:C}
    ],
    objectives:[
      {n:"Orb NW Pedestal", x:28,y:30,t:"orb"},
      {n:"Orb NE Pedestal", x:72,y:30,t:"orb"},
      {n:"Orb SW Pedestal", x:28,y:70,t:"orb"},
      {n:"Orb SE Pedestal", x:72,y:70,t:"orb"},
      {n:"Center Score Zone",x:50,y:50,t:"zone"}
    ]
  },

  dg: {
    name:"Deepwind Gorge", short:"DG", type:"Domination", size:"15v15", cat:"blitz",
    map:"/maps/dg.jpg",
    win:"First to 1,500 resources",
    tips:[
      "5-node layout similar to AB — Market (center) = Blacksmith",
      "Alliance opens toward Quarry + Shrine (NW/NE)",
      "Horde opens toward Ruins + Farm (SW/SE)",
      "Market is the most-fought node — control it early",
      "Use ziplines for fast cross-map rotation",
      "3-cap wins — don't spread thin across all 5",
      "Market GY is valuable — respawn puts you back in the action"
    ],
    graveyards:[
      {n:"Alliance Base GY", x:50,y:8, f:"alliance"},
      {n:"Horde Base GY",    x:50,y:92,f:"horde"},
      {n:"Market GY",        x:50,y:36,f:"neutral"},
      {n:"Shrine GY",        x:76,y:28,f:"neutral"},
      {n:"Quarry GY",        x:24,y:28,f:"neutral"},
      {n:"Farm GY",          x:76,y:72,f:"neutral"},
      {n:"Ruins GY",         x:24,y:72,f:"neutral"}
    ],
    powerups:[
      {n:"Market Buff",    x:50,y:38,t:"berserk"},
      {n:"Speed (NE)",     x:66,y:20,t:"speed"},
      {n:"Speed (NW)",     x:34,y:20,t:"speed"}
    ],
    routes:[
      {n:"Alliance → Quarry",  pts:[[50,8],[24,28]],  c:C},
      {n:"Alliance → Shrine",  pts:[[50,8],[76,28]],  c:C},
      {n:"Horde → Ruins",      pts:[[50,92],[24,72]], c:O},
      {n:"Horde → Farm",       pts:[[50,92],[76,72]], c:O},
      {n:"Quarry → Market",    pts:[[24,28],[50,36]], c:Y},
      {n:"Shrine → Market",    pts:[[76,28],[50,36]], c:Y},
      {n:"Ruins → Market",     pts:[[24,72],[50,36]], c:Y},
      {n:"Farm → Market",      pts:[[76,72],[50,36]], c:Y}
    ],
    objectives:[
      {n:"Market", x:50,y:36,t:"node"},
      {n:"Shrine", x:76,y:28,t:"node"},
      {n:"Quarry", x:24,y:28,t:"node"},
      {n:"Farm",   x:76,y:72,t:"node"},
      {n:"Ruins",  x:24,y:72,t:"node"}
    ]
  },

  dhr: {
    name:"Deephaul Ravine", short:"DHR", type:"Payload Hybrid", size:"10v10", cat:"blitz",
    map:null,
    win:"First to 1,500 points (carts + Crystal captures)",
    tips:[
      "NEW in The War Within — two mine carts score passively",
      "Deephaul Crystal spawns in center — carry to your capture point",
      "Carts move on fixed tracks — stand near them to control",
      "Crystal cap is high-risk, high-reward — burst the carrier",
      "Aerial tram above the ravine allows fast repositioning",
      "Split pressure: 3 on carts + 2 contesting crystal is solid",
      "Track both carts — don't let enemy take both uncontested"
    ],
    graveyards:[
      {n:"Alliance GY", x:18,y:20,f:"alliance"},
      {n:"Horde GY",    x:82,y:80,f:"horde"},
      {n:"Mid GY",      x:50,y:50,f:"neutral"}
    ],
    powerups:[
      {n:"Speed (W side)",     x:25,y:50,t:"speed"},
      {n:"Berserking (E side)",x:75,y:50,t:"berserk"}
    ],
    routes:[
      {n:"North Cart Track", pts:[[18,35],[50,25],[82,35]], c:Y},
      {n:"South Cart Track", pts:[[18,65],[50,75],[82,65]], c:C},
      {n:"Aerial Tram",      pts:[[20,15],[50,12],[80,15]], c:P}
    ],
    objectives:[
      {n:"Crystal Spawn",         x:50,y:50,t:"orb"},
      {n:"Alliance Cart Start",   x:20,y:50,t:"node"},
      {n:"Horde Cart Start",      x:80,y:50,t:"node"},
      {n:"Alliance Crystal Cap",  x:15,y:30,t:"node",f:"alliance"},
      {n:"Horde Crystal Cap",     x:85,y:70,t:"node",f:"horde"}
    ]
  },

  ss: {
    name:"Seething Shore", short:"SS", type:"Resource Race", size:"10v10", cat:"blitz",
    map:"/maps/ss.jpg",
    win:"First to 1,500 Azerite resources",
    tips:[
      "3 Azerite nodes active at once — locations vary each match",
      "Nodes respawn at new random positions after being drained",
      "Scout the map at match start — don't just follow the group",
      "Force a teamwipe on an active node = massive swing",
      "Don't tunnel one node; rotate constantly",
      "Keep count: which nodes your team holds vs. enemy",
      "Burst comps dominate here — kill fast and cap"
    ],
    graveyards:[
      {n:"Alliance Start", x:22,y:15,f:"alliance"},
      {n:"Horde Start",    x:78,y:85,f:"horde"}
    ],
    powerups:[
      {n:"Speed (NW)",      x:25,y:35,t:"speed"},
      {n:"Berserking (C)",  x:50,y:50,t:"berserk"},
      {n:"Speed (SE)",      x:75,y:65,t:"speed"}
    ],
    routes:[
      {n:"Main Diagonal",  pts:[[22,15],[50,50],[78,85]], c:Y},
      {n:"West Flank",     pts:[[22,15],[22,65],[50,80]], c:C},
      {n:"East Flank",     pts:[[78,85],[78,35],[50,20]], c:G}
    ],
    objectives:[
      {n:"Node Zone A", x:30,y:35,t:"zone"},
      {n:"Node Zone B", x:65,y:30,t:"zone"},
      {n:"Node Zone C", x:50,y:55,t:"zone"},
      {n:"Node Zone D", x:35,y:65,t:"zone"},
      {n:"Node Zone E", x:70,y:68,t:"zone"}
    ]
  },

  av: {
    name:"Alterac Valley", short:"AV", type:"Epic Battle", size:"40v40", cat:"epic",
    map:"/maps/av.jpg",
    win:"Kill enemy General (Drek'Thar / Vanndar) or deplete reinforcements",
    tips:[
      "Rush past FWGY to deny Horde reinforcements — top priority",
      "Iceblood GY (IBGY) is the most valuable mid-map GY",
      "Destroying towers removes 75 enemy reinforcements each",
      "Don't cap Snowfall GY unless you're planning a full push",
      "West path: backdoor route past IBT into Horde base",
      "Leave IBT standing to prevent GY switch to TP/IB area",
      "With General exposed: send all DPS, ignore everything else"
    ],
    graveyards:[
      {n:"Stormpike GY (SPGY)",    x:28,y:18,f:"alliance"},
      {n:"Stonehearth GY (SHGY)",  x:38,y:36,f:"neutral"},
      {n:"Snowfall GY (SFGY)",     x:50,y:50,f:"neutral"},
      {n:"Iceblood GY (IBGY)",     x:60,y:65,f:"neutral"},
      {n:"Tower Point GY (TPGY)",  x:48,y:60,f:"neutral"},
      {n:"Frostwolf GY (FWGY)",    x:72,y:82,f:"horde"}
    ],
    powerups:[],
    routes:[
      {n:"Alliance Rush (East)",  pts:[[28,18],[38,36],[50,50],[60,65],[72,82]], c:C},
      {n:"Alliance Rush (West)",  pts:[[28,18],[24,40],[26,65],[70,82]],          c:G},
      {n:"Horde Rush",            pts:[[72,82],[60,65],[50,50],[38,36],[28,18]],  c:O}
    ],
    objectives:[
      {n:"Dun Baldar (Alliance Base)", x:25,y:10,t:"base",f:"alliance"},
      {n:"Frostwolf Keep (Horde Base)",x:75,y:90,t:"base",f:"horde"},
      {n:"Stonehearth Bunker",         x:35,y:30,t:"tower",f:"alliance"},
      {n:"Icewing Bunker",             x:24,y:38,t:"tower",f:"alliance"},
      {n:"Iceblood Tower (IBT)",       x:56,y:62,t:"tower",f:"horde"},
      {n:"Tower Point (TP)",           x:44,y:58,t:"tower",f:"horde"},
      {n:"Frostwolf E Tower",          x:66,y:78,t:"tower",f:"horde"},
      {n:"Frostwolf W Tower",          x:60,y:80,t:"tower",f:"horde"}
    ]
  },

  ioc: {
    name:"Isle of Conquest", short:"IoC", type:"Epic Siege", size:"40v40", cat:"epic",
    map:"/maps/ioc.jpg",
    win:"Breach enemy keep and kill their General",
    tips:[
      "Workshop = siege vehicles (Glaives/Demolishers) — top priority",
      "Glaive Throwers destroy keep walls from range",
      "Catapults at Docks can launch players directly over walls",
      "Hangar gives airship — bypass walls entirely, land on roof",
      "Refinery + Quarry each give periodic reinforcement bonuses",
      "Workshop GY is central — hold it to respawn near action",
      "General is exposed once walls are down — pile on fast"
    ],
    graveyards:[
      {n:"Alliance Keep GY",   x:22,y:18,f:"alliance"},
      {n:"Horde Keep GY",      x:78,y:82,f:"horde"},
      {n:"Docks GY",           x:12,y:55,f:"neutral"},
      {n:"Hangar GY",          x:78,y:22,f:"neutral"},
      {n:"Workshop GY",        x:50,y:50,f:"neutral"},
      {n:"Refinery GY",        x:82,y:38,f:"neutral"},
      {n:"Quarry GY",          x:78,y:62,f:"neutral"}
    ],
    powerups:[],
    routes:[
      {n:"Alliance → Workshop", pts:[[22,18],[50,50]],         c:C},
      {n:"Horde → Workshop",    pts:[[78,82],[50,50]],         c:O},
      {n:"Docks Route (W)",     pts:[[22,18],[12,55],[50,50]], c:Y},
      {n:"Hangar Route (N)",    pts:[[22,18],[78,22],[78,82]], c:G},
      {n:"Workshop → Horde",    pts:[[50,50],[78,82]],         c:Y}
    ],
    objectives:[
      {n:"Alliance Keep",    x:18,y:12,t:"base",f:"alliance"},
      {n:"Horde Keep",       x:82,y:88,t:"base",f:"horde"},
      {n:"Docks",            x:12,y:55,t:"node"},
      {n:"Airship Hangar",   x:78,y:22,t:"node"},
      {n:"Siege Workshop",   x:50,y:50,t:"node"},
      {n:"Refinery",         x:82,y:38,t:"node"},
      {n:"Quarry",           x:78,y:62,t:"node"}
    ]
  },

  sr: {
    name:"Slayer's Rise", short:"SR", type:"Epic Battle (NEW)", size:"40v40", cat:"epic",
    map:null,
    win:"Defeat enemy Domanaar boss (Vidious or Ziadan)",
    tips:[
      "NEW in Midnight — set in the Voidstorm zone of Quel'Thalas",
      "Control all 3 Void Posts: +5% damage, +10% honor bonus",
      "Black Holes grant 'Take Flight' — use for aerial traversal",
      "Shenzar Refinery GY is the main neutral graveyard",
      "Bastion GY unlocks when your team captures their base",
      "Recruit neutral NPCs scattered across the map",
      "Kill enemy Domanaar (Vidious/Ziadan) to win — push hard once their outer defenses fall"
    ],
    graveyards:[
      {n:"Shenzar Refinery GY",       x:50,y:50,f:"neutral"},
      {n:"Bastion GY (if captured)",  x:50,y:30,f:"neutral"},
      {n:"Alliance Start",            x:25,y:75,f:"alliance"},
      {n:"Horde Start",               x:75,y:25,f:"horde"}
    ],
    powerups:[
      {n:"Void Post (N of Hate Spire)",    x:28,y:28,t:"berserk"},
      {n:"Void Post (E of Master's Perch)",x:65,y:50,t:"berserk"},
      {n:"Void Post (N of Grief Spire)",   x:72,y:28,t:"berserk"},
      {n:"Black Hole (Take Flight) 1",     x:40,y:45,t:"speed"},
      {n:"Black Hole (Take Flight) 2",     x:60,y:55,t:"speed"}
    ],
    routes:[
      {n:"Path of Predation (Main)",  pts:[[25,75],[50,50],[75,25]], c:Y},
      {n:"West Flank",                pts:[[25,75],[15,50],[25,25]], c:C},
      {n:"East Flank",                pts:[[75,25],[85,50],[75,75]], c:O}
    ],
    objectives:[
      {n:"Hate Spire (Alliance Boss)",  x:22,y:28,t:"base",f:"alliance"},
      {n:"Grief Spire (Horde Boss)",    x:78,y:72,t:"base",f:"horde"},
      {n:"Master's Perch (Mid)",        x:50,y:50,t:"node"},
      {n:"Void Post (NW)",              x:28,y:28,t:"tower"},
      {n:"Void Post (E)",               x:65,y:50,t:"tower"},
      {n:"Void Post (NE)",              x:72,y:28,t:"tower"}
    ]
  }
};

export default BGS;
