const firebase = require('firebase');
require('firebase/firestore');

export class Firebase {

    constructor(){

        
        this._config = {
            apiKey: "AIzaSyDx0tfxdmcPn33bqL8aA9nfm9yFm15WEcw",
            authDomain: "whatsapp-web-64a6a.firebaseapp.com",
            databaseURL: "https://whatsapp-web-64a6a.firebaseio.com",
            projectId: "whatsapp-web-64a6a",
            storageBucket: "gs://whatsapp-web-64a6a.appspot.com",
            messagingSenderId: "809368193609"
        };


        this.init();

    }


    init(){

        if (!window._initializedFirebase) {
            firebase.initializeApp(this._config);

            firebase.firestore().settings({
                timestampsInSnapshots: true
            });

            window._initializedFirebase = true;

        }

    }


    static db(){

        return firebase.firestore();
    }


    static hd(){

        return firebase.storage();
    }

    initAuth(){
        return new Promise((s, f) => {

            let provider = new firebase.auth.GoogleAuthProvider();
            
            firebase.auth().signInWithPopup(provider)
                    .then(result => {

                        let token = result.credential.accessToken;
                        let user = result.user;

                        s({
                            user,
                            token
                        });

                    })
                    .catch(err => {
                        f(err);
                    });

        });
    }

}
