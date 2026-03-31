import { useState } from "react";

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
  "New Lead":    { color: G.blue,   bg: G.blueLight,   dot: "#2563eb" },
  "Booked":      { color: G.amber,  bg: G.amberLight,  dot: "#d97706" },
  "In Progress": { color: G.green,  bg: G.greenLight,  dot: "#16a34a" },
  "Completed":   { color: "#374151",bg: "#f3f4f6",     dot: "#6b7280" },
  "Invoiced":    { color: G.red,    bg: G.redLight,    dot: "#dc2626" },
  "Overdue":     { color: G.red,    bg: G.redLight,    dot: "#dc2626" },
  "Cancelled":   { color: "#6b7280",bg: "#f3f4f6",     dot: "#9ca3af" },
  "No Response": { color: G.amber,  bg: G.amberLight,  dot: "#d97706" },
};

const URGENCY_CFG = {
  "Emergency": { color: G.red,      bg: G.redLight },
  "High":      { color: G.amber,    bg: G.amberLight },
  "Normal":    { color: G.green,    bg: G.greenLight },
  "Low":       { color: G.textMuted,bg: "#f3f4f6" },
};

const TIMELINE_COLORS = {
  lead: "#2563eb", os: G.green, booked: "#7c3aed",
  comms: "#0891b2", complete: "#16a34a", invoice: G.amber,
  paid: G.green, flag: G.red, cancelled: "#6b7280",
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CUSTOMERS = [
  { id:"c1", name:"Sandra Okafor",       phone:"647-882-3341", email:"sandra.okafor@gmail.com",  address:"44 Birchwood Ave, Scarborough, ON M1K 2P3",         type:"residential" },
  { id:"c2", name:"David Park",          phone:"416-554-7821", email:"dpark@outlook.com",          address:"312 Royal York Rd Unit 4B, Etobicoke, ON M8Y 2T5", type:"residential" },
  { id:"c3", name:"Parkway Grill (Marcus Webb)", phone:"416-901-2234", email:"marcus@parkwaygrill.ca", address:"88 King St W, Toronto, ON M5H 1J4",            type:"commercial"  },
  { id:"c4", name:"Linda Tremblay",      phone:"905-443-8812", email:"ltremblay@hotmail.com",      address:"19 Elmwood Cres, North York, ON M3A 1B6",          type:"residential" },
  { id:"c5", name:"Raymond Xu",          phone:"647-221-5509", email:"raymond.xu@gmail.com",       address:"77 Sheppard Ave E #902, Toronto, ON M2N 6S3",      type:"residential" },
  { id:"c6", name:"Stephanie Noel",      phone:"416-778-4423", email:"snoel@live.ca",              address:"5 Glenwood Ave, East York, ON M4E 2K7",            type:"residential" },
  { id:"c7", name:"Halton Property Mgmt",phone:"905-334-1190", email:"ops@haltonpm.ca",            address:"Multiple units — Mississauga portfolio",           type:"commercial"  },
  { id:"c8", name:"James Kowalski",      phone:"416-223-8871", email:"jkowalski@gmail.com",        address:"202 Brimley Rd, Scarborough, ON M1P 3B7",          type:"residential" },
  { id:"c9", name:"Aisha Mensah",        phone:"647-554-2210", email:"aisha.mensah@hotmail.com",   address:"55 Dufferin St, Toronto, ON M6K 2B6",              type:"residential" },
  { id:"c10",name:"Sunrise Daycare",     phone:"905-664-9981", email:"admin@sunrisedaycare.ca",    address:"12 Sunrise Blvd, Brampton, ON L6T 2P4",            type:"commercial"  },
];

const JOBS = [
  // J-1039: Completed + Paid (commercial, contract signed)
  {
    id:"J-1039", customerId:"c7", pestType:"Rodents", tech:"Henry", status:"Completed", urgency:"Normal",
    date:"2026-03-20", time:"9:00 AM", price:580, paid:true, paymentMethod:"Invoice (net 30)",
    notes:"3-unit Mississauga portfolio inspection. Entry points sealed. Monthly contract signed.",
    conversation:[
      { from:"customer", time:"Mar 18, 11:00 AM", msg:"We manage a residential portfolio in Mississauga and need regular pest inspections with documentation across multiple units. Can you handle commercial accounts?" },
      { from:"os",       time:"Mar 18, 11:00 AM", msg:"Hi — yes, commercial and multi-unit accounts are something we specialize in, with full documentation for every visit. I'd like to get Henry out to your Mississauga properties for an initial walkthrough and we can set up a monthly program from there. What works best for your schedule this week?" },
      { from:"customer", time:"Mar 18, 1:30 PM",  msg:"Thursday morning works. Can you do 9am?" },
      { from:"os",       time:"Mar 18, 1:31 PM",  msg:"Perfect — Henry is confirmed for Thursday March 20 at 9:00 AM. You'll get a confirmation email shortly, plus a reminder the morning of. Looking forward to getting your properties sorted." },
      { from:"os",       time:"Mar 20, 8:00 AM",  msg:"Good morning — just a reminder that Henry is on his way to your Mississauga properties. ETA 9:00 AM. He'll document all entry points and treatment areas for your records." },
      { from:"os",       time:"Mar 20, 11:45 AM", msg:"Henry has completed the 3-unit inspection. Invoice #1039 for $580.00 (net 30) has been sent to ops@haltonpm.ca. A monthly prevention contract proposal is attached — please review at your convenience." },
    ],
    timeline:[
      { time:"Mar 18, 11:00 AM", event:"Lead received",       detail:"Inbound email — commercial multi-unit inquiry", type:"lead" },
      { time:"Mar 18, 11:00 AM", event:"OS responded",        detail:"Commercial inquiry response sent within 60 seconds", type:"os" },
      { time:"Mar 18, 1:31 PM",  event:"Job booked",          detail:"Henry assigned, Mar 20 9:00 AM confirmed", type:"booked" },
      { time:"Mar 18, 1:31 PM",  event:"Confirmation sent",   detail:"Booking confirmation sent to ops@haltonpm.ca", type:"comms" },
      { time:"Mar 20, 8:00 AM",  event:"Day-of reminder sent",detail:"ETA notification sent", type:"comms" },
      { time:"Mar 20, 11:30 AM", event:"Job completed",       detail:"Henry — 3-unit inspection complete", type:"complete" },
      { time:"Mar 20, 11:30 AM", event:"Invoice sent",        detail:"Invoice #1039 — $580.00 net 30", type:"invoice" },
      { time:"Mar 21, 9:00 AM",  event:"Payment received",    detail:"Invoice paid — $580.00", type:"paid" },
    ],
    complianceRecord:{ date:"2026-03-20", tech:"Henry", license:"ON-4821", pest:"Rodents", product:"Contrac Blox", units:"3", area:"Mississauga portfolio", notes:"Entry points sealed at all units. Bait stations installed in utility rooms." }
  },

  // J-1040: Completed + Paid (routine)
  {
    id:"J-1040", customerId:"c6", pestType:"Cockroaches", tech:"Bruce", status:"Completed", urgency:"Normal",
    date:"2026-03-21", time:"1:00 PM", price:160, paid:true, paymentMethod:"Credit card",
    notes:"Cockroaches in kitchen, treated baseboards and under appliances.",
    conversation:[
      { from:"customer", time:"Mar 19, 9:00 AM", msg:"Hi, we've been seeing cockroaches in our kitchen for about a week now. A few in the mornings. We're in East York." },
      { from:"os",       time:"Mar 19, 9:00 AM", msg:"Hi Stephanie! A week of cockroach sightings means it's time to act before they settle in. Bruce can come out to your East York home this week. Are you available Thursday or Friday afternoon? I'll get a confirmation sent right away." },
      { from:"customer", time:"Mar 19, 9:15 AM", msg:"Friday works. Afternoon is fine." },
      { from:"os",       time:"Mar 19, 9:16 AM", msg:"Done — Bruce is confirmed for Friday March 21 at 1:00 PM. You'll get a reminder tomorrow evening. See you then!" },
      { from:"os",       time:"Mar 20, 6:00 PM", msg:"Just a reminder that Bruce is coming to your East York home tomorrow (Friday) at 1:00 PM. No prep needed on your end." },
      { from:"os",       time:"Mar 21, 12:30 PM",msg:"Bruce is about 30 minutes away. See you shortly!" },
      { from:"os",       time:"Mar 21, 3:00 PM", msg:"Bruce has completed your cockroach treatment. Invoice #1040 for $160.00 has been sent. How was the service? A quick Google review would mean a lot to us!" },
    ],
    timeline:[
      { time:"Mar 19, 9:00 AM", event:"Lead received",        detail:"Inbound web form", type:"lead" },
      { time:"Mar 19, 9:00 AM", event:"OS responded",         detail:"Acknowledgment sent within 60 seconds", type:"os" },
      { time:"Mar 19, 9:16 AM", event:"Job booked",           detail:"Bruce assigned, Mar 21 1:00 PM", type:"booked" },
      { time:"Mar 19, 9:16 AM", event:"Confirmation sent",    detail:"Confirmation sent to snoel@live.ca", type:"comms" },
      { time:"Mar 20, 6:00 PM", event:"Reminder sent",        detail:"24h reminder sent", type:"comms" },
      { time:"Mar 21, 12:30 PM",event:"Day-of ETA sent",      detail:"ETA notification sent", type:"comms" },
      { time:"Mar 21, 2:45 PM", event:"Job completed",        detail:"Bruce marked complete", type:"complete" },
      { time:"Mar 21, 2:45 PM", event:"Invoice sent",         detail:"Invoice #1040 — $160.00", type:"invoice" },
      { time:"Mar 21, 4:30 PM", event:"Payment received",     detail:"Credit card — $160.00 collected", type:"paid" },
      { time:"Mar 21, 4:31 PM", event:"Review request sent",  detail:"Follow-up + review request sent", type:"comms" },
    ],
    complianceRecord:{ date:"2026-03-21", tech:"Bruce", license:"ON-3190", pest:"Cockroaches", product:"Maxforce FC Magnum", units:"1", area:"Kitchen — baseboards and under appliances", notes:"Treatment applied to kitchen perimeter. Follow-up recommended in 30 days." }
  },

  // J-1041: Invoiced — OVERDUE (no payment, past 7 days)
  {
    id:"J-1041", customerId:"c4", pestType:"Mice", tech:"Bruce", status:"Overdue", urgency:"Normal",
    date:"2026-03-19", time:"11:00 AM", price:185, paid:false, paymentMethod:"Credit card",
    notes:"Scratching in walls, droppings in pantry. Bruce set bait stations. Invoice now 9 days overdue — OS has sent 2 follow-ups. Flagged for owner action.",
    humanFlag:{ type:"owner", msg:"Invoice #1041 is 9 days overdue. Two automated follow-ups sent with no response. Recommend a direct call to Linda Tremblay at 905-443-8812.", flaggedAt:"Mar 28, 8:00 AM" },
    conversation:[
      { from:"customer", time:"Mar 17, 7:30 PM", msg:"Hi, I've been hearing scratching in my walls at night and found some droppings in my pantry. I think I might have mice. I'm in North York." },
      { from:"os",       time:"Mar 17, 7:30 PM", msg:"Hi Linda! Scratching in walls and droppings are classic signs of mice — the good news is this is very treatable. We can get Bruce out to your North York home this week. Does Monday or Tuesday work for you?" },
      { from:"customer", time:"Mar 17, 7:45 PM", msg:"Monday works!" },
      { from:"os",       time:"Mar 17, 7:46 PM", msg:"Bruce is confirmed for Monday March 19 at 11:00 AM. Confirmation sent to ltremblay@hotmail.com. See you Monday!" },
      { from:"os",       time:"Mar 18, 6:00 PM", msg:"Just a reminder that Bruce is coming tomorrow (Monday) at 11:00 AM. No special preparation needed." },
      { from:"os",       time:"Mar 19, 10:30 AM",msg:"Bruce is about 30 minutes away!" },
      { from:"os",       time:"Mar 19, 12:45 PM",msg:"Bruce has completed your mice treatment. Invoice #1041 for $185.00 has been sent to ltremblay@hotmail.com. Payment is due within 7 days." },
      { from:"os",       time:"Mar 26, 9:00 AM", msg:"Hi Linda — just a friendly reminder that invoice #1041 for $185.00 is now due. You can pay online using the link in your original invoice email. Let me know if you have any questions!" },
      { from:"os",       time:"Mar 28, 8:00 AM", msg:"⚠️ Invoice #1041 remains unpaid at 9 days. Flagging to Henry for direct follow-up." },
    ],
    timeline:[
      { time:"Mar 17, 7:30 PM",  event:"Lead received",        detail:"Inbound web form", type:"lead" },
      { time:"Mar 17, 7:30 PM",  event:"OS responded",         detail:"Acknowledgment sent within 60 seconds", type:"os" },
      { time:"Mar 17, 7:46 PM",  event:"Job booked",           detail:"Bruce assigned, Mar 19 11:00 AM confirmed", type:"booked" },
      { time:"Mar 19, 12:30 PM", event:"Job completed",        detail:"Bruce marked complete", type:"complete" },
      { time:"Mar 19, 12:30 PM", event:"Invoice sent",         detail:"Invoice #1041 — $185.00 sent. Due Mar 26.", type:"invoice" },
      { time:"Mar 26, 9:00 AM",  event:"7-day follow-up sent", detail:"Automated payment reminder sent", type:"comms" },
      { time:"Mar 28, 8:00 AM",  event:"⚠️ Flagged to owner",  detail:"9 days overdue — owner action required", type:"flag" },
    ],
    complianceRecord:{ date:"2026-03-19", tech:"Bruce", license:"ON-3190", pest:"Mice", product:"Contrac Blox", units:"1", area:"Kitchen walls, pantry area", notes:"Bait stations placed at 4 locations. Entry point at utility gap behind stove — sealed. Follow-up in 14 days recommended." }
  },

  // J-1042: Completed + Paid (emergency)
  {
    id:"J-1042", customerId:"c1", pestType:"Mice", tech:"Henry", status:"Completed", urgency:"Emergency",
    date:"2026-03-26", time:"9:00 AM", price:210, paid:true, paymentMethod:"Credit card",
    notes:"Active infestation, newborn at home. Emergency same-day dispatch. Entry point sealed at utility gap behind fridge.",
    conversation:[
      { from:"customer", time:"Mar 25, 8:14 PM", msg:"Hi I found mice droppings all over my kitchen this morning and I have a newborn at home. This is a serious health issue, I need someone TODAY. I'm in Scarborough." },
      { from:"os",       time:"Mar 25, 8:14 PM", msg:"Hi Sandra — I completely understand, and with a newborn at home this is our absolute top priority. We can have Henry at your address first thing tomorrow morning — 9:00 AM. Can you confirm your address so I can lock this in right now?" },
      { from:"customer", time:"Mar 25, 8:20 PM", msg:"44 Birchwood Ave Scarborough. Thank you so much." },
      { from:"os",       time:"Mar 25, 8:21 PM", msg:"Confirmed — Henry will be at 44 Birchwood Ave tomorrow at 9:00 AM sharp. This is an emergency booking. You'll get a confirmation now and a reminder in the morning. In the meantime, keep food sealed and avoid disturbing droppings. See you tomorrow." },
      { from:"os",       time:"Mar 26, 8:00 AM", msg:"Good morning Sandra — Henry is on his way. ETA 9:00 AM. He'll do a full assessment and seal any entry points today." },
      { from:"os",       time:"Mar 26, 11:00 AM",msg:"Henry has completed your mice treatment. Entry point behind the fridge has been sealed and bait stations placed. Invoice #1042 for $210.00 has been sent. Your home is safe. Let us know if you see anything in the next few days — the follow-up visit is on us if needed." },
    ],
    timeline:[
      { time:"Mar 25, 8:14 PM", event:"Lead received",        detail:"Emergency inbound — web form", type:"lead" },
      { time:"Mar 25, 8:14 PM", event:"OS responded",         detail:"Emergency response sent within 60 seconds", type:"os" },
      { time:"Mar 25, 8:21 PM", event:"Emergency job booked", detail:"Henry assigned, Mar 26 9:00 AM — same-day priority", type:"booked" },
      { time:"Mar 26, 8:00 AM", event:"Day-of ETA sent",      detail:"Henry on his way", type:"comms" },
      { time:"Mar 26, 10:45 AM",event:"Job completed",        detail:"Henry marked complete — entry point sealed", type:"complete" },
      { time:"Mar 26, 10:45 AM",event:"Invoice sent",         detail:"Invoice #1042 — $210.00", type:"invoice" },
      { time:"Mar 26, 3:00 PM", event:"Payment received",     detail:"Credit card — $210.00 collected", type:"paid" },
      { time:"Mar 26, 3:01 PM", event:"Review request sent",  detail:"Post-job follow-up sent", type:"comms" },
    ],
    complianceRecord:{ date:"2026-03-26", tech:"Henry", license:"ON-4821", pest:"Mice", product:"Contrac Blox", units:"1", area:"Kitchen — behind fridge, utility gap", notes:"Entry point sealed. 3 bait stations placed. Emergency booking — newborn in home. Follow-up in 7 days." }
  },

  // J-1043: Booked (upcoming)
  {
    id:"J-1043", customerId:"c2", pestType:"Cockroaches", tech:"Bruce", status:"Booked", urgency:"Normal",
    date:"2026-03-31", time:"2:00 PM", price:175, paid:false, paymentMethod:"Credit card",
    notes:"Cockroach sighting in bathroom over several days. Unit 4B. Job scheduled for tomorrow.",
    conversation:[
      { from:"customer", time:"Mar 27, 11:02 AM", msg:"Hey do you guys deal with cockroaches? Found a couple in my bathroom over the last few days. Not an emergency but want to get it sorted. Located in Etobicoke, unit 4B." },
      { from:"os",       time:"Mar 27, 11:02 AM", msg:"Hey David! Yes, cockroaches in the bathroom is something we handle all the time — and the sooner the better. We can get Bruce out to your Etobicoke unit Monday afternoon. Does 2:00 PM work for you?" },
      { from:"customer", time:"Mar 27, 11:20 AM", msg:"Monday works great, thanks!" },
      { from:"os",       time:"Mar 27, 11:21 AM", msg:"Bruce is confirmed for Monday March 31 at 2:00 PM at 312 Royal York Rd Unit 4B, Etobicoke. You'll get a reminder Sunday evening. See you Monday!" },
      { from:"os",       time:"Mar 30, 6:00 PM",  msg:"Just a reminder that Bruce is coming tomorrow (Monday) at 2:00 PM. Nothing special needed on your end — he'll bring everything." },
    ],
    timeline:[
      { time:"Mar 27, 11:02 AM", event:"Lead received",        detail:"Inbound web form", type:"lead" },
      { time:"Mar 27, 11:02 AM", event:"OS responded",         detail:"Acknowledgment sent within 60 seconds", type:"os" },
      { time:"Mar 27, 11:21 AM", event:"Job booked",           detail:"Bruce assigned, Mar 31 2:00 PM confirmed", type:"booked" },
      { time:"Mar 27, 11:21 AM", event:"Confirmation sent",    detail:"Confirmation sent to dpark@outlook.com", type:"comms" },
      { time:"Mar 30, 6:00 PM",  event:"24h reminder sent",    detail:"Reminder sent to customer", type:"comms" },
    ],
  },

  // J-1044: In Progress (commercial)
  {
    id:"J-1044", customerId:"c3", pestType:"Rodents", tech:"Henry", status:"In Progress", urgency:"High",
    date:"2026-03-30", time:"10:00 AM", price:395, paid:false, paymentMethod:"Invoice (net 30)",
    notes:"Commercial kitchen — rodent activity near dry storage. Henry on site now. Monthly contract discussed.",
    conversation:[
      { from:"customer", time:"Mar 26, 3:45 PM", msg:"Hello, I manage a restaurant downtown and we've been seeing rodent activity near our storage. We need someone who can come regularly and keep documentation for health inspections." },
      { from:"os",       time:"Mar 26, 3:45 PM", msg:"Hello Marcus — this is exactly what we specialize in for commercial kitchens. Health inspection documentation is built into every service visit. I'd like to get Henry out this week for an initial assessment and we can set up a monthly prevention program from there. What works Tuesday or Wednesday morning?" },
      { from:"customer", time:"Mar 26, 4:10 PM", msg:"Wednesday doesn't work. Can you do Saturday?" },
      { from:"os",       time:"Mar 26, 4:11 PM", msg:"Absolutely — Henry is confirmed for Saturday March 28 at 10:00 AM. Confirmation sent to marcus@parkwaygrill.ca. He'll do a full assessment and bring documentation for your health inspection file." },
      { from:"os",       time:"Mar 29, 6:00 PM", msg:"Reminder: Henry is coming to Parkway Grill tomorrow (Saturday) at 10:00 AM. Please make sure the storage area is accessible." },
      { from:"os",       time:"Mar 30, 9:30 AM", msg:"Henry is on his way — ETA 10:00 AM." },
    ],
    timeline:[
      { time:"Mar 26, 3:45 PM", event:"Lead received",        detail:"Inbound email — commercial kitchen", type:"lead" },
      { time:"Mar 26, 3:45 PM", event:"OS responded",         detail:"Commercial response sent within 60 seconds", type:"os" },
      { time:"Mar 26, 4:11 PM", event:"Job booked",           detail:"Henry assigned, Mar 30 10:00 AM", type:"booked" },
      { time:"Mar 29, 6:00 PM", event:"24h reminder sent",    detail:"Reminder sent with storage access note", type:"comms" },
      { time:"Mar 30, 9:30 AM", event:"Day-of ETA sent",      detail:"Henry on his way", type:"comms" },
      { time:"Mar 30, 10:05 AM",event:"Henry on site",        detail:"Job in progress", type:"complete" },
    ],
  },

  // J-1045: New Lead — Bed Bugs (awaiting booking)
  {
    id:"J-1045", customerId:"c5", pestType:"Bed Bugs", tech:"Henry", status:"New Lead", urgency:"High",
    date:null, time:null, price:420, paid:false, paymentMethod:null,
    notes:"Suspected bed bugs, woke up with bites. Condo unit. OS responded immediately but customer hasn't confirmed a time yet. Follow-up scheduled.",
    conversation:[
      { from:"customer", time:"Mar 28, 7:18 AM", msg:"I woke up this morning with bites on my arms and I think it might be bed bugs. I'm in a condo on Sheppard. What do I do?" },
      { from:"os",       time:"Mar 28, 7:18 AM", msg:"Hi Raymond — bed bugs can be really stressful and I want to get someone to you quickly. We specialize in bed bug treatment and Henry can come out for an assessment as early as today or tomorrow. In the meantime, try not to move your bedding to other rooms as that can spread them. Can you confirm your unit number and a good time?" },
      { from:"os",       time:"Mar 29, 9:00 AM", msg:"Hi Raymond — just following up. Henry is available today and tomorrow morning. Bed bugs are time-sensitive so the sooner we can get in, the better. What time works for you?" },
    ],
    timeline:[
      { time:"Mar 28, 7:18 AM", event:"Lead received",           detail:"Inbound web form — bed bugs", type:"lead" },
      { time:"Mar 28, 7:18 AM", event:"OS responded",            detail:"Acknowledgment sent within 60 seconds", type:"os" },
      { time:"Mar 29, 9:00 AM", event:"Follow-up sent",          detail:"Automated 24h follow-up — awaiting customer response", type:"comms" },
    ],
  },

  // J-1046: No Response — lead gone cold
  {
    id:"J-1046", customerId:"c8", pestType:"Wasps", tech:null, status:"No Response", urgency:"Low",
    date:null, time:null, price:145, paid:false, paymentMethod:null,
    notes:"Customer inquired about wasp nest removal, OS responded and followed up twice. No reply in 5 days. Flagged for owner awareness.",
    humanFlag:{ type:"owner", msg:"J-1046 (James Kowalski) has not responded after 2 follow-ups over 5 days. Lead likely gone cold. No action required unless you want to attempt a direct call.", flaggedAt:"Mar 28, 8:00 AM" },
    conversation:[
      { from:"customer", time:"Mar 23, 2:00 PM", msg:"Hey, I've got a wasp nest under my deck. How much does removal cost and how soon can you come?" },
      { from:"os",       time:"Mar 23, 2:00 PM", msg:"Hi James! Wasp nest removal under a deck is a standard job for us — typically $130–160 depending on nest size. Bruce can come out as early as this week. What days work for you?" },
      { from:"os",       time:"Mar 25, 9:00 AM", msg:"Hi James — just following up on your wasp nest inquiry. We have availability this week and want to get that sorted before it gets worse. What day works best?" },
      { from:"os",       time:"Mar 28, 8:00 AM", msg:"⚠️ No response after 2 follow-ups. Flagging to Henry — lead may have gone cold." },
    ],
    timeline:[
      { time:"Mar 23, 2:00 PM", event:"Lead received",           detail:"Inbound text message", type:"lead" },
      { time:"Mar 23, 2:00 PM", event:"OS responded",            detail:"Quote provided, availability offered", type:"os" },
      { time:"Mar 25, 9:00 AM", event:"Follow-up #1 sent",      detail:"48h follow-up sent — no response", type:"comms" },
      { time:"Mar 28, 8:00 AM", event:"⚠️ Flagged to owner",    detail:"Lead gone cold — 5 days no response", type:"flag" },
    ],
  },

  // J-1047: Technician no-show — human intervention required
  {
    id:"J-1047", customerId:"c9", pestType:"Ants", tech:"Bruce", status:"Booked", urgency:"Normal",
    date:"2026-03-30", time:"11:00 AM", price:130, paid:false, paymentMethod:"Credit card",
    notes:"Bruce did not arrive on time. Customer messaged asking where he is. OS has flagged to Henry — Bruce unreachable. Needs rescheduling.",
    humanFlag:{ type:"owner", msg:"Bruce has not arrived for J-1047 (Aisha Mensah, 11:00 AM). Customer has messaged asking where he is. Bruce is not responding to calls. You need to contact the customer directly and reschedule.", flaggedAt:"Mar 30, 11:20 AM" },
    conversation:[
      { from:"customer", time:"Mar 26, 10:15 AM", msg:"Hi, I have a bad ant problem in my kitchen and bathroom. I'm in Little Portugal. Can you help?" },
      { from:"os",       time:"Mar 26, 10:15 AM", msg:"Hi Aisha! Ant problems in the kitchen and bathroom are very common this time of year and totally fixable. Bruce can come out Sunday morning — does 11:00 AM work for you?" },
      { from:"customer", time:"Mar 26, 10:30 AM", msg:"Sunday 11am works perfectly!" },
      { from:"os",       time:"Mar 26, 10:31 AM", msg:"Bruce is confirmed for Sunday March 30 at 11:00 AM at 55 Dufferin St. You'll get a reminder Saturday evening." },
      { from:"os",       time:"Mar 29, 6:00 PM",  msg:"Reminder: Bruce is coming tomorrow (Sunday) at 11:00 AM for your ant treatment." },
      { from:"customer", time:"Mar 30, 11:18 AM", msg:"Hi, it's 11:20 and no one has shown up yet. Is someone coming?" },
      { from:"os",       time:"Mar 30, 11:19 AM", msg:"Hi Aisha — I sincerely apologize for the delay. I'm reaching out to Bruce now and will have an update for you within the next few minutes. Thank you for your patience." },
      { from:"os",       time:"Mar 30, 11:20 AM", msg:"⚠️ HUMAN INTERVENTION REQUIRED: Bruce is not responding. Henry must contact Aisha directly at 647-554-2210 and arrange a reschedule." },
    ],
    timeline:[
      { time:"Mar 26, 10:15 AM", event:"Lead received",             detail:"Inbound email", type:"lead" },
      { time:"Mar 26, 10:31 AM", event:"Job booked",                detail:"Bruce assigned, Mar 30 11:00 AM", type:"booked" },
      { time:"Mar 29, 6:00 PM",  event:"Reminder sent",             detail:"24h reminder sent to customer", type:"comms" },
      { time:"Mar 30, 11:18 AM", event:"Customer messaged — late",  detail:"Customer asking where technician is", type:"lead" },
      { time:"Mar 30, 11:19 AM", event:"OS apologized to customer", detail:"Holding message sent", type:"os" },
      { time:"Mar 30, 11:20 AM", event:"⚠️ Flagged to Henry",       detail:"Bruce unreachable — owner must call customer", type:"flag" },
    ],
  },

  // J-1048: Cancelled job
  {
    id:"J-1048", customerId:"c10", pestType:"Rodents", tech:"Henry", status:"Cancelled", urgency:"Normal",
    date:"2026-03-27", time:"2:00 PM", price:0, paid:false, paymentMethod:null,
    notes:"Customer cancelled morning of job — said they handled it themselves with traps. OS confirmed cancellation and offered to rebook if needed.",
    conversation:[
      { from:"customer", time:"Mar 24, 3:00 PM",  msg:"Hi, we run a daycare in Brampton and we've found what looks like mouse droppings near our storage area. This is urgent — we have children here every day." },
      { from:"os",       time:"Mar 24, 3:00 PM",  msg:"Hi — completely understand, a daycare environment makes this a top priority. Henry can come out Thursday afternoon. Does 2:00 PM work?" },
      { from:"customer", time:"Mar 24, 3:20 PM",  msg:"Yes Thursday 2pm works." },
      { from:"os",       time:"Mar 24, 3:21 PM",  msg:"Henry is confirmed for Thursday March 27 at 2:00 PM at 12 Sunrise Blvd, Brampton." },
      { from:"customer", time:"Mar 27, 9:00 AM",  msg:"Hi, I need to cancel. We set some traps ourselves and haven't seen anything else. We think we're okay for now." },
      { from:"os",       time:"Mar 27, 9:01 AM",  msg:"Hi — no problem, I've cancelled your appointment for today. If the problem returns, don't hesitate to reach out and we'll get Henry out quickly. Mice are persistent so keep an eye out over the next week. Hope all stays quiet!" },
    ],
    timeline:[
      { time:"Mar 24, 3:00 PM",  event:"Lead received",       detail:"Inbound email — daycare commercial", type:"lead" },
      { time:"Mar 24, 3:00 PM",  event:"OS responded",        detail:"Urgent commercial response sent", type:"os" },
      { time:"Mar 24, 3:21 PM",  event:"Job booked",          detail:"Henry assigned, Mar 27 2:00 PM", type:"booked" },
      { time:"Mar 27, 9:00 AM",  event:"Customer cancelled",  detail:"Customer self-resolved — no charge", type:"cancelled" },
      { time:"Mar 27, 9:01 AM",  event:"Cancellation confirmed", detail:"Polite cancellation sent, door left open", type:"os" },
    ],
  },

  // J-1049: Vague inquiry needing qualification + upsell
  {
    id:"J-1049", customerId:"c4", pestType:"Unknown", tech:null, status:"New Lead", urgency:"Low",
    date:null, time:null, price:0, paid:false, paymentMethod:null,
    notes:"Repeat customer Linda Tremblay asking a vague question. OS is qualifying. Upsell opportunity: prevention contract.",
    conversation:[
      { from:"customer", time:"Mar 30, 8:30 AM", msg:"Hi, I think I might have bugs again. Not sure what kind." },
      { from:"os",       time:"Mar 30, 8:30 AM", msg:"Hi Linda! Thanks for reaching out — happy to help figure this out. Can you tell me a bit more? Where in the house are you noticing them, and what do they look like — tiny black dots, larger beetles, something flying?" },
      { from:"customer", time:"Mar 30, 8:45 AM", msg:"I see little things near my window. Kind of small and black." },
      { from:"os",       time:"Mar 30, 8:46 AM", msg:"That sounds like it could be carpet beetles or fungus gnats — both very treatable. Is it near a plant or in a window with soil nearby? In the meantime, I want to flag something: since you had mice treated last month, a prevention check-in visit from Bruce might be a good idea too. We offer a quarterly prevention package that covers rodents and common insects — want me to tell you more about it while we sort out the current issue?" },
    ],
    timeline:[
      { time:"Mar 30, 8:30 AM", event:"Lead received",      detail:"Repeat customer — vague inquiry via text", type:"lead" },
      { time:"Mar 30, 8:30 AM", event:"OS qualifying",      detail:"Asking clarifying questions to ID pest type", type:"os" },
      { time:"Mar 30, 8:46 AM", event:"Upsell initiated",   detail:"Prevention contract mentioned to repeat customer", type:"os" },
    ],
  },
];

// ─── MESSAGES (OS → Human) ────────────────────────────────────────────────────
const OS_MESSAGES = [
  { id:"m1", jobId:"J-1047", for:"owner", priority:"urgent", time:"Mar 30, 11:20 AM", subject:"Technician no-show — immediate action needed", body:"Bruce has not arrived for J-1047 (Aisha Mensah, 11:00 AM). Customer is waiting. Bruce is not responding to calls. You need to contact Aisha directly at 647-554-2210 and arrange a reschedule or find coverage.", resolved:false },
  { id:"m2", jobId:"J-1041", for:"owner", priority:"high",   time:"Mar 28, 8:00 AM",  subject:"Invoice #1041 overdue — 9 days, no payment", body:"Linda Tremblay has not paid Invoice #1041 ($185.00). Two automated follow-ups have been sent with no response. Recommend a direct phone call to 905-443-8812 to resolve.", resolved:false },
  { id:"m3", jobId:"J-1046", for:"owner", priority:"low",    time:"Mar 28, 8:00 AM",  subject:"Cold lead — J-1046 Kowalski no response", body:"James Kowalski (wasp nest inquiry) has not responded after 2 follow-ups over 5 days. Lead is likely cold. No action required unless you want to try a direct call.", resolved:false },
  { id:"m4", jobId:"J-1044", for:"owner", priority:"normal", time:"Mar 30, 10:00 AM", subject:"Parkway Grill — contract opportunity on table", body:"Henry is on site at Parkway Grill now. Marcus Webb mentioned wanting a monthly prevention contract during booking. This is a strong upsell opportunity — follow up after today's job.", resolved:false },
  { id:"m5", jobId:"J-1047", for:"tech",  priority:"urgent", time:"Mar 30, 11:15 AM", subject:"J-1047 — customer waiting, where are you?", body:"Aisha Mensah at 55 Dufferin St is waiting for you. It's now 11:15 AM and you're 15 minutes late. Please confirm your status immediately. Henry has been notified.", resolved:false },
];

// ─── WEEKLY CALENDAR DATA ─────────────────────────────────────────────────────
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
const weekRevenue = JOBS.filter(j => j.paid).reduce((s,j) => s + j.price, 0);
const outstanding = JOBS.filter(j => !j.paid && ["Invoiced","Overdue","In Progress","Booked"].includes(j.status)).reduce((s,j) => s + j.price, 0);

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
  { id:"dashboard", label:"Dashboard",         icon:"▦" },
  { id:"d1",        label:"D1 · Lead Mgmt",    icon:"◎", live:true },
  { id:"d2",        label:"D2 · Calendar",     icon:"◫" },
  { id:"d3",        label:"D3 · Communications",icon:"◐" },
  { id:"d4",        label:"D4 · Quotes & Revenue",icon:"◈" },
  { id:"d5",        label:"D5 · Compliance",   icon:"◉" },
  { id:"d6",        label:"D6 · Invoicing",    icon:"◑" },
  { id:"messages",  label:"Messages",          icon:"✉", badge:true },
  { id:"summary",   label:"Weekly Summary",    icon:"◧" },
];

