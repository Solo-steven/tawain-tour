import axios from 'axios';
import jsSHA from 'jssha';

const app_id  = '2f6bbd7edb8b44998908bec8ac74325c';
const app_key = '4ssuteFAI12Rkb0EyFCouBgELrs';

async function fetchSpotData(purpose, city_Name , time){
    let spot_data ;    
    let UTCstring = new Date().toUTCString();
    let ShaObj    = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(app_key, 'TEXT');
    ShaObj.update('x-date: ' + UTCstring);
    let HMAC = ShaObj.getHMAC('B64');
    
    await axios({
        method : 'get',
        url :`https://ptx.transportdata.tw/MOTC/v2/Tourism/${purpose}${!city_Name ? city_Name : '/'+city_Name }?$top=30&$skip=${30*(time)}&$format=JSON`,
        headers : {
            'Authorization' : `hmac username="${app_id}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`,
            'X-Date' :  UTCstring,
        }
    }).then((response)=>{
        spot_data = response.data;
    }).catch((err)=>{
        console.error(err);
    });
    return spot_data;
}

export default fetchSpotData;