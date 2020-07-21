
const fs = require('fs');
const obj = JSON.parse(fs.readFileSync('/Users/manhngo/Downloads/labels.json', 'utf8'));
for (const key in obj){
  if (obj.hasOwnProperty(key)){
    console.log(key);
    console.log(obj[key])
  }
}