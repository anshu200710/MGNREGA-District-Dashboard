// backend/models/DistrictData.js
import mongoose from "mongoose";

const districtDataSchema = new mongoose.Schema(
  {
    fin_year: String,
    month: String,
    state_code: String,
    state_name: String,
    district_code: String,
    district_name: String,
    Approved_Labour_Budget: Number,
    Average_Wage_rate_per_day_per_person: Number,
    Average_days_of_employment_provided_per_Household: Number,
    Differently_abled_persons_worked: Number,
    Material_and_skilled_Wages: Number,
    Number_of_Completed_Works: Number,
    Number_of_GPs_with_NIL_exp: Number,
    Number_of_Ongoing_Works: Number,
    Persondays_of_Central_Liability_so_far: Number,
    SC_persondays: Number,
    ST_persondays: Number,
    Total_Adm_Expenditure: Number,
    Total_Exp: Number,
    Total_Households_Worked: Number,
    Total_Individuals_Worked: Number,
    Total_No_of_Active_Job_Cards: Number,
    Total_No_of_Active_Workers: Number,
    Total_No_of_HHs_completed_100_Days_of_Wage_Employment: Number,
    Total_No_of_JobCards_issued: Number,
    Total_No_of_Workers: Number,
    Total_No_of_Works_Takenup: Number,
    Wages: Number,
    Women_Persondays: Number,
    percent_of_Category_B_Works: Number,
    percent_of_Expenditure_on_Agriculture_Allied_Works: Number,
    percent_of_NRM_Expenditure: Number,
    percentage_payments_gererated_within_15_days: Number,
    Remarks: String,
  },
  { timestamps: true }
);

const DistrictData = mongoose.model("DistrictData", districtDataSchema);
export default DistrictData;
