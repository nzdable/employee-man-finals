const Salary = require('../models/Salary');
const Customer = require('../models/Customer');



function calculateGrossPayRate(basicPay) {
    return basicPay * 1.2;  // This is a simplistic calculation, adjust as needed
}

const exchangeRate = 50;  // Example exchange rate for dollar to peso conversion

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
        employeeName, tin, sss, philhealth, hdmf, basicPay, nightDiff,
        overtimePay, holidayPay, internetAllowance, otherBonuses, attendanceIncentive,
        sssDeduction, philhealthDeduction, hdmfDeduction, startingCutoff, endingCutoff,
        hoursWorked, regularOvertime, regularHoliday, specialNonWorkingDay, holidayOvertime,
        serviceIncentiveLeaveCredit
    } = req.body;

    const grossPayRate = calculateGrossPayRate(basicPay);
    const grossSalaryDollars = (basicPay + nightDiff + overtimePay + holidayPay + internetAllowance + otherBonuses) / exchangeRate;
    const grossSalaryPesos = basicPay + nightDiff + overtimePay + holidayPay + internetAllowance + otherBonuses;
    const totalGrossCompensation = basicPay + nightDiff + overtimePay + holidayPay + internetAllowance + otherBonuses + attendanceIncentive + regularOvertime + regularHoliday + specialNonWorkingDay + holidayOvertime;
    const yearToDateCompensation = totalGrossCompensation; // This needs to be accumulated over the year
    const totalDeductions = sssDeduction + philhealthDeduction + hdmfDeduction;
    const yearToDateDeductions = totalDeductions; // This also needs to be accumulated over the year
    const yearToDateGrossPay = totalGrossCompensation; // Accumulated gross pay over the year
    const yearToDateNetPay = yearToDateGrossPay - yearToDateDeductions; // Net pay accumulated over the year
    const whDeduction = calculatewhDeduction(basicPay);

    const newSalary = new Salary({
        employeeName, tin, sss, philhealth, hdmf,
        basicPay, nightDiff, overtimePay, holidayPay, internetAllowance,
        otherBonuses, attendanceIncentive, sssDeduction, philhealthDeduction,
        hdmfDeduction, payrollDate: new Date(), startingCutoff, endingCutoff,
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
        res.render('salary/viewSalary', {
            title: "View Salary",
            salary
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching salary details.');
    }
};