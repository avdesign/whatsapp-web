export class CameraController {

    constructor(videoEl) {

        this._videoEl = videoEl;

        // Aviso de Permissão da camera
        navigator.mediaDevices.getUserMedia({
            video: true
        }).then(stream => {
            this._stream = stream;
            this._videoEl.src = URL.createObjectURL(stream);
            this._videoEl.play();

        }).catch(err => {
            console.error(err);
        });

    }

    /**
     * Parar de gravar
     */
    stop(){
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    /**
     * Tirar uma foto
     */
    takePicture(mimeType = 'image/png'){

        let canvas = document.createElement('canvas');

        canvas.setAttribute('height', this._videoEl.videoHeight);
        canvas.setAttribute('width', this._videoEl.videoWidth);

        let context = canvas.getContext('2d');

        // desenha img 
        context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL(mimeType);
    }

}