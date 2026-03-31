import { useState, useRef, useEffect } from "react";

// ─── COLOUR SYSTEM ────────────────────────────────────────────────────────────
const G = {
  bg: "#f5f4f0", white: "#ffffff", border: "#e4e2dc", borderMid: "#ccc9c0",
  text: "#18180f", textMuted: "#5c5b52", textLight: "#9e9d94",
  green: "#1a472a", greenLight: "#edf5ee", greenMid: "#b8d4bc",
  amber: "#8a4d0c", amberLight: "#fef4e4", amberMid: "#f5c97a",
  red: "#7d1f1f", redLight: "#fdf0f0", redMid: "#f0a0a0",
  blue: "#173a5c", blueLight: "#edf2fa", blueMid: "#a8c0dc",
  purple: "#3b1f6e", purpleLight: "#f2effe", purpleMid: "#c0a8ec",
  teal: "#0f4c4c", tealLight: "#eaf5f5",
};

const STATUS_CFG = {
  "New Lead":    { color: G.blue,    bg: G.blueLight,  dot: "#2563eb" },
  "Booked":      { color: G.amber,   bg: G.amberLight, dot: "#d97706" },
  "In Progress": { color: G.green,   bg: G.greenLight, dot: "#16a34a" },
  "Completed":   { color: "#374151", bg: "#f3f4f6",    dot: "#6b7280" },
  "Invoiced":    { color: G.red,     bg: G.redLight,   dot: "#dc2626" },
  "Overdue":     { color: G.red,     bg: G.redLight,   dot: "#dc2626" },
  "Cancelled":   { color: "#6b7280", bg: "#f3f4f6",    dot: "#9ca3af" },
  "No Response": { color: G.amber,   bg: G.amberLight, dot: "#d97706" },
};

const URGENCY_CFG = {
  "Emergency": { color: G.red,       bg: G.redLight   },
  "High":      { color: G.amber,     bg: G.amberLight },
  "Normal":    { color: G.green,     bg: G.greenLight },
  "Low":       { color: G.textMuted, bg: "#f3f4f6"    },
};

