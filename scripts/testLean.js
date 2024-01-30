
const { getSet,getCardByUuid } = require("../backend/data");
const {sample, shuffle, random, range, times, constant, pull} = require("lodash");
const pool = require("../backend/pool");

function test01(){

    result = pool.DraftNormal({playersLength:5, sets:["RNG","RNG","RNG"], singleton:true})
    const singleton = require("../backend/boosterGeneratorSingleton");
    //singleton.getFromPokemon(["PKMN","PKMN","PKMN"])
    let poke = pool.getPokemonDraft({sets:["PKMN","PKMN","PKMN"]})
    
    
    //console.log(pool.DraftNormal({sets:["RNG","RNG","RNG"]}))
    //console.log(result)
    
    let a  = pool.DraftNormal({
        playersLength: 8,
        sets: ["RNG","RNG","RNG"]
    });
    
    console.log(poke)
}

function test02(){
    let a = pool.getPokemonSealed({sets:["PKMN","PKMN","PKMN"], playersLength:8, playerPoolSize:90})
    console.log(a)
    //let a = getSet()
    //const set =  getSet("PKMN");
    //let allSet = [...set.Common, ...set.Uncommon, ...set.Rare, ...set.Mythic, ...set.ManaFix].map(getCardByUuid)
    //let ManaFix= shuffle(allSet.filter((item)=>{return ( item.rarity=="ManaFix")}))
    //console.log(ManaFix.length)
}

test02()

