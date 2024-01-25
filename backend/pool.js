const {sample, shuffle, random, range, times, constant, pull} = require("lodash");
const boosterGenerator = require("./boosterGenerator");
const { getCardByUuid,getSet, getCardByName, getRandomSet, getExpansionOrCoreModernSets: getModernList, getExansionOrCoreSets: getSetsList } = require("./data");
const draftId = require("uuid").v1;

/**
 * @desc add a unique id to a card
 * @param card
 * @returns {{...card, cardId: string}}
 */
const addCardId = (card) => ({
  ...card,
  cardId: draftId()
});

const addCardIdsToBoosterCards = (pack) => pack.map(addCardId);

const SealedCube = ({ cubeList, playersLength, playerPoolSize = 90 }) => {
  return DraftCube({
    cubeList,
    playersLength,
    packsNumber: 1,
    playerPackSize: playerPoolSize
  });
};

const DraftCube = ({ cubeList, playersLength, packsNumber = 3, playerPackSize = 15 }) => {
  let list = shuffle(cubeList); // copy the list to work on it

  return range(playersLength * packsNumber)
    .map(() => list.splice(0, playerPackSize).map(getCardByName))
    .map(addCardIdsToBoosterCards);
};

// Replace RNG set with real set
const replaceRNGSet = (sets) => (
  sets.map(set => set === "RNG" ? getRandomSet().code : set)
);

const SealedNormal = ({ playersLength, sets }) => (
  times(playersLength , constant(replaceRNGSet(sets)))
    .map(sets => sets.flatMap(boosterGenerator))
    .map(addCardIdsToBoosterCards)
);

const DraftNormal = ({ playersLength, sets }) => (
  replaceRNGSet(sets)
    .flatMap(set => times(playersLength, constant(set)))
    .map(boosterGenerator)
    .map(addCardIdsToBoosterCards)
);
// Get a random set and transform it to pack
function getRandomPack(setList) {
  const code = chooseRandomSet(setList).code;
  return boosterGenerator(code);
}

const chooseRandomSet = (setList) => {
  const set = sample(setList);
  if (!set.Uncommon || !set.Common)
    return chooseRandomSet(pull(setList, set));
  return set;
};

// Create a complete random pack
function getTotalChaosPack(setList) {
  const chaosPool = [];
  const randomSet = chooseRandomSet(setList);

  // Check if set has at least rares
  if (randomSet.Rare && randomSet.Rare.length > 0) {
    const isMythic = randomSet.mythic && random(7);
    chaosPool.push(sample(isMythic ? randomSet.Mythic : randomSet.Rare));
  } else {
    //If no rare exists for the set, we pick an uncommon
    chaosPool.push(sample(randomSet.Uncommon));
  }

  for (let k = 0; k < 3; k++) {
    chaosPool.push(sample(chooseRandomSet(setList).Uncommon));
  }

  for (let k = 0; k < 11; k++) {
    chaosPool.push(sample(chooseRandomSet(setList).Common));
  }

  return chaosPool.map(getCardByUuid);
}

const DraftChaos = ({ playersLength, packsNumber = 3, modernOnly, totalChaos }) => {
  const setList = modernOnly ? getModernList() : getSetsList();

  return range(playersLength * packsNumber)
    .map(() => totalChaos ? getTotalChaosPack(setList) : getRandomPack(setList))
    .map(addCardIdsToBoosterCards);
};

const SealedChaos = ({ playersLength, packsNumber = 6, modernOnly, totalChaos }) => {
  const pool = DraftChaos({playersLength, packsNumber, modernOnly, totalChaos});
  return range(playersLength)
    .map(() => pool.splice(0, packsNumber).flat())
    .map(addCardIdsToBoosterCards);
};


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

