const  nodemailer = require('nodemailer');

// Email service configuration 
class EmailService {
    constructor(){
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            
        });
    }

     /**
   * Send email with HTML content
   * @param {string} to - Recipient email address
   * @param {string} subject - Email subject
   * @param {string} html - HTML content
   * @returns {Promise<object>} - Result of the email sending operation
   */

    async sendEmail(to, subject, html){
         try {
            const mailOptions = {
                from : `TechCare <${process.env.EMAIL_USER}>`,
                to,
                subject, 
                html
            };
            const info = await this.transporter.sendMail(mailOptions);
            console.log("Email sent successfully:", info.response);
            return { success: true, messegId: info.messageId};
         }
         catch (error){
            console.error("Error sending email:", error);
            return { success: false, error: error.message}
         }
    }


}

module.exports = new EmailService();
