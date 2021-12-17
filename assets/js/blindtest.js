function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
    s1 =    s1.toLowerCase().normalize("NFD") // Séparer accents des lettres
            .replace(/[\u0300-\u036f]/g, "") // Supprimer accents
            .replace(/[\W_]+/g," ") // Supprimer chars spéciaux
            .replace(/\s+/g, ''); // Supprimer espaces

    s2 =    s2.toLowerCase().normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[\W_]+/g," ")
            .replace(/\s+/g, '');

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

function setIframe(src) {
    if (src !== undefined) {
        var domain = (new URL(src)).hostname.replace('www.','');
        src = src.split('?')[0];

        if (domain == "youtube.com") {
            src = src + "?autoplay=1&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3&fs=0";

        } else if (domain == "player.vimeo.com") {
            src = src + "?autoplay=1&title=0&byline=0&portrait=0";

        } else if (domain == "dailymotion.com") {
            src = src + "?autoplay=1&queue-autoplay-next=0&queue-enable=0&sharing-enable=0&ui-logo=0&ui-start-screen-info=0";

        } else {
            newRound();
        }
    }

    document.getElementById("video").src = src;
}

function getHtml(url) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: "https://adoasis.fr/nautilproxy.php?url=" + encodeURIComponent(url),
            type:'GET',
            success: function(data) {
                resolve($($.parseHTML(data)));
            },
            error: function(err) {
                reject(err);
            }
        });
    });
}


var round = 0;
var score = 0;
var musique = {};
var musiques = [];
var titres = [];
var titres1 = [];
var titresbak = [];
var mode, diversite, reponse;
var alertMsgFade;

function setup() {
    mode = document.getElementById('mode').value;
    diversite = document.getElementById('diversite').value;
    reponse = document.getElementById('reponse').value;
    newGame(mode, diversite, reponse);
}


function randomSetup() {
    // Mode
    var modeS = document.getElementById('mode');
    var modeO = modeS.getElementsByTagName('option');
    var modeI = Math.floor(Math.random() * modeO.length);
    modeS.selectedIndex = modeI;
    // Diversité
    diversiteI = [30, 60, 90, 120, 150, 180, 210, 240, 270, 300][Math.floor(Math.random()*10)];
    document.getElementById('diversite').value = diversiteI;
    // Réponse
    var reponseS = document.getElementById('reponse');
    var reponseO = reponseS.getElementsByTagName('option');
    var reponseI = Math.floor(Math.random() * reponseO.length);
    reponseS.selectedIndex = reponseI;
    setup();
}

var async_request=[];
var responses=[];
function newGame(mode, diversite, reponse) {
    document.getElementById("loading").style.display = "block";
    document.getElementById("setup").style.display = "none";
    document.getElementById("solution").style.display = "none";
    document.getElementById("final").style.display = "none";
    document.getElementById("video").classList.add("hideframe");

    for (i = 0; i < (parseInt(diversite)/30); i++) {
        async_request.push($.ajax({
            url: "https://adoasis.fr/nautilproxy.php?url=" + encodeURIComponent("https://www.nautiljon.com/classements/" + mode + "/generic/" + (i*30) + "/"),
            type:'GET',
            success: function(data){
                responses.push(data);
            },
            error: function(data){
                endGame(data);
            }
        }));
    }

    $.when.apply(null, async_request).done(function(){
        $.each(responses, function(i, rep){
            $(rep).find("table").find("tr").each(function() {
                musiques.push($(this).find("td.left").find("a").attr('href'));
                titres1.push($(this).find("td.left").find("span.infos_small").text().slice(1,-1));
            });
        });

        $.each(titres1, function(i, el){
            if ($.inArray(el, titres) === -1) titres.push(el);
        });

        titresbak = titres.slice(0);
        musiques = shuffle(musiques);

        var uniqueAnime = []
        var uniqueAnimeURL = []
        for (mus of musiques) {
            if (!uniqueAnime.includes(mus.split("/")[2])) {
                uniqueAnime.push(mus.split("/")[2]);
                uniqueAnimeURL.push(mus);
            }
        }
        musiques = uniqueAnimeURL;

        newRound();
    });
}


