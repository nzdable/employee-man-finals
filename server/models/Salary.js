const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalarySchema = new Schema({
    employeeName: { type: String, required: true },
    tin: { type: String, required: true },
    sss: { type: String, required: true },
    philhealth: { type: String, required: true },
    hdmf: { type: String, required: true },    
    department: {type: String, required: true},

    nightDiff: { type: Number, default: 0 },
    overtimePay: { type: Number, default: 0 },
    holidayPay: { type: Number, default: 0 },
    internetAllowance: { type: Number, default: 0 },
    otherBonuses: { type: Number, default: 0 },
    attendanceIncentive: { type: Number, default: 0 },

    // Added fields
    hoursWorked: { type: Number, default: 0 },
    basicPay: { type: Number, required: 0 },

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

    // Loans
    sssLoanSalary: { type: Number, default: 0 },
    sssLoanCalamity: { type: Number, default: 0 },
    hdmfLoanSalary: { type: Number, default: 0 },
    hdmfLoanCalamity: { type: Number, default: 0 },

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
    createdAt: { type: Date, default: Date.now },
    payrollDate: { type: Date, default: Date.now },
    startingCutoff: { type: Date, default: Date.now },
    endingCutoff: { type: Date, default: Date.now }
});

// Pre-save middleware to calculate total compensation and net pay
SalarySchema.pre('save', function(next) {
    // Recalculating total compensation to include all components
    this.totalCompensation = this.basicPay + this.nightDiff + this.overtimePay + this.holidayPay + this.internetAllowance + this.otherBonuses + this.attendanceIncentive + this.regularOvertime + this.regularHoliday + this.specialNonWorkingDay + this.holidayOvertime;
    // Optionally calculate gross pay rate, rate per hour etc., here if needed
    this.grossPayRate = calculateGrossPayRate(this.hoursWorked);  // Ensure this function is defined or provide logic
    this.grossRatePerHour = this.grossPayRate / (this.hoursWorked || 1); // Prevent division by zero
    this.grossSalaryDollars = this.totalCompensation / exchangeRate;  // Assuming exchange rate is defined
    this.grossSalaryPesos = this.totalCompensation;
    this.totalGrossCompensation = this.totalCompensation + this.internetAllowanceBonuses; // Assuming this field accumulates all bonuses
    this.basicPay = calculateBasicPay(this.hoursWorked);
    this.overtimePay = calculateOvertimePay(this.hoursWorked);

    this.whDeduction = calculatewhDeduction(this.basicPay);
    this.sssDeduction = calculateSSSDeduction(this.basicPay);

    this.totalDeductions = this.whDeduction + this.sssDeduction + this.philhealthDeduction + this.hdmfDeduction + this.sssLoanSalary + this.sssLoanCalamity + this.hdmfLoanSalary + this.sssLoanCalamity;
    this.totalNetPay = this.totalCompensation - this.totalDeductions;
    next();
});

const Salary = mongoose.model('Salary', SalarySchema);
module.exports = Salary;

function calculateBasicPay(hoursWorked){
    return hoursWorked * 54;
}

function calculateOvertimePay(hoursWorked) {
    const regularHoursPerMonth = 160;
    let overtimePay;

    if (hoursWorked > regularHoursPerMonth) {
        overtimePay = ((hoursWorked - 160) * (0.5*54));
    } 
    return overtimePay;
}

// Define a function to calculate the gross pay rate based on the basic pay
function calculateGrossPayRate(hoursWorked) {
    return hoursWorked * 5.10;  // Example calculation, adjust as needed
}

const exchangeRate = 50; // Adjust the value as needed

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

function calculateSSSDeduction(basicPay) {
    let sssDeduction;
    if (basicPay <= 10000) {
        sssDeduction = basicPay * 0.0363;  // 3.63% contribution for basic pay up to 10,000
    } else if (basicPay <= 20000) {
        sssDeduction = basicPay * 0.0918;  // 9.18% contribution for basic pay between 10,001 and 20,000
    } else if (basicPay <= 40000) {
        sssDeduction = basicPay * 0.1024;  // 10.24% contribution for basic pay between 20,001 and 40,000
    } else if (basicPay <= 80000) {
        sssDeduction = basicPay * 0.1127;  // 11.27% contribution for basic pay between 40,001 and 80,000
    } else if (basicPay <= 120000) {
        sssDeduction = basicPay * 0.1288;  // 12.88% contribution for basic pay between 80,001 and 120,000
    } else if (basicPay <= 160000) {
        sssDeduction = basicPay * 0.1433;  // 14.33% contribution for basic pay between 120,001 and 160,000
    } else if (basicPay <= 200000) {
        sssDeduction = basicPay * 0.1551;  // 15.51% contribution for basic pay between 160,001 and 200,000
    } else {
        sssDeduction = basicPay * 0.1639;  // 16.39% contribution for basic pay above 200,000
    }
    return sssDeduction;
}

function calculatePhilHealthDeduction(basicPay) {
    let philhealthDeduction;
    if (basicPay <= 10000) {
        philhealthDeduction = basicPay * 0.0275;  // 2.75% contribution for basic pay up to 10,000
    } else if (basicPay <= 40000) {
        philhealthDeduction = basicPay * 0.035;   // 3.5% contribution for basic pay between 10,001 and 40,000
    } else if (basicPay <= 60000) {
        philhealthDeduction = basicPay * 0.0425;  // 4.25% contribution for basic pay between 40,001 and 60,000
    } else if (basicPay <= 70000) {
        philhealthDeduction = basicPay * 0.05;    // 5% contribution for basic pay between 60,001 and 70,000
    } else {
        philhealthDeduction = basicPay * 0.055;   // 5.5% contribution for basic pay above 70,000
    }
    return philhealthDeduction;
}

function calculateHDMFDeduction(basicPay) {
    let hdmfDeduction;
    if (basicPay <= 1500) {
        hdmfDeduction = basicPay * 0.01;  // 1% contribution for basic pay up to 1,500
    } else {
        hdmfDeduction = basicPay * 0.02;  // 2% contribution for basic pay above 1,500
    }
    return hdmfDeduction;
}