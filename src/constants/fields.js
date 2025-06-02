// src/constants/fields.js

export const RESOURCE_KEYS = [
  "S.NO","Emp ID", "RA ID", "Emp Name", "Status", "Utilised in ZS", "Resume",
  "Previous ZS work Experience", "DOJ", "KL Exp (yr)", "Total Workex (yr)",
  "Location Constraint", "Role", "Current Allocation", "Lead",
  "Primary skills", "Secondary skills", "Comment"
];

export const SPACE_KEYS = [
  "S.NO","Client Space", "Client Principal/AP", "Client Manager", "RA ZS Account Manager"
];

export const PROJECT_DETAILS = [
  "S.NO", "Project Name", "Client Space", "Client Principal" ,"POC", "Other POCs" , "Handled by"  , "Active"];

export const REQUEST_DETAILS = [
  "S.NO", "Request ID", "Project Name", "Skills", "Comment"];

export const REQUEST_TRACKER = [
    	"Request ID",	"Beeline ID",	"Project Name",	"Client SPACE",	
    "#Resources"	,"Level",	"Skill Set"	, "Duration",
    "Location",	"Demand Date","Closing Date"	,"Handled By",	"Status",	"Comment"
];

export const SOW_DETAILS = [  "S.NO",	"SOW Name",	"Account"	, "Active"]


  export const DEMAND_FULFILLMENT = [
    	"S.NO","Request ID",	"SOW Name",	"Client Project", "Candidate Name","Client Space",
     	"Candidate Status",	"Work Location","TimeZone",	"Type",	"Fullfillment Date",
      "Joining Date",	"Expected Offboarding Date"	,"Project Role (for SOW)",	
      "Allocation %",	"Country",	"Comment"]

  export const PRIMARY_KEYS = {
  "Resource Details":"RA ID",
  "Project Details" :"Project Name",
  "Request Details" :"Request ID",
  "Space Details"   :"S.NO",
  "Request Tracker" :"Request ID",
  "SOW Details"     :"S.NO",
  "Demand Fullfillment":"S.NO"
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
    // ,
    // {
    //   sourceField: "Project Name",
    //   targetobject: "demand-fulfillment",
    //   targetField: "Client Project"
    // },
    // {
    //   sourceField: "Client SPACE",
    //   targetobject: "demand-fulfillment",
    //   targetField: "Client Space"
    // }
  ]
};
