$(document).ready(function () {
    $('.sideBar').click(function (event) {
        $('.aside').toggleClass('open');
    })
})

var data;//存取Json資料
var town = document.querySelector('.town');
var point = document.querySelector('.point');

//創建一個地圖資訊
var map = L.map('map').setView([24.1650122, 120.6414029], 17);


//載入OSM的圖資
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);




init();
renderDay();



town.addEventListener('change', function (e) {
    renderLsit(e.target.value)
})
point.addEventListener('change', function (e) {
    var selectCountry = town.value;
    renderListTown(selectCountry, e.target.value)
})
//網頁初始化
function init() {
    getData();
}

//顯示日期
function renderDay() {
    //日期判斷
    var _date = new Date();
    var _day = _date.getDay();
    var _numDay = _date.getDate();
    var _chineseDay = chineseDay(_day);
    var _today = _date.getFullYear() + "-" + (_date.getMonth() + 1) + "-" + _numDay;
    document.querySelector('.date').textContent = _today;
    document.querySelector('.day span').textContent = _chineseDay;

    //判斷日期是否為奇數偶數
    if (_day == 1 || _day == 3 || _day == 5) {
        document.querySelector('.odd').style.display = "block";
    }
    else if (_day == 2 || _day == 4 || _day == 6) {
        document.querySelector('.even').style.display = "block";
    }
}
//利用XMLHttpRequest獲取Json資料並將資料存進全域變數data變數裡
function getData() {
    var xhr = new XMLHttpRequest();
    xhr.open('get', "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json");
    xhr.send();
    xhr.onload = function () {
        var str = JSON.parse(xhr.responseText);
        data = str;
        renderLsit();
    }
}
//點選選到的藥局然後將視窗移到該處
function searchBtn(x,y) {
    L.popup().setLatLng([x, y]).setContent('<h4>' + '點選的藥局' + '</h4>').openOn(map);
    console.log('fuck')
}
//讀取select縣市並顯示有該內容的藥局
function renderLsit(country) {
    var ary = data.features;
    var str = '';
    var area2 = [];
    var area = [];
    //收縮地圖，提升效能
    var markers = new L.MarkerClusterGroup().addTo(map);

    for (var j = 0; j < ary.length; j++) {
        area.push(ary[j].properties.county);
        markers.addLayer(L.marker([ary[j].geometry.coordinates[1], ary[j].geometry.coordinates[0]])
            .bindPopup(`<h5>${ary[j].properties.name}</h5><p>成人口罩：${ary[j].properties.mask_adult}<br>兒童口罩:${ary[j].properties.mask_child}</p>`))
        
    }
    map.addLayer(markers);
    
    var noSameArea = Array.from(new Set(area));

    if (country == undefined || country == "") {
        showTownAndArea(noSameArea, country);
    }
    else {
        for (var i = 0; i < ary.length; i++) {
            //挑出選到的國家
            if (country == ary[i].properties.county) {
                str += `<li class="listli">
                    <div>
                        <a href="#" class="d-inline-block path " onclick='searchBtn(${ary[i].geometry.coordinates[1]}, ${ary[i].geometry.coordinates[0]})'><img src="https://i.ibb.co/jrKkY92/visibility.png" style="width:30px;"></a>
                        <h2 class="shop">${ary[i].properties.name}</h2>
                        <p class="address">${ary[i].properties.address}</p>
                        <p class="phone">${ary[i].properties.phone}</p>
                        <p class="item">${ary[i].properties.note}</p>
                    </div>
                    <div class="mask">
                        <p class="adult">成人口罩:${ary[i].properties.mask_adult}</p>
                        <p class="child">兒童口罩:${ary[i].properties.mask_child}</p>
                    </div>
                </li>`;
                //篩選國家裡的小鎮/村莊/街道並放進變數area2
                area2.push(ary[i].properties.town);
                
               
            }
        }
    }
    document.querySelector(".list").innerHTML = str;

    //挑選出沒有重複的小鎮/村莊/街道
    var nosamePoint = Array.from(new Set(area2));
    

    showPoint(nosamePoint);
}
   
function renderListTown(Country,Town) {  
    var ary = data.features;
    var str = '';

    
    for(var i =0 ; i < ary.length;i++){
        if(Country == ary[i].properties.county && Town == ary[i].properties.town){
            str += `<li class="listli">
                    <div>
                        <a href="#" class="d-inline-block path " onclick='searchBtn(${ary[i].geometry.coordinates[1]}, ${ary[i].geometry.coordinates[0]})'><img src="https://i.ibb.co/jrKkY92/visibility.png" style="width:30px;"></a>
                        <h2 class="shop">${ary[i].properties.name}</h2>
                        <p class="address">${ary[i].properties.address}</p>
                        <p class="phone">${ary[i].properties.phone}</p>
                        <p class="item">${ary[i].properties.note}</p>
                    </div>
                    <div class="mask">
                        <p class="adult">成人口罩:${ary[i].properties.mask_adult}</p>
                        <p class="child">兒童口罩:${ary[i].properties.mask_child}</p>
                    </div>
                </li>`;
        }
    }
    document.querySelector(".list").innerHTML = str;
}




//將國家顯示在select上
function showTownAndArea(place, choose) {
    if (choose == undefined) {
        var str = '<option value="" disabled selected>-- 請選擇 --</option>';
        for (var i = 0; i < place.length; i++) {
            str += '<option value="' + place[i] + '">' + place[i] + '</option>'
        }
        town.innerHTML = str;
    }

}

function showPoint(place) {
    var str = '<option value="" disabled selected>-- 請選擇 --</option>';
    for (var i = 0; i < place.length; i++) {
        str += '<option value="' + place[i] + '">' + place[i] + '</option>';
    }
    point.innerHTML = str;
}


//將數字日期轉成國語日期
function chineseDay(day) {
    switch (day) {
        case 0:
            return "日";
            break;
        case 1:
            return "一";
            break;
        case 2:
            return "二";
            break;
        case 3:
            return "三";
            break;
        case 4:
            return "四";
            break;
        case 5:
            return "五";
            break;
        case 6:
            return "六";
            break;
        default:
            return "沒有這一天"
            break;
    }
}




