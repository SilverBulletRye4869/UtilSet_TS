import * as fs from "fs"

class Sfile{

    filename: string;
    codeType: | (fs.ObjectEncodingOptions & { flag?: string | undefined; }) | BufferEncoding;
    constructor(filename: string, codeType: | (fs.ObjectEncodingOptions & { flag?: string | undefined; }) | BufferEncoding) {
        this.filename = filename;
        this.codeType = codeType;
    }

    getAll_S(): string {
        return fs.readFileSync(this.filename, this.codeType).toString();
    }

    getLines_S(): string[] {
        return fs.readFileSync(this.filename, this.codeType).toString().replace(/\r/g, "").split("\n");
    }

    getWord_S(): string[] {
        return fs.readFileSync(this.filename, this.codeType).toString().replace(/\r/g, "").replace(/\n/g, " ").split(" ");
    }

    write(data: string|string[]){
        fs.writeFileSync(this.filename, typeof(data) == "string" ? data : data.join("\n"));
        
    }
    
    
    add(data: string|string[]){
        if(typeof(data)=="string"){
            let words :string[] = this.getWord_S();
            words.push(data);
            this.write(words);
        }else this.write(this.getWord_S().concat(data));
    }

    remove(data: string){
        let now: string[] = this.getWord_S();
        let index: number = now.indexOf(data);
        if(index<0)return;
        now.splice(index,1)
        this.write(now);
    }
}

