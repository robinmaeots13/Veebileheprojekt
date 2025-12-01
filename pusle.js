//peamiselt tehtud järgides seda tutorial videot: https://youtu.be/HS6KHYIYdXc?si=uKSzZGvUdGD9VNPN
// modal asjad:
// https://www.w3schools.com/w3css/w3css_modal.asp
// https://www.w3schools.com/howto/howto_css_modals.asp 

// globaalsed muutujad + vajalikud vaikeväärtused
let PILT=null;
let CANVAS=null;
let CONTEXT=null;
let SCALER=0.65; //pusle suurus
let SIZE={x:0,y:0,width:0,height:0,rows:3,columns:3};
let TÜKID=[];
let VALITUD_TÜKK=null;
let PUSLE_VALMIS = false;
let galeriiIndex = 0;
let galeriiInterval = null;
const galeriiPildid = [
    "pildid/Sipsik-j.jpg",
    "pildid/sipsik-vaatab.jpg",
    "pildid/sipsik-uh.jpg",
    "pildid/sipsik-tups.jpg",
    "pildid/sipsik-s.jpg",
    "pildid/sipsik-lips.jpg",
    "pildid/sipsik-keerd.jpg",
    "pildid/sipsik-huh.jpg",
    "pildid/sipsik-haigutus.jpg",
    "pildid/sipsik-ganst.jpg",
    "pildid/sipsik-bleh.jpg"
];


// main funktsioon on see mis käivitud lehe laadimisel 
function main() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 5);

    CANVAS=document.getElementById("minu_canvas");
    CONTEXT=CANVAS.getContext("2d");
    addEventListeners();

    PILT = new Image();
    PILT.src = "pildid/Sipsik-j.jpg";
    PILT.onload = function(){
        handleResize();
        randomizeRaskus();
        initializeTükid(SIZE.rows, SIZE.columns);
        randomizeTükid();
        updateCanvas();
        window.addEventListener("resize", () => {
            handleResize()
            updateCanvas();
        });
    };

}

// Kui kasutaja muudab akna suurust siis
// pusle suurus ja asukoht kohanduvad
function handleResize() {

    CANVAS.width = CANVAS.clientWidth;
    CANVAS.height = CANVAS.clientHeight;

    let endineWidth = CANVAS.width;
    let endineHeight = CANVAS.height;


    SIZE.width = 450;
    SIZE.height = 350;

    let resizer=SCALER*
                Math.min(
                    window.innerWidth/PILT.width,
                    window.innerHeight/PILT.height
                );
    SIZE.width=resizer*PILT.width;
    SIZE.height=resizer*PILT.height;

    SIZE.x = CANVAS.width/2 - SIZE.width/2;
    SIZE.y = CANVAS.height/2 - SIZE.height/2;


    if (TÜKID.length > 0) {
        for (let t of TÜKID) {
            t.width = SIZE.width / SIZE.columns;
            t.height = SIZE.height / SIZE.rows;
            t.xCorrect = SIZE.x + SIZE.width * t.veeru_index / SIZE.columns;
            t.yCorrect = SIZE.y + SIZE.height * t.rea_index / SIZE.rows;

            if (t.correct) {
                t.x = t.xCorrect;
                t.y = t.yCorrect;
            } else {
                t.x = t.x * CANVAS.width / endineWidth;
                t.y = t.y * CANVAS.height / endineHeight;
            }
        }
    }
}

function updateCanvas() {
    // Kontrollib kas pusle on koos, kui on siis käivitatakse
    // näitValmisPilt mis asendab pusle pildiga
    if (!PUSLE_VALMIS && onValmis()) {
        PUSLE_VALMIS = true;
        näitValmisPilt();
        return;
    }
    CONTEXT.clearRect(0,0,CANVAS.width,CANVAS.height);
    // juhend pilt, mille läbipaistvust on alandatud
    // selle peale lohistame tükid, et pusle kokku panna
    CONTEXT.globalAlpha = 0.5;

    CONTEXT.drawImage(PILT, SIZE.x,SIZE.y,SIZE.width, SIZE.height);
    CONTEXT.globalAlpha = 1;

    CONTEXT.strokeStyle = "black"; 
    CONTEXT.lineWidth = 0.5;
    CONTEXT.strokeRect(SIZE.x, SIZE.y, SIZE.width, SIZE.height);


    for(let i=0; i<TÜKID.length;i++){
        // joonistab pusle tükid
        TÜKID[i].draw(CONTEXT);
    }

}

