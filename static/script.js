$(document).ready(function () {
    var recorder;
    var audioChunks = [];
    var useraudio;
    $('#record-button').click(function () {
        if (!recorder) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function (stream) {
                    recorder = new MediaRecorder(stream);
                    recorder.start();

                    audioChunks = [];
                    recorder.addEventListener('dataavailable', function (event) {
                        audioChunks.push(event.data);
                    });
                })
                .catch(function (error) {
                    console.log('Error accessing microphone: ', error);
                });

            $('#record-button').text('Stop');
        } else {
            recorder.stop();

            recorder.addEventListener('stop', function () {
                var audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                var reader = new FileReader();
                reader.onloadend = function () {
                    var audioDataUrl = reader.result;
                    audioDataUrl = `${audioDataUrl}`; // Log the audio data URL
                    CHATIO(audioDataUrl);
                    
                    
                };
                reader.readAsDataURL(audioBlob);

                recorder = null;
                audioChunks = [];
            });

            $('#record-button').text('Record');
        }
    });

    
    const message = new SpeechSynthesisUtterance();

    
    function handleError(error) {
      console.error('Speech synthesis error:', error);
      
    }
    function speakText(text) {
      
      const maxChunkLength = 200; 
      

      var chunks=text.split('. ');
      chunks.forEach(chunk => {
        const utterance = new SpeechSynthesisUtterance(chunk);
        utterance.onerror = handleError; 
        speechSynthesis.speak(utterance);
      });
    }


    function CHATIO(AUDIO) {


        if (AUDIO !== '') {
            $.ajax({
                url: '/chat',
                type: 'POST',
                data: { 'audioI': AUDIO },
                success: function (response) {
                    useraudio = response.response;
                    console.log(useraudio);
                    $('#chat-messages').append('<div class="message"><div class="content sent">'+useraudio+'</div></div>');
                    // $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
                    retio(useraudio);

                },
                error: function (error) {
                    console.log(error);
                }
            });
        }


    }
    function retio(txt) {
        if (txt !== '') {
            $.ajax({
                url: '/reter',
                type: 'POST',
                data: { 'audioI': txt },
                success: function (response) {
                    useraudio = response.response;
                    console.log(useraudio);
                    $('#chat-messages').append('<div class="message"><div class="content received">'+useraudio+'</div></div>');
                    // $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
                    speakText(useraudio); 
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }

    }

});
