require ('file-saver')
const jsdom = require('jsdom')
const { JSDOM } = jsdom


  const expCSV = () =>{
    //  const dom = new JSDOM('',{    //should have the url of gcloud when we are at the waste pages or routes
    //      url: 'http://127.0.0.1:5500/app/sample.html',
    //      referrer: 'undefined',
    //      contentType: 'text/html',
    //      includeNodeLocations: true,
    //      storageQuota: 10000000
    //  })
    //  dom.serialize()
    // let csv = []
    // const rows = document.querySelectorAll('table tr')
    //     for( const row of rows.values()){
    //         const cells = rows.querySelectorAll('td, th')
    //         const rowText = Array.from(cells).map(cell => cell.innerText)
    //         csv.push(rowText.join(','))
    //     }
    //     const csvFile = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;'})
    //     saveAs(csvFile, 'data.csv')
 }



module.exports = expCSV()