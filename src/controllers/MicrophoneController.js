import { ClassEvent } from '../util/ClassEvent';

export class MicrophoneController extends ClassEvent {

    constructor(){
        
        super();

        this._mimeType = 'audio/webm';
        this._available = false;

        // Aviso de Permissão da camera
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then(stream => {

            this._available = true;
            this._stream = stream;            

            this.trigger('ready', this._stream);

        }).catch(err => {
            console.error(err);
        });

    }


    /**
     * Se o usuário permitiu gravar
     */
    isAvailable(){
        return  this._available;
    }


    /**
     * Parar o audio
     */
    stop(){
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    
    /**
     * Iniciar gravação
     */

     startRecorder(){

        if (this.isAvailable()) {

            this._mediaRecorder = new MediaRecorder(this._stream, {
                mimeType: this._mimeType
            });

            this._recorderChunks = [];

            this._mediaRecorder.addEventListener('dataavailable', e => {
                if (e.data.size > 0) this._recorderChunks.push(e.data);
            });

            this._mediaRecorder.addEventListener('stop', e => {

                let blob = new Blob(this._recorderChunks, {
                    type: this._mimeType
                });

                let filename = `rec${Date.now()}.webm`;

                let audioContext = new AudioContext();

                let reader = new FileReader();

                reader.onload = e => {

                    audioContext.decodeAudioData(reader.result).then(decode => {

                        let file = new File([blob], filename, {
                            type: this._mimeType,
                            lastModified: Date.now()
                        });

                        this.trigger('recorded', file, decode);
    
                    });



                }

                reader.readAsArrayBuffer(blob);

            });

            this._mediaRecorder.start();
            this.startTime();
        }

     }

     /** 
      * Parar Gravação
     */

     stopRecorder(){

        if (this.isAvailable()) {
            this._mediaRecorder.stop();
            this.stop();
            this.stopTime();
        }
        
     }

     /**
      * 
      */
     startTime(){
        let start = Date.now();
        this._recordMicrophoneInterval = setInterval(() => {
            
            this.trigger('recordtimer', (Date.now() - start));

        }, 100);


    }

    /**
     * 
     */
    stopTime(){
        clearInterval(this._recordMicrophoneInterval);
    }



}