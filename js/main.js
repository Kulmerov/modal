;(function () {

    $(document).ready(function () {
        $("#show-modal").click();
        $('[data-toggle="popover"]').popover();
        
        var mediaRecorder = null;
        var blobToSend = null;

        $("#modal-record-button").click(function () {
            
            var mediaConstraints = {
                audio: true
            };

            navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError);
            
            function onMediaSuccess(stream) {
                mediaRecorder = new MediaStreamRecorder(stream);
                mediaRecorder.mimeType = 'audio/wav';
                
                var player = new window.Audio();
                mediaRecorder.ondataavailable = function (blob) {
                    blobToSend = blob;
                    player.src = URL.createObjectURL(blob);
                    player.play();
                };
                mediaRecorder.start(150 * 1000);
            }

            function onMediaError(e) {
                console.error('media error', e);
            }
        });

        $("#modal-play-button").click(function () {
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

}());