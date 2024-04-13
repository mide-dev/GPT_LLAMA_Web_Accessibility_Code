const { runAnalysis } = require("./main");

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function automateExperiment() {
  const urls = [
    "https://www.argentdata.com/catalog/",
    "https://buy.ticketstothecity.com/",
    "https://www.cobo.com/",
    "https://craigkeener.com/",
    "https://drgo.us/",
    "https://dtf.ru/",
    "https://e.huawei.com/eu/",
    "https://ettagroup.ru/",
    "https://www.eyehealthweb.com/",
    "https://gudangtekno.web.id/cgi-sys/suspendedpage.cgi",
    "https://hgic.clemson.edu/",
    "https://homemade-recipes.blogspot.com/",
    "https://ilovelakemac.com/",
    "https://www.ipsoft.ba/",
    "https://islands.scot/",
    "https://www.itnewsafrica.com/",
    "https://khanbank.com/personal/home/",
    "https://www.lifepoint.com/",
    "https://www.lightstation.com/",
    "https://live4.io/",
    "https://musiconthedot.com/",
    "https://nic.xyz/",
    "https://projectzante.com/",
    "https://riggertalk.com/",
    "https://robosoft.com.tr/",
    "https://rohanvarma.me/",
    "https://www.rolfdisch.de/en/architects-office/",
    "https://www.silicon.co.uk/",
    "https://soslc.lk/en",
    "https://sso2.educamos.com/",
    "https://tampabayhistorycenter.org/",
    "https://thefifearms.com/",
    "https://wallery.app/",
    "https://www.wonderlandmagazine.com/",
    "https://worldscientific.com/",
    "https://www.zuluwaterways.com/",
  ];

  for (const url of urls) {
    await runAnalysis(url, "aria-required-attr", "fewShot", 0.5, "GPT"); // Run analysis
    await delay(30000); // Wait for 1 minute (60000 milliseconds)
  }

  console.log("********************");
  console.log("DONE!!!");
}

automateExperiment();
