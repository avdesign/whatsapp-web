export class Base64 {

    static getMimetype(UrlBase64){

        let regex = /^data:(.*);base64,(.*)$/;
        let result = UrlBase64.match(regex);

        return result[1];

    }

    static toFile(UrlBase64){

        let mimeType = Base64.getMimetype(UrlBase64);
        let ext = mimeType.split('/')[1];
        let filename = `file${Date.now()}.${ext}`;

        return fetch(UrlBase64).then(res => { 
            return res.arrayBuffer(); 
        }).then(buffer => { 
            return new File([buffer], filename, { type: mimeType }); 
        });
    }


}