;(function () {

    $(document).ready(function () {
        $("#show-modal").click();

        var mediaRecorder = null;
        var player = new window.Audio();
        var blobToSend = null;

        var recordButtonTag = $("#modal-record-button");
        var spanTag = recordButtonTag.find("span");

        recordButtonTag.click(function () {
            
            if (spanTag.hasClass("glyphicon-stop")) {
                $("#modal-play-button").click();
                return;
            }
            
            var mediaConstraints = {
                audio: true
            };
            
            navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);

            function onMediaSuccess(stream) {
                mediaRecorder = new MediaStreamRecorder(stream);
                mediaRecorder.mimeType = 'audio/wav';

                mediaRecorder.ondataavailable = function (blob) {
                    blobToSend = blob;
                    player.src = URL.createObjectURL(blob);
                    player.play();

                };
                mediaRecorder.start(250 * 1000);
                replaceClass(spanTag, "glyphicon-record", "glyphicon-stop");
            }

            function onMediaError(e) {
                console.error('media error', e);
            }
        });

        $("#modal-play-button").click(function () {
            if (spanTag.hasClass("glyphicon-record") && blobToSend !== null) {
                player.pause();
                player.currentTime = 0;
                player.play();
                return;
            }
            replaceClass(spanTag, "glyphicon-stop", "glyphicon-record");
            mediaRecorder.stop();
        });

        $("#modal-submit-button").click(function () {
            var fileType = 'audio';
            var fileName = 'message.wav';

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-blob', blobToSend);

            xhr("save.php", formData);
            
        });

    });

    function xhr(url, data, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                callback(location.href + request.responseText);
            }
        };
        request.open("POST", url);
        request.send(data);
    }
    
    function replaceClass(tag, oldClass, newClass) {
        tag.removeClass(oldClass);
        tag.addClass(newClass)
    }

}());