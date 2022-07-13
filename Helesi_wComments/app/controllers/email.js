// not currentrly used
var nodemailer = require('nodemailer'); 
require('dotenv').config();

exports.sendEmail = (req, res) => {
  
    var transporter = nodemailer.createTransport({
        sendmail: true,
		
        auth: {
          user: 'info@blockchaincert.net',
          pass: 'Qwerty000!'
        }
      });
      var info = 'Καλώς ήλθατε στο Σύστημα Έκδοσης και Πιστοποίησης Εγγράφων Τεχνολογίας Blockchain.'+'\n'
	  +'\n'+
	  'Το παρόν email σας έχει σταλθεί έπειτα από εγγραφή στο σύστημα από τον διαχειριστή της πλατφόρμας.'+'\n'
		  +'\n'+
	  'Η εγγραφή του λογαριασμού σας έγινε με τα εξής στοιχεία:' +'\n'
     +'\n'+
		'Το Username λογαριασμού σας είναι:       ' + req.body.username +'\n'
    +'\n'+
		'Ο κωδικός είναι:                                             ' + req.body.pwd1 +'\n'
     +'\n'+
		 'Το παρόν Email είναι αυτοποιημένο, παρακαλώ μην απαντήσετε σε αυτό.'+'\n'
	  +'\n'+  
	  'Ο διαχειριστής απαλλάσσεται από την ευθύνη των δεδομένων και η επεξεργασία αυτών σχετίζεται με παροχή υπηρεσιών προς τους χρήστες της πλατφόρμας. Οι χρήστες είναι υπεύθυνοι για την ορθή χρήση των δεδομένων τους και την μη κοινοποίηση σε τρίτους.'
        
      var mailOptions = {
        from: 'info@blockchaincert.net',
        to: req.body.email,
        subject: 'Sending Email using Node.js',
        text: info
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 
}
