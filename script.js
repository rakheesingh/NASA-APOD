const imageContainer = document.querySelector(".images-container");
const resultantNav = document.querySelector("#resultsNav");
const favNav = document.querySelector("#favNav");
const saveConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
const resultNavChild = resultantNav.querySelectorAll(".clickable");
const favNavChild = favNav.querySelectorAll(".clickable");
const container= document.querySelector(".container");

//NASA API
const count = 10;
const API_KEY = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=${count}`;
let resultantArray = [];
let favArray = [];
let favPageVisible = false;

function updateFavList(imgData, index) {
  if (favPageVisible) {
    saveConfirmed.textContent = "REMOVED";
    favArray.splice(index, 1);
    updateDOM(favArray);
  } else {
    favArray.push(imgData);
    saveConfirmed.textContent = "ADDED";
  }
  localStorage.setItem("FavItems", JSON.stringify(favArray));
  saveConfirmed.classList.toggle("hidden");
  setTimeout(() => saveConfirmed.classList.toggle("hidden"), 2000);
}

function updateDOM(photoList) {
  window.scrollTo(0, 0);
  imageContainer.textContent = "";
  photoList.forEach((imgData, index) => {
    let imgCard = document.createElement("div");
    imgCard.classList.add("card");

    //image link elemnt
    let imageLink = document.createElement("a");
    imageLink.setAttribute("src", imgData.hdurl);
    imageLink.setAttribute("target", "_black");

    //image elemnt
    let image = document.createElement("img");
    image.setAttribute("src", imgData.url);
    image.classList.add("card-img-top");
    image.loading = "lazy";

    //Card Body
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    //Card Title
    let cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = imgData.title;

    //Add to Fav
    let favElemnt = document.createElement("p");
    favElemnt.classList.add("clickable");
    favElemnt.textContent = favPageVisible
      ? `Remove From Favorites`
      : "Add To Favorites";

    //Card paragraph
    let cardPara = document.createElement("p");
    cardPara.classList.add("card-text");
    cardPara.textContent = imgData.explanation;

    //Footer Container
    let footer = document.createElement("footer");
    footer.classList.add("text-muted");
    //date Container
    let date = document.createElement("strong");
    date.textContent = imgData.date;
    //copyright
    let copyright = document.createElement("span");
    copyright.textContent = imgData.copyright
      ? `  ${imgData.copyright}`
      : "Unknown";
    copyright.nowrap = "nowrap";
    // Append Element
    footer.append(date, copyright);
    cardBody.append(cardTitle, favElemnt, cardPara);
    imageLink.append(image);
    imgCard.append(imageLink, cardBody, footer);
    imageContainer.append(imgCard);
    favElemnt.addEventListener("click", () => updateFavList(imgData, index));
  });
}

async function getApiData() {
  loader.classList.toggle("hidden");
  container.classList.toggle("hidden");
  try {
    const response = await fetch(apiUrl);
    resultantArray = await response.json();
    loader.classList.toggle("hidden");
    container.classList.toggle("hidden");
    updateDOM(resultantArray);
  } catch (err) {
    console.log(err, "error");
  }
}

function changeScreen(array, favText) {
  favPageVisible = !favPageVisible;
  updateDOM(array, favText);
  favNav.classList.toggle("hidden");
  resultantNav.classList.toggle("hidden");
}
//Load Fav articles from localstorage
if(localStorage.getItem("FavItems")){
  favArray=JSON.parse(localStorage.getItem("FavItems"))
}
//onLoad
getApiData();
resultNavChild[0].addEventListener("click", () => changeScreen(favArray));
resultNavChild[1].addEventListener("click", getApiData);
favNavChild[0].addEventListener("click", () => changeScreen(resultantArray));