// iga kord kui leht laetakse on pusle üks kahest raskusastest
// üks raskus on 9 tükki teine on 25 tükki
// Kui ei viitsi paljude tükkidega puslet kokku panna 
// võid laadida lehte kuni saad väiksemate tükkide arvuga pusle
function randomizeRaskus() {
    let raskused = [
        {r: 3, c: 3},
        {r: 5, c: 5}
    ]
    let valik = raskused[Math.floor(Math.random()*raskused.length)];
    SIZE.rows = valik.r;
    SIZE.columns = valik.c
}

// Käib läbi kõik tükid ja kontrollib, kas kõigil on 
// tükk.correct väärtuseks true ehk kas kõik tükid on õigel kohal
// Kui isegi üks on false siis tagastab false
function onValmis() {
    for(let i=0; i<TÜKID.length; i++) {
        if(TÜKID[i].correct==false) {
            return false;
        }
    }
    return true;
}

// Vajalik selleks, et hallata kasutaja interaktsiooni canvas elemendil
function addEventListeners() {
    CANVAS.addEventListener("mousedown", onMouseDown);
    CANVAS.addEventListener("mousemove", onMouseMove);
    CANVAS.addEventListener("mouseup", onMouseUp);
}

// leiab hiire kursosi asukoha
function getMousePos(evt) {
    const rect = CANVAS.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// reageerib kui hiirt vajutatakse ja leiab kas vajutati pusletüki peale, kui jah siis on valmis lohistama
// peale vajutatud tükk on alati kõige peal
function onMouseDown(evt) {
    const pos = getMousePos(evt);
    let vajutatud = getVajutatudTükk(pos);

    if (vajutatud && vajutatud.correct) {
        return;
    }

    VALITUD_TÜKK = vajutatud;
    if (VALITUD_TÜKK != null) {
        const index = TÜKID.indexOf(VALITUD_TÜKK);
        if(index>-1){
            TÜKID.splice(index, 1);
            TÜKID.push(VALITUD_TÜKK)
        }
        VALITUD_TÜKK.offset = {
            x:pos.x-VALITUD_TÜKK.x,
            y:pos.y-VALITUD_TÜKK.y
        };
    }
}

//Liigutab/lohistab valitud ehk peale vajutatud pusletükki
function onMouseMove(evt) {
    if(VALITUD_TÜKK != null) {
        const pos = getMousePos(evt);
        VALITUD_TÜKK.x = pos.x-VALITUD_TÜKK.offset.x;
        VALITUD_TÜKK.y = pos.y-VALITUD_TÜKK.offset.y;
        updateCanvas();
    }
}

//Kui hiire nupp vabastatakse siis lõpetatakse lohistamine ja vaatab ka kas tükk on õigele kohale lähedal
function onMouseUp(evt) {
    if(VALITUD_TÜKK && VALITUD_TÜKK.isclose()){
        VALITUD_TÜKK.snap();
        updateCanvas();
    }
    VALITUD_TÜKK=null;
}

//Tuvastab, millisele tükkile vajutati antud hiire asukohas
function getVajutatudTükk(loc) {
    for (let i = TÜKID.length - 1; i >= 0; i--){
        if(loc.x>TÜKID[i].x && loc.x<TÜKID[i].x+TÜKID[i].width &&
            loc.y>TÜKID[i].y && loc.y<TÜKID[i].y+TÜKID[i].height){
               return TÜKID[i];
        }       
    }
    return null;
}

// täidab TÜKID massiivi uute TÜKK objektidega
function initializeTükid(read, veerud){
    SIZE.rows = read;
    SIZE.columns = veerud;

    TÜKID = [];
    for(let i=0;i<SIZE.rows;i++){
        for(let j=0;j<SIZE.columns;j++){
            TÜKID.push(new Tükk(i,j));
        }
    }
}

// Annab igale tükile juhuslikud asukohad canvas raames
// ning seab, et ükski tükk ei ole õigesti
function randomizeTükid() {
    for(let i=0;i<TÜKID.length;i++){
        let loc={
            x:Math.random() * (CANVAS.width - TÜKID[i].width),
            y:Math.random() * (CANVAS.height - TÜKID[i].height)
        }
        TÜKID[i].x=loc.x;
        TÜKID[i].y=loc.y;
        TÜKID[i].correct=false;
    }
}

// Käivitab automaatse piltide slideshow
function startGalerii() {
    const img = document.getElementById("galerii-img");

    // algus pilt
    img.src = galeriiPildid[galeriiIndex];

    // käivitab tsükli mis kordub iga 3,5 sekundi tagant
    galeriiInterval = setInterval(() => {
        galeriiIndex = (galeriiIndex + 1) % galeriiPildid.length;
        img.src = galeriiPildid[galeriiIndex];
    }, 3500);
}

//Käivitub pärast pusle edukat kokkupanemist
function näitValmisPilt() {
    // peidab canvas ja juhendi
    document.getElementById("minu_canvas").style.display = "none";
    document.querySelector(".juhend").style.display = "none";
    document.getElementById("enne").style.display = "none";

    //näitame pärast section-i
    const pärast = document.getElementById("pärast");
    pärast.classList.remove("peidetud");

    document.body.style.overflowY = 'auto';

    // piltide galerii 
    const pilt = document.getElementById("galerii-img");
    setTimeout(() => pilt.classList.add("nähtav"), 50);

    // info box
    const info = document.getElementById("infoKast");
    const alumineRida = document.querySelector(".alumine-rida")

    setTimeout(() => {
        info.classList.add("nähtav");
        alumineRida.classList.add("nähtav");
    }, 300);

    //käivitab piltide slideshow
    startGalerii();
}

// See avab modaalse akna ehk pop-up'i, vastavalt id-le
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        //teeb modaalakne nähtavaks
        modal.classList.remove('peidetud');
        document.body.style.overflow = 'hidden';
    }
}

