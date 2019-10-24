const axios = require("axios");
const cheerio = require("cheerio");

const url =
  "http://results.eci.gov.in/ACOCT2019/ConstituencywiseS13254.htm?ac=254";

axios(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const eciTable = $("#div1 > table").first();

    const tr = eciTable.find("tbody > tr[style='font-size:12px;']");

    let constituency = [];

    tr.each(function() {
      //   const td = $(this).find("td");
      let candidate = {};
      candidate["O.S.N"] = $(this)
        .find("td:nth-child(1)")
        .text();
      candidate["Candidate"] = $(this)
        .find("td:nth-child(2)")
        .text();
      candidate["Party"] = $(this)
        .find("td:nth-child(3)")
        .text();
      candidate["EVM Votes"] = $(this)
        .find("td:nth-child(4)")
        .text();
      candidate["Postal Votes"] = $(this)
        .find("td:nth-child(5)")
        .text();
      candidate["Total Votes"] = $(this)
        .find("td:nth-child(6)")
        .text();
      candidate["% of Votes"] = $(this)
        .find("td:nth-child(7)")
        .text();
      constituency.push(candidate);
    });

    console.log(constituency);
  })
  .catch(console.error);