function newRound() {
    setIframe();
    if (round == 10) { endGame(); return; }
    if (musiques.length === 0) { endGame(); return; }

    var item = ~~(Math.random() * musiques.length);
    var url = musiques[item];

    musique.url = url;
    musiques.splice(item, 1);

    getHtml("https://www.nautiljon.com" + url).then(function(data) {
        musique.titre = data.find(".h1titre").find("span[itemprop='name']").attr("content");
        musique.image = data.find(".image_fiche").find("a").find("img").attr("src");
        musique.video = data.find(".center100").find("iframe").attr("src");
        if (musique.video == undefined) { newRound(); }
        data.find(".infosFicheTop").find("li").each(function() {
            if ($(this).find("span.bold:contains('Anime : ')").length > 0) {
                musique.anime = $(this).find("a").text();
            } else if ($(this).find("span.bold:contains('Interprète : ')").length > 0) {
                musique.inteprete = $(this).find("a").text();
            } else if ($(this).find("span.bold:contains('Compositeur : ')").length > 0) {
                musique.auteur = $(this).find("a").text();
            }
        });

        setIframe(musique.video);

        titres.splice(titres.indexOf(musique.anime), 1);
        var correct = Math.floor(Math.random() * 4);
        var buttons = [0,1,2,3];
        buttons.splice(correct, 1);
        
        document.getElementById("choix" + correct).innerHTML = musique.anime;

        $(buttons).each(function(){
            var faux = titres.sort(() => Math.random() - Math.random()).slice(0, 1);
            document.getElementById("choix" + this.valueOf()).innerHTML = faux;
            titres.splice(faux, 1);
            buttons.splice(this, 1);
        });
        titres = titresbak.slice(0);

        document.getElementById("loading").style.display = "none";
        document.getElementById("jeu").style.display = "block";
        document.getElementById("solution").style.display = "none";

        if (reponse == "choix") {
            document.getElementById("reponseChoix").style.display = "block";
            document.getElementById("reponseEcrite").style.display = "none";
        } else if (reponse == "ecrite") {
            document.getElementById("reponseChoix").style.display = "none";
            document.getElementById("reponseEcriteInput").value = "";
            document.getElementById("reponseEcrite").style.display = "block";
        }

        document.getElementById("video").classList.add("hideframe");

        clearTimeout(alertMsgFade);
        document.getElementById("alertMessage").style.display = "none";
        alertMsgFade = setTimeout(fadeAlert, 10000);
        function fadeAlert() {
            $('#alertMessage').fadeIn(300);
        }

    }).catch(function(err) {
        endGame(err);
        return;
    });
}


function valider(input) {
    round += 1;
    $("#video").css("-webkit-filter","blur(0px)");
    $("#video").css("filter","blur(0px)");
    document.getElementById("video").classList.remove("hideframe");
    clearTimeout(alertMsgFade);
    document.getElementById("alertMessage").style.display = "none";

    document.getElementById("solutionReponse").innerHTML = input;
    document.getElementById("solutionReponse").className = '';

    if (((reponse == "ecrite") && (similarity(input, musique.anime) > 0.825)) || ((reponse == "choix") && (musique.anime == input))) {
        document.getElementById("solutionReponse").classList.add("text-success");
        score += 1;
    } else {
        document.getElementById("solutionReponse").classList.add("text-danger");
    }

    document.getElementById("solutionAnime").innerHTML = musique.anime;
    document.getElementById("solutionMusique").innerHTML = musique.titre;
    document.getElementById("solutionAuteur").innerHTML = musique.auteur;
    document.getElementById("solutionInterprete").innerHTML = musique.inteprete;
    document.getElementById("solutionImage").src = "https://adoasis.fr/nautilimage.php?img=" + btoa("https://www.nautiljon.com" + musique.image);
    document.getElementById("solutionLien").href = "https://www.nautiljon.com" + musique.url;

    document.getElementById("solution").style.display = "block";
    document.getElementById("reponseEcrite").style.display = "none";
    document.getElementById("reponseChoix").style.display = "none";

    document.addEventListener("keyup", function(event) {
        if ((event.keyCode === 13 || event.code === 'Enter') && ($('#solution').is(":visible"))) {
            newRound();
        }
    },{once: true});
}


function endGame(erreur) {
    document.getElementById("jeu").style.display = "block";
    document.getElementById("loading").style.display = "none";
    document.getElementById("setup").style.display = "none";
    document.getElementById("video").src = "";
    document.getElementById("video").classList.add("hideframe");
    clearTimeout(alertMsgFade);
    document.getElementById("alertMessage").style.display = "none";
    document.getElementById("solution").style.display = "none";
    document.getElementById("final").style.display = "block";
    document.getElementById("reponseChoix").style.display = "none";
    document.getElementById("reponseEcrite").style.display = "none";

    if (erreur) {
        console.log(erreur)
        document.getElementById("finalParagraphe").innerHTML = "<b>Une erreur est survenue.</b> Raisons possibles :<br><li>Connexion internet instable</li><li>Nautiljon a modifié son interface</li><br>Si l'erreur persiste, merci de remplir le <a href='contact.html' target='_blank'>formulaire de contact</a> en expliquant comment l'erreur a été causée."
    } else {
        document.getElementById("finalScore").innerHTML = score;
        document.getElementById("finalRounds").innerHTML = round;
    }
}