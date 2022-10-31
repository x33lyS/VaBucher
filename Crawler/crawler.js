const puppeteer = require('puppeteer');
const mysql = require('mysql');

// const con = mysql.createConnection({
//     host: "localhost",
//     user: "",
//     password: "",
//     database: "vabucherdb"
// });



(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://fr.indeed.com/jobs?q=Informatique&l=Toulouse');
    await page.screenshot({path: 'example.png'});
    console.log("node js crawler")
    await browser.close();

    // con.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Connected!");
    //     let sql = "INSERT INTO JobOffer (name, address) VALUES ('Company Inc', 'Highway 37')";
    //     con.query(sql, function (err, result) {
    //         if (err) throw err;
    //         console.log("1 record inserted");
    //     });
    // });
})();