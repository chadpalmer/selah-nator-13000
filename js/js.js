//Created simple plugin to detect touchstart
;
(function ($) {
    $.fn.extend({
        touch: function (func) {
            return this.each(function () {
                this.addEventListener("touchstart", func)
            });
        }
    });
})(jQuery);


$(function () {
    objSelah.objContainer = jQuery(".js-page-container");
    objSelah.objHead = jQuery(".js-head");
    objSelah.objChatter = jQuery(".js-chatter");
    objSelah.objImageBox = jQuery(".js-image-container");
    objSelah.objAudioPlayer = jQuery("#js-audio-player");
    window.addEventListener("orientationchange", function () {
        objSelah.reformatPage();
    }, false);
    onresize = onload = function () {
        objSelah.reformatPage();
    };
    objSelah.loadData();
});

var objSelah = objSelah || {};

objSelah.numIntroAudio = 0;
objSelah.numIntroVideo = 0;

objSelah.loadData = function () {
    jQuery.getJSON("js/data.json", function (data) {
        objSelah.objData = data;
        objSelah.renderSite();
    });
};

objSelah.reformatPage = function () {
    objSelah.objImageBox.height(window.innerHeight - objSelah.objHead.height() - objSelah.objChatter.height() - 20).find("img").height(window.innerHeight - objSelah.objHead.height() - objSelah.objChatter.height() - 20);
    objSelah.objImageBox.find("video").height(window.innerHeight - objSelah.objHead.height() - objSelah.objChatter.height() - 20);
    objSelah.objContainer.width((objSelah.objImageBox.find("img").width()));
};

objSelah.renderSite = function () {
    var strIntroImageHTML = "";
    var strPath;
    objSelah.objHead.html(objSelah.objData.page_content[0].title);
    objSelah.objChatter.html(objSelah.objData.page_content[0].chatter);
    jQuery.each(objSelah.objData.page_content[0].images, function (index) {
        switch (objSelah.objData.page_content[0].images[index].type) {
            case "image":
                strPath = objSelah.objData.base_image_path;
                break;
            case "audio":
                strPath = objSelah.objData.base_audio_path;
                break;
            case "video":
                strPath = objSelah.objData.base_video_path;
                break;
        }
        strIntroImageHTML += "<div class=\"" + objSelah.objData.page_content[0].images[index].classes + "\"><img src=\"" + strPath + objSelah.objData.page_content[0].images[index].name + "\"/></div>";
    });
    strIntroImageHTML += "<video id=\"js-video-player\" height=\"1080\">";
    strIntroImageHTML += "  <source src=\"video/selah-intro.mp4\" type=\"video/mp4\">";
    strIntroImageHTML += "  <source src=\"video/selah-intro.ogg\" type=\"video/ogg\">";
    strIntroImageHTML += "</video>";
    objSelah.objImageBox.html(strIntroImageHTML);
    objSelah.renderSelahAudio(objSelah.numIntroAudio, false);
    objSelah.objVideoPlayer = jQuery("#js-video-player");
    objSelah.addEvents();
};

objSelah.addEvents = function () {
    objSelah.objImageBox.click(function (e) {
        objSelah.objImageBox.addClass("open");
        setTimeout("objSelah.renderSelah()", 3000);
        objSelah.objAudioPlayer[0].play();
        objSelah.objChatter.html(objSelah.objData.page_content[0].chatter_clicked);
        objSelah.objImageBox.off("click");
    });

    objSelah.objAudioPlayer[0].addEventListener("ended", function () {
        if (objSelah.numIntroAudio == 0) {
            objSelah.renderSelahLight();
        } else if (objSelah.numIntroAudio == 1) {
            objSelah.renderSelahAudio(2, true);
        } else if (objSelah.numIntroAudio == 2) {
            objSelah.renderSelahVideo(0, true);
        } else {
            console.log(objSelah.numIntroAudio);
            objSelah.renderSelahAudio(objSelah.numIntroAudio, true);
        }
    });

    objSelah.objVideoPlayer[0].addEventListener("ended", function () {
        objSelah.objVideoPlayer.removeClass("playing");
        objSelah.numIntroAudio = objSelah.numIntroAudio + 1;
        objSelah.renderSelahAudio(3, true);
    });
};

objSelah.renderSelah = function () {
    objSelah.objImageBox.find(".js-dark").animate({"opacity": 1}, 3000, function () {
        console.log("done");
    });
};

objSelah.renderSelahLight = function () {
    objSelah.objImageBox.find(".js-dark").animate({"opacity": 0}, 3000, function () {
        console.log("done");
    });

    objSelah.objImageBox.find(".js-light").animate({"opacity": 1}, 3000, function () {
        console.log("done");
    });
    objSelah.renderSelahAudio(1, true);
};

objSelah.renderSelahAudio = function (numAudio, blnPlay) {
    if (objSelah.objData.page_content[0].audio[numAudio]) {
        jQuery.each(objSelah.objAudioPlayer.find("source"), function (index) {
            objSelah.objAudioPlayer.find("source").eq(index).attr({
                "src": objSelah.objData.base_audio_path + objSelah.objData.page_content[0].audio[numAudio].name + ".mp3",
                "type": "audio/mpeg"
            }).detach().appendTo(objSelah.objAudioPlayer);

            objSelah.objAudioPlayer.find("source").eq(index).attr({
                "src": objSelah.objData.base_audio_path + objSelah.objData.page_content[0].audio[numAudio].name + ".ogg",
                "type": "audio/ogg"
            }).detach().appendTo(objSelah.objAudioPlayer);
        });
        objSelah.objAudioPlayer.load();
        if (blnPlay) {
            objSelah.objAudioPlayer[0].play();
            objSelah.numIntroAudio = objSelah.numIntroAudio + 1;
        }
    } else {
        objSelah.renderIndex();
    }
};

objSelah.renderSelahVideo = function (numVideo, blnPlay) {
    if (objSelah.objData.page_content[0].video[numVideo]) {
        jQuery.each(objSelah.objVideoPlayer.find("source"), function (index) {
            objSelah.objVideoPlayer.find("source").eq(index).attr({
                "src": objSelah.objData.base_video_path + objSelah.objData.page_content[0].video[numVideo].name + ".mp4",
                "type": "video/mp4"
            }).detach().appendTo(objSelah.objVideoPlayer);

            objSelah.objVideoPlayer.find("source").eq(index).attr({
                "src": objSelah.objData.base_video_path + objSelah.objData.page_content[0].video[numVideo].name + ".ogg",
                "type": "video/ogg"
            }).detach().appendTo(objSelah.objVideoPlayer);
        });
        objSelah.objVideoPlayer.load();
        if (blnPlay) {
            objSelah.objVideoPlayer.addClass("playing");
            objSelah.objVideoPlayer[0].play();
            objSelah.numIntroVideo = objSelah.numIntroVideo + 1;
        }
    } else {
        objSelah.renderIndex();
    }
};

objSelah.renderIndex = function() {
    objSelah.objImageBox.append("<div class=\"selah-index\"></div>");
    objSelah.objIndex = jQuery(".selah-index");
};