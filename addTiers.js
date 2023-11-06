const Tier = require('./models/tier')

const tier1 = new Tier({
  name: "Tier 1",
  maxRequests: 1000,
});

const tier2 = new Tier({
  name: "Tier 2",
  maxRequests: 100,
});

const tier3 = new Tier({
  name: "Tier 3",
  maxRequests: 10,
});

async function saveTiers() {
  try {
    await tier1.save();
    await tier2.save();
    await tier3.save();
    console.log("Tiers saved successfully.");
  } catch (error) {
    console.error("Error saving tiers:", error);
  }
}

saveTiers();
