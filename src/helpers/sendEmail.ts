var nodemailer = require('nodemailer');

export const sendEmail = (receiverEmail: string, subject: string, Message: string) => {
	// ****************************************
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'portal.cp.test@gmail.com',
			pass: 'ooqt ique hvew ggsa'
		}
	});

	// ****************************************
	var mailOptions = {
		from: 'portal.cp.test',
		to: receiverEmail,
		subject: subject,
		text: Message
		// '<h1>Welcome</h1><p>That was easy!</p>'
	};

	// ****************************************
	transporter.sendMail(mailOptions, function (error: any, info: any) {
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});
}