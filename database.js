//This file is used to insert temprorary data in MongoDB for Searching
//Don't Run this file Twice.

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
var db = null;
var url = 'mongodb://localhost:27017';
MongoClient.connect(url, function (err, client) {
    if (err) {
        console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
        console.log('Connection established to', url);
        db = client.db('meme-hub');
        var collection = db.collection('post');
        collection.insertMany(dataBase);
        
    }
});

var dataBase = [
    {
        "title": "food",
        "tags":"food",
        "like":12,
        "url":"https://media.gizmodo.co.uk/wp-content/uploads/2018/11/free-food-count-me-in-31970907.png"
    },
    {
        "title": "burning house",
        "tags": "spider",
        "like":13,
        "url":"https://s2.r29static.com/bin/entry/017/545x362,85/1621956/image.webp"
    },
    {
        "title": "funny",
        "tags":"funny",
        "like":20,
        "url":"https://www.thesun.co.uk/wp-content/uploads/2018/06/NINTCHDBPICT000307940539.jpg"
    },
    {
        "title": "cat",
        "tags":"funny",
        "like":50,
        "url":"https://www.thesun.co.uk/wp-content/uploads/2018/06/NINTCHDBPICT000411917106.jpg?w=335"
    },
    {
        "title": "bollywood",
        "tags":"dialog",
        "like":1,
        "url":"https://spiderimg.amarujala.com/assets/images/2018/07/20/750x506/_1532078773.jpeg"
    },
    {
        "title": "sacred games",
        "tags":"dialog",
        "like":22,
        "url":"https://spiderimg.amarujala.com/assets/images/2018/07/20/750x506/bhukamp_1532077884.jpeg"
    },
    {
        "title": "bollywood",
        "tags":"dialog",
        "like":10,
        "url":"https://i.imgflip.com/3766bk.jpg"
    },
    {
        "title": "funny",
        "tags":"single",
        "like":12,
        "url":"https://scontent.fccu1-1.fna.fbcdn.net/v/t1.0-9/s960x960/74835067_2495737640648148_6980168080521428992_o.jpg?_nc_cat=109&_nc_oc=AQl25HeBjQAjaCBHlVS1NpzwS_0Ocmp3S6MGmcEL0e6MZCO0uqhB4ZOvqSmOBSX8a8k&_nc_ht=scontent.fccu1-1.fna&oh=6abff99643df7d4778d279bc1e981ceb&oe=5E404DBC"
    },
    {
        "title": "bollywood",
        "tags":"funny",
        "like":16,
        "url":"https://scontent.fccu1-1.fna.fbcdn.net/v/t1.0-9/s960x960/76935904_2494653970756515_3704416370906103808_o.jpg?_nc_cat=105&_nc_oc=AQnuLUxCo_cVI6v9aD3_JDsXGu2SQW52s5f9IF_ExOuwHvOdo6zy2R48jfywK-lwid4&_nc_ht=scontent.fccu1-1.fna&oh=9972a4d196c2e3bf7247a41bdde8f824&oe=5E599B36"
    },
    {
        "title":"funny",
        "tags":"best friend",
        "like":19,
        "url":"https://scontent.fccu1-1.fna.fbcdn.net/v/t1.0-9/p960x960/75246626_2493614050860507_561184605898539008_o.jpg?_nc_cat=101&_nc_oc=AQn4jVx6g5G7_2frRyP0PY-opgL3XYI7_FlB848QV5aX-IjF6cUYomLJwNVnAXYhzn0&_nc_ht=scontent.fccu1-1.fna&oh=36d9030481a81d4e685c50376052c655&oe=5E50F00C"
    },
    {
        "title":"funny",
        "tags":"bollywood",
        "like":32,
        "url":"https://scontent.fccu1-1.fna.fbcdn.net/v/t1.0-9/74677033_2493256467562932_8048213790044454912_n.jpg?_nc_cat=105&_nc_oc=AQnCNurrjG8-ua2cBgCoOo-FQIbgJFbMjCyfAMIHmDOJqUGfnNABv3I3UwxBLd-6zRA&_nc_ht=scontent.fccu1-1.fna&oh=0fb80612c619b9a632339b224ddcada5&oe=5E899F1A"
    },
    {
        "title":"funny",
        "tags":"funny",
        "like":42,
        "url":"https://scontent.fccu1-1.fna.fbcdn.net/v/t1.0-9/76631270_2493230080898904_444254177099513856_n.jpg?_nc_cat=105&_nc_oc=AQlHa-H6XjRmy3dXTj13wTSvP8ZGxKskEyHl8hCshn2xvk7jTXkkHeV_JCs9VHSf0Xs&_nc_ht=scontent.fccu1-1.fna&oh=237fe18e6a4a64e37df3056dfaaf4408&oe=5E4DC5A0"
    },
    {
        "title":"funny",
        "tags":"funny",
        "like":33,
        "url":"https://scontent.fccu1-1.fna.fbcdn.net/v/t1.0-9/s960x960/77110454_2492107201011192_3481035181970685952_o.jpg?_nc_cat=111&_nc_oc=AQlUi8-LC686MdliP8dDFmFpyRJHlrxG_yLEvP-cAq2qu5aY16nJRMDP7b2MBc3CFmQ&_nc_ht=scontent.fccu1-1.fna&oh=3e30bfd6a321efd68f973b4eab5b4076&oe=5E45B013"
    },
]


