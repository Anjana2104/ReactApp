
// *********************** START OF PAGES SCHEMAS *****************************************
export const RESOURCE_KEYS_SCHEMA = [
  { key:"S.NO",type: "number" },
  { key:"Emp ID", type: "string" },
  { key:"RA ID", type: "string" },
  { key:"Emp Name", type: "string" },
  { key:"Status", type: "string" },
  { key:"Utilised in ZS", type: "string" },
  { key:"Resume",type: "string" },
  { key:"Previous ZS work Experience",type: "string" }, 
  { key:"DOJ", type: "date" },
  { key:"KL Exp (yr)",type: "number" },
  { key:"Total Workex (yr)",type: "number" },
  { key:"Location Constraint", type: "string" },
  { key:"Role", type: "string" },
  { key:"Current Allocation",type: "string" },
  { key:"Lead",type: "string" },
  { key:"Primary skills", type: "string" },
  { key:"Secondary skills", type: "string" },
  { key:"Comment",type: "string" }
];

export const SPACE_SCHEMA = [
  { key: "S.NO",type: "string" },
  { key:"Client Space", type: "string" },
  { key:"Client Principal/AP",type: "string" }, 
  { key:"Client Manager",type: "string" },
  { key: "RA ZS Account Manager",type: "string" }
];

export const PROJECT_DETAILS_SCHEMA = [
  { key:"S.NO", type: "string" },
  { key:"Project Name",type: "string" },
  { key:"Client Space",type: "string" },
  { key:"Client Principal" ,type: "string" },
  { key:"POC", type: "string" },
  { key:"Other POCs" ,type: "string" },
  { key:"Handled by"  , type: "string" },
  { key:"Active"  , type: "string" }
  ];


export const REQUEST_DETAILS_SCHEMA = [
  { key:"S.NO", type: "string" },
  { key:"Request ID", type: "string" },
  { key:"Project Name", type: "string" },
  { key:"Skills", type: "string" },
  { key:"Comment", type: "string" }
];

export const REQUEST_TRACKER_SCHEMA = [
   { key: "Request ID",	type: "string" },
   { key: "Beeline ID",	type: "string" },
   { key: "Project Name",	type: "string" },
   { key: "Client SPACE",	type: "string" },
   { key: "#Resources"	,type: "string" },
   { key: "Level",	type: "string" },
   { key: "Skill Set"	, type: "string" },
   { key: "Duration",type: "string" },
   { key: "Location",	type: "string" },
   { key: "Demand Date",type: "date" },
   { key:"Closing Date"	,type: "date" },
   { key: "Handled By",	type: "string" },
   { key:"Status",	type: "string" },
   { key:"Comment" , type: "string" }
];

export const SOW_DETAILS_SCHEMA = [  
  { key:"S.NO",	type: "string" },
  { key:"SOW Name",	type: "string" },
  { key:"Account"	, type: "string" },
  { key:"Active" , type: "string" },
]

export const DEMAND_FULFILLMENT_SCHEMA = [
    	{ key:"S.NO",type: "string" },
      { key:"Request ID",	type: "string" },
      { key:"SOW Name",	type: "string" },
      { key:"Client Project", type: "string" },
      { key:"Candidate Name",type: "string" },
      { key:"Client Space",type: "string" },
     	{ key:"Candidate Status",	type: "string" },
      { key:"Work Location",type: "string" },
      { key:"TimeZone",	type: "string" },
      { key:"Type",	type: "string" },
      { key:"Fullfillment Date",type: "date" },
      { key:"Joining Date",	type: "date" },
      { key:"Expected Offboarding Date"	,type: "date" },
      { key:"Project Role (for SOW)",	type: "string" },
      { key:"Allocation %",	type: "string" },
      { key:"Country",	type: "string" },
      { key:"Comment" ,type: "string" }
    ]

// *********************** END OF PAGES SCHEMAS *****************************************

export const PRIMARY_KEYS = {
  "Resource Details":"RA ID",
  "Project Details" :"Project Name",
  "Request Details" :"Request ID",
  "Space Details"   :"S.NO",
  "Request Tracker" :"Request ID",
  "SOW Details"     :"S.NO",
  "Demand Fullfillment":"S.NO"
};

export const END_POINTS = {
  "Resource Details":"resources",
  "Project Details" :"",
  "Request Details" :"",
  "Space Details"   :"",
  "Request Tracker" :"",
  "SOW Details"     :"",
  "Demand Fullfillment":""
};
 
export const NONEDITABLE_FIELDS = {
  "Resource Details":[],
  "Space Details"   :[],
  "Project Details" :[],
  "Request Details" :["Project Name"],
  "Request Tracker" :["Project Name","Client SPACE"],
  "SOW Details"     :[],
  "Demand Fullfillment":["Client Project","Client Space",]
}

  export const local_Storage_Key = {
  "Resource Details":"resource-data",
  "Project Details" :"project-details",
  "Request Details" :"request-details",
  "Space Details"   :"client-spaces",
  "Request Tracker" :"request-tracker",
  "SOW Details"     :"sow-details",
  "Demand Fullfillment":"demand-fulfillment",
};

export const DERIVED_FIELDS = {
  "project-details": [
    {
      sourceField: "Project Name",
      targetobject: "request-tracker",
      targetField: "Project Name"
    }
    ,
    {
      sourceField: "Client SPACE",
      targetobject: "request-details",
      targetField: "Client SPACE"
    }
    
  ]
};