// Sulgeb ehk peidab modaalakna
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.classList.add('peidetud');
        document.body.style.overflow = 'auto'; 
    }
}

// Kui kasutaja vajutab modal aknast väljaspoole see ka läheb kinni/peidetakse
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.add('peidetud');
        document.body.style.overflow = 'auto';
    }
}

// Pusle tükkide loomine, liigutamine, kontroll
class Tükk{
    constructor(rea_index, veeru_index){
        this.rea_index = rea_index;
        this.veeru_index = veeru_index;
        this.width=SIZE.width/SIZE.columns;
        this.height=SIZE.height/SIZE.rows;
        this.x=SIZE.x+SIZE.width*this.veeru_index/SIZE.columns;
        this.y=SIZE.y+SIZE.height*this.rea_index/SIZE.rows;
        this.xCorrect=this.x;
        this.yCorrect=this.y;
        this.correct=true;

    }
    draw(context) {

        context.drawImage(
            PILT,
            this.veeru_index * (PILT.width / SIZE.columns),  
            this.rea_index * (PILT.height / SIZE.rows),      
            PILT.width / SIZE.columns,                       
            PILT.height / SIZE.rows,                         
            this.x,                                          
            this.y,                                          
            this.width,                                   
            this.height                  
            
        );

        context.beginPath();

        context.rect(this.x,this.y,this.width,this.height);
        context.stroke();
    }
    
    // kontrollib kas tüki hetke asukoht on piisavalt lähedal
    // oma õigele kohale 
    isclose() {
        if(kaugus({x:this.x,y:this.y},
            {x:this.xCorrect,y:this.yCorrect})<this.width/3){
                return true;
        }
        return false;
    }

    // kui isclose() on tõene ehk kui tüki praegune asukoht on tõesti
    // piisavalt läehele õigele kohale määrab tüki aukoha täpselt õigetele väärtustele
    snap() {
        this.x = this.xCorrect;
        this.y = this.yCorrect;
        this.correct=true;
    }
}

function kaugus(p1,p2) {
    return Math.sqrt(
        (p1.x-p2.x)*(p1.x-p2.x) +
        (p1.y-p2.y)*(p1.y-p2.y));
}


window.onload = main;

