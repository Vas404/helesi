async function print(){
    const url = "http://95.216.162.109/print/";
      //console.log('1');
      var data = localStorage.getItem("object_name");
     
          //const browser = await puppeteer.launch();
          const browser = await puppeteer.launch({
            headless: true,
            ignoreHTTPSErrors: true,
            args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--window-size=1400,900',
            '--ignore-certifcate-errors-spki-list'],
          });
        
         // console.log('2');
          const page = await browser.newPage();
    
          await page.goto(url,{ waitUntil: 'networkidle0' });
          
          await page.evaluate(_ => {
            // this will be executed within the page, that was loaded before
            document.getElementById("company_name").innerHTML="company_name";
            
          });
         // await page.setViewport({ width: 1680, height: 1050 });
          
          const buffer = await page.pdf({
              format: "A4",
              printBackground: true,
          
          });
          res.send(buffer);
          //await browser.close();
          //return pdf;
          
    }