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

      const scriptTag = $("#sns_global_scripts").html();

      const confirmed = scriptTag
        .match(/document.getElementById\("cases"\).innerHTML = "[0-9]+"/g)[0]
        .match(/[0-9]+/g)[0];

      const casesaspermohfw = scriptTag
        .match(/document.getElementById\("mohfw"\).innerHTML = "[0-9]+"/g)[0]
        .match(/[0-9]+/g)[0];

      const deaths = scriptTag
        .match(/document.getElementById\("death"\).innerHTML = "[0-9]+"/g)[0]
        .match(/[0-9]+/g)[0];

      const recovered = scriptTag
        .match(/document.getElementById\("recovery"\).innerHTML = "[0-9]+"/g)[0]
        .match(/[0-9]+/g)[0];

      const treatment_ongoing = scriptTag
        .match(/document.getElementById\("ongoing"\).innerHTML = "[0-9]+"/g)[0]
        .match(/[0-9]+/g)[0];

      const nooftestsdone = scriptTag
        .match(/document.getElementById\("testnum"\).innerHTML = "[0-9]+"/g)[0]
        .match(/[0-9]+/g)[0];

      const lineone =
        "Cases updated 2-Apr, " +
        scriptTag
          .match(/let currentUpdateTime = '[0-9]{2}:[0-9]{2}'/g)[0]
          .match(/[0-9]{2}:[0-9]{2}/g)[0] +
        " " +
        scriptTag.match(/let timeEC = '[ap]{1}m'/g)[0].match(/[ap]{1}m/g)[0] +
        "; Tests as of 01-Apr; next update " +
        scriptTag
          .match(/nextUpdateTime = '[0-9]{2}:[0-9]{2}'/g)[0]
          .match(/[0-9]{2}:[0-9]{2}/g)[0] +
        " " +
        scriptTag.match(/let timeEN = '[ap]{1}m'/g)[0].match(/[ap]{1}m/g)[0] +
        "; Sources: MoHFW, Worldometers, ICMR, JHU";

      const linetwo = $(".elementor-element-09fdaea p").text();

      return {
        confirmed,
        casesaspermohfw,
        deaths,
        recovered,
        treatment_ongoing,
        nooftestsdone,
        lineone,
        linetwo
      };
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

  res.status(200).send(response);
});

app.get("/constituency/:url", async function(req, res) {
  const response = await getData(req.params.url);
  console.log(response);
  res.status(200).send(response);
});

const PORT = 1339;

app.listen(PORT, function() {
  console.log("Server Started:" + PORT);
});
