const axios = require('axios')
const fs = require('fs');

const firstid = '108414544572573503';
const url = 'https://mastodon.online/api/v1/accounts/133400/statuses?exclude_replies=true&max_id='
const reqPromise = url => axios.get(url);
const dataLengthLimit = 400;// 到达上限存储json文件
let DirectorFlag= false;
let DataList = []
function writeFile(data, fileName) {
    fs.writeFile(fileName, JSON.stringify(data), 'utf8', (err) => {
        if (err) throw err;
        console.log(`${fileName}.json saved successfully`);
      });
}

async function crawler(URL) {
    const res = await reqPromise(URL);
    const data = res.data;
    let lastItem = data[data.length-1]
    let id = lastItem.id;
    let fileName = `./${lastItem.account.username}/${lastItem.created_at.slice(0,10)+'-'+id}.json`;
    if(!DirectorFlag){
        //文件夹不存在则创建data文件夹存储json文件 
        if(!fs.existsSync(`./${lastItem.account.username}`)){
            fs.mkdirSync(`./${lastItem.account.username}`)
            DirectorFlag = true;        
        }
    }
    data.map((item)=>{
        DataList.push(item.content)
    })
    if(DataList.length>dataLengthLimit){
        writeFile(DataList, fileName);
        DataList = [];
        console.log(id)
    }
    console.log(DataList.length);
     sleep(crawler(url+id),1000)
}


function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

crawler(url+firstid);
