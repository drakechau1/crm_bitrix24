const http = require("http")
const request = require('request')
const express = require("express")
const app = express();
const server = app.listen(process.env.PORT || 8080, function () {
    console.log("server is running");
})

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ducchau.app@gmail.com',
        pass: 'vaoyvhrpqnstzyxq'
    }
});

var mailOptions = {
    from: "ducchau.app@gmail.com",
    to: "ducchau.spm@gmail.com",
    subject: "CRM DEAL LIST",
    text: ""
}

var bodyParser = require('body-parser')
app.use(bodyParser.json())

var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const axios = require('axios')

const dealTypedef = {
    TEXT: "",
    TOTAL_OPPORTUNITY: 0,
    COUNT: 0
}

const VNformat = new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency: "VND"
})

app.get("/", function (req, res) {
    res.send("hello crm");
})

app.get("/crmdeallist", function (req, res) {
    console.log("crm dead list");
    res.send("crm deal list")


    // Make request
    axios.get("https://b24-hqt8v8.bitrix24.vn/rest/10/70c5qqzru1ab122y/crm.deal.list.json")

        // Show response data
        .then(res => {

            var newDeal = Object.create(dealTypedef);
            var prepareDeal = Object.create(dealTypedef);
            var prepaymentInvoiceDeal = Object.create(dealTypedef);
            var finalInvoiceDeal = Object.create(dealTypedef);
            var executingDeal = Object.create(dealTypedef);
            var wonDeal = Object.create(dealTypedef);
            var lostDeal = Object.create(dealTypedef);

            res.data["result"].forEach(element => {

                if (element["STAGE_ID"] == 'NEW') {
                    newDeal.COUNT += 1;
                    newDeal.TEXT += "Deal: " + element["TITLE"] + "\n"
                        + "Oppotunity: " + VNformat.format(element["OPPORTUNITY"]) + "\n"
                        + "Source: " + element["SOURCE_ID"] + "\n\n";
                    newDeal.TOTAL_OPPORTUNITY += parseInt(element["OPPORTUNITY"]);
                }
                else if (element["STAGE_ID"] == 'PREPARATION') {
                    prepareDeal.COUNT += 1;
                    prepareDeal.TEXT += "Deal: " + element["TITLE"] + "\n"
                        + "Oppotunity: " + VNformat.format(element["OPPORTUNITY"]) + "\n"
                        + "Source: " + element["SOURCE_ID"] + "\n\n";
                    prepareDeal.TOTAL_OPPORTUNITY += parseInt(element["OPPORTUNITY"]);
                }
                else if (element["STAGE_ID"] == 'PREPAYMENT_INVOICE') {
                    prepaymentInvoiceDeal.COUNT = + 1;
                    prepaymentInvoiceDeal.TEXT += "Deal: " + element["TITLE"] + "\n"
                        + "Oppotunity: " + VNformat.format(element["OPPORTUNITY"]) + "\n"
                        + "Source: " + element["SOURCE_ID"] + "\n\n";
                    prepaymentInvoiceDeal.TOTAL_OPPORTUNITY += parseInt(element["OPPORTUNITY"]);
                }
                else if (element["STAGE_ID"] == 'FINAL_INVOICE') {
                    finalInvoiceDeal.COUNT += 1;
                    finalInvoiceDeal.TEXT += "Deal: " + element["TITLE"] + "\n"
                        + "Oppotunity: " + VNformat.format(element["OPPORTUNITY"]) + "\n"
                        + "Source: " + element["SOURCE_ID"] + "\n\n";
                    finalInvoiceDeal.TOTAL_OPPORTUNITY += parseInt(element["OPPORTUNITY"]);
                }
                else if (element["STAGE_ID"] == 'EXECUTING') {
                    executingDeal.COUNT += 1;
                    executingDeal.TEXT += "Deal: " + element["TITLE"] + "\n"
                        + "Oppotunity: " + VNformat.format(element["OPPORTUNITY"]) + "\n"
                        + "Source: " + element["SOURCE_ID"] + "\n\n";
                    executingDeal.TOTAL_OPPORTUNITY += parseInt(element["OPPORTUNITY"]);
                }
                else if (element["STAGE_ID"] == 'WON') {
                    wonDeal.COUNT += 1;
                    wonDeal.TEXT += "Deal: " + element["TITLE"] + "\n"
                        + "Oppotunity: " + VNformat.format(element["OPPORTUNITY"]) + "\n"
                        + "Source: " + element["SOURCE_ID"] + "\n\n";
                    wonDeal.TOTAL_OPPORTUNITY += parseInt(element["OPPORTUNITY"]);
                }
                else if (element["STAGE_ID"] == 'LOST') {
                    lostDeal.COUNT += 1;
                    lostDeal.TEXT += "Deal: " + element["TITLE"] + "\n"
                        + "Oppotunity: " + VNformat.format(element["OPPORTUNITY"]) + "\n"
                        + "Source: " + element["SOURCE_ID"] + "\n\n";
                    lostDeal.TOTAL_OPPORTUNITY += parseInt(element["OPPORTUNITY"]);
                }

            });

            var mailContent = "";
            mailContent += `----NEW (${newDeal.COUNT})----` + "\n" + "Total oppotunity: " + VNformat.format(newDeal.TOTAL_OPPORTUNITY) + "\n\n" + newDeal.TEXT + "\n";
            mailContent += `----PREPARATION (${prepareDeal.COUNT})----` + "\n" + "Total oppotunity: " + VNformat.format(prepareDeal.TOTAL_OPPORTUNITY) + "\n\n" + prepareDeal.TEXT + "\n";
            mailContent += `----PREPAYMENT_INVOICE (${prepaymentInvoiceDeal.COUNT})----` + "\n" + "Total oppotunity: " + VNformat.format(prepaymentInvoiceDeal.TOTAL_OPPORTUNITY) + "\n\n" + prepaymentInvoiceDeal.TEXT + "\n";
            mailContent += `----FINAL_INVOICE (${finalInvoiceDeal.COUNT})----` + "\n" + "Total oppotunity: " + VNformat.format(finalInvoiceDeal.TOTAL_OPPORTUNITY) + "\n\n" + finalInvoiceDeal.TEXT + "\n";
            mailContent += `----EXECUTING (${executingDeal.COUNT})----` + "\n" + "Total oppotunity: " + VNformat.format(executingDeal.TOTAL_OPPORTUNITY) + "\n\n" + executingDeal.TEXT + "\n";
            mailContent += `----WON (${wonDeal.COUNT})----` + "\n" + "Total oppotunity: " + VNformat.format(wonDeal.TOTAL_OPPORTUNITY) + "\n\n" + wonDeal.TEXT + "\n";
            mailContent += `----LOST (${lostDeal.COUNT})----` + "\n" + "Total oppotunity: " + VNformat.format(lostDeal.TOTAL_OPPORTUNITY) + "\n\n" + lostDeal.TEXT + "\n";

            mailOptions.text = mailContent;
            console.log(mailOptions.text);

            transporter.sendMail(mailOptions, function (err, info) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("email send: " + info.response);
                }
            })


        })
        .catch(err => console.log(err))
})

app.get("/crmcontactlist", function (req, res) {
    console.log("crm dead list");
    res.send("crm contact list")


    // Make request
    axios.get("https://b24-hqt8v8.bitrix24.vn/rest/10/70c5qqzru1ab122y/crm.contact.list.json")

        // Show response data
        .then(res => {
            res.data["result"].forEach(element => {
                // if (element["STAGE_ID"] == 'NEW')
                console.log(element);
            });
        })
        .catch(err => console.log(err))
})
