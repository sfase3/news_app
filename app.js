function customHTTP(){
return{
    get(url,cb){
        try{
            const xhr = new XMLHttpRequest();
            xhr.open('GET',url);
            xhr.addEventListener('load',()=>{
                if(Math.floor(xhr.status / 100) !== 2){
                    cb(`Error. Status code: ${xhr.status}`,xhr)
                    return       
                }
                const response = JSON.parse(xhr.responseText)
                cb(null,response)
            });
        
    
    xhr.addEventListener('error',()=>{
        cb(`Error. Status code: ${xhr.status}`,xhr)
    });

    xhr.send()
    } catch(error){
        cb(error)
    }
    },

    post(url,body,headers,cb){
        try{
            const xhr = new XMLHttpRequest()
            xhr.open('POST',url)
            xhr.addEventListener('load',()=>{
                if(Math.floor(xhr.status/100) !== 2){
                    cb(`Error. Status code: ${xhr.status}`,xhr)
                    return
                }
                const response = JSON.parse(xhr.responseText)
                cb(null,response)
            });
            xhr.addEventListener('error',()=>{
                cb(`Error. Status code: ${xhr.status}`,xhr)
            });

            if(headers){
                Object.entries(headers).forEach(([key,value])=>{
                    xhr.setRequestHeader(key,value);
                });
            }
            xhr.send(JSON.stringify(body))
        } catch(error){
            cb(error)
        }
    },
};
}

const http = customHTTP();



const newsService = (function(){
const apiKey = '8fa869752edb47d6b7620c39bdc17f3c'
const apiUrl = 'https://newsapi.org/v2';
return {
    topHeadlines(country=`ua`,cb){
        http.get(`${apiUrl}/top-headlines?country=${country}&apiKey=${apiKey}`,cb)
    },
    everything(query,cb){
        http.get(`${apiUrl}/everything?q=${query}&apiKey=${apiKey}`,cb)
    }
}
})()

const form = document.forms['news_control']
const countrySelect = form.elements['country']
const searchInput = form.elements['search']

form.addEventListener('submit',e=>{
    e.preventDefault();
    randomNews()
})

document.addEventListener('DOMContentLoaded',function(){
    M.AutoInit();
    randomNews()   
});


// preload news func

function randomNews(){
    const country = countrySelect.value;
    const searchText = searchInput.value;
if(!searchText){ 
newsService.topHeadlines(country,onGetResponse)
 } else{
    newsService.everything(searchText,onGetResponse)

 }
}


function showMessage(msg,type='success'){
    M.toast({html: msg,classes: type})
}

// fn on get response from server
function onGetResponse(err,res){
    if(err){
        showMessage(err,"error-msg");
        return 
    }
    renderNews(res.articles)
}

// fn render news
function renderNews(news){
const newsContainer = document.querySelector('.news-container .row')
let frag = "";

news.forEach(item =>{
const el = newsTemplate(item)
if(el){
frag += el;
}
});
clearContainer(newsContainer)
newsContainer.insertAdjacentHTML("afterbegin",frag)
}

// news item temp
function newsTemplate({urlToImage, title, url, description}){
    if(url === null || description === null || title === null ) {return false}
    return `
    <div class="col s12"> 
        <div class="card">
            <div class="card-image">
                <img src="${urlToImage || "img/no_photo.png"}">
                <span class="card-title bg-black">${title || ""}</span> 
            </div>
        <div class="card-content">
    <p>${description}</p>
    </div> 
    <div class="card-action">
    <a href="${url}">Read more</a>
    </div>
    </div>
    </div>
    `;
}


function clearContainer(container){
    container.innerHTML = ''
}


let dark_theme = false;

function changeTheme(){
    if(!dark_theme){
        document.body.style.backgroundColor = '#202324'
        document.querySelector('.row.grid-container').classList.add('bg-dark')
        document.querySelector('.row.grid-container').classList.remove('bg-white')
        dark_theme = true
    } else if(dark_theme){
        document.body.style.backgroundColor = 'white'
        document.querySelector('.row.grid-container').classList.remove('bg-dark')
        document.querySelector('.row.grid-container').classList.add('bg-white')
        dark_theme = false
    }
    
    }

const btn_theme = document.querySelector('#btn_dark')
btn_theme.addEventListener('click',changeTheme)

