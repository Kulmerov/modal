;(function () {

    $(document).ready(function () {
        $("#show-modal").click();

        var mediaRecorder = null;
        var player = new window.Audio();
        var blobToSend = null;

        var recordTag = $("#modal-record-button");
        var spanTag = recordTag.find("span");
        var submitTag = $("#modal-submit-button");
        var playTag = $("#modal-play-button");

        var nameFieldTag = $("#modal-user-name");
        var emailFieldTag = $("#modal-user-email");

        // var isCanRecord = false;

        submitTag.popover({
            trigger: 'focus',
            placement: 'top',
            content: function () {
                if (blobToSend === null) {
                    return "First make a record!";
                }
                var message = validateAll();
                if (message) {
                    return message;
                }
                return "Thank you! We will email you results in 24 hours.";
            }
        });
        
        // recordTag.popover({
        //     trigger: 'focus',
        //     placement: 'top',
        //     content: function () {
        //         var message = validateAll();
        //         if (message) {
        //             return message;
        //         }
        //     }
        // });

        playTag.popover({
            trigger: 'focus',
            placement: 'top',
            content: function () {
                // var message = validateAll();
                // if (message) {
                //     return message;
                // }
                if (blobToSend === null) {
                    return "First make a record!";
                }
            }
        });

        recordTag.click(function () {

            // if (!isCanRecord) {
            //     return;
            // }

            if (spanTag.hasClass("glyphicon-stop")) {
                playTag.click();
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
                    // player.play();

                };
                mediaRecorder.start(250 * 1000);
                replaceClass(spanTag, "glyphicon-record", "glyphicon-stop");
            }

            function onMediaError(e) {
                console.error('media error', e);
            }
        });

        playTag.click(function () {
            if (spanTag.hasClass("glyphicon-record") && blobToSend !== null) {
                player.pause();
                player.currentTime = 0;
                player.play();
                return;
            }
            replaceClass(spanTag, "glyphicon-stop", "glyphicon-record");
            mediaRecorder.stop();
        });


        submitTag.click(function () {
            if (blobToSend === null) {
                // if the user is not made a record
                return;
            }
            var fileType = 'audio';
            var fileName = 'message.wav';

            var formData = new FormData();
            formData.append(fileType + '-filename', fileName);
            formData.append(fileType + '-blob', blobToSend);

            xhr("save.php", formData);
        });

        function validateAll() {
            if (!nameFieldTag.val().length || !emailFieldTag.val().length) {
                return "Fill in the fields!";
            } else {
                var isValidEmail = validateEmail(emailFieldTag.val());
                if (!isValidEmail) {
                    return "Email is not valid!";
                }
                var isValidName = validateName(nameFieldTag.val());
                if (!isValidName) {
                    return "Name is not valid!";
                }
            }
            // isCanRecord = true;
            return null;
        }

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

    function validateEmail(email) {
        var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    }

    function validateName(name) {
        return name.length > 1;
    }

}());