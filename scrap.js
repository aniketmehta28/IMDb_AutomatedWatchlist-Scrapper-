const fs = require("fs");
const request = require("request");
const cheerio = require("cheerio");
const json2xls = require('json2xls');



let finalList = [];


function scrap(link){
    request(link, function(err,res,data){
        process(data);
    })

    
}

function process(html){
    let myDocument = cheerio.load(html);
    let allMovieNames = myDocument('.lister-item-header');
    let ratingsBar = myDocument('.ratings-bar');
    let paraElem = myDocument(".lister-item-content");
 
    for(let i = 0; i< allMovieNames.length;i++){
        let movieTitle = myDocument(allMovieNames[i]);
        let rate = myDocument(ratingsBar[i]);
        let para = myDocument(paraElem[i]);
        let movieName = movieTitle.find("a").text();
        let year = movieTitle.find(".lister-item-year.text-muted.unbold").text();
        
        let genre = para.find(".genre").text().trim();
        // console.log(genre);
        let rating = rate.find(".inline-block.ratings-imdb-rating strong").text();
        let runTime = para.find(".runtime").text();
         processDetails(movieName,year,genre,rating,runTime);
    }
}

function toExcel(path){

    let data = JSON.parse(fs.readFileSync(`${path}`));

    let xls = json2xls(data);
    let name = path.split(".json");

    let filePath = `${name[0]}.xlsx`;
    fs.writeFileSync(filePath, xls, 'binary');
}

function processDetails(movieName,year,genre,rating,runTime){
    let folderPath = `./List.json`;


    let tData = {
        Name : movieName,
        Year: year,
        Genre : genre,
        AudienceScore : rating,
        RunTime: runTime
    }
    finalList.push(tData);
    fs.writeFileSync(folderPath,JSON.stringify(finalList));
     toExcel(folderPath);

}









module.exports = scrap;
