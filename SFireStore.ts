import { initializeApp } from "firebase/app";
import * as firestore from "firebase/firestore";
import { getFireBaseConfig } from "./firebaseConfig";
//import * as firebaseAna from "firebase/analytics";



export class SFireStore {
    private app;
    private fireStore: any;
    private collection: any;
    private collectionName: string | undefined;

    constructor(fireBaseConfig: { apiKey: string; authDomain: string; projectId: string; storageBucket: string; messagingSenderId: string; appId: string; measurementId: string; }) {
        this.app = initializeApp(fireBaseConfig);
        this.fireStore = firestore.getFirestore(this.app);
    }

    async setCollection(collectionName: string) {
        this.collectionName = collectionName;
        this.collection = firestore.collection(this.fireStore, collectionName);
        return;
    }

    async getIDs(): Promise<string[] | null> {
        if (!this.collection) throw "collectionが不定です"
        let keys: string[] = [];
        await firestore.getDocs(this.collection).then(
            (docs) => docs.forEach(e => keys.push(e.id))
        );
        return keys;
    }

    async get(key: string): Promise<firestore.DocumentData | null> {
        if (!this.collectionName) throw "collectionが不定です"
        const docRef = firestore.doc(this.fireStore, this.collectionName, key)
        const docSnap = await firestore.getDoc(docRef);
        if (docSnap.exists()) return docSnap.data();
        else console.log("ドキュメントの取得に失敗しました");
        return null;
    }

    async whereEqualTo(id: string, value: any): Promise<string[]>{
        if(!this.collectionName)throw "collectionが不定です";
        const q = firestore.query(this.collection, firestore.where(id, "==", value))
        let keys:string[] = [];
        await firestore.getDocs(q).then((docs)=>{
            docs.forEach(doc => {keys.push(doc.id)});
        })
        return keys;
    }

    async whereAllEqualTo(terms:[string,string][]){
        if(!this.collectionName)throw "collectionが不定です";
        let q:firestore.Query<unknown> = this.collection;
        await terms.forEach(e =>{q = firestore.query(q,firestore.where(e[0],"==",e[1]))});
        let keys:string[] = [];
        await firestore.getDocs(q).then((docs)=>{
            docs.forEach(doc => {keys.push(doc.id)});
        })
        return keys;
    }

    async add(key: string,data: object, isMerge :boolean = false ){
        firestore.setDoc(firestore.doc(this.fireStore,this.collectionName,key),data,{merge: isMerge})
    }

    async delete(key: string){
        firestore.deleteDoc(firestore.doc(this.fireStore,this.collection,key))
    }

    getApp(){return this.app;}
    getFireStore(){return this.fireStore;}
    getCollection(){return this.collection;}
    getCollectionName(){return this.collectionName;}


}


async function main() {
    const fb: SFireStore = new SFireStore(getFireBaseConfig());
    fb.setCollection("test");
    //console.log(await fb.add({test:2}))
    console.log(await fb.get("test"))
}
main()