const getPokemonDraft = ({ sets=["PKMN","PKMN","PKMN"], playersLength=8, packsNumber = 3, playerPackSize = 15 }) =>{
  const set =  getSet(sets[0]);
  let allSet = [...set.Common, ...set.Uncommon, ...set.Rare, ...set.Mythic, ...set.ManaFix].map(getCardByUuid)
  //console.log(getCardByUuid(set.Common[0]))
  //const card = getCardByUuid(sets[0].Common[0])
  //return (card)



  let commonCreatures= shuffle(allSet.filter((item)=>{return item.type.includes("Creature") && item.rarity=="Common"}))
  let uncommonCreatures= shuffle(allSet.filter((item)=>{return item.type.includes("Creature") && item.rarity=="Uncommon"}))
  let rareCreatures= shuffle(allSet.filter((item)=>{return item.type.includes("Creature") && item.rarity=="Rare"}))
  let mythicCreatures= shuffle(allSet.filter((item)=>{return item.type.includes("Creature") && item.rarity=="Mythic"}))

  let commonSpells= shuffle(allSet.filter((item)=>{return (!item.type.includes("Creature") && !item.type.includes("Artifact") && item.rarity=="Common")}))
  let uncommonSpells= shuffle(allSet.filter((item)=>{return (!item.type.includes("Creature") && !item.type.includes("Artifact") && item.rarity=="Uncommon")}))
  let rareSpells= shuffle(allSet.filter((item)=>{return (!item.type.includes("Creature") && !item.type.includes("Artifact")  && item.rarity=="Rare")}))
  //let mythicSpells= shuffle(allSet.filter((item)=>{return (!item.type.includes("Creature") && !item.type.includes("Artifact") && item.rarity=="Mythic")}))
  
  let commonItems= shuffle(allSet.filter((item)=>{return (!item.type.includes("Creature") && item.type.includes("Artifact") && item.rarity=="Common")}))
  let uncommonItems= shuffle(allSet.filter((item)=>{return (!item.type.includes("Creature") && item.type.includes("Artifact") && item.rarity=="Uncommon")}))
  let rareItems= shuffle(allSet.filter((item)=>{return (!item.type.includes("Creature") && item.type.includes("Artifact")  && item.rarity=="Rare")}))
  //let mythicItems= shuffle(allSet.filter((item)=>{return (!item.type.includes("Creature") && item.type.includes("Artifact") && item.rarity=="Mythic")}))
  
  let ManaFix= shuffle(allSet.filter((item)=>{return ( item.rarity=="ManaFix")}))
//  console.log(ManaFix)
  let trainers= shuffle(allSet.filter((item)=>{return (item.type.includes("Legendary Trainer"))}))

  
  let base = range(playersLength * packsNumber).map (()=>{return []})

  base =base.map((item)=>{ item.push(ManaFix.pop()) ; return (item)})
  // 4 commons creatures
  for (let index = 0; index < 4; index++) {
    base =base.map((item)=>{ item.push(commonCreatures.pop()) ; return (item)})
  }
  // 3 uncommons creatures
  for (let index = 0; index < 3; index++) {
    base =base.map((item)=>{item.push(uncommonCreatures.pop()); return (item)})
  }
  // 1 rare creatures
  for (let index = 0; index < 1; index++) {
    base =base.map((item)=>{item.push(rareCreatures.pop()); return (item)})
  }
  // rare (5/6) or mythic (1/6) creature
  base =base.map((item)=>{
    let dice
    dice = getRandomInt(1,6)
    if ([1,2,3,4,5].includes(dice)){
      item.push(rareCreatures.pop());   
    }else{
      item.push(mythicCreatures.pop()); 
    }
    return (item);
  })

  // 2 commmon spells
  for (let index = 0; index < 2; index++) {
    base =base.map((item)=>{item.push(commonSpells.pop()); return (item)})
  }

  // 1 uncommmon spells
  for (let index = 0; index < 1; index++) {
    base =base.map((item)=>{item.push(uncommonSpells.pop()); return (item)})
  }
  


  // 1 spells or trainer
  base =base.map((item)=>{
    let dice
    dice = getRandomInt(1,6)
    if ([1,2,3].includes(dice)){
      item.push(uncommonSpells.pop());   
    }else if([4,5].includes(dice)){
      item.push(rareSpells.pop()); 
    }else{
      item.push(trainers.pop()); 
    }
    return (item);
  })

  // 1 artifact
  base =base.map((item)=>{
    let dice
    dice = getRandomInt(1,6)
    if ([1,2,3].includes(dice)){
      item.push(commonItems.pop());   
    }else if([4,5].includes(dice)){
      item.push(uncommonItems.pop()); 
    }else{
      item.push(rareItems.pop()); 
    }
    return (item);
  })
  //let base2 =base.map(()=>{(commonCreatures.pop())})

  base = base.map((item)=>{return addCardIdsToBoosterCards(item)})
  return (base)
}

module.exports = {
  SealedCube,
  DraftCube,
  SealedNormal,
  DraftNormal,
  SealedChaos,
  DraftChaos,
  replaceRNGSet,
  getPokemonDraft
};
