var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'portal.cp.test@gmail.com',
		pass: 'ooqt ique hvew ggsa'
	}
});

var mailOptions = {
	from: 'portal.cp.test',
	to: 'devyoussefsalah@gmail.com',
	subject: 'Sending Email using Node.js',
	text: 'That was easy!'
	// '<h1>Welcome</h1><p>That was easy!</p>'
};

// ! Send email to more than one address:
// var mailOptions = {
//   from: 'youremail@gmail.com',
//   to: 'myfriend@yahoo.com, myotherfriend@yahoo.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!'
// }

export const sendEmail = () => {
	transporter.sendMail(mailOptions, function (error: any, info: any) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}