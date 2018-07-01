const pdfjslib = require('pdfjs-dist');
const path = require('path');

pdfjslib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js');


export class DocumentPreviewController {

    constructor(file){
        this._file = file;
    }


    getPreviewData(){

        return new Promise((s, f) => {

            let reader = new FileReader();

            switch (this._file.type) {
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/gif':
                case 'image/png':
                
                
                reader.onload = e => {
                   s({
                       src: reader.result,
                       info: this._file.name 
                    });
                }
                reader.onerror = e => {
                    f(e);
                }
                reader.readAsDataURL(this._file);
                break;

                case 'application/pdf':
                    //console.log('este é um pdf');                  

                    reader.onload = e => {

                        pdfjslib.getDocument(new Uint8Array(reader.result)).then(pdf => {
                            //console.log('pdf', pdf);
                            pdf.getPage(1).then(page => {
                                //console.log('page', page);
                                let viewport = page.getViewport(1);
                                let canvas = document.createElement('canvas');
                                let canvasContext = canvas.getContext('2d');

                                canvas.width = viewport.width;
                                canvas.height = viewport.height;

                                page.render({
                                    canvasContext,
                                    viewport
                                }).then(() => {

                                    let _s = (pdf.numPages > 1) ? 's' : '';

                                    s({
                                        src: canvas.toDataURL('image/png'),
                                        info: `${pdf.numPages} página${_s}`
                                    });

                                    
                                }).catch(err => {
                                    f(err);
                                });

                            }).catch(err => {
                                f(err);
                            });


                        }).catch(err => {

                            f(err);
                        });

                    }

                    reader.readAsArrayBuffer(this._file);

                break;

                default:
                    //console.log('outer');
                    f();

            }
        });

    }

}