const TIMELINE_COLORS = {
  lead: "#2563eb", os: G.green, booked: "#7c3aed",
  comms: "#0891b2", complete: "#16a34a", invoice: G.amber,
  paid: G.green, flag: G.red, cancelled: "#6b7280",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CUSTOMERS = [
  { id:"c1",  name:"Sandra Okafor",               phone:"647-882-3341", email:"sandra.okafor@gmail.com",  address:"44 Birchwood Ave, Scarborough, ON M1K 2P3",        type:"residential" },
  { id:"c2",  name:"David Park",                  phone:"416-554-7821", email:"dpark@outlook.com",         address:"312 Royal York Rd Unit 4B, Etobicoke, ON M8Y 2T5",type:"residential" },
  { id:"c3",  name:"Parkway Grill (Marcus Webb)", phone:"416-901-2234", email:"marcus@parkwaygrill.ca",    address:"88 King St W, Toronto, ON M5H 1J4",               type:"commercial"  },
  { id:"c4",  name:"Linda Tremblay",              phone:"905-443-8812", email:"ltremblay@hotmail.com",     address:"19 Elmwood Cres, North York, ON M3A 1B6",         type:"residential" },
  { id:"c5",  name:"Raymond Xu",                  phone:"647-221-5509", email:"raymond.xu@gmail.com",      address:"77 Sheppard Ave E #902, Toronto, ON M2N 6S3",     type:"residential" },
  { id:"c6",  name:"Stephanie Noel",              phone:"416-778-4423", email:"snoel@live.ca",             address:"5 Glenwood Ave, East York, ON M4E 2K7",           type:"residential" },
  { id:"c7",  name:"Halton Property Mgmt",        phone:"905-334-1190", email:"ops@haltonpm.ca",           address:"Multiple units — Mississauga portfolio",          type:"commercial"  },
  { id:"c8",  name:"James Kowalski",              phone:"416-223-8871", email:"jkowalski@gmail.com",       address:"202 Brimley Rd, Scarborough, ON M1P 3B7",         type:"residential" },
  { id:"c9",  name:"Aisha Mensah",                phone:"647-554-2210", email:"aisha.mensah@hotmail.com",  address:"55 Dufferin St, Toronto, ON M6K 2B6",             type:"residential" },
  { id:"c10", name:"Sunrise Daycare",             phone:"905-664-9981", email:"admin@sunrisedaycare.ca",   address:"12 Sunrise Blvd, Brampton, ON L6T 2P4",           type:"commercial"  },
];

const TECHNICIANS = [
  { id:"daniel", name:"Daniel", license:"ON-4821", color: G.green  },
  { id:"bruce",  name:"Bruce",  license:"ON-3190", color: G.blue   },
  { id:"maria",  name:"Maria",  license:"ON-5512", color: "#7c3aed"},
];

const JOBS = [
  // J-1039: Completed + Paid (commercial) — Maria
  {
    id:"J-1039", customerId:"c7", pestType:"Rodents", tech:"Maria", status:"Completed", urgency:"Normal",
    date:"2026-03-24", time:"9:00 AM", price:580, paid:true, paymentMethod:"Invoice (net 7)",
    notes:"3-unit Mississauga portfolio inspection. Entry points sealed. Monthly contract signed.",
    conversation:[
      { from:"customer", time:"Mar 22, 11:00 AM", msg:"Hi, we manage a residential portfolio in Mississauga and need regular pest inspections with documentation across multiple units. Can you handle commercial accounts?" },
      { from:"os",       time:"Mar 22, 11:00 AM", msg:"Hi! Yes, commercial and multi-unit accounts are something we specialize in, with full documentation for every visit. To get started, could I get your name, the property address, and the best email for sending confirmations?" },
      { from:"customer", time:"Mar 22, 11:08 AM", msg:"Marcus Webb. ops@haltonpm.ca. Multiple units across Mississauga — main office is 880 Pacific Rd, Oakville." },
      { from:"os",       time:"Mar 22, 11:09 AM", msg:"Thanks Marcus. I'd like to get Maria out for an initial walkthrough of your Mississauga properties and set up a monthly program from there. What works best for your schedule this week?" },
      { from:"customer", time:"Mar 22, 1:30 PM",  msg:"Tuesday March 24 morning works. Can you do 9am?" },
      { from:"os",       time:"Mar 22, 1:31 PM",  msg:"Maria is confirmed for Tuesday March 24 at 9:00 AM. Confirmation sent to ops@haltonpm.ca. Looking forward to it." },
      { from:"os",       time:"Mar 24, 8:00 AM",  msg:"Good morning Marcus — Maria is on her way to your Mississauga properties. ETA 9:00 AM." },
      { from:"os",       time:"Mar 24, 11:45 AM", msg:"Maria has completed the 3-unit inspection. Invoice #1039 for $580.00 (net 7) has been sent to ops@haltonpm.ca. A monthly prevention contract proposal is attached — let us know if you'd like to discuss." },
    ],
    timeline:[
      { time:"Mar 22, 11:00 AM", event:"Lead received",        detail:"Inbound email — commercial multi-unit inquiry", type:"lead" },
      { time:"Mar 22, 11:00 AM", event:"OS responded",         detail:"Intake started — name, address, email requested", type:"os" },
      { time:"Mar 22, 11:09 AM", event:"Info collected",       detail:"All details gathered — booking initiated", type:"os" },
      { time:"Mar 22, 1:31 PM",  event:"Job booked",           detail:"Maria assigned, Mar 24 9:00 AM confirmed", type:"booked" },
      { time:"Mar 22, 1:31 PM",  event:"Confirmation sent",    detail:"Sent to ops@haltonpm.ca", type:"comms" },
      { time:"Mar 24, 8:00 AM",  event:"Day-of reminder sent", detail:"ETA notification sent", type:"comms" },
      { time:"Mar 24, 11:30 AM", event:"Job completed",        detail:"Maria — 3-unit inspection complete", type:"complete" },
      { time:"Mar 24, 11:30 AM", event:"Invoice sent",         detail:"Invoice #1039 — $580.00 net 7", type:"invoice" },
      { time:"Mar 25, 9:00 AM",  event:"Payment received",     detail:"Invoice paid — $580.00", type:"paid" },
    ],
    complianceRecord:{ date:"2026-03-24", tech:"Maria", license:"ON-5512", pest:"Rodents", product:"Contrac Blox", units:"3", area:"Mississauga portfolio", notes:"Entry points sealed at all units. Bait stations installed in utility rooms." }
  },

  // J-1040: Completed + Paid (routine) — Bruce
  {
    id:"J-1040", customerId:"c6", pestType:"Cockroaches", tech:"Bruce", status:"Completed", urgency:"Normal",
    date:"2026-03-25", time:"1:00 PM", price:160, paid:true, paymentMethod:"Credit card",
    notes:"Cockroaches in kitchen, treated baseboards and under appliances.",
    conversation:[
      { from:"customer", time:"Mar 19, 9:00 AM", msg:"Hi, we've been seeing cockroaches in our kitchen for about a week now. A few in the mornings. How much do you charge?" },
      { from:"os",       time:"Mar 19, 9:00 AM", msg:"Hi! For a standard cockroach treatment, pricing is typically $140–$180 depending on the size of the space. To get you a firm quote and booked in, could I get your name, address, and the best phone or email for your confirmation?" },
      { from:"customer", time:"Mar 19, 9:06 AM", msg:"Stephanie Noel. 5 Glenwood Ave, East York. 416-778-4423, snoel@live.ca" },
      { from:"os",       time:"Mar 19, 9:07 AM", msg:"Thanks Stephanie. For your East York home we're looking at $160 all in. Bruce can come out this week — Thursday or Friday afternoon work for you?" },
      { from:"customer", time:"Mar 19, 9:15 AM", msg:"Tuesday the 25th works actually." },
      { from:"os",       time:"Mar 19, 9:16 AM", msg:"Done — Bruce is confirmed for Tuesday March 25 at 1:00 PM. Confirmation sent to snoel@live.ca. See you then." },
      { from:"os",       time:"Mar 24, 6:00 PM", msg:"Reminder: Bruce is coming tomorrow at 1:00 PM. No prep needed on your end." },
      { from:"os",       time:"Mar 25, 12:30 PM",msg:"Bruce is about 30 minutes away." },
      { from:"os",       time:"Mar 25, 3:00 PM", msg:"Bruce has finished your cockroach treatment. Invoice #1040 for $160.00 has been sent. Thanks for choosing us — a Google review would mean a lot if you have a minute." },
    ],
    timeline:[
      { time:"Mar 19, 9:00 AM", event:"Lead received",        detail:"Inbound web form", type:"lead" },
      { time:"Mar 19, 9:00 AM", event:"OS responded",         detail:"Pricing provided, intake started", type:"os" },
      { time:"Mar 19, 9:07 AM", event:"Info collected",       detail:"All details gathered — booking initiated", type:"os" },
      { time:"Mar 19, 9:16 AM", event:"Job booked",           detail:"Bruce assigned, Mar 25 1:00 PM", type:"booked" },
      { time:"Mar 19, 9:16 AM", event:"Confirmation sent",    detail:"Sent to snoel@live.ca", type:"comms" },
      { time:"Mar 24, 6:00 PM", event:"Reminder sent",        detail:"24h reminder sent", type:"comms" },
      { time:"Mar 25, 12:30 PM",event:"Day-of ETA sent",      detail:"ETA notification sent", type:"comms" },
      { time:"Mar 25, 2:45 PM", event:"Job completed",        detail:"Bruce marked complete", type:"complete" },
      { time:"Mar 25, 2:45 PM", event:"Invoice sent",         detail:"Invoice #1040 — $160.00", type:"invoice" },
      { time:"Mar 25, 4:30 PM", event:"Payment received",     detail:"Credit card — $160.00 collected", type:"paid" },
      { time:"Mar 25, 4:31 PM", event:"Review request sent",  detail:"Follow-up + review request sent", type:"comms" },
    ],
    complianceRecord:{ date:"2026-03-25", tech:"Bruce", license:"ON-3190", pest:"Cockroaches", product:"Maxforce FC Magnum", units:"1", area:"Kitchen — baseboards and under appliances", notes:"Treatment applied to kitchen perimeter. Follow-up recommended in 30 days." }
  },

  // J-1041: Overdue invoice — Bruce — net 7, service Mar 10 so now 18 days out
  {
    id:"J-1041", customerId:"c4", pestType:"Mice", tech:"Bruce", status:"Overdue", urgency:"Normal",
    date:"2026-03-10", time:"11:00 AM", price:185, paid:false, paymentMethod:"Credit card",
    notes:"Scratching in walls, droppings in pantry. Bruce set bait stations. Invoice net 7 — now 18 days overdue. OS sent follow-ups at 7 and 10 days. Flagged for owner action.",
    humanFlag:{ type:"owner", msg:"Invoice #1041 is 18 days overdue. Automated follow-ups sent at 7 and 10 days with no response. Recommend a direct call to Linda Tremblay at 905-443-8812.", flaggedAt:"Mar 28, 8:00 AM" },
    conversation:[
      { from:"customer", time:"Mar 7, 7:30 PM",  msg:"Hi, I've been hearing scratching in my walls at night and found some droppings in my pantry. I think I might have mice. How much would that cost?" },
      { from:"os",       time:"Mar 7, 7:30 PM",  msg:"Hi! Scratching in walls and droppings are classic signs of mice — very treatable. For a standard residential treatment we're typically looking at $160–$210 depending on what we find. To get you booked and send over a firm quote, could I get your name, address, and best contact info?" },
      { from:"customer", time:"Mar 7, 7:42 PM",  msg:"Linda Tremblay. 19 Elmwood Cres, North York. 905-443-8812, ltremblay@hotmail.com" },
      { from:"os",       time:"Mar 7, 7:43 PM",  msg:"Thanks Linda. For your North York home we're looking at $185 all in. Bruce can come out Monday or Tuesday — which works better?" },
      { from:"customer", time:"Mar 7, 7:46 PM",  msg:"Monday works!" },
      { from:"os",       time:"Mar 7, 7:47 PM",  msg:"Bruce is confirmed for Monday March 10 at 11:00 AM. Confirmation sent to ltremblay@hotmail.com. See you Monday." },
      { from:"os",       time:"Mar 9, 6:00 PM",  msg:"Reminder: Bruce is coming tomorrow at 11:00 AM." },
      { from:"os",       time:"Mar 10, 10:30 AM",msg:"Bruce is about 30 minutes away." },
      { from:"os",       time:"Mar 10, 12:45 PM",msg:"Bruce has finished your mice treatment. Invoice #1041 for $185.00 has been sent to ltremblay@hotmail.com. Payment is due within 7 days." },
      { from:"os",       time:"Mar 17, 9:00 AM", msg:"Hi Linda — just a reminder that invoice #1041 for $185.00 is now due. You can pay using the link in your invoice email. Let us know if you have any questions." },
      { from:"os",       time:"Mar 20, 9:00 AM", msg:"Hi Linda — following up again on invoice #1041 for $185.00, now 10 days past due. Please use the link in your invoice email to settle this at your earliest convenience." },
    ],
    timeline:[
      { time:"Mar 7, 7:30 PM",  event:"Lead received",         detail:"Inbound web form", type:"lead" },
      { time:"Mar 7, 7:30 PM",  event:"OS responded",          detail:"Pricing provided, intake started", type:"os" },
      { time:"Mar 7, 7:47 PM",  event:"Job booked",            detail:"Bruce assigned, Mar 10 11:00 AM confirmed", type:"booked" },
      { time:"Mar 10, 12:30 PM",event:"Job completed",         detail:"Bruce marked complete", type:"complete" },
      { time:"Mar 10, 12:30 PM",event:"Invoice sent",          detail:"Invoice #1041 — $185.00. Due Mar 17.", type:"invoice" },
      { time:"Mar 17, 9:00 AM", event:"7-day follow-up sent",  detail:"Automated payment reminder sent", type:"comms" },
      { time:"Mar 20, 9:00 AM", event:"10-day follow-up sent", detail:"Second automated reminder sent", type:"comms" },
      { time:"Mar 28, 8:00 AM", event:"⚠️ Flagged to owner",   detail:"18 days overdue — owner action required", type:"flag" },
    ],
    complianceRecord:{ date:"2026-03-10", tech:"Bruce", license:"ON-3190", pest:"Mice", product:"Contrac Blox", units:"1", area:"Kitchen walls, pantry area", notes:"Bait stations placed at 4 locations. Entry point at utility gap behind stove — sealed." }
  },

  // J-1042: Completed + Paid (emergency) — Daniel
  {
    id:"J-1042", customerId:"c1", pestType:"Mice", tech:"Daniel", status:"Completed", urgency:"Emergency",
    date:"2026-03-26", time:"9:00 AM", price:210, paid:true, paymentMethod:"Credit card",
    notes:"Active infestation, newborn at home. Emergency same-day dispatch. Entry point sealed at utility gap behind fridge.",
    conversation:[
      { from:"customer", time:"Mar 25, 8:14 PM", msg:"Hi I found mice droppings all over my kitchen this morning and I have a newborn at home. This is a serious health issue, I need someone TODAY." },
      { from:"os",       time:"Mar 25, 8:14 PM", msg:"Hi — understood, we'll treat this as a priority. We can have Daniel at your place first thing tomorrow at 9:00 AM. Could you give me your name, address, and best phone or email so I can confirm the booking right now?" },
      { from:"customer", time:"Mar 25, 8:20 PM", msg:"Sandra Okafor. 44 Birchwood Ave Scarborough. 647-882-3341, sandra.okafor@gmail.com" },
      { from:"os",       time:"Mar 25, 8:21 PM", msg:"Confirmed — Daniel will be at 44 Birchwood Ave tomorrow at 9:00 AM. Confirmation sent to sandra.okafor@gmail.com. In the meantime, keep food sealed and avoid disturbing the droppings." },
      { from:"os",       time:"Mar 26, 8:00 AM", msg:"Good morning Sandra — Daniel is on his way. ETA 9:00 AM." },
      { from:"os",       time:"Mar 26, 11:00 AM",msg:"Daniel has completed your mice treatment. The entry point behind the fridge has been sealed and bait stations are in place. Invoice #1042 for $210.00 has been sent. Let us know if you notice anything over the next few days." },
    ],
    timeline:[
      { time:"Mar 25, 8:14 PM", event:"Lead received",        detail:"Emergency inbound — web form", type:"lead" },
      { time:"Mar 25, 8:14 PM", event:"OS responded",         detail:"Emergency response — name, address, contact requested", type:"os" },
      { time:"Mar 25, 8:21 PM", event:"Emergency job booked", detail:"Daniel assigned, Mar 26 9:00 AM — priority booking", type:"booked" },
      { time:"Mar 26, 8:00 AM", event:"Day-of ETA sent",      detail:"Daniel on his way", type:"comms" },
      { time:"Mar 26, 10:45 AM",event:"Job completed",        detail:"Daniel marked complete — entry point sealed", type:"complete" },
      { time:"Mar 26, 10:45 AM",event:"Invoice sent",         detail:"Invoice #1042 — $210.00", type:"invoice" },
      { time:"Mar 26, 3:00 PM", event:"Payment received",     detail:"Credit card — $210.00 collected", type:"paid" },
    ],
    complianceRecord:{ date:"2026-03-26", tech:"Daniel", license:"ON-4821", pest:"Mice", product:"Contrac Blox", units:"1", area:"Kitchen — behind fridge, utility gap", notes:"Entry point sealed. 3 bait stations placed. Emergency booking — newborn in home." }
  },

  // J-1043: Booked (upcoming) — Bruce
  {
    id:"J-1043", customerId:"c2", pestType:"Cockroaches", tech:"Bruce", status:"Booked", urgency:"Normal",
    date:"2026-03-31", time:"2:00 PM", price:175, paid:false, paymentMethod:"Credit card",
    notes:"Cockroach sighting in bathroom. Unit 4B. Job scheduled for tomorrow.",
    conversation:[
      { from:"customer", time:"Mar 27, 11:02 AM", msg:"Hey do you guys deal with cockroaches? Found a couple in my bathroom over the last few days. What do you charge?" },
      { from:"os",       time:"Mar 27, 11:02 AM", msg:"Hey! Yes, cockroach treatment is something we do regularly. For a condo or apartment unit, pricing is typically $150–$185 all in. To get you a firm number and booked, could I get your name, address, and best contact info?" },
      { from:"customer", time:"Mar 27, 11:09 AM", msg:"David Park. 312 Royal York Rd Unit 4B, Etobicoke. 416-554-7821, dpark@outlook.com" },
      { from:"os",       time:"Mar 27, 11:10 AM", msg:"Thanks David. For your Etobicoke unit we're at $175 all in. Bruce can come Monday afternoon — does 2:00 PM work?" },
      { from:"customer", time:"Mar 27, 11:20 AM", msg:"Monday works great." },
      { from:"os",       time:"Mar 27, 11:21 AM", msg:"Bruce is confirmed for Monday March 31 at 2:00 PM at 312 Royal York Rd Unit 4B. Confirmation sent to dpark@outlook.com. See you Monday." },
      { from:"os",       time:"Mar 30, 6:00 PM",  msg:"Reminder: Bruce is coming tomorrow at 2:00 PM. Nothing special needed on your end." },
    ],
    timeline:[
      { time:"Mar 27, 11:02 AM", event:"Lead received",       detail:"Inbound web form", type:"lead" },
      { time:"Mar 27, 11:02 AM", event:"OS responded",        detail:"Pricing provided, intake started", type:"os" },
      { time:"Mar 27, 11:10 AM", event:"Info collected",      detail:"All details gathered — booking initiated", type:"os" },
      { time:"Mar 27, 11:21 AM", event:"Job booked",          detail:"Bruce assigned, Mar 31 2:00 PM confirmed", type:"booked" },
      { time:"Mar 27, 11:21 AM", event:"Confirmation sent",   detail:"Sent to dpark@outlook.com", type:"comms" },
      { time:"Mar 30, 6:00 PM",  event:"24h reminder sent",   detail:"Reminder sent to customer", type:"comms" },
    ],
  },

  // J-1044: In Progress (commercial) — Daniel
  {
    id:"J-1044", customerId:"c3", pestType:"Rodents", tech:"Daniel", status:"In Progress", urgency:"High",
    date:"2026-03-30", time:"10:00 AM", price:395, paid:false, paymentMethod:"Invoice (net 7)",
    notes:"Commercial kitchen — rodent activity near dry storage. Daniel on site now. Monthly contract discussed.",
    conversation:[
      { from:"customer", time:"Mar 26, 3:45 PM", msg:"Hello, I manage a restaurant downtown and we've been seeing rodent activity near our storage. We need someone who can come regularly and keep documentation for health inspections. What are your rates?" },
      { from:"os",       time:"Mar 26, 3:45 PM", msg:"Hello! Commercial kitchen inspections with health documentation are something we specialize in. For an initial assessment and treatment, commercial jobs typically run $300–$450 depending on scope, with monthly contracts available at a reduced rate. To get you booked, could I get your name, the restaurant address, and best contact info?" },
      { from:"customer", time:"Mar 26, 3:55 PM", msg:"Marcus Webb. Parkway Grill, 88 King St W Toronto. 416-901-2234, marcus@parkwaygrill.ca" },
      { from:"os",       time:"Mar 26, 3:56 PM", msg:"Thanks Marcus. For an initial assessment and treatment we'd be at $395. Daniel can come Saturday March 30 at 10:00 AM — does that work?" },
      { from:"customer", time:"Mar 26, 4:10 PM", msg:"Saturday works. 10am is fine." },
      { from:"os",       time:"Mar 26, 4:11 PM", msg:"Daniel is confirmed for Saturday March 30 at 10:00 AM. Confirmation sent to marcus@parkwaygrill.ca. Please make sure the storage area is accessible." },
      { from:"os",       time:"Mar 29, 6:00 PM", msg:"Reminder: Daniel is coming to Parkway Grill tomorrow at 10:00 AM. Please have the storage area accessible." },
      { from:"os",       time:"Mar 30, 9:30 AM", msg:"Daniel is on his way — ETA 10:00 AM." },
    ],
    timeline:[
      { time:"Mar 26, 3:45 PM", event:"Lead received",        detail:"Inbound email — commercial kitchen", type:"lead" },
      { time:"Mar 26, 3:45 PM", event:"OS responded",         detail:"Pricing provided, intake started", type:"os" },
      { time:"Mar 26, 3:56 PM", event:"Info collected",       detail:"All details gathered — booking initiated", type:"os" },
      { time:"Mar 26, 4:11 PM", event:"Job booked",           detail:"Daniel assigned, Mar 30 10:00 AM", type:"booked" },
      { time:"Mar 29, 6:00 PM", event:"24h reminder sent",    detail:"Reminder sent with storage access note", type:"comms" },
      { time:"Mar 30, 9:30 AM", event:"Day-of ETA sent",      detail:"Daniel on his way", type:"comms" },
      { time:"Mar 30, 10:05 AM",event:"Daniel on site",       detail:"Job in progress", type:"complete" },
    ],
  },

  // J-1045: New Lead — Bed Bugs — Daniel (address not yet collected)
  {
    id:"J-1045", customerId:"c5", pestType:"Bed Bugs", tech:"Daniel", status:"New Lead", urgency:"High",
    date:null, time:null, price:420, paid:false, paymentMethod:null,
    addressCollected: false,
    notes:"Suspected bed bugs. OS has name and email but still needs phone and unit number.",
    conversation:[
      { from:"customer", time:"Mar 28, 7:18 AM", msg:"I woke up this morning with bites on my arms and I think it might be bed bugs. I'm in a condo on Sheppard. What do I do?" },
      { from:"os",       time:"Mar 28, 7:18 AM", msg:"Hi — bed bugs are stressful but very treatable. We can get Daniel out to you quickly. Could I get your name, full unit address, and best phone number so I can get this booked right away?" },
      { from:"customer", time:"Mar 28, 7:24 AM", msg:"Raymond Xu. raymond.xu@gmail.com — I'll grab my unit number and get back to you." },
      { from:"os",       time:"Mar 29, 9:00 AM", msg:"Hi Raymond — just following up. Still need your unit number at Sheppard and a phone number. Bed bugs move fast, so the sooner we can get Daniel in, the better." },
    ],
    timeline:[
      { time:"Mar 28, 7:18 AM", event:"Lead received",          detail:"Inbound web form — bed bugs", type:"lead" },
      { time:"Mar 28, 7:18 AM", event:"OS responded",           detail:"Name, address, phone requested in one message", type:"os" },
      { time:"Mar 28, 7:24 AM", event:"Partial info received",  detail:"Name + email only. Address + phone outstanding.", type:"os" },
      { time:"Mar 29, 9:00 AM", event:"Follow-up sent",         detail:"24h follow-up — awaiting address + phone", type:"comms" },
    ],
  },

  // J-1046: No Response — cold lead
  {
    id:"J-1046", customerId:"c8", pestType:"Wasps", tech:null, status:"No Response", urgency:"Low",
    date:null, time:null, price:145, paid:false, paymentMethod:null,
    humanFlag:{ type:"owner", msg:"J-1046 (James Kowalski) has not responded after 2 follow-ups over 5 days. Lead is likely cold. Your call on whether to try once more directly.", flaggedAt:"Mar 28, 8:00 AM" },
    notes:"Customer inquired about wasp nest removal. OS responded and followed up twice. No reply in 5 days.",
    conversation:[
      { from:"customer", time:"Mar 23, 2:00 PM", msg:"Hey, I've got a wasp nest under my deck. How much does removal cost and how soon can you come?" },
      { from:"os",       time:"Mar 23, 2:00 PM", msg:"Hi James! Wasp nest removal under a deck is typically $130–160 depending on nest size. We can usually get someone out within a day or two. Could I get your address and a good phone number so I can get something booked?" },
      { from:"os",       time:"Mar 25, 9:00 AM", msg:"Hi James — just following up on your wasp nest inquiry. We still have availability this week. Let me know if you'd like to move forward." },
    ],
    timeline:[
      { time:"Mar 23, 2:00 PM", event:"Lead received",        detail:"Inbound text message", type:"lead" },
      { time:"Mar 23, 2:00 PM", event:"OS responded",         detail:"Pricing provided, address requested", type:"os" },
      { time:"Mar 25, 9:00 AM", event:"Follow-up #1 sent",    detail:"48h follow-up — no response", type:"comms" },
      { time:"Mar 28, 8:00 AM", event:"Flagged to owner",     detail:"Lead cold after 5 days — owner notified", type:"flag" },
    ],
  },

  // J-1047: Technician no-show — Bruce
  {
    id:"J-1047", customerId:"c9", pestType:"Ants", tech:"Bruce", status:"Booked", urgency:"Normal",
    date:"2026-03-30", time:"11:00 AM", price:130, paid:false, paymentMethod:"Credit card",
    notes:"Bruce did not arrive on time. Customer messaged. Bruce unreachable. Needs rescheduling.",
    humanFlag:{ type:"owner", msg:"Bruce has not arrived for J-1047 (Aisha Mensah, 11:00 AM) and is not responding to calls. You need to contact Aisha directly at 647-554-2210 and arrange a reschedule.", flaggedAt:"Mar 30, 11:20 AM" },
    conversation:[
      { from:"customer", time:"Mar 26, 10:15 AM", msg:"Hi, I have a bad ant problem in my kitchen and bathroom. How much do you charge?" },
      { from:"os",       time:"Mar 26, 10:15 AM", msg:"Hi! Ant treatment for a home is typically $130–$160. To get you booked and confirm the price, could I get your name, address, and best contact info?" },
      { from:"customer", time:"Mar 26, 10:21 AM", msg:"Aisha Mensah. 55 Dufferin St, Toronto. 647-554-2210, aisha.mensah@hotmail.com" },
      { from:"os",       time:"Mar 26, 10:22 AM", msg:"Thanks Aisha. For your home we're at $130 all in. Bruce can come Sunday morning — does 11:00 AM work?" },
      { from:"customer", time:"Mar 26, 10:30 AM", msg:"Sunday 11am works perfectly." },
      { from:"os",       time:"Mar 26, 10:31 AM", msg:"Bruce is confirmed for Sunday March 30 at 11:00 AM at 55 Dufferin St. Confirmation sent to aisha.mensah@hotmail.com." },
      { from:"os",       time:"Mar 29, 6:00 PM",  msg:"Reminder: Bruce is coming tomorrow at 11:00 AM for your ant treatment." },
      { from:"customer", time:"Mar 30, 11:18 AM", msg:"Hi, it's 11:20 and no one has shown up yet. Is someone coming?" },
      { from:"os",       time:"Mar 30, 11:19 AM", msg:"Hi Aisha — I apologize for the delay. I'm looking into this now and will have an update for you within the next few minutes. Thank you for your patience." },
    ],
    timeline:[
      { time:"Mar 26, 10:15 AM", event:"Lead received",             detail:"Inbound email", type:"lead" },
      { time:"Mar 26, 10:15 AM", event:"OS responded",              detail:"Pricing provided, intake started", type:"os" },
      { time:"Mar 26, 10:31 AM", event:"Job booked",                detail:"Bruce assigned, Mar 30 11:00 AM", type:"booked" },
      { time:"Mar 29, 6:00 PM",  event:"Reminder sent",             detail:"24h reminder sent", type:"comms" },
      { time:"Mar 30, 11:18 AM", event:"Customer messaged — late",  detail:"Customer asking where technician is", type:"lead" },
      { time:"Mar 30, 11:19 AM", event:"OS responded to customer",  detail:"Holding message sent", type:"os" },
      { time:"Mar 30, 11:20 AM", event:"Flagged to owner",          detail:"Bruce unreachable — owner action needed", type:"flag" },
    ],
  },

  // J-1048: Cancelled — Daniel
  {
    id:"J-1048", customerId:"c10", pestType:"Rodents", tech:"Daniel", status:"Cancelled", urgency:"Normal",
    date:"2026-03-27", time:"2:00 PM", price:0, paid:false, paymentMethod:null,
    notes:"Customer cancelled morning of job — said they handled it themselves.",
    conversation:[
      { from:"customer", time:"Mar 24, 3:00 PM",  msg:"Hi, we run a daycare in Brampton and found mouse droppings near our storage. We have children here every day. What do you charge and how fast can you come?" },
      { from:"os",       time:"Mar 24, 3:00 PM",  msg:"Hi — a daycare is exactly the kind of situation we prioritize. For a commercial space like yours, we're looking at $185–$250 depending on what we find. We can get Daniel out Thursday. To confirm, could I get your name, the address, and best contact info?" },
      { from:"customer", time:"Mar 24, 3:08 PM",  msg:"Priya Sharma. 12 Sunrise Blvd, Brampton. 905-664-9981, admin@sunrisedaycare.ca" },
      { from:"os",       time:"Mar 24, 3:09 PM",  msg:"Thanks Priya. Daniel is confirmed for Thursday March 27 at 2:00 PM at 12 Sunrise Blvd. Confirmation sent to admin@sunrisedaycare.ca." },
      { from:"customer", time:"Mar 27, 9:00 AM",  msg:"Hi, I need to cancel. We set some traps ourselves and haven't seen anything. We think we're okay for now." },
      { from:"os",       time:"Mar 27, 9:01 AM",  msg:"No problem — your appointment is cancelled. If anything comes up again, just reach out and we'll get Daniel scheduled quickly. Mice can be persistent so keep an eye on it." },
    ],
    timeline:[
      { time:"Mar 24, 3:00 PM",  event:"Lead received",          detail:"Inbound email — daycare", type:"lead" },
      { time:"Mar 24, 3:00 PM",  event:"OS responded",           detail:"Pricing provided, intake started", type:"os" },
      { time:"Mar 24, 3:09 PM",  event:"Job booked",             detail:"Daniel assigned, Mar 27 2:00 PM", type:"booked" },
      { time:"Mar 27, 9:00 AM",  event:"Customer cancelled",     detail:"Customer self-resolved — no charge", type:"cancelled" },
      { time:"Mar 27, 9:01 AM",  event:"Cancellation confirmed", detail:"Polite cancellation, door left open", type:"os" },
    ],
  },

  // J-1049: Vague inquiry — repeat customer — upsell
  {
    id:"J-1049", customerId:"c4", pestType:"Unknown", tech:null, status:"New Lead", urgency:"Low",
    date:null, time:null, price:0, paid:false, paymentMethod:null,
    notes:"Repeat customer Linda Tremblay. OS qualifying. Upsell opportunity.",
    conversation:[
      { from:"customer", time:"Mar 30, 8:30 AM", msg:"Hi, I think I might have bugs again. Not sure what kind." },
      { from:"os",       time:"Mar 30, 8:30 AM", msg:"Hi Linda! Happy to help figure it out. Where are you noticing them and what do they look like — small black dots, something larger, flying?" },
      { from:"customer", time:"Mar 30, 8:45 AM", msg:"Near my window. Small and black." },
      { from:"os",       time:"Mar 30, 8:46 AM", msg:"Could be carpet beetles or fungus gnats — both easy to deal with. Is there a plant near that window with soil? Also, since we treated for mice last month, it might be worth doing a prevention check-in at the same time. We have a quarterly package that covers both — want me to include that in a quote?" },
    ],
    timeline:[
      { time:"Mar 30, 8:30 AM", event:"Lead received",    detail:"Repeat customer — vague inquiry", type:"lead" },
      { time:"Mar 30, 8:30 AM", event:"OS qualifying",    detail:"Asking clarifying questions", type:"os" },
      { time:"Mar 30, 8:46 AM", event:"Upsell initiated", detail:"Prevention contract raised", type:"os" },
    ],
  },
];

// ─── OS MESSAGES ─────────────────────────────────────────────────────────────
const INITIAL_OS_MESSAGES = [
  { id:"m1", jobId:"J-1047", for:"owner", priority:"urgent", time:"Mar 30, 11:20 AM", subject:"Technician no-show — immediate action needed", body:"Bruce has not arrived for J-1047 (Aisha Mensah, 11:00 AM). Customer is waiting. Bruce is not responding to calls. Contact Aisha directly at 647-554-2210 and arrange a reschedule or find coverage.", resolved:false },
  { id:"m2", jobId:"J-1041", for:"owner", priority:"high",   time:"Mar 28, 8:00 AM",  subject:"Invoice #1041 overdue — 18 days, no payment", body:"Linda Tremblay has not paid Invoice #1041 ($185.00). Automated follow-ups sent at 7 and 10 days with no response. Recommend a direct call to 905-443-8812.", resolved:false },
  { id:"m3", jobId:"J-1046", for:"owner", priority:"low",    time:"Mar 28, 8:00 AM",  subject:"Cold lead — J-1046 Kowalski no response", body:"James Kowalski (wasp nest inquiry) has not responded after 2 follow-ups over 5 days. Lead is likely cold. Your call on whether to try once more directly at 416-223-8871.", resolved:false },
  { id:"m4", jobId:"J-1044", for:"owner", priority:"normal", time:"Mar 30, 10:00 AM", subject:"Parkway Grill — contract opportunity", body:"Daniel is on site at Parkway Grill now. Marcus Webb mentioned a monthly prevention contract during booking. Good opportunity to follow up after today's job.", resolved:false },
  { id:"m5", jobId:"J-1047", for:"tech",  priority:"urgent", time:"Mar 30, 11:15 AM", subject:"J-1047 — Aisha Mensah waiting at 55 Dufferin St", body:"Your 11:00 AM job at 55 Dufferin St has not been started. It is now 11:15 AM. Please confirm your status. Henry (owner) has been notified.", resolved:false },
];

// ─── WEEKLY CALENDAR ──────────────────────────────────────────────────────────
const WEEK_DAYS = [
  { date:"2026-03-24", label:"Mon Mar 24" },
  { date:"2026-03-25", label:"Tue Mar 25" },
  { date:"2026-03-26", label:"Wed Mar 26" },
  { date:"2026-03-27", label:"Thu Mar 27" },
  { date:"2026-03-28", label:"Fri Mar 28" },
  { date:"2026-03-29", label:"Sat Mar 29" },
  { date:"2026-03-30", label:"Sun Mar 30" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const money = n => `$${Number(n).toLocaleString()}.00`;
const getCustomer = id => CUSTOMERS.find(c => c.id === id);
const getWeekJobs = () => JOBS.filter(j => j.date && j.date >= "2026-03-24" && j.date <= "2026-03-30");
const getWeekRevenue = () => getWeekJobs().filter(j => j.paid).reduce((s,j) => s + j.price, 0);
const getOutstanding = () => JOBS.filter(j => !j.paid && j.price > 0 && ["Invoiced","Overdue","In Progress","Booked"].includes(j.status)).reduce((s,j) => s + j.price, 0);

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || {};
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:20, fontSize:12, fontWeight:500, color:cfg.color, background:cfg.bg }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.dot, flexShrink:0 }} />
      {status}
    </span>
  );
}