const TECH_NAV = [
  { id:"techdash",  label:"My Dashboard",      icon:"▦" },
  { id:"d2",        label:"D2 · My Schedule",  icon:"◫" },
  { id:"d3",        label:"D3 · Comms",        icon:"◐" },
  { id:"messages",  label:"Messages",          icon:"✉", badge:true },
];

function Sidebar({ active, setActive, role, setRole }) {
  const nav = role === "owner" ? OWNER_NAV : TECH_NAV;
  const urgentCount = OS_MESSAGES.filter(m => !m.resolved && (role === "owner" ? m.for === "owner" : m.for === "tech")).length;

  return (
    <div style={{ width:228, flexShrink:0, background:G.white, borderRight:`1px solid ${G.border}`, display:"flex", flexDirection:"column", padding:"0 0 24px" }}>
      {/* Logo */}
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

      {/* Role toggle */}
      <div style={{ padding:"12px 14px", borderBottom:`1px solid ${G.border}` }}>
        <div style={{ display:"flex", background:G.bg, borderRadius:8, padding:3, gap:3 }}>
          {["owner","tech"].map(r => (
            <button key={r} onClick={() => setRole(r)} style={{ flex:1, padding:"6px 0", borderRadius:6, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"inherit", background:role===r ? G.green : "transparent", color:role===r ? "#fff" : G.textMuted, transition:"all 0.15s" }}>
              {r === "owner" ? "Owner" : "Technician"}
            </button>
          ))}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding:"10px 10px", flex:1, overflowY:"auto" }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:8, border:"none", cursor:"pointer", background:active===item.id ? G.greenLight : "transparent", color:active===item.id ? G.green : G.textMuted, fontSize:13, fontWeight:active===item.id ? 600 : 400, fontFamily:"inherit", textAlign:"left", transition:"all 0.12s", marginBottom:2 }}>
            <span style={{ fontSize:13 }}>{item.icon}</span>
            <span style={{ flex:1 }}>{item.label}</span>
            {item.live && <span style={{ fontSize:10, padding:"2px 6px", borderRadius:10, background:"#dcfce7", color:"#16a34a", fontWeight:700 }}>LIVE</span>}
            {item.badge && urgentCount > 0 && <span style={{ fontSize:10, padding:"2px 7px", borderRadius:10, background:G.redLight, color:G.red, fontWeight:700 }}>{urgentCount}</span>}
          </button>
        ))}
      </nav>

      {/* Techs */}
      <div style={{ padding:"12px 18px", borderTop:`1px solid ${G.border}` }}>
        <div style={{ fontSize:11, color:G.textLight, marginBottom:8, fontWeight:600, letterSpacing:"0.04em" }}>TECHNICIANS</div>
        {["Henry","Bruce"].map(t => {
          const onJob = JOBS.some(j => j.tech===t && j.status==="In Progress");
          const isLate = t==="Bruce";
          return (
            <div key={t} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:7 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:G.greenLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:G.green }}>{t[0]}</div>
              <div>
                <div style={{ fontSize:12, fontWeight:600, color:G.text }}>{t}</div>
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
function OwnerDashboard({ setActive, setSelectedJob }) {
  const todayJobs = JOBS.filter(j => j.date === "2026-03-30");
  const urgentMessages = OS_MESSAGES.filter(m => m.for==="owner" && !m.resolved);

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:G.text, margin:0 }}>Good morning, Henry 👋</h1>
        <p style={{ fontSize:14, color:G.textMuted, margin:"4px 0 0" }}>Sunday, March 30 — your business at a glance.</p>
      </div>

      {/* Urgent flags */}
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
        <MetricCard label="Revenue this week"    value={money(weekRevenue)} sub="Collected" accent={G.green} />
        <MetricCard label="Outstanding"          value={money(outstanding)} sub="Across all open jobs" accent={G.red} />
        <MetricCard label="Jobs today"           value={todayJobs.length}   sub={todayJobs.map(j=>j.tech).filter(Boolean).join(", ")||"None scheduled"} />
        <MetricCard label="New leads"            value={JOBS.filter(j=>j.status==="New Lead").length} sub="Awaiting booking" accent={G.blue} />
        <MetricCard label="OS messages"          value={urgentMessages.length} sub="Needs your attention" accent={G.red} />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
        {/* Today */}
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

        {/* New leads */}
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

        {/* Overdue invoices */}
        <Card>
          <div style={{ fontSize:14, fontWeight:600, color:G.text, marginBottom:14 }}>Overdue invoices</div>
          {JOBS.filter(j=>j.status==="Overdue").map(job => {
            const c = getCustomer(job.customerId);
            return (
              <div key={job.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:`1px solid ${G.border}` }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:500, color:G.text }}>{c?.name}</div>
                  <div style={{ fontSize:12, color:G.red }}>Invoice #{job.id.replace("J-","")} · 9 days overdue</div>
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:G.red }}>{money(job.price)}</div>
              </div>
            );
          })}
          <div style={{ marginTop:10, padding:"8px 12px", background:G.amberLight, borderRadius:8, fontSize:12, color:G.amber }}>⏰ 2 automated follow-ups sent. Direct call recommended.</div>
        </Card>

        {/* OS Messages */}
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
function TechDashboard({ setActive, setSelectedJob }) {
  const myJobs = JOBS.filter(j => j.tech==="Bruce" && j.date==="2026-03-30");
  const techMessages = OS_MESSAGES.filter(m => m.for==="tech" && !m.resolved);
  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:700, color:G.text, margin:0 }}>Good morning, Bruce 👋</h1>
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
        <MetricCard label="My jobs today" value={myJobs.length} />
        <MetricCard label="Jobs this week" value={JOBS.filter(j=>j.tech==="Bruce").length} />
        <MetricCard label="Completed today" value={myJobs.filter(j=>j.status==="Completed").length} accent={G.green} />
      </div>

      <Card>
        <div style={{ fontSize:14, fontWeight:600, color:G.text, marginBottom:14 }}>Today's jobs</div>
        {myJobs.length===0 && <div style={{ fontSize:13, color:G.textMuted }}>No jobs scheduled for you today.</div>}
        {myJobs.map(job => {
          const c = getCustomer(job.customerId);
          return (
            <div key={job.id} onClick={()=>{setSelectedJob(job.id);setActive("d1");}} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 0", borderBottom:`1px solid ${G.border}`, cursor:"pointer" }}>
              <div style={{ width:44, height:44, borderRadius:10, background:job.humanFlag?G.redLight:G.greenLight, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:job.humanFlag?G.red:G.green, flexShrink:0 }}>{job.time}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:600, color:G.text }}>{c?.name}</div>
                <div style={{ fontSize:12, color:G.textMuted }}>{job.pestType} · {c?.address}</div>
                {job.humanFlag && <div style={{ fontSize:12, color:G.red, fontWeight:600, marginTop:3 }}>⚠️ {job.humanFlag.msg.slice(0,60)}...</div>}
              </div>
              <StatusBadge status={job.status} />
            </div>
          );
        })}
      </Card>
    </div>
  );
}

