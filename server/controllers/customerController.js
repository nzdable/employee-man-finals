const Customer = require("../models/Customer");
const mongoose = require("mongoose");
const LeaveController = require('../controllers/leaveController');

exports.homepage = async (req, res) => {
  const messages = await req.flash("info");

  const locals = {
    title: "Employee Management System",
  };

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const customers = await Customer.find()
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Customer.countDocuments({});

    res.render("index", {
      locals,
      customers,
      current: page,
      pages: Math.ceil(count / perPage),
      messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while fetching customers.");
  }
};


// Function to retrieve only superiors with position 'manager'
const getManagerSuperiors = async () => {
  try {
    const managerSuperiors = await Customer.find({ position: 'Manager' });
    return managerSuperiors;
  } catch (error) {
    console.error(error);
    return [];
  }
};

exports.about = async (req, res) => {
  try {
    // Fetch all customers from the database
    const customers = await Customer.find();
    
    // Fetch only superiors with position 'manager'
    const managerSuperiors = await getManagerSuperiors();

    const locals = {
      title: "Leave",
      customers: customers, // Pass the customers data to the template
      managerSuperiors: managerSuperiors // Pass the manager superiors data to the template
    };
    res.render("about", locals);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred while rendering about page.");
  }
};


exports.addCustomer = async (req, res) => {
  const locals = {
    title: "Add New Customer - NodeJs",
  };

  res.render("customer/add", locals);
};

exports.postCustomer = async (req, res) => {
  console.log(req.body);

  const newCustomer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    details: req.body.details,
    tel: req.body.tel,
    email: req.body.email,
    department: req.body.department,
    destination: req.body.destination, 
    type: req.body.type, 
    position: req.body.position, 
    addressLine: req.body.addressLine, 
    barangay: req.body.barangay,       
    city: req.body.city, 
    province: req.body.province,       
    country: req.body.country,         
    zipcode: req.body.zipcode          
  });

  try {
    await Customer.create(newCustomer);
    
    // Save employee name as signatory for leave
    const { firstName, lastName } = req.body;
    const signatoryName = `${firstName} ${lastName}`;
    await LeaveController.saveSignatory({
      ...req.body,
      signatories: [signatoryName],
    });

    await req.flash("info", "A New Employee Information Has Been Added.");

    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

exports.view = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id })
    .populate('department')
      .populate('destination')
        .populate('type')
        .populate('position');

    const locals = {
      title: "View Employee Data",
    };

    res.render("customer/view", {
      locals,
      customer,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.edit = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });

    const locals = {
      title: "Edit Employee Data",
    };

    res.render("customer/edit", {
      locals,
      customer,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.editPost = async (req, res) => {
  const { firstName, lastName, tel, email, details, department, destination, type } = req.body;
  try {
    await Customer.findByIdAndUpdate(req.params.id, {
      firstName,
      lastName,
      tel,
      email,
      details,
      department, // Assuming this is the ObjectId of the department
      destination, // Assuming this is the ObjectId of the destination
      type,
      updatedAt: Date.now(),
    });

    await req.flash("info", "Employee updated successfully.");
    res.redirect(`/view/${req.params.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while updating the customer.");
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

exports.searchCustomers = async (req, res) => {
  const locals = {
    title: "Search Employee Data",
  };

  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const customers = await Customer.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      customers,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};