function UrgencyBadge({ urgency }) {
  const cfg = URGENCY_CFG[urgency] || {};
  return <span style={{ padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:500, color:cfg.color, background:cfg.bg }}>{urgency}</span>;
}

function Card({ children, style={}, onClick }) {
  return (
    <div onClick={onClick} style={{ background:G.white, border:`1px solid ${G.border}`, borderRadius:12, padding:"18px 20px", cursor:onClick?"pointer":"default", ...style }}
      onMouseEnter={onClick ? e=>e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.07)" : null}
      onMouseLeave={onClick ? e=>e.currentTarget.style.boxShadow="none" : null}>
      {children}
    </div>
  );
}

function MetricCard({ label, value, sub, accent }) {
  return (
    <Card style={{ flex:1 }}>
      <div style={{ fontSize:12, color:G.textMuted, marginBottom:6, fontWeight:500, letterSpacing:"0.02em" }}>{label}</div>
      <div style={{ fontSize:26, fontWeight:700, color:accent||G.text, letterSpacing:"-0.02em" }}>{value}</div>
      {sub && <div style={{ fontSize:12, color:G.textLight, marginTop:4 }}>{sub}</div>}
    </Card>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom:20 }}>
      <h2 style={{ fontSize:20, fontWeight:700, color:G.text, margin:0 }}>{title}</h2>
      {sub && <p style={{ fontSize:13, color:G.textMuted, margin:"4px 0 0" }}>{sub}</p>}
    </div>
  );
}