// ─── D1 — LEAD INBOX (LIVE AI) ────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are the intake agent for Henry the Exterminator, a licensed pest control company in the Greater Toronto Area.

Business: Henry the Exterminator | GTA | Services: Rodents, Cockroaches, Bed Bugs, Ants, Wasps, Wildlife | Technicians: Henry and Bruce | Pricing: $130–$160 wasps/ants, $150–$250 mice/cockroaches standard, $300–$450 bed bugs | Payment: Credit card or net 30 invoice (commercial) | Ontario Pesticides Act certified.

When a customer message comes in, respond with ONLY valid JSON (no markdown, no preamble):
{
  "customerName": "name or Unknown",
  "neighbourhood": "neighbourhood or Unknown",
  "pestType": "type or unknown",
  "urgency": "EMERGENCY/HIGH/NORMAL/LOW",
  "jobType": "residential/commercial",
  "qualificationComplete": true or false,
  "missingInfo": ["list of missing fields if any"],
  "technician": "Henry or Bruce",
  "estimatedPrice": "$XXX–$XXX",
  "outboundMessage": "Warm, professional reply. Sound like a real local business. One message only. Ask ONE clarifying question if needed.",
  "routing": "Schedule with Henry / Schedule with Bruce / Awaiting info / Emergency escalation",
  "followUpScheduled": true or false
}`;

const DEMO_SCENARIOS = [
  { label:"🚨 Emergency", msg:"Hi I found mice droppings all over my kitchen this morning and I have a newborn at home. This is a serious health issue, I need someone TODAY. I'm in Scarborough at 44 Birchwood Ave." },
  { label:"🪳 Routine inquiry", msg:"Hey do you guys deal with cockroaches? Found a couple in my bathroom over the last few days. Not an emergency but want to get it sorted. Located in Etobicoke, unit 4B." },
  { label:"🛏 Bed bugs", msg:"I woke up this morning with bites on my arms and legs. I think it might be bed bugs. I'm in a condo on Sheppard Ave East. How quickly can you come?" },
  { label:"🏢 Commercial", msg:"Hello, I manage a restaurant in downtown Toronto and we've been seeing rodent activity near our storage area. We need someone who can come regularly and keep documentation for health inspections." },
  { label:"❓ Vague inquiry", msg:"Hi how much do you charge" },
  { label:"🚫 No info given", msg:"I have a bug problem" },
];

function D1LeadMgmt({ selectedJob, setSelectedJob }) {
  const [msg, setMsg] = useState(DEMO_SCENARIOS[0].msg);
  const [activeScenario, setActiveScenario] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);
  const steps = ["Parsing message","Classifying lead","Extracting details","Qualifying","Checking urgency","Composing reply","Routing","Logging"];

  if (selectedJob) {
    const job = JOBS.find(j=>j.id===selectedJob);
    if (job) return <JobDetail job={job} onBack={()=>setSelectedJob(null)} />;
  }

  const run = async () => {
    setLoading(true); setResult(null); setError(null); setStep(0);
    const interval = setInterval(()=>{ setStep(s=>s<steps.length-1?s+1:s); },220);
    try {
      const res = await fetch("/api/proxy", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({ model:"claude-haiku-4-5", max_tokens:1000, system:SYSTEM_PROMPT, messages:[{ role:"user", content:`Process this inbound customer message: "${msg}"` }] }),
      });
      const data = await res.json();
      if (data.proxyError) {
        setError("API Error: " + JSON.stringify(data.anthropicError || data.message));
        return;
      }
      if (data.error) {
        setError("Anthropic Error: " + data.error.message);
        return;
      }
      const text = (data.content||[]).map(b=>b.text||"").join("");
      const clean = text.replace(/```json\n?|\n?```/g,"").trim();
      setResult(JSON.parse(clean));
    } catch(e) { setError("Processing failed — " + (e.message || JSON.stringify(e))); }
    finally { clearInterval(interval); setStep(steps.length-1); setLoading(false); }
  };

  return (
    <div>
      <SectionHeader title="D1 — Lead & Inquiry Management" sub="All inbound conversations. Live inbox feeds here." />

      {/* Existing leads */}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:13, fontWeight:600, color:G.textMuted, marginBottom:10, letterSpacing:"0.03em" }}>ALL LEADS & CONVERSATIONS</div>
        <Card style={{ padding:0, overflow:"hidden" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:G.bg, borderBottom:`1px solid ${G.border}` }}>
                {["Job","Customer","Pest","Channel","Status","Last activity",""].map(h=>(
                  <th key={h} style={{ padding:"9px 16px", textAlign:"left", fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {JOBS.map((job,i) => {
                const c = getCustomer(job.customerId);
                const lastMsg = job.conversation?.[job.conversation.length-1];
                return (
                  <tr key={job.id} onClick={()=>setSelectedJob(job.id)} style={{ borderBottom:i<JOBS.length-1?`1px solid ${G.border}`:"none", cursor:"pointer", transition:"background 0.1s" }}
                    onMouseEnter={e=>e.currentTarget.style.background=G.bg}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"11px 16px", fontSize:12, fontWeight:600, color:G.textMuted }}>{job.id}</td>
                    <td style={{ padding:"11px 16px" }}>
                      <div style={{ fontSize:13, fontWeight:500, color:G.text }}>{c?.name}</div>
                      <div style={{ fontSize:11, color:G.textLight }}>{c?.type}</div>
                    </td>
                    <td style={{ padding:"11px 16px", fontSize:13, color:G.text }}>{job.pestType}</td>
                    <td style={{ padding:"11px 16px", fontSize:12, color:G.textMuted }}>Web / Email</td>
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

      {/* Live AI inbox */}
      <div style={{ fontSize:13, fontWeight:600, color:G.textMuted, marginBottom:10, letterSpacing:"0.03em" }}>LIVE LEAD INBOX — AI RESPONDS IN REAL TIME</div>
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
              <Card style={{ borderLeft:`3px solid ${G.green}`, marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:600, color:G.green, letterSpacing:"0.04em", marginBottom:8 }}>MESSAGE SENT TO CUSTOMER</div>
                <div style={{ fontSize:13, lineHeight:1.65, fontStyle:"italic", color:G.text }}>"{result.outboundMessage}"</div>
                <div style={{ marginTop:8, fontSize:11, color:G.textLight }}>Sent in under 60 seconds · 0 human steps</div>
              </Card>
              <Card style={{ marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em", marginBottom:10 }}>LEAD DETAILS</div>
                {[["Customer",result.customerName],["Location",result.neighbourhood],["Pest type",result.pestType],["Job type",result.jobType],["Urgency",result.urgency],["Assigned to",result.technician],["Estimate",result.estimatedPrice],["Routing",result.routing],["Follow-up",result.followUpScheduled?"Scheduled":"Not needed"]].map(([k,v])=>(
                  <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${G.border}`, fontSize:12 }}>
                    <span style={{ color:G.textMuted }}>{k}</span>
                    <span style={{ color:G.text, fontWeight:500 }}>{v||"—"}</span>
                  </div>
                ))}
              </Card>
              <div style={{ padding:"10px 14px", background:G.greenLight, borderRadius:8, fontSize:12, color:G.green, fontWeight:500 }}>✓ Lead logged · Technician assigned · Follow-up scheduled · 0 human steps</div>
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
              <div style={{ fontSize:12, color:G.textMuted, marginTop:3 }}>{c?.address}</div>
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

      {/* Tabs */}
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
                <div style={{ fontSize:10, color:G.textLight, marginBottom:3, fontWeight:500 }}>{m.from==="customer"?c?.name.split(" ")[0]:" OS"} · {m.time}</div>
                <div style={{ maxWidth:"80%", padding:"10px 14px", borderRadius:12, fontSize:13, lineHeight:1.6, color:m.from==="os"?"#fff":G.text, background:m.from==="os"?G.green:m.msg.includes("⚠️")?G.redLight:G.bg, border:m.from==="customer"?`1px solid ${G.border}`:"none", fontStyle:m.msg.includes("⚠️")?"normal":"normal" }}>
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
function D2Calendar() {
  const statusColors = { "Completed":"#16a34a","In Progress":"#1a472a","Booked":"#d97706","New Lead":"#2563eb","Overdue":"#dc2626","Cancelled":"#9ca3af","No Response":"#d97706" };
  return (
    <div>
      <SectionHeader title="D2 — Scheduling & Dispatch" sub="Week of March 24–30, 2026" />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:8 }}>
        {WEEK_DAYS.map(day => {
          const dayJobs = JOBS.filter(j=>j.date===day.date);
          const isToday = day.date==="2026-03-30";
          return (
            <div key={day.date} style={{ background:isToday?G.greenLight:G.white, border:`1px solid ${isToday?G.greenMid:G.border}`, borderRadius:10, padding:"12px 10px", minHeight:160 }}>
              <div style={{ fontSize:11, fontWeight:700, color:isToday?G.green:G.textMuted, marginBottom:8, letterSpacing:"0.03em" }}>{day.label.toUpperCase()}</div>
              {dayJobs.length===0 && <div style={{ fontSize:11, color:G.textLight, fontStyle:"italic" }}>No jobs</div>}
              {dayJobs.map(job=>{
                const c=getCustomer(job.customerId);
                return (
                  <div key={job.id} style={{ padding:"6px 8px", borderRadius:6, marginBottom:6, background:statusColors[job.status]+"22", borderLeft:`3px solid ${statusColors[job.status]||"#888"}` }}>
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
      <div style={{ display:"flex", gap:12, marginTop:14, flexWrap:"wrap" }}>
        {Object.entries(statusColors).map(([s,c])=>(
          <div key={s} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:G.textMuted }}>
            <div style={{ width:10, height:10, borderRadius:2, background:c }} />{s}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── D3 — COMMUNICATIONS ─────────────────────────────────────────────────────
function D3Communications({ setSelectedJob }) {
  return (
    <div>
      <SectionHeader title="D3 — Customer Communication" sub="Full message threads for every job. All sent automatically." />
      {JOBS.filter(j=>j.conversation&&j.conversation.length>0).map(job=>{
        const c=getCustomer(job.customerId);
        const lastMsg=job.conversation[job.conversation.length-1];
        return (
          <Card key={job.id} style={{ marginBottom:12, cursor:"pointer" }} onClick={()=>setSelectedJob(job.id)}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:G.text }}>{c?.name}</div>
                  <StatusBadge status={job.status} />
                  {job.humanFlag && <span style={{ fontSize:11, padding:"2px 8px", borderRadius:10, background:G.redLight, color:G.red, fontWeight:600 }}>⚠️ Needs action</span>}
                </div>
                <div style={{ fontSize:12, color:G.textMuted, marginTop:2 }}>{job.id} · {job.pestType} · {job.conversation.length} messages</div>
              </div>
              <div style={{ fontSize:11, color:G.textLight }}>{lastMsg.time}</div>
            </div>
            <div style={{ fontSize:13, color:G.textMuted, fontStyle:"italic", background:G.bg, borderRadius:6, padding:"7px 10px", lineHeight:1.5 }}>
              {lastMsg.from==="os"?"OS: ":"Customer: "}{lastMsg.msg.slice(0,100)}{lastMsg.msg.length>100?"...":""}
            </div>
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
  return (
    <div>
      <SectionHeader title="D4 — Quoting & Revenue" sub="Owner view only. Financial snapshot for the week." />
      <div style={{ display:"flex", gap:14, marginBottom:24 }}>
        <MetricCard label="Revenue collected"   value={money(paid)}    accent={G.green} />
        <MetricCard label="Pending invoices"    value={money(pending)} accent={G.amber} />
        <MetricCard label="Overdue"             value={money(overdue)} accent={G.red} />
        <MetricCard label="Pipeline (open jobs)"value={money(JOBS.filter(j=>["Booked","In Progress","New Lead"].includes(j.status)).reduce((s,j)=>s+j.price,0))} accent={G.blue} />
      </div>
      <Card>
        <div style={{ fontSize:14, fontWeight:600, color:G.text, marginBottom:14 }}>All jobs — financial status</div>
        <table style={{ width:"100%", borderCollapse:"collapse" }}>
          <thead>
            <tr style={{ background:G.bg, borderBottom:`1px solid ${G.border}` }}>
              {["Job","Customer","Service","Value","Status","Payment"].map(h=>(
                <th key={h} style={{ padding:"9px 14px", textAlign:"left", fontSize:11, fontWeight:600, color:G.textLight, letterSpacing:"0.04em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {JOBS.filter(j=>j.price>0).map((job,i)=>{
              const c=getCustomer(job.customerId);
              return (
                <tr key={job.id} style={{ borderBottom:`1px solid ${G.border}` }}>
                  <td style={{ padding:"11px 14px", fontSize:12, fontWeight:600, color:G.textMuted }}>{job.id}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, color:G.text }}>{c?.name}</td>
                  <td style={{ padding:"11px 14px", fontSize:13, color:G.text }}>{job.pestType}</td>
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
  return (
    <div>
      <SectionHeader title="D6 — Invoicing & Collections" sub="Owner view only. Invoice status and automated follow-up tracking." />
      {JOBS.filter(j=>j.price>0&&["Completed","Overdue","Invoiced"].includes(j.status)).map(job=>{
        const c=getCustomer(job.customerId);
        const daysOut = job.status==="Overdue"?9:job.date==="2026-03-26"?4:job.paid?0:3;
        return (
          <Card key={job.id} style={{ marginBottom:12, borderLeft:job.status==="Overdue"?`4px solid ${G.red}`:job.paid?`4px solid ${G.green}`:`4px solid ${G.amberMid}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <div style={{ fontSize:14, fontWeight:600, color:G.text }}>Invoice #{job.id.replace("J-","")} — {c?.name}</div>
                <div style={{ fontSize:12, color:G.textMuted, marginTop:2 }}>{job.pestType} · {job.date} · {job.paymentMethod||"Credit card"}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontSize:18, fontWeight:700, color:job.paid?G.green:job.status==="Overdue"?G.red:G.amber }}>{money(job.price)}</div>
                <div style={{ fontSize:12, color:job.paid?G.green:job.status==="Overdue"?G.red:G.amber, fontWeight:500 }}>{job.paid?"✓ Paid":job.status==="Overdue"?`⚠️ ${daysOut} days overdue`:`${daysOut} days outstanding`}</div>
              </div>
            </div>
            {!job.paid && (
              <div style={{ marginTop:10, padding:"8px 12px", background:job.status==="Overdue"?G.redLight:G.amberLight, borderRadius:8, fontSize:12, color:job.status==="Overdue"?G.red:G.amber }}>
                {job.status==="Overdue"?"⚠️ 2 automated follow-ups sent. Direct call recommended to 905-443-8812.":"⏰ Automated follow-up scheduled at 7 days if unpaid."}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────
function Messages({ role }) {
  const myMessages = OS_MESSAGES.filter(m => role==="owner" ? m.for==="owner" : m.for==="tech");
  const priorityColor = { urgent:G.red, high:G.amber, normal:G.blue, low:G.textMuted };
  return (
    <div>
      <SectionHeader title="Messages — OS to Human" sub={`The OS flags cases that need ${role==="owner"?"your":"your"} attention. These are the only things you need to handle manually.`} />
      {myMessages.length===0 && (
        <Card style={{ textAlign:"center", padding:"40px 20px" }}>
          <div style={{ fontSize:32, marginBottom:12 }}>✓</div>
          <div style={{ fontSize:14, color:G.textMuted }}>No messages. Everything is running automatically.</div>
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
    </div>
  );
}

// ─── WEEKLY SUMMARY ───────────────────────────────────────────────────────────
function WeeklySummary() {
  const weekJobs = JOBS.filter(j=>j.date&&j.date>="2026-03-24");
  const weekRev = weekJobs.filter(j=>j.paid).reduce((s,j)=>s+j.price,0);
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
        <MetricCard label="Revenue this week" value={money(weekRev)} accent={G.green} />
        <MetricCard label="Jobs this week" value={weekJobs.length} />
        <MetricCard label="Completed" value={weekJobs.filter(j=>j.status==="Completed").length} accent={G.green} />
        <MetricCard label="Outstanding" value={money(outstanding)} accent={G.red} />
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>
        <Card>
          <div style={{ fontSize:13, fontWeight:600, color:G.text, marginBottom:14 }}>Jobs this week</div>
          {weekJobs.map(job=>{
            const c=getCustomer(job.customerId);
            return (
              <div key={job.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${G.border}` }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:500, color:G.text }}>{c?.name}</div>
                  <div style={{ fontSize:11, color:G.textMuted }}>{job.pestType} · {job.tech||"?"} · {job.date}</div>
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
          {["Henry","Bruce"].map(tech=>{
            const techJobs=weekJobs.filter(j=>j.tech===tech);
            const techRev=techJobs.filter(j=>j.paid).reduce((s,j)=>s+j.price,0);
            return (
              <div key={tech} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:G.text }}>{tech}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:G.green }}>{money(techRev)}</div>
                </div>
                <div style={{ fontSize:12, color:G.textMuted, marginBottom:5 }}>{techJobs.length} jobs · {techJobs.filter(j=>j.status==="Completed").length} completed</div>
                <div style={{ height:5, background:G.border, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:G.green, borderRadius:3, width:`${weekRev>0?Math.min((techRev/weekRev)*100,100):0}%` }} />
                </div>
              </div>
            );
          })}
          <div style={{ marginTop:10, padding:"10px 12px", background:G.bg, borderRadius:8, fontSize:12, color:G.textMuted }}>
            <div style={{ fontWeight:600, color:G.text, marginBottom:4 }}>OS actions this week</div>
            <div>· {weekJobs.length} leads received and responded to automatically</div>
            <div>· {weekJobs.filter(j=>!["New Lead","No Response"].includes(j.status)).length} jobs booked automatically</div>
            <div>· {weekJobs.filter(j=>["Completed","Overdue"].includes(j.status)).length} invoices generated and sent</div>
            <div>· 3 edge cases flagged to owner for human action</div>
            <div>· 0 tasks handled manually by owner</div>
          </div>
        </Card>
      </div>
      <Card style={{ borderLeft:`3px solid ${G.amber}` }}>
        <div style={{ fontSize:13, fontWeight:600, color:G.text, marginBottom:12 }}>Needs your attention this week</div>
        <div style={{ display:"flex", gap:10, flexDirection:"column" }}>
          <div style={{ fontSize:13, color:G.text }}>🚨 <strong>J-1047</strong> (Aisha Mensah) — Bruce no-show. Customer waiting. Call 647-554-2210 immediately.</div>
          <div style={{ fontSize:13, color:G.text }}>⏰ <strong>Invoice #1041</strong> (Linda Tremblay, $185) — 9 days overdue. Two follow-ups ignored. Direct call recommended.</div>
          <div style={{ fontSize:13, color:G.text }}>🤝 <strong>Parkway Grill</strong> — Monthly contract opportunity. Henry on site today — follow up this afternoon.</div>
          <div style={{ fontSize:13, color:G.text }}>🛏 <strong>J-1045</strong> (Raymond Xu — bed bugs) — Lead awaiting booking. High urgency. Follow up today.</div>
        </div>
        <div style={{ marginTop:12, fontSize:12, color:G.textLight, fontStyle:"italic" }}>Everything else ran automatically this week. These 4 items are the only things that needed a human.</div>
      </Card>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [role, setRole] = useState("owner");
  const [selectedJob, setSelectedJob] = useState(null);

  const handleSetActive = id => { setActive(id); setSelectedJob(null); };
  const handleSetRole = r => { setRole(r); setActive(r==="owner"?"dashboard":"techdash"); setSelectedJob(null); };

  const renderPanel = () => {
    if (selectedJob) {
      const job = JOBS.find(j=>j.id===selectedJob);
      if (job) return <JobDetail job={job} onBack={()=>setSelectedJob(null)} />;
    }
    switch(active) {
      case "dashboard": return <OwnerDashboard setActive={handleSetActive} setSelectedJob={setSelectedJob} />;
      case "techdash":  return <TechDashboard  setActive={handleSetActive} setSelectedJob={setSelectedJob} />;
      case "d1":        return <D1LeadMgmt     selectedJob={selectedJob}   setSelectedJob={setSelectedJob} />;
      case "d2":        return <D2Calendar />;
      case "d3":        return <D3Communications setSelectedJob={id=>{setSelectedJob(id);setActive("d1");}} />;
      case "d4":        return <D4Quotes />;
      case "d5":        return <D5Compliance />;
      case "d6":        return <D6Invoicing />;
      case "messages":  return <Messages role={role} />;
      case "summary":   return <WeeklySummary />;
      default:          return <OwnerDashboard setActive={handleSetActive} setSelectedJob={setSelectedJob} />;
    }
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", fontFamily:"'DM Sans', system-ui, sans-serif", background:G.bg }}>
      <Sidebar active={active} setActive={handleSetActive} role={role} setRole={handleSetRole} />
      <main style={{ flex:1, padding:"28px 32px", overflowY:"auto", maxWidth:"calc(100vw - 228px)" }}>
        {renderPanel()}
      </main>
    </div>
  );
}
