const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const urlData = require("./urls");

app.use(cors());

function getData(url) {
  return axios("http://results.eci.gov.in/ACOCT2019/" + url)
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const eciTable = $("#div1 > table").first();
      const tr = eciTable.find("tbody > tr[style='font-size:12px;']");
      let constituency = [];

      tr.each(function() {
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

      return constituency;
    })
    .catch(error => {
      console.log(error);
    });
}

function getCovidData() {
  return axios("https://covidindia.org/")
    .then(response => {
      const html = response.data;
      const $ = cheerio.load(html);
      const section = $(".elementor-element-51bcd0e");
      // console.log(section);
      const confirmed = $("#sns_global_scripts").html();

      console.log(confirmed.search('document.getElementById("cases")'));
      // const tr = eciTable.find("tbody > tr[style='font-size:12px;']");
      // let constituency = [];

      // tr.each(function() {
      //   let candidate = {};
      //   candidate["O.S.N"] = $(this)
      //     .find("td:nth-child(1)")
      //     .text();
      //   candidate["Candidate"] = $(this)
      //     .find("td:nth-child(2)")
      //     .text();
      //   candidate["Party"] = $(this)
      //     .find("td:nth-child(3)")
      //     .text();
      //   candidate["EVM Votes"] = $(this)
      //     .find("td:nth-child(4)")
      //     .text();
      //   candidate["Postal Votes"] = $(this)
      //     .find("td:nth-child(5)")
      //     .text();
      //   candidate["Total Votes"] = $(this)
      //     .find("td:nth-child(6)")
      //     .text();
      //   candidate["% of Votes"] = $(this)
      //     .find("td:nth-child(7)")
      //     .text();
      //   constituency.push(candidate);
      // });

      return null;
    })
    .catch(error => {
      console.log(error);
    });
}

getCovidData();

app.get("/", function(req, res) {
  res.status(200).send("Welcome to our restful API");
});

app.get("/covid19/in", async function(req, res) {
  const response = await getCovidData();

  res.status(200).send({
    confirmed: 2032,
    casesaspermohfw: 1965,
    deaths: 58,
    recovered: 171,
    treatment_ongoing: 1803,
    nooftestsdone: 47951
  });
});

app.get("/constituency/:url", async function(req, res) {
  const response = await getData(req.params.url);
  res.status(200).send(response);
});

const PORT = 1339;

app.listen(PORT, function() {
  console.log("Server Started:" + PORT);
});