function FlagBanner({ flag }) {
  if (!flag) return null;
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 16px", background:G.redLight, border:`1px solid ${G.redMid}`, borderLeft:`4px solid ${G.red}`, borderRadius:10, marginBottom:18 }}>
      <span style={{ fontSize:18 }}>⚠️</span>
      <div>
        <div style={{ fontSize:13, fontWeight:600, color:G.red, marginBottom:3 }}>Human action required · {flag.flaggedAt}</div>
        <div style={{ fontSize:13, color:G.text }}>{flag.msg}</div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const OWNER_NAV = [
  { id:"dashboard", label:"Dashboard",            icon:"▦" },
  { id:"d1",        label:"D1 · Lead Mgmt",       icon:"◎", live:true },
  { id:"d2",        label:"D2 · Calendar",        icon:"◫" },
  { id:"d3",        label:"D3 · Completed Jobs",  icon:"◐" },
  { id:"d4",        label:"D4 · Quotes & Revenue",icon:"◈" },
  { id:"d5",        label:"D5 · Compliance",      icon:"◉" },
  { id:"d6",        label:"D6 · Invoicing",       icon:"◑" },
  { id:"messages",  label:"Messages",             icon:"✉", badge:true },
  { id:"summary",   label:"Weekly Summary",       icon:"◧" },
];

const TECH_NAV = [
  { id:"techdash", label:"My Dashboard",      icon:"▦" },
  { id:"d2",       label:"D2 · My Schedule",  icon:"◫" },
  { id:"messages", label:"Messages from OS",  icon:"✉", badge:true },
];

function Sidebar({ active, setActive, role, setRole, osMessages }) {
  const urgentCount = osMessages.filter(m => !m.resolved && (role==="owner" ? m.for==="owner" : m.for==="tech")).length;
  return (
    <div style={{ width:228, flexShrink:0, background:G.white, borderRight:`1px solid ${G.border}`, display:"flex", flexDirection:"column", padding:"0 0 24px" }}>
      <div style={{ padding:"20px 20px 14px", borderBottom:`1px solid ${G.border}` }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:8, background:G.green, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🦟</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:G.text, lineHeight:1.2 }}>Henry the</div>
            <div style={{ fontSize:13, fontWeight:700, color:G.text, lineHeight:1.2 }}>Exterminator</div>
          </div>
        </div>
        <div style={{ marginTop:10, padding:"4px 8px", borderRadius:6, background:G.greenLight, fontSize:11, color:G.green, fontWeight:600, display:"inline-block" }}>OS — Live Demo</div>
      </div>

      <div style={{ padding:"12px 14px", borderBottom:`1px solid ${G.border}` }}>
        <div style={{ display:"flex", background:G.bg, borderRadius:8, padding:3, gap:3 }}>
          {["owner","tech"].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{ flex:1, padding:"6px 0", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit", background:role===r?G.green:"transparent", color:role===r?"#fff":G.textMuted, transition:"all 0.15s" }}>
              {r==="owner"?"Owner":"Technician"}
            </button>
          ))}
        </div>
      </div>

      <nav style={{ padding:"10px 10px", flex:1, overflowY:"auto" }}>
        {(role==="owner" ? OWNER_NAV : TECH_NAV).map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:8, border:"none", cursor:"pointer", background:active===item.id?G.greenLight:"transparent", color:active===item.id?G.green:G.textMuted, fontSize:13, fontWeight:active===item.id?600:400, fontFamily:"inherit", textAlign:"left", transition:"all 0.12s", marginBottom:2 }}>
            <span style={{ fontSize:13 }}>{item.icon}</span>
            <span style={{ flex:1 }}>{item.label}</span>
            {item.live && <span style={{ fontSize:10, padding:"2px 6px", borderRadius:10, background:"#dcfce7", color:"#16a34a", fontWeight:700 }}>LIVE</span>}
            {item.badge && urgentCount > 0 && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:10, background:G.redLight, color:G.red, fontWeight:700 }}>{urgentCount}</span>}
          </button>
        ))}
      </nav>

      <div style={{ padding:"12px 18px", borderTop:`1px solid ${G.border}` }}>
        <div style={{ fontSize:11, color:G.textLight, marginBottom:8, fontWeight:600, letterSpacing:"0.04em" }}>TECHNICIANS</div>
        {TECHNICIANS.map(t => {
          const onJob = JOBS.some(j => j.tech===t.name && j.status==="In Progress");
          const isLate = t.name==="Bruce";
          return (
            <div key={t.id} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:t.color+"22", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:t.color }}>{t.name[0]}</div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:G.text }}>{t.name}</div>
                <div style={{ fontSize:11, color:isLate?G.red:G.textLight }}>{isLate?"⚠️ Unreachable":onJob?"On job":"Available"}</div>
              </div>
              <div style={{ marginLeft:"auto", width:7, height:7, borderRadius:"50%", background:isLate?"#ef4444":onJob?"#16a34a":"#9ca3af" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── OWNER DASHBOARD ─────────────────────────────────────────────────────────
function OwnerDashboard({ setActive, setSelectedJob, osMessages }) {
  const todayJobs = JOBS.filter(j => j.date === "2026-03-30");
  const urgentMessages = osMessages.filter(m => m.for==="owner" && !m.resolved);

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:G.text, margin:0 }}>Good morning, Henry 👋</h1>
        <p style={{ fontSize:14, color:G.textMuted, margin:"4px 0 0" }}>Sunday, March 30 — your business at a glance.</p>
      </div>

      {urgentMessages.filter(m=>m.priority==="urgent").map(m => (
        <div key={m.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 16px", background:G.redLight, border:`1px solid ${G.redMid}`, borderLeft:`4px solid ${G.red}`, borderRadius:10, marginBottom:14, cursor:"pointer" }} onClick={()=>setActive("messages")}>
          <span style={{ fontSize:18 }}>🚨</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, fontWeight:700, color:G.red }}>{m.subject}</div>
            <div style={{ fontSize:12, color:G.text, marginTop:3 }}>{m.body.slice(0,120)}...</div>
          </div>
          <span style={{ fontSize:12, color:G.red, fontWeight:600, whiteSpace:"nowrap" }}>View →</span>
        </div>
      ))}

      <div style={{ display:"flex", gap:14, marginBottom:24 }}>
        <MetricCard label="Revenue this week" value={money(getWeekRevenue())} sub="Collected" accent={G.green} />
        <MetricCard label="Outstanding"        value={money(getOutstanding())} sub="Across all open jobs" accent={G.red} />
        <MetricCard label="Jobs today"         value={todayJobs.length} sub={todayJobs.map(j=>j.tech).filter(Boolean).join(", ")||"None scheduled"} />
        <MetricCard label="New leads"          value={JOBS.filter(j=>j.status==="New Lead").length} sub="Awaiting booking" accent={G.blue} />
        <MetricCard label="OS messages"        value={urgentMessages.length} sub="Needs your attention" accent={G.red} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:600, color:G.text }}>Today's schedule</div>
            <button onClick={()=>setActive("d2")} style={{ fontSize:12, color:G.green, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Calendar →</button>
          </div>
          {todayJobs.length===0 && <div style={{ fontSize:13, color:G.textMuted }}>No jobs scheduled today.</div>}
          {todayJobs.map(job => {
            const c = getCustomer(job.customerId);
            return (
              <div key={job.id} onClick={()=>{setSelectedJob(job.id);setActive("d1");}} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${G.border}`, cursor:"pointer" }}>
                <div style={{ width:36, height:36, borderRadius:8, background:job.humanFlag?G.redLight:G.greenLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:job.humanFlag?G.red:G.green, flexShrink:0 }}>
                  {job.time?.split(":")[0]}{job.time?.includes("AM")?"A":"P"}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:G.text }}>{c?.name}</div>
                  <div style={{ fontSize:12, color:G.textMuted }}>{job.pestType} · {job.tech||"Unassigned"}</div>
                </div>
                <StatusBadge status={job.status} />
              </div>
            );
          })}
        </Card>

        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:600, color:G.text }}>New leads</div>
            <button onClick={()=>setActive("d1")} style={{ fontSize:12, color:G.green, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>Open D1 →</button>
          </div>
          {JOBS.filter(j=>j.status==="New Lead").map(job => {
            const c = getCustomer(job.customerId);
            return (
              <div key={job.id} style={{ padding:"10px 0", borderBottom:`1px solid ${G.border}` }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:G.text }}>{c?.name}</div>
                  <UrgencyBadge urgency={job.urgency} />
                </div>
                <div style={{ fontSize:12, color:G.textMuted }}>{job.pestType} — {c?.address?.split(",")[1]?.trim()}</div>
              </div>
            );
          })}
        </Card>

        <Card>
          <div style={{ fontSize:14, fontWeight:600, color:G.text, marginBottom:14 }}>Overdue invoices</div>
          {JOBS.filter(j=>j.status==="Overdue").map(job => {
            const c = getCustomer(job.customerId);
            return (
              <div key={job.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${G.border}` }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:G.text }}>{c?.name}</div>
                  <div style={{ fontSize:12, color:G.red }}>Invoice #{job.id.replace("J-","")} · 18 days overdue</div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:G.red }}>{money(job.price)}</div>
              </div>
            );
          })}
          <div style={{ marginTop:10, padding:"8px 12px", background:G.amberLight, borderRadius:8, fontSize:12, color:G.amber }}>⏰ 2 automated follow-ups sent. Direct call recommended.</div>
        </Card>

        <Card>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <div style={{ fontSize:14, fontWeight:600, color:G.text }}>OS messages</div>
            <button onClick={()=>setActive("messages")} style={{ fontSize:12, color:G.green, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit" }}>View all →</button>
          </div>
          {urgentMessages.slice(0,3).map(m => (
            <div key={m.id} style={{ padding:"9px 0", borderBottom:`1px solid ${G.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                <div style={{ fontSize:12, fontWeight:600, color:m.priority==="urgent"?G.red:m.priority==="high"?G.amber:G.text }}>{m.subject}</div>
                <span style={{ fontSize:11, color:G.textLight, whiteSpace:"nowrap", marginLeft:8 }}>{m.time}</span>
              </div>
              <div style={{ fontSize:12, color:G.textMuted }}>{m.body.slice(0,80)}...</div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── TECH DASHBOARD ───────────────────────────────────────────────────────────
function TechDashboard({ setActive, osMessages }) {
  const myJobs = JOBS.filter(j => j.tech==="Daniel" && j.date==="2026-03-30");
  const allMyJobs = JOBS.filter(j => j.tech==="Daniel");
  const techMessages = osMessages.filter(m => m.for==="tech" && !m.resolved);

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:G.text, margin:0 }}>Good morning, Daniel 👋</h1>
        <p style={{ fontSize:14, color:G.textMuted, margin:"4px 0 0" }}>Sunday, March 30 — your jobs for today.</p>
      </div>

      {techMessages.map(m => (
        <div key={m.id} style={{ display:"flex", alignItems:"flex-start", gap:12, padding:"12px 16px", background:G.redLight, border:`1px solid ${G.redMid}`, borderLeft:`4px solid ${G.red}`, borderRadius:10, marginBottom:14 }}>
          <span style={{ fontSize:18 }}>🚨</span>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:G.red }}>{m.subject}</div>
            <div style={{ fontSize:12, color:G.text, marginTop:3 }}>{m.body}</div>
          </div>
        </div>
      ))}

      <div style={{ display:"flex", gap:14, marginBottom:24 }}>
        <MetricCard label="My jobs today"     value={myJobs.length} />
        <MetricCard label="Jobs this week"    value={allMyJobs.filter(j=>j.date>="2026-03-24").length} />
        <MetricCard label="Completed today"   value={myJobs.filter(j=>j.status==="Completed").length} accent={G.green} />
        <MetricCard label="Revenue generated" value={money(allMyJobs.filter(j=>j.paid).reduce((s,j)=>s+j.price,0))} accent={G.green} />
      </div>

      <Card>
        <div style={{ fontSize:14, fontWeight:600, color:G.text, marginBottom:14 }}>Today's jobs</div>
        {myJobs.length===0 && <div style={{ fontSize:13, color:G.textMuted }}>No jobs scheduled for you today.</div>}
        {myJobs.map(job => {
          const c = getCustomer(job.customerId);
          return (
            <div key={job.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:`1px solid ${G.border}` }}>
              <div style={{ width:44, height:44, borderRadius:10, background:G.greenLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:G.green, flexShrink:0 }}>{job.time}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:G.text }}>{c?.name}</div>
                <div style={{ fontSize:12, color:G.textMuted }}>{job.pestType} · {c?.address}</div>
              </div>
              <StatusBadge status={job.status} />
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ─── D1 — LEAD INBOX ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the intake and booking agent for Henry the Exterminator, a licensed pest control company in the Greater Toronto Area.

Business details: GTA | Services: Rodents, Cockroaches, Bed Bugs, Ants, Wasps, Wildlife | Technicians: Daniel, Bruce, Maria | Pricing: $130–$160 wasps/ants, $150–$250 mice/cockroaches, $300–$450 bed bugs, $185–$450 commercial | Payment: Credit card or net 7 invoice (commercial) | Ontario Pesticides Act certified.

INTAKE RULES:
1. Read the message. Extract whatever info was already given (name, address, phone, email, pest type).
2. Identify what is still missing. Required minimum to book: full name + service address. Phone or email needed for confirmation.
3. In your FIRST reply: provide pricing if asked, then ask for ALL missing required info in ONE message. Do not spread questions across multiple messages.
4. If the customer replies with partial info, ask only for what is still missing.
5. Once you have name + address + phone or email: confirm the booking with technician, date, and time.
6. Tone: direct, warm, professional. No filler phrases. No "absolutely!" or "great question!". Sound like a real local business.

Respond with ONLY valid JSON (no markdown):
{
  "customerName": "name or Unknown",
  "neighbourhood": "neighbourhood or Unknown",
  "address": "full address or Requested",
  "phone": "phone or Requested",
  "email": "email or Requested",
  "pestType": "type or unknown",
  "urgency": "EMERGENCY/HIGH/NORMAL/LOW",
  "jobType": "residential/commercial",
  "intakeComplete": true or false,
  "missingInfo": ["list of still-missing fields"],
  "technician": "Daniel or Bruce or Maria (only if intakeComplete is true)",
  "estimatedPrice": "$XXX–$XXX",
  "outboundMessage": "Your reply. If intake incomplete: give pricing if asked, then ask for all missing info in one message. If complete: confirm booking with full details.",
  "routing": "Awaiting info / Schedule with Daniel / Schedule with Bruce / Schedule with Maria / Emergency escalation",
  "bookingConfirmed": true or false
}`;

const DEMO_SCENARIOS = [
  { label:"🚨 Emergency — no info",    msg:"Hi I found mice droppings all over my kitchen this morning and I have a newborn at home. This is urgent, I need someone TODAY." },
  { label:"🪳 Has address, wants price",msg:"Hey do you guys deal with cockroaches? Found a couple in my bathroom over the last few days. Located at 312 Royal York Rd Unit 4B Etobicoke. What do you charge?" },
  { label:"🏢 Commercial — full info",  msg:"Hello, I manage Parkway Grill at 88 King St W Toronto. Marcus Webb, 416-901-2234, marcus@parkwaygrill.ca. Rodent activity near storage. Need regular visits with health inspection documentation." },
  { label:"❓ Vague — nothing provided",msg:"Hi I have a bug problem" },
  { label:"🛏 Bed bugs — partial info", msg:"I woke up with bites, I think bed bugs. Raymond Xu, 77 Sheppard Ave E #902 Toronto, raymond.xu@gmail.com" },
  { label:"🐜 Ants — complete info",    msg:"Hi I'm Aisha Mensah, 647-554-2210, aisha.mensah@hotmail.com. Bad ant problem at 55 Dufferin St Toronto. Can someone come this weekend?" },
];

function D1LeadMgmt({ selectedJob, setSelectedJob }) {
  const [msg, setMsg] = useState(DEMO_SCENARIOS[0].msg);
  const [activeScenario, setActiveScenario] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const steps = ["Parsing message","Extracting provided info","Identifying gaps","Assessing urgency","Composing reply","Routing","Logging"];

  if (selectedJob) {
    const job = JOBS.find(j=>j.id===selectedJob);
    if (job) return <JobDetail job={job} onBack={()=>setSelectedJob(null)} />;
  }

  const run = async () => {
    setLoading(true); setResult(null); setError(null); setStep(0);
    const interval = setInterval(()=>{ setStep(s=>s<steps.length-1?s+1:s); },220);
    try {
      const res = await fetch("/api/proxy", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ model:"claude-haiku-4-5", max_tokens:1000, system:SYSTEM_PROMPT, messages:[{ role:"user", content:`Process this inbound customer message: "${msg}"` }] }),
      });
      const data = await res.json();
      if (data.proxyError) { setError("API Error: " + JSON.stringify(data.anthropicError || data.message)); return; }
      if (data.error) { setError("Anthropic Error: " + data.error.message); return; }
      const text = (data.content||[]).map(b=>b.text||"").join("");
      const clean = text.replace(/```json\n?|\n?```/g,"").trim();
      setResult(JSON.parse(clean));
    } catch(e) { setError("Processing failed — " + (e.message||JSON.stringify(e))); }
    finally { clearInterval(interval); setStep(steps.length-1); setLoading(false); }
  };

  return (
    <div>
      <SectionHeader title="D1 — Lead & Inquiry Management" sub="All inbound conversations. Live inbox feeds here." />
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:13, fontWeight:600, color:G.textMuted, marginBottom:10, letterSpacing:"0.03em" }}>ALL LEADS & CONVERSATIONS</div>
        <Card style={{ padding:0, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:G.bg, borderBottom:`1px solid ${G.border}` }}>
                {["Job","Customer","Pest","Address","Status","Last activity",""].map(h=>(
                  <th key={h} style={{ padding:"9px 16px", textAlign:"left", fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {JOBS.map((job,i) => {
                const c = getCustomer(job.customerId);
                const lastMsg = job.conversation?.[job.conversation.length-1];
                const addrDisplay = job.addressCollected===false ? "Requested" : c?.address?.split(",")[0]||"—";
                return (
                  <tr key={job.id} onClick={()=>setSelectedJob(job.id)} style={{ borderBottom:i<JOBS.length-1?`1px solid ${G.border}`:"none", cursor:"pointer" }}
                    onMouseEnter={e=>e.currentTarget.style.background=G.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"11px 16px", fontSize:12, fontWeight:600, color:G.textMuted }}>{job.id}</td>
                    <td style={{ padding:"11px 16px" }}>
                      <div style={{ fontSize:13, fontWeight:500, color:G.text }}>{c?.name}</div>
                      <div style={{ fontSize:11, color:G.textLight }}>{c?.type}</div>
                    </td>
                    <td style={{ padding:"11px 16px", fontSize:13, color:G.text }}>{job.pestType}</td>
                    <td style={{ padding:"11px 16px", fontSize:12, color:job.addressCollected===false?G.amber:G.textMuted, fontStyle:job.addressCollected===false?"italic":"normal" }}>{addrDisplay}</td>
                    <td style={{ padding:"11px 16px" }}><StatusBadge status={job.status} /></td>
                    <td style={{ padding:"11px 16px", fontSize:12, color:G.textMuted }}>{lastMsg?.time||"—"}</td>
                    <td style={{ padding:"11px 16px", fontSize:12, color:G.green }}>View →</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>

      <div style={{ fontSize:13, fontWeight:600, color:G.textMuted, marginBottom:10, letterSpacing:"0.03em" }}>LIVE LEAD INBOX — OS RESPONDS IN REAL TIME</div>
      <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:14 }}>
        {DEMO_SCENARIOS.map((s,i)=>(
          <button key={i} onClick={()=>{ setActiveScenario(i); setMsg(s.msg); setResult(null); setError(null); }}
            style={{ padding:"6px 13px", borderRadius:20, fontSize:12, border:`1px solid ${i===activeScenario?G.green:G.border}`, background:i===activeScenario?G.green:G.white, color:i===activeScenario?"#fff":G.textMuted, cursor:"pointer", fontFamily:"inherit" }}>
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        <div>
          <Card style={{ marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:8 }}>INBOUND MESSAGE</div>
            <textarea value={msg} onChange={e=>{setMsg(e.target.value);setResult(null);}} rows={4}
              style={{ width:"100%", border:"none", background:"transparent", resize:"vertical", fontSize:13, lineHeight:1.6, color:G.text, fontFamily:"inherit", outline:"none" }}
              placeholder="Paste a customer message..." />
          </Card>
          <button onClick={run} disabled={loading||!msg.trim()} style={{ width:"100%", padding:"12px 20px", border:"none", borderRadius:10, background:loading||!msg.trim()?G.border:G.green, color:loading||!msg.trim()?G.textMuted:"#fff", fontSize:14, fontWeight:600, cursor:loading||!msg.trim()?"not-allowed":"pointer", fontFamily:"inherit" }}>
            {loading?`Processing... (${steps[step]})`:"▶ Run — OS responds"}
          </button>
          {(loading||result) && (
            <div style={{ marginTop:14 }}>
              {steps.map((s,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:8, padding:"4px 0", fontSize:12, color:i<=step?G.green:G.textLight }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", flexShrink:0, background:i<=step?G.green:G.border, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff" }}>{i<=step?"✓":""}</div>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          {error && <Card style={{ borderColor:G.red }}><div style={{ fontSize:13, color:G.red }}>{error}</div></Card>}
          {!result&&!error && (
            <Card style={{ background:G.bg, border:`1px dashed ${G.borderMid}`, display:"flex", alignItems:"center", justifyContent:"center", minHeight:260 }}>
              <div style={{ textAlign:"center", color:G.textLight }}>
                <div style={{ fontSize:32, marginBottom:10 }}>◎</div>
                <div style={{ fontSize:13 }}>OS response will appear here</div>
              </div>
            </Card>
          )}
          {result && (
            <div>
              <Card style={{ borderLeft:`3px solid ${result.bookingConfirmed?G.green:G.amber}`, marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:600, color:result.bookingConfirmed?G.green:G.amber, letterSpacing:"0.04em", marginBottom:8 }}>
                  {result.bookingConfirmed?"✓ BOOKING CONFIRMED — SENT TO CUSTOMER":"⏳ INTAKE IN PROGRESS — COLLECTING INFO"}
                </div>
                <div style={{ fontSize:13, lineHeight:1.65, fontStyle:"italic", color:G.text }}>"{result.outboundMessage}"</div>
                <div style={{ marginTop:8, fontSize:11, color:G.textLight }}>Sent in under 60 seconds · 0 human steps</div>
              </Card>
              <Card style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:10 }}>INTAKE STATUS</div>
                {[["Customer",result.customerName],["Address",result.address],["Phone",result.phone],["Email",result.email],["Pest type",result.pestType],["Job type",result.jobType],["Urgency",result.urgency],["Assigned to",result.intakeComplete?result.technician:"Pending intake"],["Estimate",result.estimatedPrice],["Routing",result.routing]].map(([k,v])=>{
                  const pending = v==="Requested"||v==="Pending intake";
                  return (
                    <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${G.border}`, fontSize:12 }}>
                      <span style={{ color:G.textMuted }}>{k}</span>
                      <span style={{ color:pending?G.amber:G.text, fontWeight:500, fontStyle:pending?"italic":"normal" }}>{v||"—"}</span>
                    </div>
                  );
                })}
                {result.missingInfo?.length > 0 && (
                  <div style={{ marginTop:10, padding:"8px 12px", background:G.amberLight, borderRadius:8, fontSize:12, color:G.amber }}>
                    Still needed: {result.missingInfo.join(", ")}
                  </div>
                )}
              </Card>
              <div style={{ padding:"10px 14px", background:result.bookingConfirmed?G.greenLight:G.amberLight, borderRadius:8, fontSize:12, color:result.bookingConfirmed?G.green:G.amber, fontWeight:500 }}>
                {result.bookingConfirmed?"✓ Intake complete · Technician assigned · Booking confirmed · 0 human steps":"⏳ Intake active — OS collecting remaining info before booking"}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── JOB DETAIL ───────────────────────────────────────────────────────────────
function JobDetail({ job, onBack }) {
  const c = getCustomer(job.customerId);
  const [tab, setTab] = useState("conversation");
  const addrDisplay = job.addressCollected===false ? "Requested" : c?.address;
  return (
    <div>
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", color:G.textMuted, fontSize:13, fontFamily:"inherit", marginBottom:20, padding:0 }}>← Back</button>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20, flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
            <h1 style={{ fontSize:22, fontWeight:700, color:G.text, margin:0 }}>{job.id}</h1>
            <StatusBadge status={job.status} />
            <UrgencyBadge urgency={job.urgency} />
          </div>
          <div style={{ fontSize:14, color:G.textMuted }}>{c?.name} · {job.pestType}</div>
        </div>
        {job.price>0 && (
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:26, fontWeight:700, color:G.text }}>{money(job.price)}</div>
            <div style={{ fontSize:12, color:job.paid?G.green:G.red, fontWeight:500 }}>{job.paid?"✓ Paid":"⏳ Unpaid"}{job.paymentMethod?` · ${job.paymentMethod}`:""}</div>
          </div>
        )}
      </div>

      <FlagBanner flag={job.humanFlag} />

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:18 }}>
        <Card>
          <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:10 }}>CUSTOMER</div>
          <div style={{ display:"flex", gap:12, alignItems:"flex-start" }}>
            <div style={{ width:38, height:38, borderRadius:"50%", background:G.greenLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:G.green, flexShrink:0 }}>{c?.name.split(" ").map(w=>w[0]).join("")}</div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:G.text }}>{c?.name}</div>
              <div style={{ fontSize:12, color:G.textMuted, marginTop:2 }}>{c?.phone}</div>
              <div style={{ fontSize:12, color:G.textMuted }}>{c?.email}</div>
              <div style={{ fontSize:12, color:job.addressCollected===false?G.amber:G.textMuted, marginTop:3, fontStyle:job.addressCollected===false?"italic":"normal" }}>{addrDisplay}</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:10 }}>JOB DETAILS</div>
          {[["Technician",job.tech||"TBD"],["Date",job.date||"TBD"],["Time",job.time||"TBD"],["Pest",job.pestType],["Type",c?.type]].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${G.border}`, fontSize:13 }}>
              <span style={{ color:G.textMuted }}>{k}</span>
              <span style={{ color:G.text, fontWeight:500 }}>{v}</span>
            </div>
          ))}
          {job.notes && <div style={{ marginTop:8, fontSize:12, color:G.textMuted, fontStyle:"italic", lineHeight:1.5 }}>{job.notes}</div>}
        </Card>
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {["conversation","timeline",...(job.complianceRecord?["compliance"]:[])].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{ padding:"7px 16px", borderRadius:20, fontSize:12, fontWeight:500, border:`1px solid ${tab===t?G.green:G.border}`, background:tab===t?G.green:G.white, color:tab===t?"#fff":G.textMuted, cursor:"pointer", fontFamily:"inherit" }}>
            {t==="conversation"?"Conversation":t==="timeline"?"Timeline":"Compliance Record"}
          </button>
        ))}
      </div>

      {tab==="conversation" && job.conversation && (
        <Card>
          <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:14 }}>FULL CONVERSATION — OS HANDLED THIS</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {job.conversation.map((m,i)=>(
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.from==="customer"?"flex-start":"flex-end" }}>
                <div style={{ fontSize:10, color:G.textLight, marginBottom:3, fontWeight:500 }}>{m.from==="customer"?c?.name.split(" ")[0]:"OS"} · {m.time}</div>
                <div style={{ maxWidth:"80%", padding:"10px 14px", borderRadius:12, fontSize:13, lineHeight:1.6, color:m.from==="os"?"#fff":G.text, background:m.from==="os"?G.green:G.bg, border:m.from==="customer"?`1px solid ${G.border}`:"none" }}>
                  {m.msg}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, padding:"8px 12px", background:G.greenLight, borderRadius:8, fontSize:12, color:G.green, fontWeight:500 }}>✓ Every message above was sent automatically by the OS — 0 human steps</div>
        </Card>
      )}

      {tab==="timeline" && (
        <Card>
          <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:16 }}>JOB TIMELINE</div>
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute", left:11, top:0, bottom:0, width:1, background:G.border }} />
            {job.timeline.map((item,i)=>(
              <div key={i} style={{ display:"flex", gap:14, marginBottom:14, position:"relative" }}>
                <div style={{ width:22, height:22, borderRadius:"50%", flexShrink:0, background:TIMELINE_COLORS[item.type]||G.green, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"#fff", fontWeight:700, zIndex:1 }}>✓</div>
                <div style={{ flex:1, paddingTop:2 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                    <div style={{ fontSize:13, fontWeight:500, color:G.text }}>{item.event}</div>
                    <div style={{ fontSize:11, color:G.textLight }}>{item.time}</div>
                  </div>
                  <div style={{ fontSize:12, color:G.textMuted, marginTop:2 }}>{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab==="compliance" && job.complianceRecord && (
        <Card>
          <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:14 }}>ONTARIO PESTICIDES ACT — COMPLIANCE RECORD</div>
          {Object.entries({ "Date":job.complianceRecord.date,"Technician":job.complianceRecord.tech,"License #":job.complianceRecord.license,"Pest treated":job.complianceRecord.pest,"Product used":job.complianceRecord.product,"Units treated":job.complianceRecord.units,"Treatment area":job.complianceRecord.area,"Notes":job.complianceRecord.notes }).map(([k,v])=>(
            <div key={k} style={{ display:"flex", padding:"7px 0", borderBottom:`1px solid ${G.border}`, fontSize:13 }}>
              <span style={{ color:G.textMuted, width:140, flexShrink:0 }}>{k}</span>
              <span style={{ color:G.text, fontWeight:500 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop:12, padding:"8px 12px", background:G.greenLight, borderRadius:8, fontSize:12, color:G.green, fontWeight:500 }}>✓ Auto-generated · Ontario Pesticides Act compliant · Audit ready</div>
        </Card>
      )}
    </div>
  );
}

// ─── D2 — CALENDAR ────────────────────────────────────────────────────────────
function D2Calendar({ role }) {
  const techFilter = role==="tech" ? "Daniel" : null;
  const statusColors = { "Completed":"#16a34a","In Progress":"#1a472a","Booked":"#d97706","New Lead":"#2563eb","Overdue":"#dc2626","Cancelled":"#9ca3af","No Response":"#d97706" };
  const techColors = { "Daniel":G.green, "Bruce":G.blue, "Maria":"#7c3aed" };

  return (
    <div>
      <SectionHeader title={role==="tech"?"D2 — My Schedule":"D2 — Scheduling & Dispatch"} sub={`Week of March 24–30, 2026${role==="tech"?" · Daniel's jobs only":""}`} />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
        {WEEK_DAYS.map(day => {
          const dayJobs = JOBS.filter(j=>j.date===day.date && (!techFilter||j.tech===techFilter));
          const isToday = day.date==="2026-03-30";
          return (
            <div key={day.date} style={{ background:isToday?G.greenLight:G.white, border:`1px solid ${isToday?G.greenMid:G.border}`, borderRadius:10, padding:"12px 10px", minHeight:160 }}>
              <div style={{ fontSize:11, fontWeight:700, color:isToday?G.green:G.textMuted, marginBottom:8, letterSpacing:"0.03em" }}>{day.label.toUpperCase()}</div>
              {dayJobs.length===0 && <div style={{ fontSize:11, color:G.textLight, fontStyle:"italic" }}>No jobs</div>}
              {dayJobs.map(job=>{
                const c=getCustomer(job.customerId);
                const techColor=techColors[job.tech]||G.green;
                return (
                  <div key={job.id} style={{ padding:"6px 8px", borderRadius:6, marginBottom:6, background:statusColors[job.status]+"22", borderLeft:`3px solid ${techColor}` }}>
                    <div style={{ fontSize:11, fontWeight:600, color:G.text }}>{job.time||"TBD"}</div>
                    <div style={{ fontSize:11, color:G.text }}>{c?.name.split(" ")[0]}</div>
                    <div style={{ fontSize:10, color:G.textMuted }}>{job.pestType} · {job.tech||"?"}</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <div style={{ display:"flex", gap:16, marginTop:14, flexWrap:"wrap" }}>
        <div style={{ fontSize:11, fontWeight:600, color:G.textLight, marginRight:4 }}>STATUS:</div>
        {Object.entries(statusColors).map(([s,c])=>(
          <div key={s} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:G.textMuted }}>
            <div style={{ width:10, height:10, borderRadius:2, background:c }} />{s}
          </div>
        ))}
      </div>
      {role==="owner" && (
        <div style={{ display:"flex", gap:16, marginTop:8, flexWrap:"wrap" }}>
          <div style={{ fontSize:11, fontWeight:600, color:G.textLight, marginRight:4 }}>TECH:</div>
          {Object.entries(techColors).map(([t,c])=>(
            <div key={t} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:G.textMuted }}>
              <div style={{ width:10, height:10, borderRadius:2, background:c }} />{t}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── D3 — COMPLETED JOBS ─────────────────────────────────────────────────────
function D3CompletedJobs({ setSelectedJob, setActive }) {
  const [expandedJob, setExpandedJob] = useState(null);
  const completedJobs = JOBS.filter(j => j.status==="Completed");

  return (
    <div>
      <SectionHeader title="D3 — Completed Jobs" sub="Full record of every completed job — customer profile, chat history, and invoice status." />
      {completedJobs.map(job => {
        const c = getCustomer(job.customerId);
        const isExpanded = expandedJob===job.id;
        return (
          <Card key={job.id} style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", cursor:"pointer" }} onClick={()=>setExpandedJob(isExpanded?null:job.id)}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:G.text }}>{job.id}</div>
                  <StatusBadge status={job.status} />
                  {job.paid ? <span style={{ fontSize:11, padding:"2px 8px", borderRadius:10, background:G.greenLight, color:G.green, fontWeight:600 }}>✓ Paid</span> : job.price>0 ? <span style={{ fontSize:11, padding:"2px 8px", borderRadius:10, background:G.redLight, color:G.red, fontWeight:600 }}>⚠️ Unpaid</span> : null}
                </div>
                <div style={{ fontSize:13, color:G.text, fontWeight:500 }}>{c?.name}</div>
                <div style={{ fontSize:12, color:G.textMuted }}>{job.pestType} · {job.tech} · {job.date}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                {job.price>0 && <div style={{ fontSize:18, fontWeight:700, color:G.text, marginBottom:4 }}>{money(job.price)}</div>}
                <div style={{ fontSize:12, color:G.textLight }}>{isExpanded?"▲ Collapse":"▼ Expand"}</div>
              </div>
            </div>

            {isExpanded && (
              <div style={{ marginTop:16, borderTop:`1px solid ${G.border}`, paddingTop:16 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                  <div style={{ padding:"12px 14px", background:G.bg, borderRadius:10 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:10 }}>CUSTOMER PROFILE</div>
                    <div style={{ fontSize:14, fontWeight:600, color:G.text, marginBottom:6 }}>{c?.name}</div>
                    <div style={{ fontSize:12, color:G.textMuted, marginBottom:3 }}>📞 {c?.phone}</div>
                    <div style={{ fontSize:12, color:G.textMuted, marginBottom:3 }}>✉️ {c?.email}</div>
                    <div style={{ fontSize:12, color:G.textMuted, marginBottom:3 }}>📍 {c?.address}</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>🏷️ {c?.type}</div>
                  </div>
                  <div style={{ padding:"12px 14px", background:G.bg, borderRadius:10 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:10 }}>JOB SUMMARY</div>
                    {[["Tech",job.tech],["Date",job.date],["Time",job.time],["Pest",job.pestType],["Payment",job.paymentMethod||"—"],["Invoice",job.paid?"Paid ✓":"Unpaid ⚠️"]].map(([k,v])=>(
                      <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:`1px solid ${G.border}`, fontSize:12 }}>
                        <span style={{ color:G.textMuted }}>{k}</span>
                        <span style={{ color:G.text, fontWeight:500 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {job.conversation && (
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:10 }}>CONVERSATION HISTORY ({job.conversation.length} messages)</div>
                    <div style={{ maxHeight:200, overflowY:"auto", display:"flex", flexDirection:"column", gap:8 }}>
                      {job.conversation.slice(-4).map((m,i)=>(
                        <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.from==="customer"?"flex-start":"flex-end" }}>
                          <div style={{ fontSize:10, color:G.textLight, marginBottom:2 }}>{m.from==="customer"?c?.name.split(" ")[0]:"OS"} · {m.time}</div>
                          <div style={{ maxWidth:"85%", padding:"8px 12px", borderRadius:10, fontSize:12, lineHeight:1.5, color:m.from==="os"?"#fff":G.text, background:m.from==="os"?G.green:G.bg, border:m.from==="customer"?`1px solid ${G.border}`:"none" }}>{m.msg}</div>
                        </div>
                      ))}
                    </div>
                    <button onClick={()=>{setSelectedJob(job.id);setActive("d1");}} style={{ marginTop:10, fontSize:12, color:G.green, background:"none", border:"none", cursor:"pointer", fontFamily:"inherit", padding:0 }}>View full conversation →</button>
                  </div>
                )}
                {job.notes && <div style={{ padding:"10px 12px", background:G.amberLight, borderRadius:8, fontSize:12, color:G.amber, fontStyle:"italic" }}>{job.notes}</div>}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── D4 — QUOTES & REVENUE ────────────────────────────────────────────────────
function D4Quotes() {
  const paid = JOBS.filter(j=>j.paid).reduce((s,j)=>s+j.price,0);
  const pending = JOBS.filter(j=>!j.paid&&j.price>0).reduce((s,j)=>s+j.price,0);
  const overdue = JOBS.filter(j=>j.status==="Overdue").reduce((s,j)=>s+j.price,0);
  const pipeline = JOBS.filter(j=>["Booked","In Progress","New Lead"].includes(j.status)).reduce((s,j)=>s+j.price,0);
  return (
    <div>
      <SectionHeader title="D4 — Quoting & Revenue" sub="Owner view only. Financial snapshot for the week." />
      <div style={{ display:"flex", gap:14, marginBottom:24 }}>
        <MetricCard label="Revenue collected"    value={money(paid)}    accent={G.green} />
        <MetricCard label="Pending invoices"     value={money(pending)} accent={G.amber} />
        <MetricCard label="Overdue"              value={money(overdue)} accent={G.red} />
        <MetricCard label="Pipeline (open jobs)" value={money(pipeline)} accent={G.blue} />
      </div>
      <Card>
        <div style={{ fontSize:14, fontWeight:600, color:G.text, marginBottom:14 }}>All jobs — financial status</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:G.bg, borderBottom:`1px solid ${G.border}` }}>
              {["Job","Customer","Service","Tech","Value","Status","Payment"].map(h=>(
                <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {JOBS.filter(j=>j.price>0).map(job=>{
              const c=getCustomer(job.customerId);
              return (
                <tr key={job.id} style={{ borderBottom:`1px solid ${G.border}` }}>
                  <td style={{ padding:"11px 14px", fontSize:12, fontWeight:600, color:G.textMuted }}>{job.id}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, color:G.text }}>{c?.name}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, color:G.text }}>{job.pestType}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, color:G.text }}>{job.tech||"—"}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, fontWeight:700, color:G.text }}>{money(job.price)}</td>
                  <td style={{ padding:"11px 14px" }}><StatusBadge status={job.status} /></td>
                  <td style={{ padding:"11px 14px", fontSize:12, color:job.paid?G.green:G.red, fontWeight:500 }}>{job.paid?"✓ Paid":job.status==="Overdue"?"⚠️ Overdue":"⏳ Pending"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── D5 — COMPLIANCE ─────────────────────────────────────────────────────────
function D5Compliance() {
  const records = JOBS.filter(j=>j.complianceRecord);
  return (
    <div>
      <SectionHeader title="D5 — Job Documentation & Compliance" sub="Ontario Pesticides Act records. Auto-generated for every job." />
      {records.map(job=>{
        const c=getCustomer(job.customerId);
        const r=job.complianceRecord;
        return (
          <Card key={job.id} style={{ marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:G.text }}>{c?.name} — {job.id}</div>
                <div style={{ fontSize:12, color:G.textMuted }}>{r.date} · {r.tech} · {r.pest}</div>
              </div>
              <div style={{ padding:"4px 10px", borderRadius:20, background:G.greenLight, fontSize:11, color:G.green, fontWeight:600 }}>✓ Compliant</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6 }}>
              {[["Product",r.product],["License",r.license],["Area",r.area],["Units",r.units]].map(([k,v])=>(
                <div key={k} style={{ fontSize:12, color:G.textMuted }}><span style={{ fontWeight:600, color:G.text }}>{k}: </span>{v}</div>
              ))}
            </div>
            {r.notes && <div style={{ marginTop:8, fontSize:12, color:G.textMuted, fontStyle:"italic" }}>{r.notes}</div>}
          </Card>
        );
      })}
    </div>
  );
}

// ─── D6 — INVOICING ──────────────────────────────────────────────────────────
function D6Invoicing() {
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const invoiceJobs = JOBS.filter(j=>j.price>0&&["Completed","Overdue","Invoiced","Booked","In Progress"].includes(j.status));

  return (
    <div>
      <SectionHeader title="D6 — Invoicing & Collections" sub="Owner view only. Click any invoice to view full details." />
      {invoiceJobs.map(job=>{
        const c=getCustomer(job.customerId);
        const isExpanded = expandedInvoice===job.id;
        const daysOut = job.status==="Overdue"?18:job.paid?0:3;
        const invoiceNum = job.id.replace("J-","");
        return (
          <Card key={job.id} style={{ marginBottom:12, borderLeft:job.status==="Overdue"?`4px solid ${G.red}`:job.paid?`4px solid ${G.green}`:`4px solid ${G.amberMid}`, cursor:"pointer" }} onClick={()=>setExpandedInvoice(isExpanded?null:job.id)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:G.text }}>Invoice #{invoiceNum} — {c?.name}</div>
                <div style={{ fontSize:12, color:G.textMuted, marginTop:2 }}>{job.pestType} · {job.date} · {job.paymentMethod||"Credit card"} · {job.tech}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:700, color:job.paid?G.green:job.status==="Overdue"?G.red:G.amber }}>{money(job.price)}</div>
                <div style={{ fontSize:12, color:job.paid?G.green:job.status==="Overdue"?G.red:G.amber, fontWeight:500 }}>
                  {job.paid?"✓ Paid":job.status==="Overdue"?`⚠️ ${daysOut} days overdue`:`${daysOut} days outstanding`}
                </div>
                <div style={{ fontSize:11, color:G.textLight, marginTop:4 }}>{isExpanded?"▲ Close":"▼ View invoice"}</div>
              </div>
            </div>

            {isExpanded && (
              <div style={{ marginTop:16, borderTop:`1px solid ${G.border}`, paddingTop:16 }} onClick={e=>e.stopPropagation()}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:16 }}>
                  <div>
                    <div style={{ fontSize:20, fontWeight:700, color:G.text, marginBottom:4 }}>INVOICE #{invoiceNum}</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>Henry the Exterminator</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>Greater Toronto Area · ON Pesticides Lic.</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>henry@henryexterminator.ca · (416) 555-0100</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ padding:"6px 14px", borderRadius:20, background:job.paid?G.greenLight:G.redLight, color:job.paid?G.green:G.red, fontSize:13, fontWeight:700, marginBottom:8 }}>
                      {job.paid?"PAID":"UNPAID"}
                    </div>
                    <div style={{ fontSize:12, color:G.textMuted }}>Date: {job.date}</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>Terms: {job.paymentMethod?.includes("net")?job.paymentMethod:"Due on receipt"}</div>
                  </div>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16 }}>
                  <div style={{ padding:"10px 14px", background:G.bg, borderRadius:8 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:G.textLight, marginBottom:8, letterSpacing:"0.04em" }}>BILL TO</div>
                    <div style={{ fontSize:13, fontWeight:600, color:G.text }}>{c?.name}</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>{c?.address}</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>{c?.phone}</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>{c?.email}</div>
                  </div>
                  <div style={{ padding:"10px 14px", background:G.bg, borderRadius:8 }}>
                    <div style={{ fontSize:11, fontWeight:600, color:G.textLight, marginBottom:8, letterSpacing:"0.04em" }}>SERVICE DETAILS</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>Technician: {job.tech}</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>Service: {job.pestType} Treatment</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>Date: {job.date} at {job.time}</div>
                    <div style={{ fontSize:12, color:G.textMuted }}>Type: {c?.type}</div>
                  </div>
                </div>
                <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:14 }}>
                  <thead>
                    <tr style={{ background:G.bg, borderBottom:`1px solid ${G.border}` }}>
                      {["Description","Qty","Rate","Amount"].map(h=>(
                        <th key={h} style={{ padding:"8px 12px", textAlign:"left", fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom:`1px solid ${G.border}` }}>
                      <td style={{ padding:"10px 12px", fontSize:13, color:G.text }}>{job.pestType} Inspection & Treatment</td>
                      <td style={{ padding:"10px 12px", fontSize:13, color:G.text }}>1</td>
                      <td style={{ padding:"10px 12px", fontSize:13, color:G.text }}>{money(Math.round(job.price*0.85))}</td>
                      <td style={{ padding:"10px 12px", fontSize:13, fontWeight:600, color:G.text }}>{money(Math.round(job.price*0.85))}</td>
                    </tr>
                    <tr style={{ borderBottom:`1px solid ${G.border}` }}>
                      <td style={{ padding:"10px 12px", fontSize:13, color:G.text }}>Materials & product application</td>
                      <td style={{ padding:"10px 12px", fontSize:13, color:G.text }}>1</td>
                      <td style={{ padding:"10px 12px", fontSize:13, color:G.text }}>{money(Math.round(job.price*0.15))}</td>
                      <td style={{ padding:"10px 12px", fontSize:13, fontWeight:600, color:G.text }}>{money(Math.round(job.price*0.15))}</td>
                    </tr>
                    <tr style={{ background:G.bg }}>
                      <td colSpan={3} style={{ padding:"10px 12px", fontSize:14, fontWeight:700, color:G.text, textAlign:"right" }}>TOTAL</td>
                      <td style={{ padding:"10px 12px", fontSize:14, fontWeight:700, color:G.text }}>{money(job.price)}</td>
                    </tr>
                  </tbody>
                </table>
                {!job.paid && (
                  <div style={{ padding:"10px 14px", background:job.status==="Overdue"?G.redLight:G.amberLight, borderRadius:8, fontSize:12, color:job.status==="Overdue"?G.red:G.amber }}>
                    {job.status==="Overdue"?"⚠️ Follow-ups sent at 7 and 10 days. No response. Direct call recommended to "+c?.phone+".":"⏰ Automated follow-up scheduled at 7 days if unpaid."}
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── MESSAGES + OS CHAT ──────────────────────────────────────────────────────
const OS_CHAT_SYSTEM = `You are the operating system (OS) for Henry the Exterminator, a pest control company in the Greater Toronto Area. You are having a direct conversation with the business owner (Henry) or technician (Daniel).

Current job awareness:
- J-1039: Halton Property Mgmt — Maria completed. Paid $580.
- J-1040: Stephanie Noel — Bruce completed cockroaches. Paid $160.
- J-1041: Linda Tremblay — overdue invoice $185. 18 days unpaid. Follow-ups sent at 7 and 10 days.
- J-1042: Sandra Okafor — emergency mice, Daniel completed. Paid $210.
- J-1043: David Park — Bruce booked for cockroaches Mar 31.
- J-1044: Parkway Grill (Marcus Webb) — Daniel in progress now, rodents. Contract opportunity.
- J-1045: Raymond Xu — bed bug lead. Has name + email, still needs unit number and phone.
- J-1046: James Kowalski — cold wasp lead, no response in 5 days.
- J-1047: Aisha Mensah — Bruce no-show, ants. URGENT. Customer waiting at 55 Dufferin St.
- J-1048: Sunrise Daycare — cancelled by customer.
- J-1049: Linda Tremblay — vague bug inquiry, being qualified.

When the human gives an instruction, confirm what action you are taking. Be specific about the job and action. Keep it concise. Always confirm what you did.

Respond with ONLY valid JSON:
{
  "osReply": "Your response — what you heard and what you're doing",
  "actionTaken": "Specific action executed (e.g. 'Sent follow-up text to James Kowalski at 416-223-8871')",
  "affectedJob": "Job ID or null",
  "affectedCustomer": "Customer name or null"
}`;

function Messages({ role, osMessages }) {
  const myMessages = osMessages.filter(m => role==="owner" ? m.for==="owner" : m.for==="tech");
  const priorityColor = { urgent:G.red, high:G.amber, normal:G.blue, low:G.textMuted };
  const [chatMessages, setChatMessages] = useState([
    { from:"os", text:role==="owner"?"Hi Henry — I'm monitoring everything. What do you need?":"Hi Daniel — what do you need from me?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [chatMessages]);

  const sendToOS = async () => {
    if (!chatInput.trim()||chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { from:"human", text:userMsg }]);
    setChatLoading(true);
    try {
      const res = await fetch("/api/proxy", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ model:"claude-haiku-4-5", max_tokens:600, system:OS_CHAT_SYSTEM, messages:[{ role:"user", content:userMsg }] }),
      });
      const data = await res.json();
      const text = (data.content||[]).map(b=>b.text||"").join("");
      const clean = text.replace(/```json\n?|\n?```/g,"").trim();
      const parsed = JSON.parse(clean);
      setChatMessages(prev => [...prev, { from:"os", text:parsed.osReply, action:parsed.actionTaken, affectedCustomer:parsed.affectedCustomer }]);
    } catch(e) {
      setChatMessages(prev => [...prev, { from:"os", text:"Something went wrong. Try again." }]);
    }
    setChatLoading(false);
  };

  return (
    <div>
      <SectionHeader title="Messages — OS to Human" sub="The OS flags cases that need your attention. Reply directly to give instructions." />

      {myMessages.length===0 && (
        <Card style={{ textAlign:"center", padding:"30px 20px", marginBottom:20 }}>
          <div style={{ fontSize:32, marginBottom:12 }}>✓</div>
          <div style={{ fontSize:14, color:G.textMuted }}>No flags. Everything is running automatically.</div>
        </Card>
      )}
      {myMessages.map(m=>{
        const job = JOBS.find(j=>j.id===m.jobId);
        const c = job ? getCustomer(job.customerId) : null;
        return (
          <Card key={m.id} style={{ marginBottom:14, borderLeft:`4px solid ${priorityColor[m.priority]||G.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                  <span style={{ fontSize:11, padding:"2px 8px", borderRadius:10, background:priorityColor[m.priority]+"22", color:priorityColor[m.priority], fontWeight:700, textTransform:"uppercase" }}>{m.priority}</span>
                  <span style={{ fontSize:12, color:G.textLight }}>{m.time}</span>
                </div>
                <div style={{ fontSize:14, fontWeight:700, color:G.text }}>{m.subject}</div>
                {c && <div style={{ fontSize:12, color:G.textMuted, marginTop:2 }}>{m.jobId} · {c.name}</div>}
              </div>
            </div>
            <div style={{ fontSize:13, color:G.text, lineHeight:1.6, padding:"10px 14px", background:G.bg, borderRadius:8 }}>{m.body}</div>
          </Card>
        );
      })}

      <div style={{ marginTop:24 }}>
        <div style={{ fontSize:13, fontWeight:600, color:G.textMuted, marginBottom:12, letterSpacing:"0.03em" }}>DIRECT CHAT — GIVE THE OS AN INSTRUCTION</div>
        <Card style={{ padding:0, overflow:"hidden" }}>
          <div style={{ padding:"12px 16px", background:G.greenLight, borderBottom:`1px solid ${G.border}` }}>
            <div style={{ fontSize:12, fontWeight:600, color:G.green }}>OS Chat · Live</div>
            <div style={{ fontSize:11, color:G.green, opacity:0.8 }}>Type a task or instruction — the OS will act on it</div>
          </div>
          <div style={{ height:300, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:10 }}>
            {chatMessages.map((m,i)=>(
              <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:m.from==="human"?"flex-end":"flex-start" }}>
                <div style={{ fontSize:10, color:G.textLight, marginBottom:3 }}>{m.from==="human"?(role==="owner"?"Henry (Owner)":"Daniel (Tech)"):"OS"}</div>
                <div style={{ maxWidth:"80%", padding:"10px 14px", borderRadius:12, fontSize:13, lineHeight:1.6, background:m.from==="human"?G.blue:G.green, color:"#fff" }}>{m.text}</div>
                {m.action && (
                  <div style={{ maxWidth:"80%", marginTop:4, padding:"6px 12px", borderRadius:8, fontSize:11, background:G.greenLight, color:G.green, fontWeight:500 }}>
                    ✓ {m.action}{m.affectedCustomer?" · "+m.affectedCustomer:""}
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-start" }}>
                <div style={{ fontSize:10, color:G.textLight, marginBottom:3 }}>OS</div>
                <div style={{ padding:"10px 14px", borderRadius:12, fontSize:13, background:G.green, color:"#fff" }}>Processing...</div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding:"12px 16px", borderTop:`1px solid ${G.border}`, display:"flex", gap:10 }}>
            <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendToOS()}
              placeholder={role==="owner"?"e.g. 'Try Kowalski one more time' or 'Reschedule Aisha to Tuesday 10am'...":"e.g. 'I'm running 20 minutes late for Parkway Grill'..."}
              style={{ flex:1, padding:"10px 14px", borderRadius:8, border:`1px solid ${G.border}`, fontSize:13, fontFamily:"inherit", outline:"none", color:G.text }} />
            <button onClick={sendToOS} disabled={chatLoading||!chatInput.trim()} style={{ padding:"10px 20px", borderRadius:8, border:"none", background:chatLoading||!chatInput.trim()?G.border:G.green, color:"#fff", fontSize:13, fontWeight:600, cursor:chatLoading||!chatInput.trim()?"not-allowed":"pointer", fontFamily:"inherit" }}>Send</button>
          </div>
        </Card>
        <div style={{ marginTop:8, fontSize:11, color:G.textLight }}>
          {role==="owner" ? "Try: \"Follow up with Kowalski\" · \"Reschedule Aisha to Tuesday 10am\" · \"Call Linda about her invoice\" · \"Update me on Parkway Grill\"" : "Try: \"I'm running late for Parkway Grill\" · \"Job complete at Parkway Grill\" · \"Customer wasn't home\""}
        </div>
      </div>
    </div>
  );
}

// ─── WEEKLY SUMMARY ───────────────────────────────────────────────────────────
function WeeklySummary() {
  const weekJobs = getWeekJobs();
  const weekRev = getWeekRevenue();
  const outstanding = getOutstanding();
  const completedCount = weekJobs.filter(j=>j.status==="Completed").length;
  const techBreakdown = TECHNICIANS.map(tech => {
    const techJobs = weekJobs.filter(j=>j.tech===tech.name);
    const techRev = techJobs.filter(j=>j.paid).reduce((s,j)=>s+j.price,0);
    return { ...tech, jobs:techJobs, rev:techRev, completed:techJobs.filter(j=>j.status==="Completed").length };
  });

  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:22, fontWeight:700, color:G.text, margin:0 }}>Weekly Summary</h1>
          <p style={{ fontSize:13, color:G.textMuted, margin:"4px 0 0" }}>Week of March 24–30, 2026 · Auto-generated Monday 7:00 AM</p>
        </div>
        <div style={{ padding:"5px 12px", borderRadius:20, background:G.greenLight, fontSize:12, color:G.green, fontWeight:600 }}>Auto-generated by OS</div>
      </div>
      <div style={{ display:"flex", gap:14, marginBottom:24 }}>
        <MetricCard label="Revenue this week" value={money(weekRev)} sub={`${completedCount} jobs completed`} accent={G.green} />
        <MetricCard label="Jobs this week"    value={weekJobs.length} sub="Across all technicians" />
        <MetricCard label="Completed"         value={completedCount} sub="Paid and closed" accent={G.green} />
        <MetricCard label="Outstanding"       value={money(outstanding)} sub="Across open invoices" accent={G.red} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
        <Card>
          <div style={{ fontSize:13, fontWeight:600, color:G.text, marginBottom:14 }}>Jobs this week ({weekJobs.length})</div>
          {weekJobs.map(job=>{
            const c=getCustomer(job.customerId);
            return (
              <div key={job.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${G.border}` }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:G.text }}>{c?.name}</div>
                  <div style={{ fontSize:11, color:G.textMuted }}>{job.pestType} · {job.tech||"Unassigned"} · {job.date}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  {job.price>0 && <div style={{ fontSize:12, fontWeight:600, color:G.text }}>{money(job.price)}</div>}
                  <StatusBadge status={job.status} />
                </div>
              </div>
            );
          })}
        </Card>
        <Card>
          <div style={{ fontSize:13, fontWeight:600, color:G.text, marginBottom:14 }}>Technician breakdown</div>
          {techBreakdown.map(tech=>(
            <div key={tech.id} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <div style={{ fontSize:13, fontWeight:600, color:G.text }}>{tech.name}</div>
                <div style={{ fontSize:13, fontWeight:600, color:G.green }}>{money(tech.rev)}</div>
              </div>
              <div style={{ fontSize:12, color:G.textMuted, marginBottom:5 }}>{tech.jobs.length} jobs · {tech.completed} completed</div>
              <div style={{ height:5, background:G.border, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", background:tech.color, borderRadius:3, width:`${weekRev>0?Math.min((tech.rev/weekRev)*100,100):0}%` }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop:10, padding:"10px 12px", background:G.bg, borderRadius:8, fontSize:12, color:G.textMuted }}>
            <div style={{ fontWeight:600, color:G.text, marginBottom:4 }}>OS actions this week</div>
            <div>· {weekJobs.length} leads received and responded to automatically</div>
            <div>· {weekJobs.filter(j=>!["New Lead","No Response","Cancelled"].includes(j.status)).length} jobs booked automatically</div>
            <div>· {weekJobs.filter(j=>["Completed","Overdue"].includes(j.status)).length} invoices generated and sent</div>
            <div>· {JOBS.filter(j=>j.humanFlag).length} edge cases flagged to owner for action</div>
            <div>· 0 tasks handled manually by owner (except flags above)</div>
          </div>
        </Card>
      </div>
      <Card style={{ borderLeft:`3px solid ${G.amber}` }}>
        <div style={{ fontSize:13, fontWeight:600, color:G.text, marginBottom:12 }}>Needs your attention this week</div>
        <div style={{ display:"flex", gap:10, flexDirection:"column" }}>
          {JOBS.filter(j=>j.humanFlag).map(job=>{
            const c=getCustomer(job.customerId);
            return (
              <div key={job.id} style={{ fontSize:13, color:G.text }}>
                {job.status==="Overdue"?"⏰":"🚨"} <strong>{job.id}</strong> ({c?.name}) — {job.humanFlag.msg}
              </div>
            );
          })}
          <div style={{ fontSize:13, color:G.text }}>🛏 <strong>J-1045</strong> (Raymond Xu — bed bugs) — Still needs unit number and phone. High urgency.</div>
          <div style={{ fontSize:13, color:G.text }}>🤝 <strong>Parkway Grill</strong> — Monthly contract opportunity. Daniel on site now — follow up this afternoon.</div>
        </div>
        <div style={{ marginTop:12, fontSize:12, color:G.textLight, fontStyle:"italic" }}>Everything else ran automatically. These are the only items that need a human.</div>
      </Card>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [role, setRole] = useState("owner");
  const [selectedJob, setSelectedJob] = useState(null);
  const [osMessages] = useState(INITIAL_OS_MESSAGES);

  const handleSetActive = id => { setActive(id); setSelectedJob(null); };
  const handleSetRole = r => { setRole(r); setActive(r==="owner"?"dashboard":"techdash"); setSelectedJob(null); };

  const renderPanel = () => {
    if (selectedJob && active!=="messages") {
      const job = JOBS.find(j=>j.id===selectedJob);
      if (job) return <JobDetail job={job} onBack={()=>setSelectedJob(null)} />;
    }
    switch(active) {
      case "dashboard": return <OwnerDashboard setActive={handleSetActive} setSelectedJob={setSelectedJob} osMessages={osMessages} />;
      case "techdash":  return <TechDashboard  setActive={handleSetActive} osMessages={osMessages} />;
      case "d1":        return <D1LeadMgmt     selectedJob={selectedJob} setSelectedJob={setSelectedJob} />;
      case "d2":        return <D2Calendar role={role} />;
      case "d3":        return role==="owner" ? <D3CompletedJobs setSelectedJob={setSelectedJob} setActive={handleSetActive} /> : <D2Calendar role={role} />;
      case "d4":        return <D4Quotes />;
      case "d5":        return <D5Compliance />;
      case "d6":        return <D6Invoicing />;
      case "messages":  return <Messages role={role} osMessages={osMessages} />;
      case "summary":   return <WeeklySummary />;
      default:          return <OwnerDashboard setActive={handleSetActive} setSelectedJob={setSelectedJob} osMessages={osMessages} />;
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans', system-ui, sans-serif", background:G.bg }}>
      <Sidebar active={active} setActive={handleSetActive} role={role} setRole={handleSetRole} osMessages={osMessages} />
      <main style={{ flex:1, padding:"28px 32px", overflowY:"auto", maxWidth:"calc(100vw - 228px)" }}>
        {renderPanel()}
      </main>
    </div>
  );
}
