const Salary = require('../models/Salary');
const Customer = require('../models/Customer');

function calculateHourlyHoursWorked(hoursWorked) {
    return hoursWorked * 1;
}
function calculateHourlyOvertime(regularOvertime) {
    return regularOvertime * 0.25;
}
function calculateHourlyHoliday(regularHoliday) {
    return regularHoliday * 1;
}
function calculateHourlyNonWorkHoliday(specialNonWorkingDay){
    return specialNonWorkingDay * 0.3;
}
function calculateHourlyHolidayOvertime(holidayOvertime){
    return holidayOvertime * 0.3;
}
function calculateHourlySILC(serviceIncentiveLeaveCredit){
    return serviceIncentiveLeaveCredit * 0.91;
}
function calculateBasicPay(hoursWorked){
    return hoursWorked * 54;
}



const exchangeRate = 50;  

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

exports.renderAddSalaryPage = async (req, res) => {
    try {
        const customers = await Customer.find().exec();
        res.render("salary/addSalary", {
            title: "Add New Salary",
            customers: customers
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while rendering the add salary page.');
    }
};

exports.addSalary = async (req, res) => {
    const {
        employeeName, tin, sss, philhealth, hdmf, department, nightDiff,
        overtimePay, holidayPay, internetAllowance, otherBonuses, attendanceIncentive, createdAt,
        startingCutoff, endingCutoff,
        hoursWorked, regularOvertime, regularHoliday, specialNonWorkingDay, holidayOvertime,
        serviceIncentiveLeaveCredit, sssLoanSalary, sssLoanCalamity, hdmfLoanSalary, hdmfLoanCalamity
    } = req.body;

    const hourlyHoursWorked = calculateHourlyHoursWorked(hoursWorked);
    const hourlyOvertime = calculateHourlyOvertime(regularOvertime);
    const hourlyHoliday = calculateHourlyHoliday(regularHoliday);
    const hourlyNonWorkHoliday = calculateHourlyNonWorkHoliday(specialNonWorkingDay);
    const hourlyHolidayOvertime = calculateHourlyHolidayOvertime(holidayOvertime);
    const hourlySILC = calculateHourlySILC(serviceIncentiveLeaveCredit);


    const basicPay = calculateBasicPay(hoursWorked);

    const sssDeduction = calculateSSSDeduction(basicPay);
    const whDeduction = calculatewhDeduction(basicPay);
    const philhealthDeduction = calculatePhilHealthDeduction(basicPay);
    const hdmfDeduction = calculateHDMFDeduction(basicPay);

    const grossPayRate = hourlyHoursWorked + hourlyOvertime + hourlyHoliday + hourlyNonWorkHoliday + hourlyHolidayOvertime + hourlySILC;
    const grossSalaryDollars = (basicPay + nightDiff + overtimePay + holidayPay + internetAllowance + otherBonuses) / exchangeRate;
    const grossSalaryPesos = basicPay + nightDiff + overtimePay + holidayPay + internetAllowance + otherBonuses;
    const totalGrossCompensation = basicPay + nightDiff + overtimePay + holidayPay + internetAllowance + otherBonuses + attendanceIncentive + regularOvertime + regularHoliday + specialNonWorkingDay + holidayOvertime;
    const yearToDateCompensation = totalGrossCompensation; // This needs to be accumulated over the year
    const totalDeductions = sssDeduction + whDeduction + philhealthDeduction + hdmfDeduction + sssLoanSalary + sssLoanCalamity + hdmfLoanSalary + hdmfLoanCalamity; 
    const yearToDateDeductions = totalDeductions; // This also needs to be accumulated over the year
    const yearToDateGrossPay = totalGrossCompensation; // Accumulated gross pay over the year
    const yearToDateNetPay = yearToDateGrossPay - yearToDateDeductions; // Net pay accumulated over the year

    const newSalary = new Salary({
        employeeName, tin, sss, philhealth, hdmf, department,
        basicPay, nightDiff, overtimePay, holidayPay, internetAllowance, hourlyHoursWorked, hourlyOvertime, hourlyHoliday, hourlyNonWorkHoliday, hourlyHolidayOvertime, hourlySILC,
        otherBonuses, attendanceIncentive, whDeduction, sssDeduction, philhealthDeduction,
        hdmfDeduction, sssLoanSalary, sssLoanCalamity, hdmfLoanSalary, hdmfLoanCalamity, createdAt, payrollDate: new Date(), startingCutoff, endingCutoff,
        hoursWorked, regularOvertime, regularHoliday, specialNonWorkingDay, holidayOvertime,
        serviceIncentiveLeaveCredit, grossPayRate, grossSalaryDollars, grossSalaryPesos,
        totalGrossCompensation, yearToDateCompensation, totalDeductions, yearToDateDeductions,
        yearToDateGrossPay, yearToDateNetPay
    });

    try {
        await newSalary.save();
        res.redirect('/salaryList'); // Redirect to the salary list page after save
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while adding salary.');
    }
};

exports.viewSalaryList = async (req, res) => {
    try {
        const salaries = await Salary.find();
        res.render('salaryList', {
            title: "Salary List",
            salaries
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching salary list.');
    }
};

exports.editSalary = async (req, res) => {
    const { id } = req.params;
    const salaryUpdates = req.body;
    try {
        await Salary.findByIdAndUpdate(id, salaryUpdates);
        res.redirect(`/salary/viewSalary/${id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while editing salary.');
    }
};

exports.viewSalary = async (req, res) => {
    const { id } = req.params;
    try {
        const salary = await Salary.findById(id);
        const customer = {};
        res.render('salary/viewSalary', {
            title: "View Salary",
            salary,
            customer,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching salary details.');
    }
};