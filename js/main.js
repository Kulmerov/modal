;(function () {

    $(document).ready(function () {
        // $("#show-modal").click();
        $('[data-toggle="popover"]').popover();
        
        var mediaRecorder = null;

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

    });


}());