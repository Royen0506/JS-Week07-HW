let data = [];
axios
  .get(
    "https://raw.githubusercontent.com/hexschool/js-training/main/travelApi.json"
  )
  .then(function (res) {
    data = res.data.data;
    // console.log(data);
    render(data);
    filterData(data);
    addData(data);
  });

//初始化資料
const list = document.querySelector(".ticketCard-area");
const select = document.querySelector(".regionSearch");
const dataNum = document.querySelector("#searchResult-text");
function render(data) {
  // console.log(data);
  let str = "";
  data.forEach(function (item) {
    // console.log(item);
    let content = `<li class="ticketCard">
                <div class="ticketCard-img">
                    <a href="#">
                        <img src="${item.imgUrl}"
                            alt="">
                    </a>
                    <div class="ticketCard-region">${item.area}</div>
                    <div class="ticketCard-rank">${item.rate}</div>
                </div>
                <div class="ticketCard-content">
                    <div>
                        <h3>
                            <a href="#" class="ticketCard-name">${item.name}</a>
                        </h3>
                        <p class="ticketCard-description">
                            ${item.description}
                        </p>
                    </div>
                    <div class="ticketCard-info">
                        <p class="ticketCard-num">
                            <span><i class="fas fa-exclamation-circle"></i></span>
                            剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
                        </p>
                        <p class="ticketCard-price">
                            TWD <span id="ticketCard-price">$${item.price}</span>
                        </p>
                    </div>
                </div>
            </li>`;
    str += content;
  });
  list.innerHTML = str;
  renderC3(data);
  dataNum.innerHTML = `<p id="searchResult-text">本次搜尋共 ${data.length} 筆資料</p>`;
}

//篩選功能
function filterData(data) {
  select.addEventListener("change", function (e) {
    if (e.target.value == "") {
      render(data);
      return;
    }
    let count = 0;
    let filterData = [];

    data.forEach(function (item) {
      // console.log(item);
      if (e.target.value == item.area) {
        filterData.push(item); //變數儲存篩選出來的資料
        count += 1;
      }
      render(filterData); //資料初始化帶入篩選的資料參數
    });
    dataNum.innerHTML = `<p id="searchResult-text">本次搜尋共 ${count} 筆資料</p>`;
    // list.innerHTML = str;
  });
}

//新增功能
const btn = document.querySelector(".btn");
const ticketName = document.querySelector("#ticketName");
const ticketImgUrl = document.querySelector("#ticketImgUrl");
const ticketRegion = document.querySelector("#ticketRegion");
const ticketPrice = document.querySelector("#ticketPrice");
const ticketNum = document.querySelector("#ticketNum");
const ticketRate = document.querySelector("#ticketRate");
const ticketDescription = document.querySelector("#ticketDescription");
const ticketForm = document.querySelector(".addTicket-form");

function addData(data) {
  btn.addEventListener("click", function (e) {
    // console.log(e.target);

    if (
      ticketName.value == "" ||
      ticketImgUrl.value == "" ||
      ticketRegion.value == "" ||
      ticketDescription.value == "" ||
      ticketNum.value == "" ||
      ticketPrice.value == "" ||
      ticketRate.value == ""
    ) {
      alert("請輸入對應資訊");
      return;
    }

    let obj = {};
    obj.id = data.length;
    obj.name = ticketName.value;
    obj.imgUrl = ticketImgUrl.value;
    obj.area = ticketRegion.value;
    obj.description = ticketDescription.value;
    obj.group = ticketNum.value;
    obj.price = ticketPrice.value;
    obj.rate = ticketRate.value;
    data.push(obj);
    // console.log(obj);
    ticketForm.reset();
    select.value = "地區搜尋";
    render(data);
  });
}

//圖表資料處理及渲染
function renderC3() {
  let totalObj = {};
  const ary = data.forEach(function (item) {
    // console.log(item.area);
    if (totalObj[item.area] == undefined) {
      totalObj[item.area] = 1;
    } else {
      totalObj[item.area] += 1;
    }
  });

  // console.log(totalObj);
  newData = [];
  let areaAry = Object.keys(totalObj);
  areaAry.forEach(function (item) {
    let newAry = [];
    newAry.push(item);
    newAry.push(totalObj[item]);
    newData.push(newAry);
  });

  console.log(areaAry);

  console.log(data);

  const chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    data: {
      columns: newData, // 資料存放

      type: "donut",
      colors: {
        台北: "#26BFC7",
        台中: "#5151D3",
        高雄: "#E68619",
      },
    },
    donut: {
      title: "套票地區比重",
      width: 17,
      label: {
        show: false,
      },
    },
  });
}
