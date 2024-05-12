const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a function to calculate the gross pay rate based on the basic pay
function calculateGrossPayRate(basicPay) {
    return basicPay * 1.2;  // Example calculation, adjust as needed
}

const exchangeRate = 50; // Adjust the value as needed

const SalarySchema = new Schema({
    employeeName: { type: String, required: true },
    tin: { type: String, required: true },
    sss: { type: String, required: true },
    philhealth: { type: String, required: true },
    hdmf: { type: String, required: true },    
    basicPay: { type: Number, required: true },
    nightDiff: { type: Number, default: 0 },
    overtimePay: { type: Number, default: 0 },
    holidayPay: { type: Number, default: 0 },
    internetAllowance: { type: Number, default: 0 },
    otherBonuses: { type: Number, default: 0 },
    attendanceIncentive: { type: Number, default: 0 },
    // Added fields
    hoursWorked: { type: Number, default: 0 },
    regularOvertime: { type: Number, default: 0 },
    regularHoliday: { type: Number, default: 0 },
    specialNonWorkingDay: { type: Number, default: 0 },
    holidayOvertime: { type: Number, default: 0 },
    serviceIncentiveLeaveCredit: { type: Number, default: 0 },
    grossPayRate: { type: Number, default: 0 },
    grossRatePerHour: { type: Number, default: 0 },
    grossSalaryDollars: { type: Number, default: 0 },
    grossSalaryPesos: { type: Number, default: 0 },
    internetAllowanceBonuses: { type: Number, default: 0 },
    totalGrossCompensation: { type: Number, default: 0 },
    yearToDateCompensation: { type: Number, default: 0 },
    yearToDateDeductions: { type: Number, default: 0 },
    yearToDateGrossPay: { type: Number, default: 0 },
    yearToDateNetPay: { type: Number, default: 0 },
    // Deductions
    whDeduction: { type: Number, default: 0 },
    sssDeduction: { type: Number, default: 0 },
    philhealthDeduction: { type: Number, default: 0 },
    hdmfDeduction: { type: Number, default: 0 },
    // Calculated fields
    totalCompensation: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    totalNetPay: { type: Number, default: 0 },

    // Dates
    payrollDate: { type: Date, default: Date.now },
    startingCutoff: { type: Date, default: Date.now },
    endingCutoff: { type: Date, default: Date.now }
});

// Pre-save middleware to calculate total compensation and net pay
SalarySchema.pre('save', function(next) {
    // Recalculating total compensation to include all components
    this.totalCompensation = this.basicPay + this.nightDiff + this.overtimePay + this.holidayPay + this.internetAllowance + this.otherBonuses + this.attendanceIncentive + this.regularOvertime + this.regularHoliday + this.specialNonWorkingDay + this.holidayOvertime;
    // Optionally calculate gross pay rate, rate per hour etc., here if needed
    this.grossPayRate = calculateGrossPayRate(this.basicPay);  // Ensure this function is defined or provide logic
    this.grossRatePerHour = this.grossPayRate / (this.hoursWorked || 1); // Prevent division by zero
    this.grossSalaryDollars = this.totalCompensation / exchangeRate;  // Assuming exchange rate is defined
    this.grossSalaryPesos = this.totalCompensation;
    this.totalGrossCompensation = this.totalCompensation + this.internetAllowanceBonuses; // Assuming this field accumulates all bonuses
    
    this.whDeduction = this.calculatewhDeduction(this.basicPay);

    this.totalDeductions = this.sssDeduction + this.philhealthDeduction + this.hdmfDeduction;
    this.totalNetPay = this.totalCompensation - this.totalDeductions;
    next();
});

const Salary = mongoose.model('Salary', SalarySchema);
module.exports = Salary;


// Define the calculateWHTax function
function calculatewhDeduction(basicPay) {
    let whDeduction;
    if (basicPay <= 20833) {
        whDeduction = basicPay * 0;  // No tax for basic pay up to 20,833
    } else if (basicPay <= 33332) {
        whDeduction = basicPay * 0.15;  // 15% tax for basic pay between 20,834 and 33,332
    } else if (basicPay <= 66666) {
        whDeduction = basicPay * 0.20;  // 20% tax for basic pay between 33,333 and 66,666
    } else if (basicPay <= 166666) {
        whDeduction = basicPay * 0.25;  // 25% tax for basic pay between 66,667 and 166,666
    } else if (basicPay <= 666666) {
        whDeduction = basicPay * 0.30;  // 30% tax for basic pay between 166,667 and 666,666
    } else {
        whDeduction = basicPay * 0.35;  // 35% tax for basic pay above 666,667
    }
    return whDeduction;
}

